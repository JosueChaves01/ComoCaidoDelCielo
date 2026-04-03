import { parseMessage } from "./parseMessage";

// Simple test runner
let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  PASS: ${name}`);
  } catch (e) {
    failed++;
    console.error(`  FAIL: ${name}`);
    console.error(`    ${(e as Error).message}`);
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

console.log("\nparseMessage tests\n");

test("plain text without tags", () => {
  const result = parseMessage("Hola, bienvenido!");
  assert(result.text === "Hola, bienvenido!", `text: "${result.text}"`);
  assert(result.action === null, "action should be null");
  assert(result.awaitProofId === null, "awaitProofId should be null");
  assert(result.proofDone === false, "proofDone should be false");
});

test("date_picker action", () => {
  const raw = '¿Para qué fecha deseas la reserva? [ACTION:{"type":"date_picker","min":"2026-04-03"}]';
  const result = parseMessage(raw);
  assert(result.text === "¿Para qué fecha deseas la reserva?", `text: "${result.text}"`);
  assert(result.action !== null, "action should not be null");
  assert(result.action!.type === "date_picker", `type: ${result.action!.type}`);
  assert((result.action as { min: string }).min === "2026-04-03", "min date mismatch");
});

test("guest_counter action", () => {
  const raw = '¿Cuántas personas asistirán? [ACTION:{"type":"guest_counter","fields":[{"key":"adults","label":"Adultos","min":1,"max":20,"default":2},{"key":"children","label":"Niños","min":0,"max":10,"default":0}]}]';
  const result = parseMessage(raw);
  assert(result.text === "¿Cuántas personas asistirán?", `text: "${result.text}"`);
  assert(result.action !== null, "action should not be null");
  assert(result.action!.type === "guest_counter", `type: ${result.action!.type}`);
  const fields = (result.action as { fields: { key: string }[] }).fields;
  assert(fields.length === 2, `fields length: ${fields.length}`);
  assert(fields[0].key === "adults", `first field key: ${fields[0].key}`);
});

test("quick_reply action", () => {
  const raw = '¿Confirmas la reserva? [ACTION:{"type":"quick_reply","options":[{"label":"Sí","value":"Sí, confirmo"},{"label":"No","value":"No"}]}]';
  const result = parseMessage(raw);
  assert(result.text === "¿Confirmas la reserva?", `text: "${result.text}"`);
  assert(result.action !== null, "action should not be null");
  assert(result.action!.type === "quick_reply", `type: ${result.action!.type}`);
  const options = (result.action as { options: { label: string }[] }).options;
  assert(options.length === 2, `options length: ${options.length}`);
});

test("AWAIT_PROOF tag", () => {
  const raw = "Envía tu comprobante. [AWAIT_PROOF:550e8400-e29b-41d4-a716-446655440000]";
  const result = parseMessage(raw);
  assert(result.text === "Envía tu comprobante.", `text: "${result.text}"`);
  assert(result.awaitProofId === "550e8400-e29b-41d4-a716-446655440000", `id: ${result.awaitProofId}`);
  assert(result.action === null, "action should be null");
});

test("PROOF_DONE tag", () => {
  const raw = "Comprobante recibido! [PROOF_DONE]";
  const result = parseMessage(raw);
  assert(result.text === "Comprobante recibido!", `text: "${result.text}"`);
  assert(result.proofDone === true, "proofDone should be true");
});

test("ACTION + AWAIT_PROOF together", () => {
  const raw = 'Pago info [AWAIT_PROOF:550e8400-e29b-41d4-a716-446655440000] [ACTION:{"type":"quick_reply","options":[{"label":"Ok","value":"Ok"}]}]';
  const result = parseMessage(raw);
  assert(result.awaitProofId === "550e8400-e29b-41d4-a716-446655440000", "awaitProofId mismatch");
  assert(result.action !== null, "action should exist");
  assert(result.action!.type === "quick_reply", "action type mismatch");
  assert(result.text === "Pago info", `text: "${result.text}"`);
});

test("malformed JSON in ACTION degrades gracefully", () => {
  const raw = "Hola [ACTION:{broken json}]";
  const result = parseMessage(raw);
  assert(result.text === "Hola", `text: "${result.text}"`);
  assert(result.action === null, "action should be null on bad JSON");
});

test("no tags returns clean text", () => {
  const raw = "   Texto con espacios   ";
  const result = parseMessage(raw);
  assert(result.text === "Texto con espacios", `text: "${result.text}"`);
});

console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
