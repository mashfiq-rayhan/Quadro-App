/*
  Warnings:

  - You are about to alter the column `isRecommended` on the `subscription_plans` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `subscription_plans` MODIFY `isRecommended` BOOLEAN NULL;
