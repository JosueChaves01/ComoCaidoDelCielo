import { useState } from "react";
import { motion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import type { GuestCounterAction } from "../types";

interface ChatGuestCounterProps {
  action: GuestCounterAction;
  onSubmit: (text: string) => void;
  disabled: boolean;
}

export function ChatGuestCounter({ action, onSubmit, disabled }: ChatGuestCounterProps) {
  const [counts, setCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(action.fields.map((f) => [f.key, f.default]))
  );
  const [submitted, setSubmitted] = useState(false);

  const update = (key: string, delta: number) => {
    setCounts((prev) => {
      const field = action.fields.find((f) => f.key === key);
      if (!field) return prev;
      const next = Math.min(Math.max(prev[key] + delta, field.min), field.max);
      return { ...prev, [key]: next };
    });
  };

  const handleConfirm = () => {
    if (disabled || submitted) return;
    setSubmitted(true);

    const parts = action.fields.map((f) => `${counts[f.key]} ${f.label.toLowerCase()}`);
    onSubmit(parts.join(" y "));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[85%] mt-1"
    >
      <div className="bg-[#F5EFE6] border border-[#E8DED0] rounded-xl p-3 space-y-3 shadow-sm">
        {action.fields.map((field) => (
          <div key={field.key} className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-[#3B2A22] min-w-[70px]">
              {field.label}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="size-8 rounded-full border-[#E8DED0] text-[#3B2A22]"
                disabled={disabled || submitted || counts[field.key] <= field.min}
                onClick={() => update(field.key, -1)}
              >
                <Minus size={14} />
              </Button>
              <span className="w-8 text-center text-sm font-semibold text-[#3B2A22]">
                {counts[field.key]}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="size-8 rounded-full border-[#E8DED0] text-[#3B2A22]"
                disabled={disabled || submitted || counts[field.key] >= field.max}
                onClick={() => update(field.key, 1)}
              >
                <Plus size={14} />
              </Button>
            </div>
          </div>
        ))}

        <Button
          className="w-full bg-[#3B2A22] hover:bg-[#2A1F19] text-white rounded-lg text-sm"
          disabled={disabled || submitted}
          onClick={handleConfirm}
        >
          {submitted ? "Enviado" : "Confirmar"}
        </Button>
      </div>
    </motion.div>
  );
}
