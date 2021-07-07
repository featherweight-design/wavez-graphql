/*
  Warnings:

  - A unique constraint covering the columns `[nanoleafAuthTokenId]` on the table `Device` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "nanoleafAuthTokenId" TEXT;

-- AlterTable
ALTER TABLE "NanoleafAuthToken" ALTER COLUMN "deviceId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Device.nanoleafAuthTokenId_unique" ON "Device"("nanoleafAuthTokenId");
