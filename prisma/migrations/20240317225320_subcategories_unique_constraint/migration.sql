/*
  Warnings:

  - A unique constraint covering the columns `[categoryId,name]` on the table `Subcategories` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Subcategories_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Subcategories_categoryId_name_key" ON "Subcategories"("categoryId", "name");
