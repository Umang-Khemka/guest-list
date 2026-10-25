// Display only: "+919830266555" -> "+91 9830266555". Other formats are left as they are.
export const formatPhone = (value: string): string => {
  const v = value.replace(/[\s-]/g, "");
  return v.startsWith("+91") && v.length > 3 ? `+91 ${v.slice(3)}` : value;
};