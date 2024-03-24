"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { ExchangeRate, Prisma } from "@prisma/client";

export const columns: ColumnDef<{ currency: string; rate: number }>[] = [
  {
    accessorKey: "currency",
    header: "Currency",
    cell: ({ row }) => {
      const exchangeRate = row.original;

      return <>{exchangeRate.currency}</>;
    },
  },
  {
    accessorKey: "rate",
    header: "Rate",
    cell: ({ row }) => {
      const exchangeRate = row.original;

      const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
      }).format(exchangeRate.rate);
      return (
        <div className="font-medium flex items-center justify-start text-md">
          {formatted}
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

interface ExchangeRateListProps {
  exchangeRate: ExchangeRate;
}

export function ExchangeRateList({ exchangeRate }: ExchangeRateListProps) {
  const rates = Object.entries(exchangeRate.data as Prisma.JsonObject).map(
    ([currency, rate]) => ({
      currency,
      rate,
    })
  ) as { currency: string; rate: number }[];

  return (
    <div className="flex flex-col w-full">
      <DataTable columns={columns} data={rates} />
    </div>
  );
}
