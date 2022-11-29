/*
  Warnings:

  - You are about to drop the column `userId` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `orders` table. All the data in the column will be lost.
  - Added the required column `businessId` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessId` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientId` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `appointments` DROP FOREIGN KEY `appointments_userId_fkey`;

-- DropForeignKey
ALTER TABLE `classes` DROP FOREIGN KEY `classes_userId_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_userId_fkey`;

-- AlterTable
ALTER TABLE `appointments` DROP COLUMN `userId`,
    ADD COLUMN `businessId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `classes` DROP COLUMN `userId`,
    ADD COLUMN `businessId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `userId`,
    ADD COLUMN `businessId` INTEGER NOT NULL,
    ADD COLUMN `clientId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `business_info_settings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes` ADD CONSTRAINT `classes_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `business_info_settings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `business_info_settings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
