-- CreateTable
CREATE TABLE "CourseNavigationItem" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseNavigationItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CourseNavigationItem_courseId_idx" ON "CourseNavigationItem"("courseId");

-- CreateIndex
CREATE INDEX "CourseNavigationItem_courseId_sortOrder_idx" ON "CourseNavigationItem"("courseId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "CourseNavigationItem_courseId_slug_key" ON "CourseNavigationItem"("courseId", "slug");

-- AddForeignKey
ALTER TABLE "CourseNavigationItem" ADD CONSTRAINT "CourseNavigationItem_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
