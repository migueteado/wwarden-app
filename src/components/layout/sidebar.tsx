"use client";

import { Separator } from "../ui/separator";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { Avatar } from "../avatar";
import { cn } from "@/lib/utils";
import {
  ArrowRightLeftIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LogOut,
  ReceiptIcon,
  UserIcon,
  WalletIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useToast } from "../ui/use-toast";
import { JWTPayload } from "@/lib/jwt";
import { signoutUser } from "../auth/actions";

const menuItems = [
  { title: "Dashboard", href: "/dashboard/", icon: LayoutDashboardIcon },
  { title: "Wallets", href: "/dashboard/wallets", icon: WalletIcon },
  {
    title: "Transfers",
    href: "/dashboard/transfers",
    icon: ArrowRightLeftIcon,
  },
  { title: "Transactions", href: "/dashboard/transactions", icon: ReceiptIcon },
  { title: "Households", href: "/dashboard/households", icon: HomeIcon },
];

export function Sidebar({
  user,
  isOpen,
}: {
  user: JWTPayload;
  isOpen: boolean;
}) {
  const { toast } = useToast();

  const handleSignOut = async () => {
    console.log("signing out");
    const result = await signoutUser();

    if (result.status) {
      toast({
        title: "Signed out",
        description: `${result.message}.`,
      });
      window.location.href = "/auth/signin";
    }
  };

  return (
    <>
      <div
        className={`w-[300px] border-r min-h-screen fixed top-0 bg-inherit transition-all lg:left-0 ${
          isOpen ? "left-0" : "-left-[301px]"
        }`}
      >
        <div className="flex p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex items-center justify-start"
              >
                <div className="mr-2">
                  <Avatar username={user.username} />
                </div>

                <div>{user.username}</div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[283px]">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/dashboard/profile" className="flex w-full">
                  <UserIcon className="w-4 h-4 mr-2" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <div className="flex text-red-500 w-full">
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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