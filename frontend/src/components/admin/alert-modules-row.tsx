"use client";

import type { FormEvent } from "react";
import { AlertTriangle, BellRing } from "lucide-react";
import { SiteAlert } from "@/types/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  glassCardClass,
  compactModuleHeightClass,
} from "@/components/admin/admin-dashboard-shared";

type Props = {
  alertTitle: string;
  alertMessage: string;
  statusMessage: string;
  pendingAlerts: SiteAlert[];
  onAlertTitleChange: (value: string) => void;
  onAlertMessageChange: (value: string) => void;
  onCreateAlert: (event: FormEvent) => Promise<void>;
  onAcknowledge: (id: string) => Promise<void>;
};

export function AlertModulesRow(props: Props) {
  const {
    alertTitle,
    alertMessage,
    statusMessage,
    pendingAlerts,
    onAlertTitleChange,
    onAlertMessageChange,
    onCreateAlert,
    onAcknowledge,
  } = props;

  return (
    <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card className={glassCardClass}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-rose-700 dark:text-rose-300">
            <BellRing className="h-5 w-5" /> Create Emergency Alert
          </CardTitle>
        </CardHeader>
        <CardContent className={`overflow-hidden ${compactModuleHeightClass}`}>
          <form onSubmit={onCreateAlert} className="space-y-4">
            <Input
              value={alertTitle}
              onChange={(event) => onAlertTitleChange(event.target.value)}
              placeholder="Alert title"
              className="border-white/30 bg-white/50 dark:border-white/15 dark:bg-black/20"
              required
            />
            <Input
              value={alertMessage}
              onChange={(event) => onAlertMessageChange(event.target.value)}
              placeholder="Alert message"
              className="border-white/30 bg-white/50 dark:border-white/15 dark:bg-black/20"
              required
            />
            <Button type="submit" className="w-full sm:w-auto">
              Publish Alert
            </Button>
          </form>
          {statusMessage ? (
            <p className="mt-3 text-sm">{statusMessage}</p>
          ) : null}
        </CardContent>
      </Card>

      <Card className={glassCardClass}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-amber-700 dark:text-amber-300">
            <AlertTriangle className="h-5 w-5" /> Pending Volunteer Alerts
          </CardTitle>
        </CardHeader>
        <CardContent
          className={`space-y-4 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${compactModuleHeightClass}`}
        >
          {pendingAlerts.length === 0 ? <p>No pending alerts.</p> : null}
          {pendingAlerts.map((alert) => (
            <div
              key={alert._id}
              className="space-y-3 rounded-2xl border border-white/30 bg-white/35 p-4 dark:border-white/15 dark:bg-white/5"
            >
              <div>
                <p className="font-semibold">{alert.title}</p>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
              </div>
              <Button onClick={() => onAcknowledge(alert._id)}>
                Acknowledge & Publish
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
