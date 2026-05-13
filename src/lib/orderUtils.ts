export function generateOrderNumber() {
  const datePart = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const randomPart = Math.floor(100000 + Math.random() * 900000);

  return `WOW-${datePart}-${randomPart}`;
}
