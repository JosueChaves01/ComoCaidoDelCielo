import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { format, parse, addMonths } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { Calendar } from "@/app/components/ui/calendar";
import { supabase } from "@/lib/supabase";
import type { DatePickerAction } from "../types";

interface TerraceInfo {
  id: string;
  max_capacity: number;
}

interface ChatDatePickerProps {
  action: DatePickerAction;
  onSubmit: (text: string) => void;
  disabled: boolean;
}

export function ChatDatePicker({ action, onSubmit, disabled }: ChatDatePickerProps) {
  const [selected, setSelected] = useState<Date | undefined>();
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  const minDate = action.min
    ? parse(action.min, "yyyy-MM-dd", new Date())
    : new Date();

  const guests = action.guests ?? 0;

  useEffect(() => {
    async function fetchAvailability() {
      try {
        // Get all terraces with their capacity
        const { data: terraces } = await supabase
          .from("terraces")
          .select("id, max_capacity");

        if (!terraces?.length) {
          setLoading(false);
          return;
        }

        // If we know the guest count, only consider terraces that fit
        const eligibleTerraces: TerraceInfo[] = guests > 0
          ? terraces.filter((t) => t.max_capacity >= guests)
          : terraces;

        // If no terrace can fit this group at all, don't block dates
        // — let the AI handle the suggestion to adjust group size
        if (eligibleTerraces.length === 0) {
          setLoading(false);
          return;
        }

        const eligibleIds = new Set(eligibleTerraces.map((t) => t.id));

        // Get active reservations for next 3 months
        const maxDate = format(addMonths(minDate, 3), "yyyy-MM-dd");
        const { data: reservations } = await supabase
          .from("terrace_reservations")
          .select("terrace_id, reservation_date")
          .neq("status", "cancelled")
          .gte("reservation_date", format(minDate, "yyyy-MM-dd"))
          .lte("reservation_date", maxDate);

        if (!reservations) {
          setLoading(false);
          return;
        }

        // Per date: count how many eligible terraces are already booked
        const bookedPerDate = new Map<string, number>();
        for (const r of reservations) {
          if (eligibleIds.has(r.terrace_id as string)) {
            const d = r.reservation_date as string;
            bookedPerDate.set(d, (bookedPerDate.get(d) ?? 0) + 1);
          }
        }

        // A date is unavailable if ALL eligible terraces are booked that day
        const blocked: Date[] = [];
        for (const [dateStr, bookedCount] of bookedPerDate) {
          if (bookedCount >= eligibleIds.size) {
            blocked.push(parse(dateStr, "yyyy-MM-dd", new Date()));
          }
        }

        setUnavailableDates(blocked);
      } catch {
        // On error, don't block dates — AI handles availability as fallback
      }
      setLoading(false);
    }

    fetchAvailability();
  }, []);

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
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-6 text-sm text-[#9B8677]">
            <Loader2 size={16} className="animate-spin" />
            Cargando disponibilidad...
          </div>
        ) : (
          <>
            <Calendar
              mode="single"
              selected={selected}
              onSelect={handleSelect}
              disabled={[{ before: minDate }, ...unavailableDates]}
              locale={es}
              className="!p-2"
              classNames={{
                day_selected:
                  "bg-[#3B2A22] text-white hover:bg-[#2A1F19] focus:bg-[#2A1F19]",
                day_today: "bg-[#E8DED0] text-[#3B2A22] font-semibold",
              }}
            />
            {unavailableDates.length > 0 && (
              <p className="text-[11px] text-[#9B8677] text-center pb-2 px-2">
                Las fechas en gris no tienen terrazas disponibles para tu grupo
              </p>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
