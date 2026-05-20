import api from "@/lib/axios";
import {
  CreateLostPersonReportPayload,
  LostPersonReport,
} from "@/types/lostPerson";

export const fetchLostPersonReports = async (): Promise<LostPersonReport[]> => {
  const response = await api.get<LostPersonReport[]>("/lost-persons");
  return response.data;
};

export const createLostPersonReport = async (
  payload: CreateLostPersonReportPayload,
): Promise<LostPersonReport> => {
  const response = await api.post<LostPersonReport>("/lost-persons", payload);
  return response.data;
};
export const dismissLostPersonReport = async (
  id: string,
): Promise<LostPersonReport> => {
  const response = await api.patch<LostPersonReport>(
    `/lost-persons/${id}/dismiss`,
  );
  return response.data;
};
