/*
  Warnings:

  - You are about to drop the `post_comment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_category" DROP CONSTRAINT "_category_A_fkey";

-- DropForeignKey
ALTER TABLE "_category" DROP CONSTRAINT "_category_B_fkey";

-- DropForeignKey
ALTER TABLE "post_comment" DROP CONSTRAINT "post_comment_postId_fkey";

-- DropIndex
DROP INDEX "_category_AB_unique";

-- DropIndex
DROP INDEX "_category_B_index";

-- AlterTable
ALTER TABLE "_category" ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD CONSTRAINT "_category_pkey" PRIMARY KEY ("B", "A");

-- DropTable
DROP TABLE "post_comment";

-- AddForeignKey
ALTER TABLE "_category" ADD CONSTRAINT "_category_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_category" ADD CONSTRAINT "_category_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
