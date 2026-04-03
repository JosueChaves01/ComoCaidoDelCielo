import { useState } from "react";
import { motion } from "motion/react";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/app/components/ui/calendar";
import type { DatePickerAction } from "../types";

interface ChatDatePickerProps {
  action: DatePickerAction;
  onSubmit: (text: string) => void;
  disabled: boolean;
}

export function ChatDatePicker({ action, onSubmit, disabled }: ChatDatePickerProps) {
  const [selected, setSelected] = useState<Date | undefined>();

  const minDate = action.min
    ? parse(action.min, "yyyy-MM-dd", new Date())
    : new Date();

  const handleSelect = (date: Date | undefined) => {
    if (!date || disabled) return;
    setSelected(date);
    onSubmit(format(date, "yyyy-MM-dd"));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[85%] mt-1"
    >
      <div className="bg-[#F5EFE6] border border-[#E8DED0] rounded-xl overflow-hidden shadow-sm">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          disabled={[{ before: minDate }]}
          locale={es}
          className="!p-2"
          classNames={{
            day_selected:
              "bg-[#3B2A22] text-white hover:bg-[#2A1F19] focus:bg-[#2A1F19]",
            day_today: "bg-[#E8DED0] text-[#3B2A22] font-semibold",
          }}
        />
      </div>
    </motion.div>
  );
}
