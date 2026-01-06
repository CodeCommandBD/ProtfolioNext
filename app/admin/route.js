// This file prevents static generation of admin routes
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export default function AdminPage() {
  return null;
}
