import type { ChatAction } from "./types";
import { ChatDatePicker } from "./widgets/ChatDatePicker";
import { ChatGuestCounter } from "./widgets/ChatGuestCounter";
import { ChatQuickReply } from "./widgets/ChatQuickReply";

interface ChatActionWidgetProps {
  action: ChatAction;
  onSubmit: (text: string) => void;
  disabled: boolean;
}

export function ChatActionWidget({ action, onSubmit, disabled }: ChatActionWidgetProps) {
  switch (action.type) {
    case "date_picker":
      return <ChatDatePicker action={action} onSubmit={onSubmit} disabled={disabled} />;
    case "guest_counter":
      return <ChatGuestCounter action={action} onSubmit={onSubmit} disabled={disabled} />;
    case "quick_reply":
      return <ChatQuickReply action={action} onSubmit={onSubmit} disabled={disabled} />;
    default:
      return null;
  }
}
