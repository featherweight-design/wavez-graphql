/*
  Warnings:

  - You are about to drop the column `nanoleafPropertiesId` on the `Palette` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Palette" DROP CONSTRAINT "Palette_nanoleafPropertiesId_fkey";

-- AlterTable
ALTER TABLE "Palette" DROP COLUMN "nanoleafPropertiesId";

-- CreateTable
CREATE TABLE "_NanoleafPropertiesToPalette" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_NanoleafPropertiesToPalette_AB_unique" ON "_NanoleafPropertiesToPalette"("A", "B");

-- CreateIndex
CREATE INDEX "_NanoleafPropertiesToPalette_B_index" ON "_NanoleafPropertiesToPalette"("B");

-- AddForeignKey
ALTER TABLE "_NanoleafPropertiesToPalette" ADD FOREIGN KEY ("A") REFERENCES "NanoleafProperties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NanoleafPropertiesToPalette" ADD FOREIGN KEY ("B") REFERENCES "Palette"("id") ON DELETE CASCADE ON UPDATE CASCADE;
