/*
  Warnings:

  - You are about to drop the `Color` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ColorToPalette` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `colors` to the `Palette` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ColorToPalette" DROP CONSTRAINT "_ColorToPalette_A_fkey";

-- DropForeignKey
ALTER TABLE "_ColorToPalette" DROP CONSTRAINT "_ColorToPalette_B_fkey";

-- AlterTable
ALTER TABLE "Palette" ADD COLUMN     "colors" TEXT NOT NULL;

-- DropTable
DROP TABLE "Color";

-- DropTable
DROP TABLE "_ColorToPalette";
