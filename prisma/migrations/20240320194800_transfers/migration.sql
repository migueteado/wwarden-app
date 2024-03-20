-- CreateTable
CREATE TABLE "Transfer" (
    "id" TEXT NOT NULL,
    "fromWalletId" TEXT NOT NULL,
    "toWalletId" TEXT NOT NULL,
    "fromTransactionId" TEXT NOT NULL,
    "toTransactionId" TEXT NOT NULL,
    "fee" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transfer_fromTransactionId_key" ON "Transfer"("fromTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Transfer_toTransactionId_key" ON "Transfer"("toTransactionId");

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_fromWalletId_fkey" FOREIGN KEY ("fromWalletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_toWalletId_fkey" FOREIGN KEY ("toWalletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_fromTransactionId_fkey" FOREIGN KEY ("fromTransactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_toTransactionId_fkey" FOREIGN KEY ("toTransactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
