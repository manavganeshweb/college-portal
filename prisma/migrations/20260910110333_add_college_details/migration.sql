/*
  Warnings:

  - You are about to drop the column `academicYear` on the `BoardExam` table. All the data in the column will be lost.
  - You are about to drop the column `examEndDate` on the `BoardExam` table. All the data in the column will be lost.
  - You are about to drop the column `examStartDate` on the `BoardExam` table. All the data in the column will be lost.
  - You are about to drop the column `officialWebsite` on the `BoardExam` table. All the data in the column will be lost.
  - You are about to drop the column `registrationEnd` on the `BoardExam` table. All the data in the column will be lost.
  - You are about to drop the column `registrationStart` on the `BoardExam` table. All the data in the column will be lost.
  - You are about to alter the column `score` on the `CollegeRanking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(8,2)`.
  - You are about to drop the column `seoDescription` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `seoTitle` on the `Course` table. All the data in the column will be lost.
  - You are about to alter the column `durationYears` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(4,1)`.
  - You are about to drop the column `applicationEnd` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `applicationStart` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `examDate` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `officialWebsite` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `authorName` on the `NewsArticle` table. All the data in the column will be lost.
  - You are about to drop the column `lastUpdated` on the `NewsArticle` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `NewsletterSubscriber` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `NewsletterSubscriber` table. All the data in the column will be lost.
  - You are about to drop the column `unsubscribedAt` on the `NewsletterSubscriber` table. All the data in the column will be lost.
  - You are about to drop the column `averageLivingCost` on the `StudyAbroadDestination` table. All the data in the column will be lost.
  - You are about to drop the column `flagImage` on the `StudyAbroadDestination` table. All the data in the column will be lost.
  - You are about to drop the column `officialWebsite` on the `StudyAbroadDestination` table. All the data in the column will be lost.
  - You are about to drop the column `popularIntakes` on the `StudyAbroadDestination` table. All the data in the column will be lost.
  - You are about to drop the column `shortDescription` on the `StudyAbroadDestination` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stateId,slug]` on the table `City` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[collegeId,year,rankingBody,category]` on the table `CollegeRanking` will be added. If there are existing duplicate values, this will fail.
  - Made the column `content` on table `NewsArticle` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('PENDING', 'PUBLISHED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AnswerStatus" AS ENUM ('PENDING', 'PUBLISHED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PlacementType" AS ENUM ('CAMPUS', 'INTERNSHIP', 'OFF_CAMPUS');

-- CreateEnum
CREATE TYPE "PlacementStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- DropIndex
DROP INDEX "City_name_stateId_key";

-- DropIndex
DROP INDEX "City_slug_stateId_key";

-- DropIndex
DROP INDEX "CollegeCutoff_closingRank_idx";

-- DropIndex
DROP INDEX "CollegeRanking_collegeId_year_category_rankingBody_key";

-- DropIndex
DROP INDEX "CollegeRanking_year_category_rankingBody_idx";

-- DropIndex
DROP INDEX "Exam_examDate_idx";

-- DropIndex
DROP INDEX "NewsArticle_type_status_idx";

-- AlterTable
ALTER TABLE "BoardExam" DROP COLUMN "academicYear",
DROP COLUMN "examEndDate",
DROP COLUMN "examStartDate",
DROP COLUMN "officialWebsite",
DROP COLUMN "registrationEnd",
DROP COLUMN "registrationStart",
ADD COLUMN     "examDate" TIMESTAMP(3),
ADD COLUMN     "examYear" INTEGER,
ADD COLUMN     "officialUrl" TEXT,
ALTER COLUMN "board" DROP NOT NULL,
ALTER COLUMN "className" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CollegeCourse" ADD COLUMN     "duration" DECIMAL(4,1);

-- AlterTable
ALTER TABLE "CollegeRanking" ALTER COLUMN "score" SET DATA TYPE DECIMAL(8,2);

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "seoDescription",
DROP COLUMN "seoTitle",
ALTER COLUMN "durationYears" SET DATA TYPE DECIMAL(4,1);

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "applicationEnd",
DROP COLUMN "applicationStart",
DROP COLUMN "examDate",
DROP COLUMN "officialWebsite",
ADD COLUMN     "applicationFee" DECIMAL(10,2),
ADD COLUMN     "examType" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "NewsArticle" DROP COLUMN "authorName",
DROP COLUMN "lastUpdated",
ALTER COLUMN "content" SET NOT NULL;

-- AlterTable
ALTER TABLE "NewsletterSubscriber" DROP COLUMN "createdAt",
DROP COLUMN "phone",
DROP COLUMN "unsubscribedAt";

-- AlterTable
ALTER TABLE "StudyAbroadDestination" DROP COLUMN "averageLivingCost",
DROP COLUMN "flagImage",
DROP COLUMN "officialWebsite",
DROP COLUMN "popularIntakes",
DROP COLUMN "shortDescription",
ADD COLUMN     "admissionInfo" TEXT,
ADD COLUMN     "livingCost" DECIMAL(12,2),
ADD COLUMN     "officialUrl" TEXT,
ADD COLUMN     "shortName" TEXT,
ADD COLUMN     "visaInfo" TEXT;

-- CreateTable
CREATE TABLE "CollegeDepartment" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "hodName" TEXT,
    "establishedYear" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollegeDepartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faculty" (
    "id" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "designation" TEXT,
    "qualification" TEXT,
    "specialization" TEXT,
    "profileImage" TEXT,
    "profileUrl" TEXT,
    "email" TEXT,
    "experienceYears" INTEGER,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollegePlacement" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "course" TEXT,
    "placementType" "PlacementType" NOT NULL DEFAULT 'CAMPUS',
    "totalStudents" INTEGER,
    "studentsPlaced" INTEGER,
    "averagePackage" DECIMAL(12,2),
    "medianPackage" DECIMAL(12,2),
    "highestPackage" DECIMAL(12,2),
    "totalOffers" INTEGER,
    "participatingCompanies" INTEGER,
    "placementReportUrl" TEXT,
    "sourceUrl" TEXT,
    "status" "PlacementStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollegePlacement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlacementRecruiter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlacementRecruiter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollegePlacementRecruiter" (
    "id" TEXT NOT NULL,
    "placementId" TEXT NOT NULL,
    "recruiterId" TEXT NOT NULL,

    CONSTRAINT "CollegePlacementRecruiter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollegeQuestion" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "askerName" TEXT,
    "askerEmail" TEXT,
    "status" "QuestionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollegeQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollegeAnswer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "answererName" TEXT,
    "answererRole" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" "AnswerStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollegeAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CollegeDepartment_collegeId_idx" ON "CollegeDepartment"("collegeId");

-- CreateIndex
CREATE INDEX "CollegeDepartment_name_idx" ON "CollegeDepartment"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CollegeDepartment_collegeId_slug_key" ON "CollegeDepartment"("collegeId", "slug");

-- CreateIndex
CREATE INDEX "Faculty_departmentId_idx" ON "Faculty"("departmentId");

-- CreateIndex
CREATE INDEX "Faculty_name_idx" ON "Faculty"("name");

-- CreateIndex
CREATE INDEX "Faculty_isPublished_idx" ON "Faculty"("isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_departmentId_slug_key" ON "Faculty"("departmentId", "slug");

-- CreateIndex
CREATE INDEX "CollegePlacement_collegeId_idx" ON "CollegePlacement"("collegeId");

-- CreateIndex
CREATE INDEX "CollegePlacement_year_idx" ON "CollegePlacement"("year");

-- CreateIndex
CREATE INDEX "CollegePlacement_status_idx" ON "CollegePlacement"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CollegePlacement_collegeId_year_course_placementType_key" ON "CollegePlacement"("collegeId", "year", "course", "placementType");

-- CreateIndex
CREATE UNIQUE INDEX "PlacementRecruiter_name_key" ON "PlacementRecruiter"("name");

-- CreateIndex
CREATE INDEX "PlacementRecruiter_name_idx" ON "PlacementRecruiter"("name");

-- CreateIndex
CREATE INDEX "CollegePlacementRecruiter_placementId_idx" ON "CollegePlacementRecruiter"("placementId");

-- CreateIndex
CREATE INDEX "CollegePlacementRecruiter_recruiterId_idx" ON "CollegePlacementRecruiter"("recruiterId");

-- CreateIndex
CREATE UNIQUE INDEX "CollegePlacementRecruiter_placementId_recruiterId_key" ON "CollegePlacementRecruiter"("placementId", "recruiterId");

-- CreateIndex
CREATE INDEX "CollegeQuestion_collegeId_idx" ON "CollegeQuestion"("collegeId");

-- CreateIndex
CREATE INDEX "CollegeQuestion_status_idx" ON "CollegeQuestion"("status");

-- CreateIndex
CREATE INDEX "CollegeQuestion_createdAt_idx" ON "CollegeQuestion"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CollegeQuestion_collegeId_slug_key" ON "CollegeQuestion"("collegeId", "slug");

-- CreateIndex
CREATE INDEX "CollegeAnswer_questionId_idx" ON "CollegeAnswer"("questionId");

-- CreateIndex
CREATE INDEX "CollegeAnswer_status_idx" ON "CollegeAnswer"("status");

-- CreateIndex
CREATE INDEX "CollegeAnswer_createdAt_idx" ON "CollegeAnswer"("createdAt");

-- CreateIndex
CREATE INDEX "BoardExam_board_idx" ON "BoardExam"("board");

-- CreateIndex
CREATE INDEX "BoardExam_examYear_idx" ON "BoardExam"("examYear");

-- CreateIndex
CREATE INDEX "BoardExam_status_idx" ON "BoardExam"("status");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "City_name_idx" ON "City"("name");

-- CreateIndex
CREATE UNIQUE INDEX "City_stateId_slug_key" ON "City"("stateId", "slug");

-- CreateIndex
CREATE INDEX "CollegeRanking_year_idx" ON "CollegeRanking"("year");

-- CreateIndex
CREATE INDEX "CollegeRanking_rankingBody_idx" ON "CollegeRanking"("rankingBody");

-- CreateIndex
CREATE INDEX "CollegeRanking_status_idx" ON "CollegeRanking"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CollegeRanking_collegeId_year_rankingBody_category_key" ON "CollegeRanking"("collegeId", "year", "rankingBody", "category");

-- CreateIndex
CREATE INDEX "Exam_conductingBody_idx" ON "Exam"("conductingBody");

-- CreateIndex
CREATE INDEX "NewsArticle_type_idx" ON "NewsArticle"("type");

-- CreateIndex
CREATE INDEX "NewsArticle_status_idx" ON "NewsArticle"("status");

-- CreateIndex
CREATE INDEX "NewsletterSubscriber_status_idx" ON "NewsletterSubscriber"("status");

-- CreateIndex
CREATE INDEX "Review_createdAt_idx" ON "Review"("createdAt");

-- CreateIndex
CREATE INDEX "State_slug_idx" ON "State"("slug");

-- CreateIndex
CREATE INDEX "StudyAbroadDestination_country_idx" ON "StudyAbroadDestination"("country");

-- AddForeignKey
ALTER TABLE "CollegeDepartment" ADD CONSTRAINT "CollegeDepartment_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faculty" ADD CONSTRAINT "Faculty_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "CollegeDepartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollegePlacement" ADD CONSTRAINT "CollegePlacement_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollegePlacementRecruiter" ADD CONSTRAINT "CollegePlacementRecruiter_placementId_fkey" FOREIGN KEY ("placementId") REFERENCES "CollegePlacement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollegePlacementRecruiter" ADD CONSTRAINT "CollegePlacementRecruiter_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "PlacementRecruiter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollegeQuestion" ADD CONSTRAINT "CollegeQuestion_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollegeAnswer" ADD CONSTRAINT "CollegeAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "CollegeQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
