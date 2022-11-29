/*
  Warnings:

  - You are about to alter the column `depositAmount` on the `appointments` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `price` on the `services` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `appointments` MODIFY `depositAmount` DOUBLE NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `services` MODIFY `price` DOUBLE NOT NULL;
