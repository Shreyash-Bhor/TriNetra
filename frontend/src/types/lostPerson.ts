export type LostPersonGender = "male" | "female" | "other";

export type LostPersonReport = {
  _id: string;
  fullName: string;
  dateOfBirth: string;
  gender: LostPersonGender;
  isDismissed: boolean;
  dismissedAt?: string;
  createdBy?: {
    _id: string;
    username: string;
    location?: string;
  };
  createdAt: string;
};

export type CreateLostPersonReportPayload = {
  fullName: string;
  dateOfBirth: string;
  gender: LostPersonGender;
};
