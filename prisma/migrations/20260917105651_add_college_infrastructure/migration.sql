-- CreateTable
CREATE TABLE "Infrastructure" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "campusArea" TEXT,
    "campusType" TEXT,
    "description" TEXT,
    "hostel" BOOLEAN NOT NULL DEFAULT false,
    "library" BOOLEAN NOT NULL DEFAULT false,
    "laboratories" BOOLEAN NOT NULL DEFAULT false,
    "sports" BOOLEAN NOT NULL DEFAULT false,
    "cafeteria" BOOLEAN NOT NULL DEFAULT false,
    "auditorium" BOOLEAN NOT NULL DEFAULT false,
    "medical" BOOLEAN NOT NULL DEFAULT false,
    "wifi" BOOLEAN NOT NULL DEFAULT false,
    "itInfrastructure" BOOLEAN NOT NULL DEFAULT false,
    "transportation" BOOLEAN NOT NULL DEFAULT false,
    "gym" BOOLEAN NOT NULL DEFAULT false,
    "otherFacilities" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Infrastructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InfrastructureFacility" (
    "id" TEXT NOT NULL,
    "infrastructureId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InfrastructureFacility_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Infrastructure_collegeId_key" ON "Infrastructure"("collegeId");

-- CreateIndex
CREATE INDEX "InfrastructureFacility_infrastructureId_idx" ON "InfrastructureFacility"("infrastructureId");

-- CreateIndex
CREATE INDEX "InfrastructureFacility_infrastructureId_sortOrder_idx" ON "InfrastructureFacility"("infrastructureId", "sortOrder");

-- AddForeignKey
ALTER TABLE "Infrastructure" ADD CONSTRAINT "Infrastructure_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InfrastructureFacility" ADD CONSTRAINT "InfrastructureFacility_infrastructureId_fkey" FOREIGN KEY ("infrastructureId") REFERENCES "Infrastructure"("id") ON DELETE CASCADE ON UPDATE CASCADE;
