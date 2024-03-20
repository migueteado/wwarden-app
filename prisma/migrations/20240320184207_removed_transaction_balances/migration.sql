/*
  Warnings:

  - You are about to drop the column `newBalance` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `previousBalance` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "newBalance",
DROP COLUMN "previousBalance";
