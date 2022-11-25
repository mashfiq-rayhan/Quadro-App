-- AlterTable
ALTER TABLE `services` MODIFY `location` VARCHAR(191) NULL DEFAULT 'To be determined';

-- CreateTable
CREATE TABLE `class_repeats` (
    `id` VARCHAR(191) NOT NULL,
    `week` INTEGER NOT NULL,
    `monday` BOOLEAN NOT NULL DEFAULT false,
    `tuesday` BOOLEAN NOT NULL DEFAULT false,
    `wednesday` BOOLEAN NOT NULL DEFAULT false,
    `thursday` BOOLEAN NOT NULL DEFAULT false,
    `friday` BOOLEAN NOT NULL DEFAULT false,
    `saturday` BOOLEAN NOT NULL DEFAULT false,
    `sunday` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `class_repeats_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classes` (
    `id` VARCHAR(191) NOT NULL,
    `maxNumberOfParticipants` INTEGER NOT NULL,
    `duration` INTEGER NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `startDateAndTime` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,
    `repeatId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `classes_id_key`(`id`),
    UNIQUE INDEX `classes_serviceId_key`(`serviceId`),
    UNIQUE INDEX `classes_repeatId_key`(`repeatId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `classes` ADD CONSTRAINT `classes_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes` ADD CONSTRAINT `classes_repeatId_fkey` FOREIGN KEY (`repeatId`) REFERENCES `class_repeats`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
