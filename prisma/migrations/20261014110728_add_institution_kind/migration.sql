-- CreateEnum
CREATE TYPE "InstitutionKind" AS ENUM ('UNIVERSITY', 'COLLEGE', 'OTHER');

-- AlterTable
ALTER TABLE "College" ADD COLUMN     "institutionKind" "InstitutionKind" NOT NULL DEFAULT 'COLLEGE';
