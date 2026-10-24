export const normalizePhone = (raw: string, defaultCountry = "91"): string | null => {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.length === 10) d = defaultCountry + d;
  if (d.length === 11 && d.startsWith("0")) d = defaultCountry + d.slice(1);
  return d.length >= 11 && d.length <= 15 ? d : null;
};