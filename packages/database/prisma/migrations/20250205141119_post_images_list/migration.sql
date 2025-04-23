-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
