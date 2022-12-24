/*
  Warnings:

  - Added the required column `price` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bookings` ADD COLUMN `location` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `discountedPrice` DOUBLE NULL,
    ADD COLUMN `price` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `services` MODIFY `location` VARCHAR(191) NULL DEFAULT 'TO_BE_DETERMINED';

-- CreateTable
CREATE TABLE `servicePictures` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `imageURL` VARCHAR(1000) NULL,
    `serviceId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `servicePictures` ADD CONSTRAINT `servicePictures_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
