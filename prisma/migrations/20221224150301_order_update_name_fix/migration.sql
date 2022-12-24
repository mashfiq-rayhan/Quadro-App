/*
  Warnings:

  - You are about to drop the column `discountedPrice` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `orders` table. All the data in the column will be lost.
  - Added the required column `value` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` DROP COLUMN `discountedPrice`,
    DROP COLUMN `price`,
    ADD COLUMN `discountedValue` DOUBLE NULL,
    ADD COLUMN `value` DOUBLE NOT NULL;
