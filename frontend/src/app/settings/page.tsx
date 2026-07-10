import ComingSoon from "@/components/ui/ComingSoon";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <ComingSoon
      icon={Settings}
      title="Settings & Access Control"
      description="Role-based permissions and team management — planned for a later phase."
    />
  );
}