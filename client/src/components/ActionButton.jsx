import { useState, useEffect } from "react";

export default function ActionButton({
  children,
  onClick,
  disabled = false,  // prop désactivation externe
  cooldown = 2000,   // ms
  className = "",
  type = "button",
  ...props
}) {
  const [internalDisabled, setInternalDisabled] = useState(disabled);

  // synchronise la prop `disabled` avec l'état interne
  useEffect(() => {
    setInternalDisabled(disabled);
  }, [disabled]);

  const handleClick = async (e) => {
    if (internalDisabled) return;

    setInternalDisabled(true);

    try {
      const apiPromise = Promise.resolve(onClick?.(e));
      const cooldownPromise = new Promise((resolve) =>
        setTimeout(resolve, cooldown)
      );

      await Promise.all([apiPromise, cooldownPromise]);
    } finally {
      // seulement si ce n’est pas bloqué par la prop externe
      if (!disabled) {
        setInternalDisabled(false);
      }
    }
  };

  return (
    <button
      {...props}
      type={type}
      onClick={handleClick}
      disabled={internalDisabled}
      className={`px-4 py-2 rounded transition ${
        internalDisabled
          ? "opacity-50 cursor-not-allowed pointer-events-none"
          : "bg-blue-600 hover:bg-blue-700 text-white"
      } ${className}`}
    >
      {children}
    </button>
  );
}