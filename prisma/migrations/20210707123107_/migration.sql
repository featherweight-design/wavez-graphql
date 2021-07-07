/*
  Warnings:

  - A unique constraint covering the columns `[deviceId]` on the table `NanoleafAuthToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deviceId` to the `NanoleafAuthToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NanoleafAuthToken" ADD COLUMN     "deviceId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafAuthToken.deviceId_unique" ON "NanoleafAuthToken"("deviceId");

-- AddForeignKey
ALTER TABLE "NanoleafAuthToken" ADD FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterIndex
ALTER INDEX "NanoleafAuthToken_panelId_unique" RENAME TO "NanoleafAuthToken.panelId_unique";
