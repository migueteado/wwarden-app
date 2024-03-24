"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { CustomCategory, CustomTransaction, CustomWallet } from "./custom-type";
import TransactionActions from "./transaction-actions";

export const columns: ColumnDef<
  CustomTransaction & { wallets: CustomWallet[]; categories: CustomCategory[] }
>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const transaction = row.original;
      const date = new Date(transaction.date);

      const year = date.toLocaleString("default", { year: "numeric" });
      const month = date.toLocaleString("default", { month: "2-digit" });
      const day = date.toLocaleString("default", { day: "2-digit" });

      const formatted = year + "/" + month + "/" + day;

      return <>{formatted}</>;
    },
  },
  {
    accessorKey: "wallet",
    header: "Wallet",
    cell: ({ row }) => {
      const transaction = row.original;

      return <>{transaction.wallet.name}</>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const transaction = row.original;

      const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
      }).format(transaction.amount);

      const formattedUSD = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
      }).format(transaction.amountUSD);

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-right font-medium flex items-center justify-end text-md">
                <div className="text-xs mr-2 text-slate-500">
                  {transaction.wallet.currency}
                </div>{" "}
                <div
                  className={
                    transaction.amount > 0
                      ? "text-green-500"
                      : transaction.amount < 0
                      ? "text-red-500"
                      : "text-slate-500"
                  }
                >
                  {formatted}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-right font-medium flex items-center justify-end text-md">
                <div className="text-xs mr-2 text-slate-500">USD</div>{" "}
                <div
                  className={
                    transaction.amountUSD > 0
                      ? "text-green-500"
                      : transaction.amountUSD < 0
                      ? "text-red-500"
                      : "text-slate-500"
                  }
                >
                  {formattedUSD}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "entity",
    header: "Entity",
    cell: ({ row }) => {
      const transaction = row.original;
      const entity = transaction.entity ? transaction.entity : "-";
      const formatted =
        entity?.length > 20 ? entity?.slice(0, 20) + "..." : entity;

      return <>{formatted}</>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const transaction = row.original;

      const formatted =
        transaction.category.name.length > 20
          ? transaction.category.name.slice(0, 20) + "..."
          : transaction.category.name;

      return <>{formatted}</>;
    },
  },
  {
    accessorKey: "subcategory",
    header: "Subcategory",
    cell: ({ row }) => {
      const transaction = row.original;

      const formatted =
        transaction.subcategory.name.length > 20
          ? transaction.subcategory.name.slice(0, 20) + "..."
          : transaction.subcategory.name;

      return <>{formatted}</>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const transaction = row.original;
      const description = transaction.description
        ? transaction.description
        : "-";
      const formatted =
        description?.length > 20
          ? description?.slice(0, 20) + "..."
          : description;

      return <>{formatted}</>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <div className="flex items-center justify-end">
          {!transaction.transferId && (
            <TransactionActions
              transaction={{
                ...transaction,
                amount: Number(transaction.amount),
              }}
              categories={row.original.categories}
              wallets={row.original.wallets}
            />
          )}
        </div>
      );
    },
  },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-md border w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

interface TransactionListProps {
  transactions: CustomTransaction[];
  wallets: CustomWallet[];
  categories: CustomCategory[];
  page: number;
  pages: number;
}

export function TransactionList({
  transactions,
  wallets,
  categories,
  page,
  pages,
}: TransactionListProps) {
  const router = useRouter();
  const pathname = usePathname();

  function nextPage() {
    router.push(`${pathname}?page=${page + 1}`);
  }

  function prevPage() {
    router.push(`${pathname}?page=${page - 1}`);
  }

  return (
    <div className="flex flex-col w-full">
      <DataTable
        columns={columns}
        data={transactions.map((t) => ({
          ...t,
          wallets: wallets,
          categories: categories,
        }))}
      />
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => prevPage()}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => nextPage()}
          disabled={page === pages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
