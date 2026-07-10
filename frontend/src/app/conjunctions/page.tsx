import { fetchConjunctions } from "@/lib/api";
import GlassPanel from "@/components/ui/GlassPanel";
import RiskIndicator from "@/components/ui/RiskIndicator";

export const dynamic = "force-dynamic";

export default async function ConjunctionsPage() {
  const { conjunctions } = await fetchConjunctions("active");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-white text-2xl font-semibold">Conjunction & Risk Analysis</h1>

      <GlassPanel className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-white/40 border-b border-white/10">
              <th className="pb-3 pr-4">Object A</th>
              <th className="pb-3 pr-4">Object B</th>
              <th className="pb-3 pr-4">Miss Distance</th>
              <th className="pb-3 pr-4">TCA</th>
              <th className="pb-3 pr-4">Pc</th>
              <th className="pb-3 pr-4">Risk</th>
            </tr>
          </thead>
          <tbody>
            {conjunctions.map((c) => (
              <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 pr-4 text-white">{c.object_a.object_name}</td>
                <td className="py-3 pr-4 text-white">{c.object_b.object_name}</td>
                <td className="py-3 pr-4 text-cyan-400 font-mono">{c.miss_distance_km.toFixed(2)} km</td>
                <td className="py-3 pr-4 text-white/70 font-mono">{new Date(c.tca).toLocaleString()}</td>
                <td className="py-3 pr-4 text-rose-400 font-mono">
                  {c.pc != null ? `${(c.pc * 100).toFixed(4)}%` : "—"}
                </td>
                <td className="py-3 pr-4">{c.risk_tier && <RiskIndicator tier={c.risk_tier} />}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {conjunctions.length === 0 && (
          <p className="text-white/40 text-center py-8">No active conjunctions.</p>
        )}
      </GlassPanel>
    </div>
  );
}