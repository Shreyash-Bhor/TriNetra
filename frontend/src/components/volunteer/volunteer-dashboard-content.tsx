"use client";

import { useState } from "react";
import { BellRing, UserRoundSearch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LostPersonForm } from "@/components/lost-person/lost-person-form";
import { VolunteerLostPersonTable } from "@/components/volunteer/volunteer-lost-person-table";
import { VolunteerCrowdDensityMapCard } from "@/components/volunteer/volunteer-crowd-density-map-card";
import { VolunteerWeatherPanel } from "@/components/volunteer/volunteer-weather-panel";
import { VolunteerKpiCards } from "@/components/volunteer/volunteer-kpi-cards";
import { useLiveResource } from "@/hooks/use-live-resource";
import {
  createLostPersonReport,
  dismissLostPersonReport,
  fetchLostPersonReports,
} from "@/lib/lostPersonApi";
import { createAlert } from "@/lib/alertApi";
import { publishRealtimeUpdate } from "@/lib/realtime";
import { LostPersonGender } from "@/types/lostPerson";
import { WeatherResponse } from "@/types/weather";
import { glassCardClass } from "@/components/admin/admin-dashboard-shared";

type LostPersonFormValues = {
  fullName: string;
  dateOfBirth: string;
  gender: LostPersonGender;
};

const defaultFormValues: LostPersonFormValues = {
  fullName: "",
  dateOfBirth: "",
  gender: "male",
};

type VolunteerDashboardContentProps = {
  weather: WeatherResponse | null;
  weatherError: string | null;
};

export function VolunteerDashboardContent({
  weather,
  weatherError,
}: VolunteerDashboardContentProps) {
  const [formData, setFormData] =
    useState<LostPersonFormValues>(defaultFormValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertStatusMessage, setAlertStatusMessage] = useState("");

  const { data: reportsData, refresh: loadReports } = useLiveResource({
    topic: "lost-person-reports",
    fetcher: fetchLostPersonReports,
    pollingMs: 5000,
    onError: () => setMessage("Unable to load reports right now."),
  });

  const reports = reportsData ?? [];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      await createLostPersonReport({
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
      });
      setFormData(defaultFormValues);
      setMessage("Lost person report submitted successfully.");
      await loadReports();
      publishRealtimeUpdate("lost-person-reports");
    } catch {
      setMessage("Failed to submit report. Please verify your inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAlert = async (event: React.FormEvent) => {
    event.preventDefault();
    setAlertStatusMessage("");

    try {
      await createAlert({ title: alertTitle, message: alertMessage });
      setAlertTitle("");
      setAlertMessage("");
      setAlertStatusMessage(
        "Alert sent to admin. It will be visible after admin acknowledgement.",
      );
      publishRealtimeUpdate("alerts");
    } catch {
      setAlertStatusMessage("Failed to create alert. Check your inputs.");
    }
  };

  return (
    <main className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 pt-24 sm:px-8">
      <section>
        <VolunteerKpiCards />
      </section>

      <section>
        <VolunteerWeatherPanel weather={weather} error={weatherError} />
      </section>

      <section className="h-fit">
        <VolunteerCrowdDensityMapCard />
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch">
        <Card className={`${glassCardClass} flex flex-col`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-violet-700 dark:text-violet-300">
              <UserRoundSearch className="h-5 w-5" /> Create Lost Person Report
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-hidden pb-5">
            <LostPersonForm
              formData={formData}
              isSubmitting={isSubmitting}
              message={message}
              onChange={setFormData}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>

        <Card className={`${glassCardClass} flex flex-col`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-rose-700 dark:text-rose-300">
              <BellRing className="h-5 w-5" /> Create Emergency Alert
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 overflow-hidden pb-5">
            <form onSubmit={handleCreateAlert} className="space-y-4">
              <Input
                placeholder="Alert title"
                value={alertTitle}
                onChange={(event) => setAlertTitle(event.target.value)}
                className="border-white/30 bg-white/50 dark:border-white/15 dark:bg-black/20"
                required
              />
              <Input
                placeholder="Alert message"
                value={alertMessage}
                onChange={(event) => setAlertMessage(event.target.value)}
                className="border-white/30 bg-white/50 dark:border-white/15 dark:bg-black/20"
                required
              />
              <Button type="submit">Send alert to admin</Button>
            </form>
            {alertStatusMessage ? (
              <p className="text-sm">{alertStatusMessage}</p>
            ) : null}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className={glassCardClass}>
          <CardHeader>
            <CardTitle className="text-2xl">
              Recent Lost Person Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[30rem] min-h-[30rem] overflow-hidden">
            <VolunteerLostPersonTable
              reports={reports}
              canDismiss
              onDismiss={async (id) => {
                await dismissLostPersonReport(id);
                await loadReports();
                publishRealtimeUpdate("lost-person-reports");
              }}
            />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
