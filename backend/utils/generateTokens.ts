import { signAccessToken, signRefreshToken } from "./jwt";

interface Payload {
  sub: string;
  email?: string;
  role: "admin" | "volunteer";
}

export function generateTokens(payload: Payload) {
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  return { accessToken, refreshToken };
}
