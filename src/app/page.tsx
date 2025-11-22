import { LinkDashboard } from "@/components/link-dashboard";
import { getAllLinks } from "@/lib/links";

export const revalidate = 0;

export default async function Home() {
  const links = await getAllLinks();
  const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";

  return (
    <div className="py-10">
      <LinkDashboard links={links} baseUrl={baseUrl} />
    </div>
  );
}
