-- CreateTable
CREATE TABLE "_coAuthors" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_coAuthors_AB_unique" ON "_coAuthors"("A", "B");

-- CreateIndex
CREATE INDEX "_coAuthors_B_index" ON "_coAuthors"("B");

-- AddForeignKey
ALTER TABLE "_coAuthors" ADD CONSTRAINT "_coAuthors_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_coAuthors" ADD CONSTRAINT "_coAuthors_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
