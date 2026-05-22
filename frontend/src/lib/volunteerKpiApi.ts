import api from "@/lib/axios";
import { VolunteerDashboardKpis } from "@/types/volunteerKpis";

export const fetchVolunteerDashboardKpis =
  async (): Promise<VolunteerDashboardKpis> => {
    const response = await api.get<VolunteerDashboardKpis>(
      "/crowd/simulation/volunteer-kpis",
    );
    return response.data;
  };
