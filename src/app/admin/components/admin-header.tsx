"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminHeader() {
  const pathname = usePathname();
  const session = useSession();
  return (
    <div className="flex justify-between border-b p-4">
      <nav className="py-4">
        <ul className="flex gap-2">
          <li>
            <Link
              className={`p-2 ${pathname.startsWith("/admin/dashboard") ? "bg-green-100 font-bold" : "bg-gray-50"}`}
              href={"/admin/dashboard"}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              className={`p-2 ${pathname.startsWith("/admin/inbox") ? "bg-green-100 font-bold" : "bg-gray-50"}`}
              href={"/admin/inbox"}
            >
              Inbox
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex gap-2">
        <p>{session.data?.user.email}</p>
        <Button onClick={() => signOut()}>Sign Out</Button>
      </div>
    </div>
  );
}
