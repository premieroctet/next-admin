/*
  Warnings:

  - You are about to drop the `_category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post_comment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_category" DROP CONSTRAINT "_category_A_fkey";

-- DropForeignKey
ALTER TABLE "_category" DROP CONSTRAINT "_category_B_fkey";

-- DropForeignKey
ALTER TABLE "post_comment" DROP CONSTRAINT "post_comment_postId_fkey";

-- DropTable
DROP TABLE "_category";

-- DropTable
DROP TABLE "post_comment";

-- CreateTable
CREATE TABLE "CategoriesOnPosts" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CategoriesOnPosts_pkey" PRIMARY KEY ("postId","categoryId")
);

-- AddForeignKey
ALTER TABLE "CategoriesOnPosts" ADD CONSTRAINT "CategoriesOnPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnPosts" ADD CONSTRAINT "CategoriesOnPosts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
