export function generatePhonePeTxnId() {
  const prefix = 'T';
  const dateStr = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(2, 14);
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${dateStr}${randomDigits}`;
}

export function generateUTR() {
  return String(Math.floor(100000000000 + Math.random() * 900000000000)).slice(0, 12);
}
