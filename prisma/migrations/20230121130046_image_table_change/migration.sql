/*
  Warnings:

  - You are about to drop the `serviceimage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `serviceimage` DROP FOREIGN KEY `ServiceImage_serviceId_fkey`;

-- DropTable
DROP TABLE `serviceimage`;

-- CreateTable
CREATE TABLE `Image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(1000) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
