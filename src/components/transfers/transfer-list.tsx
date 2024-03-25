"use client";

import { usePathname, useRouter } from "next/navigation";
import { CustomWallet } from "../transactions/custom-type";
import { CustomTransfer } from "./custom-type";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";

export const columns: ColumnDef<
  CustomTransfer & { wallets: CustomWallet[] }
>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const transfer = row.original;
      const date = new Date(transfer.transactions[0].date);

      const year = date.toLocaleString("default", { year: "numeric" });
      const month = date.toLocaleString("default", { month: "2-digit" });
      const day = date.toLocaleString("default", { day: "2-digit" });

      const formatted = year + "/" + month + "/" + day;

      return <>{formatted}</>;
    },
  },
  {
    accessorKey: "transactions",
    header: "Origin Transaction",
    cell: ({ row }) => {
      const transfer = row.original;
      const transaction = transfer.transactions.find(
        (t) => t.type === "EXPENSE"
      );

      if (transaction) {
        const formatted = new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
        }).format(transaction.amount);
        const formattedUSD = new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
        }).format(transaction.amountUSD);

        return (
          <div className="font-medium flex items-center justify-start text-md">
            <div className="mr-2">{transaction.wallet.name}</div>{" "}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
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
                  <div className="text-xs mr-2 text-slate-500">USD</div>{" "}
                  <div
                    className={
                      transaction.amount > 0
                        ? "text-green-500"
                        : transaction.amount < 0
                        ? "text-red-500"
                        : "text-slate-500"
                    }
                  >
                    {formattedUSD}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      } else {
        return <>N/A</>;
      }
    },
  },
  {
    accessorKey: "transactions",
    header: "Destination Transaction",
    cell: ({ row }) => {
      const transfer = row.original;
      const transaction = transfer.transactions.find(
        (t) => t.type === "INCOME"
      );

      if (transaction) {
        const formatted = new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
        }).format(transaction.amount);
        const formattedUSD = new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
        }).format(transaction.amountUSD);
        return (
          <div className="font-medium flex items-center justify-start text-md">
            <div className="mr-2">{transaction.wallet.name}</div>{" "}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
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
                  <>
                    <div className="text-xs mr-2 text-slate-500">USD</div>{" "}
                    <div
                      className={
                        transaction.amount > 0
                          ? "text-green-500"
                          : transaction.amount < 0
                          ? "text-red-500"
                          : "text-slate-500"
                      }
                    >
                      {formattedUSD}
                    </div>
                  </>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      } else {
        return <>N/A</>;
      }
    },
  },
  {
    accessorKey: "fee",
    header: "Fee",
    cell: ({ row }) => {
      const transfer = row.original;
      const transaction = transfer.transactions.find(
        (t) => t.type === "EXPENSE"
      );

      if (transaction) {
        const formatted = new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
        }).format(transfer.fee);
        const formattedUSD = new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
        }).format(transfer.feeUSD);

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="font-medium flex items-center justify-start text-md">
                  <div className="text-xs mr-2 text-slate-500">
                    {transaction.wallet.currency}
                  </div>{" "}
                  <div>{formatted}</div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="font-medium flex items-center justify-start text-md">
                  <div className="text-xs mr-2 text-slate-500">USD</div>{" "}
                  <div>{formattedUSD}</div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      } else {
        return <>N/A</>;
      }
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const transfer = row.original;
      if (transfer.transactions.length === 0) return <></>;

      const description = transfer.transactions[0].description;
      if (!description) return <></>;
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
      const transfer = row.original;

      return (
        <div className="flex items-center justify-end">
          {/* <TransactionActions
            transaction={{ ...transaction, amount: Number(transaction.amount) }}
            categories={row.original.categories}
            wallets={row.original.wallets}
          /> */}
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

interface TramsferListProps {
  transfers: CustomTransfer[];
  wallets: CustomWallet[];
  page: number;
  pages: number;
}

export function TransferList({
  transfers,
  wallets,
  page,
  pages,
}: TramsferListProps) {
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
        data={transfers.map((t) => ({
          ...t,
          wallets: wallets,
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
