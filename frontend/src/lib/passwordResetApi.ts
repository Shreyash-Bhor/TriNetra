import api from "@/lib/axios";

export interface ForgotPasswordPayload {
  username: string;
  newPassword: string;
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  const response = await api.post("auth/forgot-password", payload);
  return response.data as { message: string };
}
