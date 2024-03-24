/*
  Warnings:

  - Added the required column `amountUsd` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `feeUSD` to the `Transfer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "amountUsd" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "Transfer" ADD COLUMN     "feeUSD" DECIMAL(10,2) NOT NULL;
