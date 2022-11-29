-- DropForeignKey
ALTER TABLE `subscriptions` DROP FOREIGN KEY `subscriptions_subscriptionPlanId_fkey`;

-- AlterTable
ALTER TABLE `subscriptions` MODIFY `subscriptionPlanId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_subscriptionPlanId_fkey` FOREIGN KEY (`subscriptionPlanId`) REFERENCES `subscription_plans`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
