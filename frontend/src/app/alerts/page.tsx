import { fetchAlerts } from "@/lib/api";
import AlertsListClient from "@/components/dashboard/AlertsListClient";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const { alerts } = await fetchAlerts();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-white text-2xl font-semibold">Alerts & Notifications</h1>
      <AlertsListClient alerts={alerts} />
    </div>
  );
}
