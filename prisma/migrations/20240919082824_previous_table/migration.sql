/*
  Warnings:

  - You are about to drop the `activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `attachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `board` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `boardmember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `card` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cardactivity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cardmember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `checklist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `checklistitem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `label` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `list` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `watcher` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `activity` DROP FOREIGN KEY `Activity_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `activity` DROP FOREIGN KEY `Activity_userId_fkey`;

-- DropForeignKey
ALTER TABLE `attachment` DROP FOREIGN KEY `Attachment_cardId_fkey`;

-- DropForeignKey
ALTER TABLE `boardmember` DROP FOREIGN KEY `BoardMember_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `boardmember` DROP FOREIGN KEY `BoardMember_userId_fkey`;

-- DropForeignKey
ALTER TABLE `card` DROP FOREIGN KEY `Card_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `cardactivity` DROP FOREIGN KEY `CardActivity_cardId_fkey`;

-- DropForeignKey
ALTER TABLE `cardmember` DROP FOREIGN KEY `CardMember_cardId_fkey`;

-- DropForeignKey
ALTER TABLE `cardmember` DROP FOREIGN KEY `CardMember_userId_fkey`;

-- DropForeignKey
ALTER TABLE `checklist` DROP FOREIGN KEY `Checklist_cardId_fkey`;

-- DropForeignKey
ALTER TABLE `checklistitem` DROP FOREIGN KEY `ChecklistItem_checklistId_fkey`;

-- DropForeignKey
ALTER TABLE `label` DROP FOREIGN KEY `Label_cardId_fkey`;

-- DropForeignKey
ALTER TABLE `list` DROP FOREIGN KEY `List_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `watcher` DROP FOREIGN KEY `Watcher_cardId_fkey`;

-- DropForeignKey
ALTER TABLE `watcher` DROP FOREIGN KEY `Watcher_userId_fkey`;

-- DropTable
DROP TABLE `activity`;

-- DropTable
DROP TABLE `attachment`;

-- DropTable
DROP TABLE `board`;

-- DropTable
DROP TABLE `boardmember`;

-- DropTable
DROP TABLE `card`;

-- DropTable
DROP TABLE `cardactivity`;

-- DropTable
DROP TABLE `cardmember`;

-- DropTable
DROP TABLE `checklist`;

-- DropTable
DROP TABLE `checklistitem`;

-- DropTable
DROP TABLE `label`;

-- DropTable
DROP TABLE `list`;

-- DropTable
DROP TABLE `user`;

-- DropTable
DROP TABLE `watcher`;

-- CreateTable
CREATE TABLE `activities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `boardId` INTEGER NULL,
    `name` VARCHAR(255) NULL,
    `action` VARCHAR(255) NULL,
    `date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `edited` BOOLEAN NULL DEFAULT false,
    `cardTitle` VARCHAR(255) NULL DEFAULT '',
    `actionType` VARCHAR(255) NULL DEFAULT 'action',
    `color` VARCHAR(255) NULL,

    INDEX `boardId`(`boardId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attachments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `link` VARCHAR(255) NULL,
    `name` VARCHAR(255) NULL,
    `date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `cardId` INTEGER NULL,

    INDEX `cardId`(`cardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `board_activities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `board_id` INTEGER NULL,
    `user_id` INTEGER NULL,
    `action` TEXT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `color` VARCHAR(50) NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `board_id`(`board_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `board_members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `board_id` INTEGER NULL,
    `user_id` INTEGER NULL,
    `role` ENUM('owner', 'member') NOT NULL,

    INDEX `board_id`(`board_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `boards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `backgroundImageLink` VARCHAR(255) NULL,
    `isImage` BOOLEAN NULL DEFAULT false,
    `description` TEXT NULL,
    `userId` INTEGER NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `card_activities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userName` VARCHAR(255) NULL,
    `text` TEXT NULL,
    `date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isComment` BOOLEAN NULL DEFAULT false,
    `color` VARCHAR(255) NULL,
    `cardId` INTEGER NULL,

    INDEX `cardId`(`cardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `card_members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `name` VARCHAR(255) NULL,
    `color` VARCHAR(255) NULL,
    `cardId` INTEGER NULL,

    INDEX `cardId`(`cardId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `listId` INTEGER NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `description` TEXT NULL DEFAULT '',
    `dateStartDate` DATETIME(0) NULL,
    `dateDueDate` DATETIME(0) NULL,
    `dateDueTime` VARCHAR(255) NULL,
    `dateReminder` BOOLEAN NULL,
    `dateCompleted` BOOLEAN NULL DEFAULT false,
    `coverColor` VARCHAR(255) NULL,
    `coverIsSizeOne` BOOLEAN NULL,

    INDEX `listId`(`listId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `checklist_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(255) NULL,
    `completed` BOOLEAN NULL DEFAULT false,
    `checklistId` INTEGER NULL,

    INDEX `checklistId`(`checklistId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `checklists` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NULL,
    `cardId` INTEGER NULL,

    INDEX `cardId`(`cardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `labels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(255) NULL,
    `color` VARCHAR(255) NULL,
    `backColor` VARCHAR(255) NULL,
    `selected` BOOLEAN NULL,
    `cardId` INTEGER NULL,

    INDEX `cardId`(`cardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lists` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `boardId` INTEGER NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `boardId`(`boardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `boardId` INTEGER NULL,
    `name` VARCHAR(255) NULL,
    `surname` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `role` VARCHAR(255) NULL DEFAULT 'member',
    `color` VARCHAR(255) NULL,

    INDEX `boardId`(`boardId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `surname` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `avatar` VARCHAR(255) NULL,
    `color` VARCHAR(50) NULL,
    `board_id` INTEGER NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    INDEX `board_id`(`board_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `watchers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `name` VARCHAR(255) NULL,
    `cardId` INTEGER NULL,

    INDEX `cardId`(`cardId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `activities` ADD CONSTRAINT `activities_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `activities` ADD CONSTRAINT `activities_ibfk_2` FOREIGN KEY (`boardId`) REFERENCES `boards`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `attachments` ADD CONSTRAINT `attachments_ibfk_1` FOREIGN KEY (`cardId`) REFERENCES `cards`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `board_activities` ADD CONSTRAINT `board_activities_ibfk_1` FOREIGN KEY (`board_id`) REFERENCES `boards`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `board_activities` ADD CONSTRAINT `board_activities_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `board_members` ADD CONSTRAINT `board_members_ibfk_1` FOREIGN KEY (`board_id`) REFERENCES `boards`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `board_members` ADD CONSTRAINT `board_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `boards` ADD CONSTRAINT `boards_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `card_activities` ADD CONSTRAINT `card_activities_ibfk_1` FOREIGN KEY (`cardId`) REFERENCES `cards`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `card_members` ADD CONSTRAINT `card_members_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `card_members` ADD CONSTRAINT `card_members_ibfk_2` FOREIGN KEY (`cardId`) REFERENCES `cards`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `cards` ADD CONSTRAINT `cards_ibfk_1` FOREIGN KEY (`listId`) REFERENCES `lists`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `checklist_items` ADD CONSTRAINT `checklist_items_ibfk_1` FOREIGN KEY (`checklistId`) REFERENCES `checklists`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `checklists` ADD CONSTRAINT `checklists_ibfk_1` FOREIGN KEY (`cardId`) REFERENCES `cards`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `labels` ADD CONSTRAINT `labels_ibfk_1` FOREIGN KEY (`cardId`) REFERENCES `cards`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `lists` ADD CONSTRAINT `lists_ibfk_1` FOREIGN KEY (`boardId`) REFERENCES `boards`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_ibfk_2` FOREIGN KEY (`boardId`) REFERENCES `boards`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`board_id`) REFERENCES `boards`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `watchers` ADD CONSTRAINT `watchers_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `watchers` ADD CONSTRAINT `watchers_ibfk_2` FOREIGN KEY (`cardId`) REFERENCES `cards`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
