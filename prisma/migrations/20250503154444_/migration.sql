/*
  Warnings:

  - You are about to drop the column `quantity` on the `ReservationResource` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Client` MODIFY `dateOfBirth` DATE NOT NULL;

-- AlterTable
ALTER TABLE `ReservationResource` DROP COLUMN `quantity`;
