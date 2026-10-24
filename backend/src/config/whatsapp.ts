export const SENDERS = {
  mom: process.env.WA_MOM_PHONE_NUMBER_ID!,
  dad: process.env.WA_DAD_PHONE_NUMBER_ID!,
} as const;

export const WA_TOKEN = process.env.WA_ACCESS_TOKEN!;
export const WA_API = "https://graph.facebook.com/v21.0";