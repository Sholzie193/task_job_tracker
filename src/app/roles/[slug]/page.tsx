import { RoleDetailPage } from "@/components/roles/role-detail-page";

export default async function RoleDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <RoleDetailPage slug={slug} />;
}

