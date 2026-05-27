-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'PENDING', 'SUSPENDED', 'CANCELED');

-- AlterTable
ALTER TABLE "Petshop" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';
