/*
  Warnings:

  - You are about to drop the column `amountUsd` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `amountUSD` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "amountUsd",
ADD COLUMN     "amountUSD" DECIMAL(10,2) NOT NULL;
