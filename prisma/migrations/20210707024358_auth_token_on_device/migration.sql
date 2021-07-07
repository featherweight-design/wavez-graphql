/*
  Warnings:

  - A unique constraint covering the columns `[authTokenId]` on the table `Device` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "authTokenId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Device.authTokenId_unique" ON "Device"("authTokenId");

-- AddForeignKey
ALTER TABLE "Device" ADD FOREIGN KEY ("authTokenId") REFERENCES "NanoleafAuthToken"("id") ON DELETE SET NULL ON UPDATE CASCADE;
