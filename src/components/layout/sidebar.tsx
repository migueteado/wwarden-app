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
  PercentIcon,
  ReceiptIcon,
  UserIcon,
  WalletCardsIcon,
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
import { signoutUser } from "../auth/actions";
import { View } from "@/lib/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const menuItems = [
  { title: "Dashboard", href: "/dashboard/", icon: LayoutDashboardIcon },
  { title: "Wallets", href: "/dashboard/wallets", icon: WalletIcon },
  { title: "Pockets", href: "/dashboard/pockets", icon: WalletCardsIcon },
  {
    title: "Transfers",
    href: "/dashboard/transfers",
    icon: ArrowRightLeftIcon,
  },
  { title: "Transactions", href: "/dashboard/transactions", icon: ReceiptIcon },
  { title: "Exchange Rates", href: "/exchange", icon: PercentIcon },
];

export function Sidebar({ views, isOpen }: { views: View[]; isOpen: boolean }) {
  const router = useRouter();
  const user = views.find((view) => view.type === "user") as View;
  const viewType = Cookies.get("view_type") ?? user.type;
  const viewId = Cookies.get("view_id") ?? user.id;
  const view = views.find(
    (view) => view.id === viewId && view.type === viewType
  ) as View;
  const { toast } = useToast();

  const handleViewChange = (view: View) => {
    Cookies.set("view_type", view.type);
    Cookies.set("view_id", view.id);

    router.refresh();
  };

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
                  <Avatar username={view.name} />
                </div>

                <div>{view.name}</div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[283px]">
              <DropdownMenuLabel>Views</DropdownMenuLabel>
              {views.map((view) => (
                <DropdownMenuItem
                  onClick={() => handleViewChange(view)}
                  key={view.id}
                >
                  <div className="flex items-center w-full">
                    {view.type === "user" ? (
                      <UserIcon className="h-4 w-4 mr-2" />
                    ) : (
                      <HomeIcon className="h-4 w-4 mr-2" />
                    )}{" "}
                    {view.name}
                  </div>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link href="/dashboard/profile" className="flex w-full">
                  <UserIcon className="w-4 h-4 mr-2" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/households" className="flex w-full">
                  <HomeIcon className="w-4 h-4 mr-2" /> Households
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
