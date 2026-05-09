import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, LogOut, Trash2, X } from "lucide-react";
import { registerConfirmHandler } from "../../utils/confirmAction.js";

const variantStyles = {
  danger: {
    iconWrap: "bg-red-100 text-red-600",
    confirmButton: "bg-red-600 text-white hover:bg-red-700",
    ring: "ring-red-100",
    Icon: Trash2,
  },
  warning: {
    iconWrap: "bg-amber-100 text-amber-600",
    confirmButton: "bg-amber-500 text-white hover:bg-amber-600",
    ring: "ring-amber-100",
    Icon: AlertTriangle,
  },
  success: {
    iconWrap: "bg-emerald-100 text-emerald-600",
    confirmButton: "bg-emerald-600 text-white hover:bg-emerald-700",
    ring: "ring-emerald-100",
    Icon: CheckCircle2,
  },
  info: {
    iconWrap: "bg-sky-100 text-sky-600",
    confirmButton: "bg-sky-600 text-white hover:bg-sky-700",
    ring: "ring-sky-100",
    Icon: Info,
  },
  logout: {
    iconWrap: "bg-orange-100 text-orange-600",
    confirmButton: "bg-orange-600 text-white hover:bg-orange-700",
    ring: "ring-orange-100",
    Icon: LogOut,
  },
};

const defaultDialog = {
  title: "Please confirm",
  message: "Are you sure?",
  confirmText: "Confirm",
  cancelText: "Cancel",
  variant: "warning",
};

export default function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null);

  const closeDialog = useCallback(
    (result) => {
      dialog?.resolve(result);
      setDialog(null);
    },
    [dialog],
  );

  const openDialog = useCallback((options = {}) => {
    return new Promise((resolve) => {
      setDialog({
        ...defaultDialog,
        ...options,
        resolve,
      });
    });
  }, []);

  useEffect(() => registerConfirmHandler(openDialog), [openDialog]);

  useEffect(() => {
    if (!dialog) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeDialog(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeDialog, dialog]);

  const variant = variantStyles[dialog?.variant] || variantStyles.warning;
  const Icon = variant.Icon;

  return (
    <>
      {children}

      {dialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            className={`w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-8 ${variant.ring}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${variant.iconWrap}`}>
                <Icon className="size-6" />
              </div>
              <button
                type="button"
                onClick={() => closeDialog(false)}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close dialog"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-5">
              <h2 id="confirm-dialog-title" className="text-xl font-bold text-slate-950">
                {dialog.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{dialog.message}</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => closeDialog(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {dialog.cancelText}
              </button>
              <button
                type="button"
                onClick={() => closeDialog(true)}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${variant.confirmButton}`}
              >
                {dialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
