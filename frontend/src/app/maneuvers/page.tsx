import { fetchManeuvers } from "@/lib/api";
import ManeuversListClient from "@/components/dashboard/ManeuversListClient";

export const dynamic = "force-dynamic";

export default async function ManeuversPage() {
  const { maneuvers } = await fetchManeuvers();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-white text-2xl font-semibold">Maneuver & Preventive Actions</h1>
      <ManeuversListClient maneuvers={maneuvers} />
    </div>
  );
}
