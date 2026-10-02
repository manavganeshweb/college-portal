/*
  Warnings:

  - A unique constraint covering the columns `[aisheCode]` on the table `College` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sourceCourseId]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "College" ADD COLUMN     "aisheCode" TEXT;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "sourceCourseId" TEXT;

-- CreateTable
CREATE TABLE "Fee" (
    "id" TEXT NOT NULL,
    "sourceFeeId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "courseId" TEXT,
    "programName" TEXT,
    "feeType" TEXT NOT NULL,
    "label" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "frequency" TEXT,
    "isRefundable" BOOLEAN NOT NULL DEFAULT false,
    "academicYear" TEXT,
    "sourceUrl" TEXT,
    "observedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fee_sourceFeeId_key" ON "Fee"("sourceFeeId");

-- CreateIndex
CREATE INDEX "Fee_collegeId_idx" ON "Fee"("collegeId");

-- CreateIndex
CREATE INDEX "Fee_courseId_idx" ON "Fee"("courseId");

-- CreateIndex
CREATE INDEX "Fee_feeType_idx" ON "Fee"("feeType");

-- CreateIndex
CREATE INDEX "Fee_academicYear_idx" ON "Fee"("academicYear");

-- CreateIndex
CREATE UNIQUE INDEX "College_aisheCode_key" ON "College"("aisheCode");

-- CreateIndex
CREATE UNIQUE INDEX "Course_sourceCourseId_key" ON "Course"("sourceCourseId");

-- AddForeignKey
ALTER TABLE "Fee" ADD CONSTRAINT "Fee_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fee" ADD CONSTRAINT "Fee_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
