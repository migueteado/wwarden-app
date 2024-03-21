"use client";

import React from "react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CustomCategory, CustomTransaction, CustomWallet } from "./custom-type";
import UpdateTransactionForm from "./update-transaction-form";
import DeleteTransactionForm from "./delete-transaction-form";

interface TransactionActionsProps {
  transaction: CustomTransaction;
  wallets: CustomWallet[];
  categories: CustomCategory[];
}

export default function TransactionActions({
  transaction,
  wallets,
  categories,
}: TransactionActionsProps) {
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
        <DeleteTransactionForm
          transaction={transaction}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setIsOpen={setIsOpen}
        />
      )}
      {dialog === "update" && (
        <UpdateTransactionForm
          transaction={transaction}
          wallets={wallets}
          categories={categories}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setIsOpen={setIsOpen}
        />
      )}
    </Dialog>
  );
}
