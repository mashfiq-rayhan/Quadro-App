/*
  Warnings:

  - Added the required column `businessId` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessId` to the `classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `appointments` ADD COLUMN `businessId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `classes` ADD COLUMN `businessId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `business_info_settings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes` ADD CONSTRAINT `classes_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `business_info_settings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
