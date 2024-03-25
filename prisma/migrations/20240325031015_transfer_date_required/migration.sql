/*
  Warnings:

  - Made the column `date` on table `Transfer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Transfer" ALTER COLUMN "date" SET NOT NULL;
