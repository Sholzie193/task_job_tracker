import { redirect } from "next/navigation";

export default function LegacyRunnerPage() {
  redirect("/runs/latest");
}

