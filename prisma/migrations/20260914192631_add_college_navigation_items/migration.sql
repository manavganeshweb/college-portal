-- CreateTable
CREATE TABLE "NavigationItem" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NavigationItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NavigationItem_collegeId_idx" ON "NavigationItem"("collegeId");

-- CreateIndex
CREATE INDEX "NavigationItem_collegeId_sortOrder_idx" ON "NavigationItem"("collegeId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "NavigationItem_collegeId_slug_key" ON "NavigationItem"("collegeId", "slug");

-- AddForeignKey
ALTER TABLE "NavigationItem" ADD CONSTRAINT "NavigationItem_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;
