import { fetchObjects } from "@/lib/api";
import GlassPanel from "@/components/ui/GlassPanel";

export const dynamic = "force-dynamic";

export default async function FleetPage() {
  const { objects, total } = await fetchObjects("satellite", 100);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-white text-2xl font-semibold">Fleet & Asset Registry</h1>
      <p className="text-white/50 text-sm -mt-4">
        Showing {objects.length} of {total} tracked satellites. No dataset currently marks real
        fleet ownership — every object below defaults to <code className="text-cyan-400">is_own_asset: false</code>.
      </p>

      <GlassPanel className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-white/40 border-b border-white/10">
              <th className="pb-3 pr-4">NORAD ID</th>
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Owned</th>
            </tr>
          </thead>
          <tbody>
            {objects.map((o) => (
              <tr key={o.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 pr-4 text-white/70 font-mono">{o.norad_cat_id}</td>
                <td className="py-3 pr-4 text-white">{o.object_name}</td>
                <td className="py-3 pr-4 text-white/50">{o.is_own_asset ? "Yes" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassPanel>
    </div>
  );
}