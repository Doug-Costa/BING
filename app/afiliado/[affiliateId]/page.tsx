import { redirect } from "next/navigation";

export default async function AffiliatePage({ params }: { params: Promise<{ affiliateId: string }> }) {
  const { affiliateId } = await params;
  redirect(`/?affiliate=${encodeURIComponent(affiliateId)}`);
}
