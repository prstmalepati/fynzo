export function germanIncomeTax(gross, married=false) {
  const base = married ? gross/2 : gross;
  let tax = base <= 10908 ? 0 :
            base <= 15999 ? (base-10908)*0.14 :
            base <= 62809 ? 1027+(base-15999)*0.24 :
            14753+(base-62809)*0.42;
  tax *= married ? 2 : 1;
  return Math.round(tax * 1.055);
}
