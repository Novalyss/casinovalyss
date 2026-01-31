import { useState, createContext, useContext } from "react";

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

const toastColors = {
  error: "bg-red-600",
  success: "bg-green-600",
  warning: "bg-yellow-600",
};

export default function Toaster({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "error", duration = 5000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, visible: true }]);

    // Démarrer la disparition après X ms
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((toast) =>
          toast.id === id ? { ...toast, visible: false } : toast
        )
      );

      // Supprimer après animation
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 300); // durée anim
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Container des toasts en bas à droite */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`w-full sm:w-[400px] md:w-[500px] lg:w-[600px]
  h-[150px] sm:h-[180px] md:h-[200px] p-4 flex items-center justify-center rounded shadow-lg text-white transform transition-all duration-300
              ${
                toast.visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }
              ${toastColors[toast.type] ?? "bg-gray-600"}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}