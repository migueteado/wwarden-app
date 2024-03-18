"use client";

import { Separator } from "./ui/separator";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { Avatar } from "./avatar";
import { cn } from "@/lib/utils";
import { Home, Receipt, Wallet } from "lucide-react";

const menuItems = [
  { title: "Dashboard", href: "/dashboard/", icon: Home },
  { title: "Accounts", href: "/dashboard/accounts", icon: Wallet },
  { title: "Transactions", href: "/dashboard/transactions", icon: Receipt },
];

export function Sidebar({
  username,
  isOpen,
}: {
  username: string;
  isOpen: boolean;
}) {
  return (
    <>
      <div
        className={`w-[300px] border-r min-h-screen fixed top-0 bg-inherit transition-all lg:left-0 ${
          isOpen ? "left-0" : "-left-[301px]"
        }`}
      >
        <div className="flex p-2">
          <Link
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full flex items-center justify-start"
            )}
            href="/dashboard/profile"
          >
            <div className="mr-2">
              <Avatar username={username} />
            </div>

            <div>{username}</div>
          </Link>
        </div>
        <Separator />
        <div className="py-2">
          <nav className="px-2 grid gap-1">
            {menuItems.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "justify-start"
                )}
              >
                <div className="flex items-center justify-center h-6 w-6 mr-2">
                  <link.icon className="h-4 w-4" />
                </div>

                {link.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
