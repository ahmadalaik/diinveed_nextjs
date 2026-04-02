import crypto from "crypto";

const SESSION_COOKIE = "diinveed_session";

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function generateToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export { sha256, generateToken, SESSION_COOKIE };
