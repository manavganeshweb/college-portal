-- CreateTable
CREATE TABLE "UserShortlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserShortlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserShortlist_userId_idx" ON "UserShortlist"("userId");

-- CreateIndex
CREATE INDEX "UserShortlist_collegeId_idx" ON "UserShortlist"("collegeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserShortlist_userId_collegeId_key" ON "UserShortlist"("userId", "collegeId");

-- AddForeignKey
ALTER TABLE "UserShortlist" ADD CONSTRAINT "UserShortlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserShortlist" ADD CONSTRAINT "UserShortlist_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;
