/*
  Warnings:

  - You are about to drop the `_category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_category" DROP CONSTRAINT "_category_A_fkey";

-- DropForeignKey
ALTER TABLE "_category" DROP CONSTRAINT "_category_B_fkey";

-- DropTable
DROP TABLE "_category";

-- CreateTable
CREATE TABLE "Relation" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "Relation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
