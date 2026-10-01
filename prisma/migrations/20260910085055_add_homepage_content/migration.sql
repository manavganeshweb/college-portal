-- CreateEnum
CREATE TYPE "RankingStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "NewsType" AS ENUM ('EXAM_ALERT', 'COLLEGE_ALERT', 'ADMISSION_ALERT', 'EDUCATION_NEWS', 'RESULT', 'CAREER');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "NewsletterStatus" AS ENUM ('SUBSCRIBED', 'UNSUBSCRIBED');

-- CreateTable
CREATE TABLE "CollegeRanking" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "rankingBody" TEXT NOT NULL,
    "score" DECIMAL(10,2),
    "totalColleges" INTEGER,
    "status" "RankingStatus" NOT NULL DEFAULT 'DRAFT',
    "sourceUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollegeRanking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoardExam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "board" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "description" TEXT,
    "examStartDate" TIMESTAMP(3),
    "examEndDate" TIMESTAMP(3),
    "resultDate" TIMESTAMP(3),
    "registrationStart" TIMESTAMP(3),
    "registrationEnd" TIMESTAMP(3),
    "officialWebsite" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoardExam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsArticle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "coverImage" TEXT,
    "type" "NewsType" NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "authorName" TEXT,
    "sourceName" TEXT,
    "sourceUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "lastUpdated" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyAbroadDestination" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "coverImage" TEXT,
    "flagImage" TEXT,
    "currency" TEXT,
    "averageTuition" DECIMAL(12,2),
    "averageLivingCost" DECIMAL(12,2),
    "popularCourses" TEXT,
    "popularIntakes" TEXT,
    "officialWebsite" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyAbroadDestination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "status" "NewsletterStatus" NOT NULL DEFAULT 'SUBSCRIBED',
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CollegeRanking_year_category_rankingBody_idx" ON "CollegeRanking"("year", "category", "rankingBody");

-- CreateIndex
CREATE INDEX "CollegeRanking_collegeId_idx" ON "CollegeRanking"("collegeId");

-- CreateIndex
CREATE UNIQUE INDEX "CollegeRanking_collegeId_year_category_rankingBody_key" ON "CollegeRanking"("collegeId", "year", "category", "rankingBody");

-- CreateIndex
CREATE UNIQUE INDEX "BoardExam_slug_key" ON "BoardExam"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "NewsArticle_slug_key" ON "NewsArticle"("slug");

-- CreateIndex
CREATE INDEX "NewsArticle_type_status_idx" ON "NewsArticle"("type", "status");

-- CreateIndex
CREATE INDEX "NewsArticle_publishedAt_idx" ON "NewsArticle"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "StudyAbroadDestination_slug_key" ON "StudyAbroadDestination"("slug");

-- CreateIndex
CREATE INDEX "StudyAbroadDestination_status_idx" ON "StudyAbroadDestination"("status");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

-- AddForeignKey
ALTER TABLE "CollegeRanking" ADD CONSTRAINT "CollegeRanking_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;
