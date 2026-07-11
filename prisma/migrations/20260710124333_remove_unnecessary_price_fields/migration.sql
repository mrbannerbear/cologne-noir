/*
  Warnings:

  - You are about to drop the column `fiveMlPriceBdt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `tenMlPriceBdt` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "fiveMlPriceBdt",
DROP COLUMN "tenMlPriceBdt";
