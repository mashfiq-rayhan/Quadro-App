/*
  Warnings:

  - A unique constraint covering the columns `[link]` on the table `business_info_settings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `business_info_settings` ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `serviceKind` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `digital_payments` ADD COLUMN `cash` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `serviceId` INTEGER NULL,
    ADD COLUMN `utm_campaign` VARCHAR(191) NULL,
    ADD COLUMN `utm_content` VARCHAR(191) NULL,
    ADD COLUMN `utm_medium` VARCHAR(191) NULL,
    ADD COLUMN `utm_source` VARCHAR(191) NULL,
    MODIFY `name` VARCHAR(255) NULL;

-- CreateTable
CREATE TABLE `blocks` (
    `id` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `blocks_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `complete_percentages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `schedulingOnline` BOOLEAN NULL DEFAULT false,
    `increaseCatalogue` BOOLEAN NULL DEFAULT false,
    `digitalPayments` BOOLEAN NULL DEFAULT false,
    `importCustomers` BOOLEAN NULL DEFAULT false,
    `protectYourself` BOOLEAN NULL DEFAULT false,
    `automaticCharges` BOOLEAN NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `complete_percentages_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `offerType` ENUM('MEMBERSHIP', 'PACKAGE') NOT NULL DEFAULT 'MEMBERSHIP',
    `numberOfSessions` INTEGER NOT NULL DEFAULT 0,
    `paymentOption` ENUM('RECURRING', 'ONETIME', 'FREE') NOT NULL DEFAULT 'RECURRING',
    `paymentPeriod` VARCHAR(191) NULL,
    `paymentLength` INTEGER NULL,
    `price` DOUBLE NOT NULL,
    `hasFreeTrial` BOOLEAN NULL DEFAULT false,
    `isSinglePurchase` BOOLEAN NULL DEFAULT false,
    `willAllowCancellation` BOOLEAN NULL DEFAULT true,
    `hasCustomStartDate` BOOLEAN NULL DEFAULT false,
    `policies` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServicesOnPlans` (
    `serviceId` INTEGER NOT NULL,
    `planId` INTEGER NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `assignedById` INTEGER NULL,

    PRIMARY KEY (`serviceId`, `planId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NULL,
    `name` VARCHAR(255) NOT NULL,
    `countryCode` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `assignedById` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientsOnPlans` (
    `clientId` INTEGER NOT NULL,
    `planId` INTEGER NOT NULL,
    `hasPaid` BOOLEAN NULL DEFAULT false,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`clientId`, `planId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `calendars` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `duration` INTEGER NULL,
    `location` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `hasCancelled` BOOLEAN NULL DEFAULT false,
    `hasRefunded` BOOLEAN NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NULL,
    `appointmentId` INTEGER NULL,
    `classId` INTEGER NULL,
    `blockId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientsOnCalendars` (
    `clientId` INTEGER NOT NULL,
    `calendarId` INTEGER NOT NULL,
    `hasPaid` BOOLEAN NULL DEFAULT false,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`clientId`, `calendarId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `business_info_settings_link_key` ON `business_info_settings`(`link`);

-- AddForeignKey
ALTER TABLE `complete_percentages` ADD CONSTRAINT `complete_percentages_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plans` ADD CONSTRAINT `plans_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServicesOnPlans` ADD CONSTRAINT `ServicesOnPlans_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServicesOnPlans` ADD CONSTRAINT `ServicesOnPlans_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `plans`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServicesOnPlans` ADD CONSTRAINT `ServicesOnPlans_assignedById_fkey` FOREIGN KEY (`assignedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clients` ADD CONSTRAINT `clients_assignedById_fkey` FOREIGN KEY (`assignedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientsOnPlans` ADD CONSTRAINT `ClientsOnPlans_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientsOnPlans` ADD CONSTRAINT `ClientsOnPlans_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `plans`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calendars` ADD CONSTRAINT `calendars_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calendars` ADD CONSTRAINT `calendars_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `appointments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calendars` ADD CONSTRAINT `calendars_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `classes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calendars` ADD CONSTRAINT `calendars_blockId_fkey` FOREIGN KEY (`blockId`) REFERENCES `blocks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientsOnCalendars` ADD CONSTRAINT `ClientsOnCalendars_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientsOnCalendars` ADD CONSTRAINT `ClientsOnCalendars_calendarId_fkey` FOREIGN KEY (`calendarId`) REFERENCES `calendars`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
