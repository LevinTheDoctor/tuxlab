import { useEffect, useState } from 'react';
import './Toasts.css';

interface ToastItem {
  id: number;
  text: string;
  variant: 'info' | 'fun' | 'warn';
}

let counter = 0;

export function Toasts() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const onToast = (e: Event) => {
      const { text, variant } = (e as CustomEvent<{ text: string; variant: ToastItem['variant'] }>).detail;
      const id = ++counter;
      setItems((prev) => [...prev, { id, text, variant }]);
      window.setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== id));
      }, 4200);
    };
    window.addEventListener('toast', onToast);
    return () => window.removeEventListener('toast', onToast);
  }, []);

  return (
    <div className="toasts" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={`toast toast-${t.variant}`}>
          {t.text}
        </div>
      ))}
    </div>
  );
}
