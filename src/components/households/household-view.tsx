import Link from "next/link";
import { Separator } from "../ui/separator";
import { CustomHousehold } from "./custom-types";
import { SettingsIcon, UsersIcon, WalletIcon } from "lucide-react";
import { buttonVariants } from "../ui/button";

interface HouseholdViewProps {
  household: CustomHousehold;
}

export default function HouseholdView({ household }: HouseholdViewProps) {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold">{household.name}</h2>
      <div className="flex items-center my-4 justify-between">
        <div className="flex gap-4">
          <div className="flex items-center justify-center">
            <UsersIcon className="h-4 w-4 mr-2" /> {household.members.length}
          </div>
          <div className="flex items-center justify-center">
            <WalletIcon className="h-4 w-4 mr-2" /> {household.wallets.length}
          </div>
        </div>
        <div>
          <Link
            href={`/households/${household.id}/settings`}
            className={buttonVariants({ variant: "ghost" })}
          >
            <div className="flex items-center justify-center">
              <SettingsIcon className="h-4 w-4 mr-2" /> Settings
            </div>
          </Link>
        </div>
      </div>
      <Separator className="my-4" />
    </div>
  );
}
