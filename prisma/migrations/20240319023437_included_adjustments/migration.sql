/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserToUserGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'ADJUSTMENT';

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "_UserToUserGroup" DROP CONSTRAINT "_UserToUserGroup_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToUserGroup" DROP CONSTRAINT "_UserToUserGroup_B_fkey";

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "UserGroup";

-- DropTable
DROP TABLE "_UserToUserGroup";

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currency" "Currency" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_name_userId_key" ON "Wallet"("name", "userId");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
