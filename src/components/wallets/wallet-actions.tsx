"use client";

import React from "react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { MoreHorizontal, Pencil, ReceiptIcon, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CustomWallet } from "./custom-types";
import { DeleteWalletForm } from "./delete-wallet-form";
import { UpdateWalletForm } from "./update-wallet-form";
import Link from "next/link";

interface WalletActionsProps {
  wallet: CustomWallet;
}

export default function WalletActions({ wallet }: WalletActionsProps) {
  const [dialog, setDialog] = React.useState("delete");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href={`/dashboard/transactions?wallets=${wallet.id}`}>
            <DropdownMenuItem>
              <ReceiptIcon className="h-4 w-4 mr-2" />
              Transactions
            </DropdownMenuItem>
          </Link>
          <DialogTrigger className="w-full" onClick={() => setDialog("update")}>
            <DropdownMenuItem>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
          </DialogTrigger>

          <DialogTrigger className="w-full" onClick={() => setDialog("delete")}>
            <DropdownMenuItem className="text-red-500">
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialog === "delete" && (
        <DeleteWalletForm
          wallet={wallet}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setIsOpen={setIsOpen}
        />
      )}
      {dialog === "update" && (
        <UpdateWalletForm
          wallet={wallet}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setIsOpen={setIsOpen}
        />
      )}
    </Dialog>
  );
}
