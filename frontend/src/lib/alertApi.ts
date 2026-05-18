import api from "@/lib/axios";
import { AlertViewerRole, CreateAlertPayload, SiteAlert } from "@/types/alert";

export const fetchAlerts = async (
  viewer: AlertViewerRole,
): Promise<SiteAlert[]> => {
  const response = await api.get<SiteAlert[]>("/alerts", {
    params: { viewer },
  });
  return response.data;
};

export const createAlert = async (
  payload: CreateAlertPayload,
): Promise<SiteAlert> => {
  const response = await api.post<SiteAlert>("/alerts", payload);
  return response.data;
};

export const acknowledgeAlert = async (id: string): Promise<SiteAlert> => {
  const response = await api.patch<SiteAlert>(`/alerts/${id}/acknowledge`);
  return response.data;
};

export const dismissAlert = async (id: string): Promise<SiteAlert> => {
  const response = await api.patch<SiteAlert>(`/alerts/${id}/dismiss`);
  return response.data;
};
