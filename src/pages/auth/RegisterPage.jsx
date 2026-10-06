import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { Button } from "../../components/common/Button";
import { phases } from "../../data/mockData";
import { register } from "../../services/authService";
import { AuthShell, Field, FormError, inputClass } from "./AuthShell";

const MAX_PHOTO_SIZE = 10 * 1024 * 1024; // server compresses to under 1 MB
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

const initialForm = { name: "", email: "", phone: "", phase: "", villaNo: "", password: "" };

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Enter a valid email address.";
  if (!/^\+?[0-9]{10,15}$/.test(form.phone.replace(/[\s-]/g, ""))) errors.phone = "Enter a valid phone number (10-15 digits).";
  if (!form.phase) errors.phase = "Select your phase.";
  if (!form.villaNo.trim()) errors.villaNo = "Villa number is required.";
  if (form.password.length < 8) errors.password = "Password must be at least 8 characters.";
  return errors;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!PHOTO_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, photo: "Photo must be a JPG, PNG or WEBP image." }));
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setErrors((prev) => ({ ...prev, photo: "Photo must be 10 MB or smaller." }));
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, photo: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value.trim()));
    data.set("password", form.password);
    if (photo) data.append("photo", photo);

    setLoading(true);
    try {
      await register(data);
      navigate("/login", { replace: true, state: { registered: true, email: form.email.trim() } });
    } catch (err) {
      setFormError(err.message);
      setErrors(err.fieldErrors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Register as a resident"
      footer={
        <>
          Already registered?{" "}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormError message={formError} />

        <div className="flex flex-col items-center">
          <label
            htmlFor="photo"
            className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-500"
          >
            {preview ? (
              <img src={preview} alt="Profile preview" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-7 h-7 text-gray-400" />
            )}
          </label>
          <input id="photo" type="file" accept={PHOTO_TYPES.join(",")} className="sr-only" onChange={handlePhoto} />
          <span className="mt-2 text-xs text-gray-500">
            {photo ? "Click to change photo" : "Upload profile photo (optional, max 10 MB)"}
          </span>
          {errors.photo && <p className="mt-1 text-xs text-red-600">{errors.photo}</p>}
        </div>

        <Field label="Full name" htmlFor="name" error={errors.name}>
          <input id="name" autoComplete="name" className={inputClass} value={form.name} onChange={update("name")} />
        </Field>

        <Field label="Email" htmlFor="email" error={errors.email}>
          <input id="email" type="email" autoComplete="email" className={inputClass} value={form.email} onChange={update("email")} />
        </Field>

        <Field label="Phone" htmlFor="phone" error={errors.phone}>
          <input id="phone" type="tel" autoComplete="tel" className={inputClass} placeholder="9876543210" value={form.phone} onChange={update("phone")} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Phase" htmlFor="phase" error={errors.phase}>
            <select id="phase" className={inputClass} value={form.phase} onChange={update("phase")}>
              <option value="">Select</option>
              {phases.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Villa no." htmlFor="villaNo" error={errors.villaNo}>
            <input id="villaNo" className={inputClass} placeholder="A-101" value={form.villaNo} onChange={update("villaNo")} />
          </Field>
        </div>

        <Field label="Password" htmlFor="password" error={errors.password}>
          <input id="password" type="password" autoComplete="new-password" className={inputClass} placeholder="At least 8 characters" value={form.password} onChange={update("password")} />
        </Field>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Creating account…" : "Register"}
        </Button>
      </form>
    </AuthShell>
  );
}
