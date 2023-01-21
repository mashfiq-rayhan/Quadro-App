-- CreateTable
CREATE TABLE `ServiceImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(1000) NULL,
    `serviceId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ServiceImage` ADD CONSTRAINT `ServiceImage_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
