/*
  Warnings:

  - You are about to drop the column `profissionalId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the `Profissional` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[date,userId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_profissionalId_fkey";

-- DropIndex
DROP INDEX "Appointment_date_profissionalId_key";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "profissionalId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Profissional";

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_date_userId_key" ON "Appointment"("date", "userId");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
