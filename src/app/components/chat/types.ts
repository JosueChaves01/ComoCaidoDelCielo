export interface DatePickerAction {
  type: "date_picker";
  min?: string; // YYYY-MM-DD
  guests?: number; // Total guests — used to filter dates by terrace capacity
}

export interface GuestCounterField {
  key: string;
  label: string;
  min: number;
  max: number;
  default: number;
}

export interface GuestCounterAction {
  type: "guest_counter";
  fields: GuestCounterField[];
}

export interface QuickReplyOption {
  label: string;
  value: string;
}

export interface QuickReplyAction {
  type: "quick_reply";
  options: QuickReplyOption[];
}

export type ChatAction = DatePickerAction | GuestCounterAction | QuickReplyAction;

export interface ParsedMessage {
  text: string;
  action: ChatAction | null;
  awaitProofId: string | null;
  proofDone: boolean;
}
