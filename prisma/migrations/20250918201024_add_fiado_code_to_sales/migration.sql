/*
  Warnings:

  - A unique constraint covering the columns `[fiadoCode]` on the table `Sale` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "fiadoCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Sale_fiadoCode_key" ON "Sale"("fiadoCode");
