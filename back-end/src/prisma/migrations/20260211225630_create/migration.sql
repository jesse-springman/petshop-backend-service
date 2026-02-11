/*
  Warnings:

  - A unique constraint covering the columns `[date,profissionalId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profissionalId` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Appointment_date_key";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "profissionalId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Profissional" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Profissional_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_date_profissionalId_key" ON "Appointment"("date", "profissionalId");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "Profissional"("id") ON DELETE CASCADE ON UPDATE CASCADE;
