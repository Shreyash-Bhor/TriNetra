"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LostPersonForm } from "@/components/lost-person/lost-person-form";
import { LostPersonRecentList } from "@/components/lost-person/lost-person-recent-list";
import {
  createLostPersonReport,
  fetchLostPersonReports,
} from "@/lib/lostPersonApi";
import { LostPersonGender, LostPersonReport } from "@/types/lostPerson";

type LostPersonFormValues = {
  fullName: string;
  age: string;
  gender: LostPersonGender;
};

const defaultFormValues: LostPersonFormValues = {
  fullName: "",
  age: "",
  gender: "male",
};

export default function VolunteerDashboard() {
  const [formData, setFormData] =
    useState<LostPersonFormValues>(defaultFormValues);
  const [reports, setReports] = useState<LostPersonReport[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const loadReports = async () => {
    const data = await fetchLostPersonReports();
    setReports(data);
  };

  useEffect(() => {
    loadReports().catch(() => {
      setMessage("Unable to load reports right now.");
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      await createLostPersonReport({
        fullName: formData.fullName,
        age: Number(formData.age),
        gender: formData.gender,
      });

      setFormData(defaultFormValues);
      setMessage("Lost person report submitted successfully.");
      await loadReports();
    } catch {
      setMessage("Failed to submit report. Please verify your inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-10">
      <Navigation />

      <div className="px-8 pt-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 rounded-3xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Report Lost Person</CardTitle>
          </CardHeader>
          <CardContent>
            <LostPersonForm
              formData={formData}
              isSubmitting={isSubmitting}
              message={message}
              onChange={setFormData}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 rounded-3xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">
              Recent Lost Person Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LostPersonRecentList reports={reports} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
