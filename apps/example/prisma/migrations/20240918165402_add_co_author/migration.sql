/*
  Warnings:

  - Added the required column `coAuthorId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "coAuthorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_coAuthorId_fkey" FOREIGN KEY ("coAuthorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
