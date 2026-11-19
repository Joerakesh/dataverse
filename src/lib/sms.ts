import { createHash } from "crypto";

export function hashRegistrationOtp(otp: string) {
  const secret = process.env.OTP_HASH_SECRET;
  if (!secret || secret.length < 32) throw new Error("OTP_HASH_SECRET_NOT_CONFIGURED");
  return createHash("sha256").update(otp + ":" + secret).digest("hex");
}

export function hashRegistrationRequestIp(ip: string) {
  const secret = process.env.OTP_HASH_SECRET;
  if (!secret || secret.length < 32) throw new Error("OTP_HASH_SECRET_NOT_CONFIGURED");
  return createHash("sha256").update(ip + ":" + secret).digest("hex");
}

export async function sendRegistrationOtp(mobile: string, otp: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;
  if (!accountSid || !authToken || !fromNumber) throw new Error("SMS_PROVIDER_NOT_CONFIGURED");

  const form = new URLSearchParams();
  form.set("To", "+91" + mobile);
  form.set("From", fromNumber);
  form.set("Body", "Your DATAVERSE 2K26 verification code is " + otp + ". It expires in 5 minutes. Do not share this code.");

  const response = await fetch("https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages.json", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(accountSid + ":" + authToken).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
    cache: "no-store",
  });

  if (!response.ok) {
    const providerError = await response.text();
    console.error("SMS provider rejected an OTP request:", response.status, providerError.slice(0, 500));
    throw new Error("SMS_PROVIDER_FAILED");
  }
}
