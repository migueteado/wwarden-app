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
import { ArrowUpDown, UsersIcon, WalletIcon } from "lucide-react";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { CustomHousehold } from "./custom-types";
import HouseholdActions from "./household-actions";
import Link from "next/link";

export const columns: ColumnDef<CustomHousehold>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const household = row.original;

      return (
        <Link href={`/households/${household.id}`} className="hover:underline">
          {household.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "members",
    header: "Members",
    cell: ({ row }) => {
      const household = row.original;

      return (
        <div className="text-right font-medium flex items-center justify-start text-md">
          <UsersIcon className="w-4 h-4 mr-2" /> {household.members.length}
        </div>
      );
    },
  },
  {
    accessorKey: "wallets",
    header: "Wallets",
    cell: ({ row }) => {
      const household = row.original;

      return (
        <div className="text-right font-medium flex items-center justify-start text-md">
          <WalletIcon className="w-4 h-4 mr-2" /> {household.wallets.length}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const household = row.original;

      return (
        <div className="flex items-center justify-end">
          <HouseholdActions household={household} />
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

interface HouseholdListProps {
  households: CustomHousehold[];
  page: number;
  pages: number;
}

export function HouseholdList({ households, page, pages }: HouseholdListProps) {
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
      <DataTable columns={columns} data={households} />
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
