import type { ChatAction, ParsedMessage } from "./types";

const AWAIT_PROOF_REGEX = /\[AWAIT_PROOF(?::([a-f0-9-]{36}))?\]/g;
const PROOF_DONE_REGEX = /\[PROOF_DONE\]/g;

function extractAction(input: string): { text: string; action: ChatAction | null } {
  const marker = "[ACTION:";
  const start = input.indexOf(marker);
  if (start === -1) return { text: input, action: null };

  // Guarantee that NO stray characters, missing brackets, or unclosed JSON
  // ever show up in the user's chat bubble. We strip everything from [ACTION:
  // to the end of the input string.
  const text = input.substring(0, start).trim();

  let rawJsonStr = input.substring(start + marker.length).trim();

  // Try to isolate the JSON object by finding the first '{' and last '}'
  const firstBrace = rawJsonStr.indexOf("{");
  const lastBrace = rawJsonStr.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    rawJsonStr = rawJsonStr.substring(firstBrace, lastBrace + 1);
  } else if (firstBrace !== -1) {
    // Truncated JSON without a closing brace. We capture from '{' to the end.
    rawJsonStr = rawJsonStr.substring(firstBrace);
  }

  let action: ChatAction | null = null;
  try {
    action = JSON.parse(rawJsonStr) as ChatAction;
  } catch (e) {
    console.error("JSON parse failed. Value was truncated or malformed:", rawJsonStr);
    
    // IMMUNE FALLBACK: If JSON is truncated, rescue the UX by injecting defaults
    if (rawJsonStr.includes('"guest_counter"')) {
      action = {
        type: "guest_counter",
        fields: [
          { key: "adults", label: "Adultos", min: 1, max: 20, default: 2 },
          { key: "children", label: "Niños", min: 0, max: 10, default: 0 }
        ]
      } as any;
    } else if (rawJsonStr.includes('"date_picker"')) {
      action = { type: "date_picker" } as any;
    }
  }

  return { text, action };
}

export function parseMessage(raw: string): ParsedMessage {
  let action: ChatAction | null = null;
  let awaitProofId: string | null = null;
  let proofDone = false;

  // Extract [ACTION:{...}]
  const extracted = extractAction(raw);
  let text = extracted.text;
  action = extracted.action;

  // Extract [AWAIT_PROOF:uuid]
  const awaitMatch = text.match(/\[AWAIT_PROOF(?::([a-f0-9-]{36}))?\]/);
  if (awaitMatch) {
    awaitProofId = awaitMatch[1] ?? null;
  }
  text = text.replace(AWAIT_PROOF_REGEX, "");

  // Extract [PROOF_DONE]
  if (text.includes("[PROOF_DONE]")) {
    proofDone = true;
  }
  text = text.replace(PROOF_DONE_REGEX, "");

  return { text: text.trim(), action, awaitProofId, proofDone };
}
