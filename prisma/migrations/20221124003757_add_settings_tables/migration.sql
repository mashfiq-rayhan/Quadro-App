-- CreateTable
CREATE TABLE `protection_settings`
(
	`id`             INTEGER      NOT NULL AUTO_INCREMENT,
	`activatePolicy` BOOLEAN      NOT NULL DEFAULT false,
	`time`           VARCHAR(191) NULL,
	`toleranceDelay` VARCHAR(191) NULL,
	`createdAt`      DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt`      DATETIME(3)  NOT NULL,
	`userId`         INTEGER      NOT NULL,

	UNIQUE INDEX `protection_settings_userId_key` (`userId`),
	PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `automatic_charges_settings`
(
	`id`              INTEGER      NOT NULL AUTO_INCREMENT,
	`eachAppointment` BOOLEAN      NOT NULL DEFAULT false,
	`eachPlan`        BOOLEAN      NOT NULL DEFAULT false,
	`frequency`       VARCHAR(191) NULL,
	`createdAt`       DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt`       DATETIME(3)  NOT NULL,
	`userId`          INTEGER      NOT NULL,

	UNIQUE INDEX `automatic_charges_settings_userId_key` (`userId`),
	PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `business_info_settings`
(
	`id`            INTEGER      NOT NULL AUTO_INCREMENT,
	`name`          VARCHAR(255) NULL,
	`description`   VARCHAR(191) NULL,
	`link`          VARCHAR(191) NULL,
	`address`       VARCHAR(191) NULL,
	`logo`          VARCHAR(191) NULL,
	`openHours`     JSON         NULL,
	`calendar`      VARCHAR(191) NULL,
	`interval`      VARCHAR(191) NULL,
	`availability`  VARCHAR(191) NULL,
	`advanceNotice` VARCHAR(191) NULL,
	`createdAt`     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt`     DATETIME(3)  NOT NULL,
	`userId`        INTEGER      NOT NULL,

	UNIQUE INDEX `business_info_settings_userId_key` (`userId`),
	PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `digital_payments`
(
	`id`        INTEGER     NOT NULL AUTO_INCREMENT,
	`verify`    BOOLEAN     NOT NULL DEFAULT false,
	`pix`       BOOLEAN     NOT NULL DEFAULT false,
	`megapay`   BOOLEAN     NOT NULL DEFAULT false,
	`payeer`    BOOLEAN     NOT NULL DEFAULT false,
	`createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` DATETIME(3) NOT NULL,
	`userId`    INTEGER     NOT NULL,

	UNIQUE INDEX `digital_payments_userId_key` (`userId`),
	PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bank_accounts`
(
	`id`               INTEGER      NOT NULL AUTO_INCREMENT,
	`beneficiary_name` VARCHAR(191) NOT NULL,
	`account_number`   VARCHAR(191) NOT NULL,
	`bank_name`        VARCHAR(191) NOT NULL,
	`bank_code`        VARCHAR(191) NOT NULL,
	`other`            VARCHAR(191) NULL,
	`createdAt`        DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt`        DATETIME(3)  NOT NULL,
	`userId`           INTEGER      NOT NULL,

	UNIQUE INDEX `bank_accounts_userId_key` (`userId`),
	PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscriptions`
(
	`id`                 INTEGER      NOT NULL AUTO_INCREMENT,
	`billingAddress`     VARCHAR(191) NOT NULL,
	`billingEmail`       VARCHAR(191) NOT NULL,
	`isSubscribed`       BOOLEAN      NOT NULL DEFAULT false,
	`createdAt`          DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt`          DATETIME(3)  NOT NULL,
	`userId`             INTEGER      NOT NULL,
	`subscriptionPlanId` INTEGER      NOT NULL,

	UNIQUE INDEX `subscriptions_userId_key` (`userId`),
	PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscription_plans`
(
	`id`               INTEGER                                                                        NOT NULL AUTO_INCREMENT,
	`name`             VARCHAR(191)                                                                   NOT NULL,
	`tagLine`          VARCHAR(191)                                                                   NOT NULL,
	`amount`           DOUBLE                                                                         NOT NULL,
	`discountedAmount` DOUBLE                                                                         NULL,
	`subscriptionType` ENUM ('FOREVER', 'HOURLY', 'DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY') NOT NULL DEFAULT 'MONTHLY',
	`iconColor`        VARCHAR(191)                                                                   NULL,
	`isRecommended`    VARCHAR(191)                                                                   NULL,
	`features`         JSON                                                                           NULL,
	`createdAt`        DATETIME(3)                                                                    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt`        DATETIME(3)                                                                    NOT NULL,

	PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions`
(
	`id`                 INTEGER     NOT NULL AUTO_INCREMENT,
	`amount`             DOUBLE      NULL,
	`createdAt`          DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt`          DATETIME(3) NOT NULL,
	`userId`             INTEGER     NOT NULL,
	`subscriptionId`     INTEGER     NOT NULL,
	`subscriptionPlanId` INTEGER     NOT NULL,

	PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `protection_settings`
	ADD CONSTRAINT `protection_settings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `automatic_charges_settings`
	ADD CONSTRAINT `automatic_charges_settings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `business_info_settings`
	ADD CONSTRAINT `business_info_settings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `digital_payments`
	ADD CONSTRAINT `digital_payments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bank_accounts`
	ADD CONSTRAINT `bank_accounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions`
	ADD CONSTRAINT `subscriptions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions`
	ADD CONSTRAINT `subscriptions_subscriptionPlanId_fkey` FOREIGN KEY (`subscriptionPlanId`) REFERENCES `subscription_plans` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions`
	ADD CONSTRAINT `transactions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions`
	ADD CONSTRAINT `transactions_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `subscriptions` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions`
	ADD CONSTRAINT `transactions_subscriptionPlanId_fkey` FOREIGN KEY (`subscriptionPlanId`) REFERENCES `subscription_plans` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
