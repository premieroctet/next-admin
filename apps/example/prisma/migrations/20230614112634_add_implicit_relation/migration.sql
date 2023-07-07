/*
  Warnings:

  - You are about to drop the `Relation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Relation" DROP CONSTRAINT "Relation_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Relation" DROP CONSTRAINT "Relation_postId_fkey";

-- DropTable
DROP TABLE "Relation";

-- CreateTable
CREATE TABLE "_category" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_category_AB_unique" ON "_category"("A", "B");

-- CreateIndex
CREATE INDEX "_category_B_index" ON "_category"("B");

-- AddForeignKey
ALTER TABLE "_category" ADD CONSTRAINT "_category_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_category" ADD CONSTRAINT "_category_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
