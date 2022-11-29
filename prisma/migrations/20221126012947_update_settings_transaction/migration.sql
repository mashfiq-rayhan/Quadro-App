-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_subscriptionId_fkey`;

-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_subscriptionPlanId_fkey`;

-- AlterTable
ALTER TABLE `transactions` MODIFY `subscriptionId` INTEGER NULL,
    MODIFY `subscriptionPlanId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `subscriptions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_subscriptionPlanId_fkey` FOREIGN KEY (`subscriptionPlanId`) REFERENCES `subscription_plans`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
