-- CreateTable
CREATE TABLE "Order" (
    "orderId" TEXT NOT NULL,
    "beneficiaryId" TEXT NOT NULL,
    "assistantId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("orderId")
);
