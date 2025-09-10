import { useState } from "react";

export default function ActionButton({
  children,
  onClick,
  cooldown = 1500,     // ms
  className = "",
  type = "button",
  ...props
}) {
  const [disabled, setDisabled] = useState(false);

  const handleClick = async (e) => {
    if (disabled) return;

    setDisabled(true);

    try {
      // promesse API (si async)
      const apiPromise = Promise.resolve(onClick?.(e));

      // promesse cooldown
      const cooldownPromise = new Promise((resolve) =>
        setTimeout(resolve, cooldown)
      );

      // bouton reste désactivé tant que les 2 ne sont pas terminés
      await Promise.all([apiPromise, cooldownPromise]);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <button
      {...props}
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`px-4 py-2 rounded transition ${
        disabled
          ? "opacity-50 cursor-not-allowed pointer-events-none"
          : "bg-blue-600 hover:bg-blue-700 text-white"
      } ${className}`}
    >
      {children}
    </button>
  );
}