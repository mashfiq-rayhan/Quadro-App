/*
  Warnings:

  - You are about to drop the column `discountedValue` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `orders` DROP COLUMN `discountedValue`,
    DROP COLUMN `value`;
