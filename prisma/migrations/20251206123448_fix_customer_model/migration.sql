/*
  Warnings:

  - You are about to drop the `customer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "customer";

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "pet_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);
