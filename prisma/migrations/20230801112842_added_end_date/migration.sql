-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'DENIED', 'ACCEPTED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING';
