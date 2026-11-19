import { createHash, createHmac } from "crypto";

export type RegistrationOtpPurpose = "login" | "id-lookup";

export function normalizeRegistrationEmail(value: string) {
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address.");
  }
  return email;
}

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

function hmac(key: Buffer | string, value: string) {
  return createHmac("sha256", key).update(value, "utf8").digest();
}

function signingKey(secret: string, date: string, region: string) {
  const dateKey = hmac("AWS4" + secret, date);
  const regionKey = hmac(dateKey, region);
  const serviceKey = hmac(regionKey, "ses");
  return hmac(serviceKey, "aws4_request");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

export async function sendRegistrationOtpEmail(
  recipient: string,
  otp: string,
  purpose: RegistrationOtpPurpose,
  participantName?: string,
) {
  const region = (process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION)?.trim();
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY?.trim();
  const sessionToken = process.env.AWS_SESSION_TOKEN?.trim();
  const fromEmail = process.env.SES_FROM_EMAIL?.trim();

  if (!region || !accessKeyId || !secretAccessKey || !fromEmail) {
    throw new Error("SES_EMAIL_PROVIDER_NOT_CONFIGURED");
  }

  const isLogin = purpose === "login";
  const subject = isLogin ? "Your DATAVERSE sign-in code" : "Your DATAVERSE verification code";
  const heading = isLogin ? "Sign in to DATAVERSE" : "Verify your email";
  const greeting = participantName ? "Hello " + escapeHtml(participantName) + "," : "Hello,";
  const action = isLogin
    ? "Use this one-time code to sign in to your DATAVERSE participant account."
    : "Use this one-time code to verify your email and retrieve your DATAVERSE participant ID.";
  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"></head>
<body style="margin:0;padding:32px 12px;background:#050b0a;font-family:Arial,Helvetica,sans-serif;color:#e5eee9;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your DATAVERSE verification code expires in five minutes.</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;border-collapse:separate;border-spacing:0;background:#091411;border:1px solid #14513b;border-radius:20px;overflow:hidden;">
    <tr><td style="padding:26px 30px;background:linear-gradient(120deg,#063b2b,#07100e);border-bottom:1px solid #14513b;">
      <div style="font-size:12px;font-weight:700;letter-spacing:4px;color:#6ee7b7;">DATAVERSE <span style="color:#d1fae5;">2K26</span></div>
      <div style="margin-top:8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#9ab9aa;">Loyola College · SAGE</div>
    </td></tr>
    <tr><td style="padding:34px 30px 30px;">
      <div style="display:inline-block;padding:6px 10px;border:1px solid #176344;border-radius:999px;background:#09291d;color:#86efac;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Secure verification</div>
      <h1 style="margin:18px 0 10px;font-size:25px;line-height:1.25;color:#f0fdf4;">${heading}</h1>
      <p style="margin:0 0 22px;font-size:14px;line-height:1.7;color:#b8c8bf;">${greeting}<br>${action}</p>
      <div style="padding:22px 16px;text-align:center;border:1px solid #1d6848;border-radius:15px;background:#06100c;">
        <div style="font-size:10px;font-weight:700;letter-spacing:2px;color:#86efac;text-transform:uppercase;">Your one-time password</div>
        <div style="margin-top:12px;font-size:34px;line-height:1.2;font-weight:800;letter-spacing:10px;color:#d1fae5;">${otp}</div>
        <div style="margin-top:12px;font-size:11px;color:#91a79a;">Expires in 5 minutes</div>
      </div>
      <p style="margin:22px 0 0;font-size:12px;line-height:1.7;color:#9aaca1;">Never share this code with anyone. DATAVERSE organisers will never ask you to disclose it. If you did not request this code, you can safely ignore this email.</p>
    </td></tr>
    <tr><td style="padding:18px 30px;border-top:1px solid #163d2d;background:#07100d;">
      <div style="font-size:10px;line-height:1.6;color:#71877a;">DATAVERSE 2K26 · Loyola College<br>This is an automated security email. Please do not reply.</div>
    </td></tr>
  </table>
</body></html>`;
  const textBody = [
    "DATAVERSE 2K26",
    heading,
    "",
    greeting.replace(/<[^>]*>/g, ""),
    action,
    "",
    "Your one-time code: " + otp,
    "This code expires in 5 minutes.",
    "Never share this code. If you did not request it, ignore this email.",
    "",
    "DATAVERSE 2K26 · Loyola College",
  ].join("\n");

  const payload: Record<string, unknown> = {
    FromEmailAddress: fromEmail,
    Destination: { ToAddresses: [normalizeRegistrationEmail(recipient)] },
    Content: {
      Simple: {
        Subject: { Data: subject, Charset: "UTF-8" },
        Body: {
          Html: { Data: html, Charset: "UTF-8" },
          Text: { Data: textBody, Charset: "UTF-8" },
        },
      },
    },
  };
  if (process.env.SES_REPLY_TO_EMAIL) payload.ReplyToAddresses = [process.env.SES_REPLY_TO_EMAIL];
  if (process.env.SES_CONFIGURATION_SET) payload.ConfigurationSetName = process.env.SES_CONFIGURATION_SET;

  const body = JSON.stringify(payload);
  const bodyHash = createHash("sha256").update(body, "utf8").digest("hex");
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const host = "email." + region + ".amazonaws.com";
  const url = "https://" + host + "/v2/email/outbound-emails";
  const headers: Record<string, string> = {
    "content-type": "application/json",
    host,
    "x-amz-content-sha256": bodyHash,
    "x-amz-date": amzDate,
  };
  if (sessionToken) headers["x-amz-security-token"] = sessionToken;

  // SigV4 requires headers in bytewise alphabetical order, with
  // normalized values and a newline after every canonical header.
  const sortedHeaders = Object.entries(headers).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0);
  const canonicalHeaders = sortedHeaders
    .map(([key, value]) => key.toLowerCase() + ":" + value.trim().replace(/\s+/g, " ") + "\n")
    .join("");
  const signedHeaders = sortedHeaders.map(([key]) => key.toLowerCase()).join(";");
  const canonicalRequest = [
    "POST",
    "/v2/email/outbound-emails",
    "",
    canonicalHeaders,
    signedHeaders,
    bodyHash,
  ].join("\n");
  const scope = dateStamp + "/" + region + "/ses/aws4_request";
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    scope,
    createHash("sha256").update(canonicalRequest, "utf8").digest("hex"),
  ].join("\n");
  const signature = createHmac("sha256", signingKey(secretAccessKey, dateStamp, region))
    .update(stringToSign, "utf8")
    .digest("hex");

  headers.Authorization = "AWS4-HMAC-SHA256 Credential=" + accessKeyId + "/" + scope
    + ", SignedHeaders=" + signedHeaders + ", Signature=" + signature;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body,
    cache: "no-store",
  });
  if (!response.ok) {
    const providerError = await response.text();
    console.error("Amazon SES rejected an OTP email:", response.status, providerError.slice(0, 500));
    throw new Error("SES_EMAIL_PROVIDER_FAILED");
  }
}
