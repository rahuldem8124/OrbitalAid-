import ComingSoon from "@/components/ui/ComingSoon";
import { Layers } from "lucide-react";

export default function SimulationPage() {
  return (
    <ComingSoon
      icon={Layers}
      title="Simulation / What-If Sandbox"
      description="Model hypothetical launches or maneuvers before committing — planned for a later phase."
    />
  );
}