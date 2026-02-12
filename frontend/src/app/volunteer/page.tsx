'use client'

import Card from "@/components/ui/card";
import Navigation from "@/components/navigation";

export default function VolunteerDashboard() {
  return (
    <div className="min-h-screen">
      <div className="px-8 py-8 max-w-7xl mx-auto">
        <Navigation />

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1">
            <Card className="h-96 rounded-3xl flex items-center justify-center p-8 shadow-2xl hover:shadow-2xl transition-shadow duration-300">
              <h2 className="text-4xl font-bold text-white text-center">
                Form for Missing Person
              </h2>
            </Card>
          </div>

          <div className="col-span-2 space-y-8">
            <Card className="rounded-3xl p-8 h-44 flex items-center justify-center shadow-2xl">
              <h3 className="text-3xl font-bold text-white text-center">
                Alert Acknowledgement Checklist
              </h3>
            </Card>

            <Card className="rounded-3xl p-8 h-44 flex items-center justify-center shadow-2xl">
              <h3 className="text-3xl font-bold text-white text-center">
                Field Report form and Zone Updates
              </h3>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

