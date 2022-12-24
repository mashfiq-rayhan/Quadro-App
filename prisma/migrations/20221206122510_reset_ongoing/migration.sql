/*
  Warnings:

  - You are about to drop the column `businessId` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `paymentAcceptType` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `businessId` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the `bookings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orders` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `businessId` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceType` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `appointments` DROP FOREIGN KEY `appointments_businessId_fkey`;

-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `bookings_serviceId_fkey`;

-- DropForeignKey
ALTER TABLE `classes` DROP FOREIGN KEY `classes_businessId_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_bookingId_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_businessId_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_clientId_fkey`;

-- AlterTable
ALTER TABLE `appointments` DROP COLUMN `businessId`,
    DROP COLUMN `paymentAcceptType`;

-- AlterTable
ALTER TABLE `classes` DROP COLUMN `businessId`;

-- AlterTable
ALTER TABLE `services` ADD COLUMN `businessId` INTEGER NOT NULL,
    ADD COLUMN `paymentType` ENUM('IN_PERSON', 'ONLINE') NOT NULL DEFAULT 'IN_PERSON',
    ADD COLUMN `serviceType` ENUM('APPOINTMENT', 'CLASS') NOT NULL;

-- DropTable
DROP TABLE `bookings`;

-- DropTable
DROP TABLE `orders`;

-- AddForeignKey
ALTER TABLE `services` ADD CONSTRAINT `services_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `business_info_settings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
