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
import { Button } from "../ui/button";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CustomPocket, CustomWallet } from "./custom-type";
import CreatePocketForm from "./create-pocket-form";
import Link from "next/link";

export const columns: ColumnDef<CustomPocket>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const pocket = row.original;

      return (
        <>
          <Link href={`/dashboard/pockets/${pocket.id}`} className="underline">
            {pocket.name}
          </Link>
        </>
      );
    },
  },
  {
    accessorKey: "wallet",
    header: "Wallet",
    cell: ({ row }) => {
      const pocket = row.original;

      return (
        <>
          <Link
            href={`/dashboard/wallets/${pocket.wallet.id}`}
            className="underline"
          >
            {pocket.wallet.name}
          </Link>
        </>
      );
    },
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      const pocket = row.original;

      const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(pocket.balance);

      return (
        <div className="text-right font-medium flex items-center justify-end text-md">
          <div className="text-xs mr-2 text-slate-500">
            {pocket.wallet.currency}
          </div>{" "}
          {formatted}
        </div>
      );
    },
  },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const transaction = row.original;

  //     return (
  //       <div className="flex items-center justify-end">
  //         {!transaction.transferId && (
  //           <TransactionActions
  //             transaction={{
  //               ...transaction,
  //               amount: Number(transaction.amount),
  //             }}
  //             categories={row.original.categories}
  //             wallets={row.original.wallets}
  //           />
  //         )}
  //       </div>
  //     );
  //   },
  // },
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

interface PocketListProps {
  pockets: CustomPocket[];
  wallets: CustomWallet[];
  page: number;
  pages: number;
}

export function PocketList({ pockets, wallets, page, pages }: PocketListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function nextPage() {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", String(page + 1));
    router.push(`${pathname}?${current.toString()}`);
  }

  function prevPage() {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", String(page - 1));
    router.push(`${pathname}?${current.toString()}`);
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between space-x-2 py-4">
        <CreatePocketForm wallets={wallets} />
      </div>
      <DataTable
        columns={columns}
        data={pockets.map((t) => ({
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
