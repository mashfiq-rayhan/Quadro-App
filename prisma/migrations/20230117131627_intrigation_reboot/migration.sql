/*
  Warnings:

  - You are about to drop the column `businessId` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `businessId` on the `classes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `appointments` DROP FOREIGN KEY `appointments_businessId_fkey`;

-- DropForeignKey
ALTER TABLE `classes` DROP FOREIGN KEY `classes_businessId_fkey`;

-- AlterTable
ALTER TABLE `appointments` DROP COLUMN `businessId`;

-- AlterTable
ALTER TABLE `classes` DROP COLUMN `businessId`;
