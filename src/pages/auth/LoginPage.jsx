import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { AuthShell, Field, FormError, inputClass } from "./AuthShell";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [phone, setPhone] = useState(location.state?.phone || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!phone.trim() || !password) {
      setError("Please enter your mobile number and password.");
      return;
    }
    setLoading(true);
    try {
      await login(phone, password);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to your resident account"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-bold text-blue-600 underline underline-offset-4 hover:text-blue-700">
            Register
          </Link>
        </>
      }
    >
      {location.state?.registered && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          Registration successful. Please log in.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormError message={error} />
        <Field label="Mobile number" htmlFor="phone">
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            required
            className={inputClass}
            placeholder="9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Field>
        <Field label="Password" htmlFor="password">
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            className={inputClass}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Button type="submit" size="lg" className="w-full py-3.5 text-xl font-semibold" disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </Button>
      </form>
    </AuthShell>
  );
}

