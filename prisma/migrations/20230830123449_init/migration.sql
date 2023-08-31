-- CreateEnum
CREATE TYPE "RequestResponse" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "HelpType" AS ENUM ('TRANSPORT', 'HOMECARE');

-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('MANAGER', 'ASSISTANT', 'BENEFICIARY');

-- CreateTable
CREATE TABLE "Organization" (
    "orgId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("orgId")
);

-- CreateTable
CREATE TABLE "Member" (
    "memberId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("memberId")
);

-- CreateTable
CREATE TABLE "Request" (
    "requestId" SERIAL NOT NULL,
    "response" "RequestResponse" NOT NULL DEFAULT 'PENDING',
    "typeOfHelp" "HelpType" NOT NULL,
    "termFrom" TIMESTAMP(3) NOT NULL,
    "termTo" TIMESTAMP(3) NOT NULL,
    "addressFrom" TEXT NOT NULL,
    "addressTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assistantAssessment" INTEGER,
    "orgId" INTEGER NOT NULL,
    "managerId" INTEGER,
    "assistantId" INTEGER,
    "beneficiaryId" INTEGER NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("requestId")
);

-- CreateTable
CREATE TABLE "MemberOfOrganization" (
    "from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "to" TIMESTAMP(3),
    "role" "MemberRole" NOT NULL,
    "memberId" INTEGER NOT NULL,
    "orgId" INTEGER NOT NULL,

    CONSTRAINT "MemberOfOrganization_pkey" PRIMARY KEY ("memberId","orgId")
);

-- CreateTable
CREATE TABLE "MemberOfRequest" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "response" "RequestResponse" NOT NULL,
    "requestId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,

    CONSTRAINT "MemberOfRequest_pkey" PRIMARY KEY ("requestId","memberId")
);

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("orgId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberOfOrganization" ADD CONSTRAINT "MemberOfOrganization_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("memberId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberOfOrganization" ADD CONSTRAINT "MemberOfOrganization_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("orgId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberOfRequest" ADD CONSTRAINT "MemberOfRequest_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("requestId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberOfRequest" ADD CONSTRAINT "MemberOfRequest_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("memberId") ON DELETE RESTRICT ON UPDATE CASCADE;
