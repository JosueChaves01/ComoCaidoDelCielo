import type { ChatAction, ParsedMessage } from "./types";

const AWAIT_PROOF_REGEX = /\[AWAIT_PROOF(?::([a-f0-9-]{36}))?\]/g;
const PROOF_DONE_REGEX = /\[PROOF_DONE\]/g;

function extractAction(input: string): { text: string; action: ChatAction | null } {
  const marker = "[ACTION:";
  const start = input.indexOf(marker);
  if (start === -1) return { text: input, action: null };

  // Find the matching closing bracket by counting braces
  let depth = 0;
  let jsonStart = start + marker.length;
  let end = -1;

  for (let i = jsonStart; i < input.length; i++) {
    const ch = input[i];
    if (ch === "{" || ch === "[") depth++;
    if (ch === "}" || ch === "]") {
      depth--;
      if (depth === 0) {
        end = i + 1; // end of the JSON object
        break;
      }
    }
  }

  if (end === -1) return { text: input, action: null };

  // Expect a closing ']' for the [ACTION:...] wrapper
  const closingBracket = input.indexOf("]", end);
  const jsonStr = input.substring(jsonStart, end);
  const fullTag = input.substring(start, closingBracket !== -1 ? closingBracket + 1 : end);

  let action: ChatAction | null = null;
  try {
    action = JSON.parse(jsonStr) as ChatAction;
  } catch {
    // Malformed JSON — degrade gracefully
  }

  const text = input.replace(fullTag, "");
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
