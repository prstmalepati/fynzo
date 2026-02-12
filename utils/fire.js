export const fireNumber = expenses => expenses * 12 * 25;
export const fireProgress = (nw, expenses) =>
  Math.min(100, Math.round((nw / fireNumber(expenses)) * 100));
