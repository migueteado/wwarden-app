"use client";

import { Wallet } from "@prisma/client";
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
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import React from "react";
import WalletActions from "./wallet-actions";
import { usePathname, useRouter } from "next/navigation";

export type CustomWallet = Omit<Wallet, "balance"> & { balance: number };

export const columns: ColumnDef<CustomWallet>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "balance",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Balance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const wallet = row.original;

      const formatted = new Intl.NumberFormat("en-US").format(wallet.balance);

      return (
        <div className="text-right font-medium flex items-center justify-end text-md">
          <div className="text-xs mr-2 text-slate-500">{wallet.currency}</div>{" "}
          {formatted}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const wallet = row.original;

      return (
        <div className="flex items-center justify-end">
          <WalletActions
            wallet={{ ...wallet, balance: Number(wallet.balance) }}
          />
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

interface WalletListProps {
  wallets: CustomWallet[];
  page: number;
  pages: number;
}

export function WalletList({ wallets, page, pages }: WalletListProps) {
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
        data={wallets.sort((a, b) => b.balance - a.balance)}
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
          disabled={page >= pages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}