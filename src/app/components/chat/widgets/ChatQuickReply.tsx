import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";
import type { QuickReplyAction } from "../types";

interface ChatQuickReplyProps {
  action: QuickReplyAction;
  onSubmit: (text: string) => void;
  disabled: boolean;
}

export function ChatQuickReply({ action, onSubmit, disabled }: ChatQuickReplyProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (value: string) => {
    if (disabled || selected) return;
    setSelected(value);
    onSubmit(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[85%] mt-1"
    >
      <div className="flex flex-wrap gap-2">
        {action.options.map((option) => (
          <Button
            key={option.value}
            variant="outline"
            size="sm"
            disabled={disabled || (selected !== null && selected !== option.value)}
            className={`rounded-full border-[#E8DED0] text-sm transition-all ${
              selected === option.value
                ? "bg-[#3B2A22] text-white border-[#3B2A22]"
                : "bg-[#F5EFE6] text-[#3B2A22] hover:bg-[#E8DED0]"
            }`}
            onClick={() => handleClick(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </motion.div>
  );
}
