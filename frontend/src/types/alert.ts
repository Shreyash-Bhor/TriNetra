export type AlertCreatedByRole = "admin" | "volunteer";
export type AlertViewerRole = AlertCreatedByRole;
export type AlertStatus = "pending" | "active" | "dismissed";

export type SiteAlert = {
  _id: string;
  title: string;
  message: string;
  createdByRole: AlertCreatedByRole;
  status: AlertStatus;
  acknowledgedAt?: string;
  dismissedAt?: string;
  createdAt: string;
};

export type CreateAlertPayload = {
  title: string;
  message: string;
};
