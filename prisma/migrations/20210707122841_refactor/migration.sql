/*
  Warnings:

  - You are about to drop the column `authTokenId` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `authToken` on the `NanoleafAuthToken` table. All the data in the column will be lost.
  - You are about to drop the `NanoleafGlobalOrientationValue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NanoleafLayout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NanoleafPanelLayout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NanoleafPosition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NanoleafRhythm` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NanoleafState` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NanoleafStateValue` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nanoleafPropertiesId]` on the table `Device` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lifxPropertiesId]` on the table `Device` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[huePropertiesId]` on the table `Device` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[deviceId]` on the table `HueProperties` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[deviceId]` on the table `LifxProperties` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `NanoleafAuthToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[deviceId]` on the table `NanoleafProperties` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deviceId` to the `HueProperties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deviceId` to the `LifxProperties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `NanoleafAuthToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `NanoleafEffects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deviceId` to the `NanoleafProperties` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_authTokenId_fkey";

-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_huePropertiesId_fkey";

-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_lifxPropertiesId_fkey";

-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_nanoleafPropertiesId_fkey";

-- DropForeignKey
ALTER TABLE "NanoleafGlobalOrientationValue" DROP CONSTRAINT "NanoleafGlobalOrientationValue_layoutId_fkey";

-- DropForeignKey
ALTER TABLE "NanoleafPanelLayout" DROP CONSTRAINT "NanoleafPanelLayout_propertiesId_fkey";

-- DropForeignKey
ALTER TABLE "NanoleafPosition" DROP CONSTRAINT "NanoleafPosition_layoutId_fkey";

-- DropForeignKey
ALTER TABLE "NanoleafPosition" DROP CONSTRAINT "NanoleafPosition_rhythmId_fkey";

-- DropForeignKey
ALTER TABLE "NanoleafRhythm" DROP CONSTRAINT "NanoleafRhythm_propertiesId_fkey";

-- DropForeignKey
ALTER TABLE "NanoleafState" DROP CONSTRAINT "NanoleafState_propertiesId_fkey";

-- DropForeignKey
ALTER TABLE "NanoleafStateValue" DROP CONSTRAINT "NanoleafStateValue_stateId_fkey2";

-- DropForeignKey
ALTER TABLE "NanoleafStateValue" DROP CONSTRAINT "NanoleafStateValue_stateId_fkey3";

-- DropForeignKey
ALTER TABLE "NanoleafStateValue" DROP CONSTRAINT "NanoleafStateValue_stateId_fkey";

-- DropForeignKey
ALTER TABLE "NanoleafStateValue" DROP CONSTRAINT "NanoleafStateValue_stateId_fkey4";

-- DropForeignKey
ALTER TABLE "NanoleafStateValue" DROP CONSTRAINT "NanoleafStateValue_stateId_fkey1";

-- DropIndex
DROP INDEX "Device.authTokenId_unique";

-- DropIndex
DROP INDEX "NanoleafAuthToken.authToken_unique";

-- AlterTable
ALTER TABLE "Device" DROP COLUMN "authTokenId",
ADD COLUMN     "nanoleafUserId" TEXT;

-- AlterTable
ALTER TABLE "HueProperties" ADD COLUMN     "deviceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LifxProperties" ADD COLUMN     "deviceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NanoleafAuthToken" DROP COLUMN "authToken",
ADD COLUMN     "token" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NanoleafEffects" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "NanoleafProperties" ADD COLUMN     "deviceId" TEXT NOT NULL;

-- DropTable
DROP TABLE "NanoleafGlobalOrientationValue";

-- DropTable
DROP TABLE "NanoleafLayout";

-- DropTable
DROP TABLE "NanoleafPanelLayout";

-- DropTable
DROP TABLE "NanoleafPosition";

-- DropTable
DROP TABLE "NanoleafRhythm";

-- DropTable
DROP TABLE "NanoleafState";

-- DropTable
DROP TABLE "NanoleafStateValue";

-- CreateIndex
CREATE UNIQUE INDEX "Device.nanoleafPropertiesId_unique" ON "Device"("nanoleafPropertiesId");

-- CreateIndex
CREATE UNIQUE INDEX "Device.lifxPropertiesId_unique" ON "Device"("lifxPropertiesId");

-- CreateIndex
CREATE UNIQUE INDEX "Device.huePropertiesId_unique" ON "Device"("huePropertiesId");

-- CreateIndex
CREATE UNIQUE INDEX "HueProperties.deviceId_unique" ON "HueProperties"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "LifxProperties.deviceId_unique" ON "LifxProperties"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafAuthToken.token_unique" ON "NanoleafAuthToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafProperties_deviceId_unique" ON "NanoleafProperties"("deviceId");

-- AddForeignKey
ALTER TABLE "Device" ADD FOREIGN KEY ("nanoleafUserId") REFERENCES "NanoleafUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafProperties" ADD FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LifxProperties" ADD FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HueProperties" ADD FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;
