/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Country` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `movie` ADD COLUMN `alternativeTitle` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Country_name_key` ON `Country`(`name`);
