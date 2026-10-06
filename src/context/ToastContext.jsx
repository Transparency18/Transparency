import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, MessageSquare } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className="flex items-center bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[300px] animate-in slide-in-from-right-8"
          >
            {toast.type === 'whatsapp' ? (
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-600">
                <MessageSquare className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-600">
                <CheckCircle className="w-4 h-4" />
              </div>
            )}
            
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{toast.type === 'whatsapp' ? 'WhatsApp Alert' : 'Notification'}</p>
              <p className="text-sm text-gray-500">{toast.message}</p>
            </div>
            
            <button 
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
