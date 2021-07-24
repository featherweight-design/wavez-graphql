/*
  Warnings:

  - You are about to drop the column `panelId` on the `NanoleafAuthToken` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `NanoleafAuthToken` table. All the data in the column will be lost.
  - You are about to drop the `_NanoleafPropertiesToPalette` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `nanoleafAuthTokenId` on table `Device` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deviceId` on table `NanoleafAuthToken` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userId` to the `Palette` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastLogin` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "NanoleafAuthToken" DROP CONSTRAINT "NanoleafAuthToken_panelId_fkey";

-- DropForeignKey
ALTER TABLE "NanoleafAuthToken" DROP CONSTRAINT "NanoleafAuthToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "_NanoleafPropertiesToPalette" DROP CONSTRAINT "_NanoleafPropertiesToPalette_A_fkey";

-- DropForeignKey
ALTER TABLE "_NanoleafPropertiesToPalette" DROP CONSTRAINT "_NanoleafPropertiesToPalette_B_fkey";

-- DropIndex
DROP INDEX "NanoleafAuthToken.panelId_unique";

-- AlterTable
ALTER TABLE "Device" ALTER COLUMN "nanoleafAuthTokenId" SET NOT NULL;

-- AlterTable
ALTER TABLE "NanoleafAuthToken" DROP COLUMN "panelId",
DROP COLUMN "userId",
ALTER COLUMN "deviceId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Palette" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastLogin" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "_NanoleafPropertiesToPalette";

-- CreateTable
CREATE TABLE "_DeviceToPalette" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DeviceToPalette_AB_unique" ON "_DeviceToPalette"("A", "B");

-- CreateIndex
CREATE INDEX "_DeviceToPalette_B_index" ON "_DeviceToPalette"("B");

-- AddForeignKey
ALTER TABLE "Palette" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeviceToPalette" ADD FOREIGN KEY ("A") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeviceToPalette" ADD FOREIGN KEY ("B") REFERENCES "Palette"("id") ON DELETE CASCADE ON UPDATE CASCADE;
