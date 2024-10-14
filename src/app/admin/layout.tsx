import { getServerSession } from "next-auth";
import AdminHeader from "./components/admin-header";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
    <div>
      <AdminHeader />
      <div className="mx-auto mt-16 max-w-7xl rounded-xl bg-white p-8 shadow-lg">
        {children}
      </div>
    </div>
  );
}
