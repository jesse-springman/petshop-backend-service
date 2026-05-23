/*
  Warnings:

  - Made the column `petshopId` on table `Appointment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `petshopId` on table `Customer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `petshopId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_petshopId_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_petshopId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_petshopId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "petshopId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "petshopId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "petshopId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_petshopId_fkey" FOREIGN KEY ("petshopId") REFERENCES "Petshop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_petshopId_fkey" FOREIGN KEY ("petshopId") REFERENCES "Petshop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_petshopId_fkey" FOREIGN KEY ("petshopId") REFERENCES "Petshop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
