-- CreateEnum
CREATE TYPE "UserApplicationStatus" AS ENUM ('INTERESTED', 'APPLIED', 'IN_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "UserApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "status" "UserApplicationStatus" NOT NULL DEFAULT 'INTERESTED',
    "courseName" TEXT,
    "notes" TEXT,
    "appliedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserApplication_userId_idx" ON "UserApplication"("userId");

-- CreateIndex
CREATE INDEX "UserApplication_collegeId_idx" ON "UserApplication"("collegeId");

-- CreateIndex
CREATE INDEX "UserApplication_status_idx" ON "UserApplication"("status");

-- CreateIndex
CREATE UNIQUE INDEX "UserApplication_userId_collegeId_key" ON "UserApplication"("userId", "collegeId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserApplication" ADD CONSTRAINT "UserApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserApplication" ADD CONSTRAINT "UserApplication_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;
