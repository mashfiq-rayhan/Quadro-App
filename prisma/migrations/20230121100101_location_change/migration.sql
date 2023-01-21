/*
  Warnings:

  - You are about to alter the column `location` on the `services` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `services` MODIFY `location` ENUM('CLIENT', 'BUSINESS', 'ONLINE') NULL DEFAULT 'BUSINESS';
