-- CreateTable
CREATE TABLE "CollegePhoto" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "category" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollegePhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CollegePhoto_collegeId_idx" ON "CollegePhoto"("collegeId");

-- CreateIndex
CREATE INDEX "CollegePhoto_collegeId_sortOrder_idx" ON "CollegePhoto"("collegeId", "sortOrder");

-- AddForeignKey
ALTER TABLE "CollegePhoto" ADD CONSTRAINT "CollegePhoto_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;
