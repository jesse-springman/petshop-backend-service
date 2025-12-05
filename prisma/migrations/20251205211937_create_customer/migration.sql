-- CreateTable
CREATE TABLE "customer" (
    "id" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "pet_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);
