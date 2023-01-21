/*
  Warnings:

  - You are about to drop the `servicepictures` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `servicepictures` DROP FOREIGN KEY `servicePictures_serviceId_fkey`;

-- DropTable
DROP TABLE `servicepictures`;

-- CreateTable
CREATE TABLE `ImageOnService` (
    `serviceId` INTEGER NOT NULL,
    `imageId` INTEGER NOT NULL,

    PRIMARY KEY (`serviceId`, `imageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ImageOnService` ADD CONSTRAINT `ImageOnService_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImageOnService` ADD CONSTRAINT `ImageOnService_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
