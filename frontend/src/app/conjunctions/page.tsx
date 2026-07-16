import { fetchConjunctions } from "@/lib/api";
import ConjunctionsTableClient from "@/components/dashboard/ConjunctionsTableClient";

export const dynamic = "force-dynamic";

export default async function ConjunctionsPage() {
  const { conjunctions } = await fetchConjunctions("active");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-white text-2xl font-semibold">Conjunction & Risk Analysis</h1>
      <ConjunctionsTableClient conjunctions={conjunctions} />
    </div>
  );
}
