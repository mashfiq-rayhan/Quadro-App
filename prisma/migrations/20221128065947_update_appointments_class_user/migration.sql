/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `appointments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `classes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `appointments` ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `classes` ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `userId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `appointments_userId_key` ON `appointments`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `classes_userId_key` ON `classes`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `orders_userId_key` ON `orders`(`userId`);

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes` ADD CONSTRAINT `classes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
