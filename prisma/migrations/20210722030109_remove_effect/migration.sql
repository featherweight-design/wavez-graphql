/*
  Warnings:

  - You are about to drop the `NanoleafEffect` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_NanoleafEffectToNanoleafProperties` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `nanoleafPropertiesId` to the `Palette` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "NanoleafEffect" DROP CONSTRAINT "NanoleafEffect_paletteId_fkey";

-- DropForeignKey
ALTER TABLE "_NanoleafEffectToNanoleafProperties" DROP CONSTRAINT "_NanoleafEffectToNanoleafProperties_A_fkey";

-- DropForeignKey
ALTER TABLE "_NanoleafEffectToNanoleafProperties" DROP CONSTRAINT "_NanoleafEffectToNanoleafProperties_B_fkey";

-- AlterTable
ALTER TABLE "Palette" ADD COLUMN     "nanoleafPropertiesId" TEXT NOT NULL;

-- DropTable
DROP TABLE "NanoleafEffect";

-- DropTable
DROP TABLE "_NanoleafEffectToNanoleafProperties";

-- AddForeignKey
ALTER TABLE "Palette" ADD FOREIGN KEY ("nanoleafPropertiesId") REFERENCES "NanoleafProperties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
