export type LostPersonGender = "male" | "female" | "other";

export type LostPersonReport = {
  _id: string;
  fullName: string;
  age: number;
  gender: LostPersonGender;
  createdAt: string;
};

export type CreateLostPersonReportPayload = {
  fullName: string;
  age: number;
  gender: LostPersonGender;
};
