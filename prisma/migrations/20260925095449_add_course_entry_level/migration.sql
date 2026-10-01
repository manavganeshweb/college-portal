-- CreateEnum
CREATE TYPE "CourseEntryLevel" AS ENUM ('AFTER_10TH', 'AFTER_12TH', 'AFTER_DIPLOMA', 'UNDERGRADUATE', 'POSTGRADUATE', 'PHD');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "entryLevel" "CourseEntryLevel";

-- CreateIndex
CREATE INDEX "Course_entryLevel_idx" ON "Course"("entryLevel");
