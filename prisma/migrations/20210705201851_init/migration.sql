/*
  Warnings:

  - You are about to drop the column `nanoLeafPanelId` on the `NanoleafAuthToken` table. All the data in the column will be lost.
  - You are about to drop the column `nanoLeafUserId` on the `NanoleafAuthToken` table. All the data in the column will be lost.
  - You are about to drop the column `nanoLeafPropertiesId` on the `NanoleafEffects` table. All the data in the column will be lost.
  - You are about to drop the column `nanoLeafLayoutId` on the `NanoleafGlobalOrientationValue` table. All the data in the column will be lost.
  - You are about to drop the column `nanoLeafPropertiesId` on the `NanoleafPanelLayout` table. All the data in the column will be lost.
  - You are about to drop the column `nanoLeafLayoutId` on the `NanoleafPosition` table. All the data in the column will be lost.
  - You are about to drop the column `nanoLeafRhythmId` on the `NanoleafPosition` table. All the data in the column will be lost.
  - You are about to drop the column `nanoLeafPropertiesId` on the `NanoleafRhythm` table. All the data in the column will be lost.
  - You are about to drop the column `nanoLeafPropertiesId` on the `NanoleafState` table. All the data in the column will be lost.
  - You are about to drop the column `nanoLeafStateId` on the `NanoleafStateValue` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ip]` on the table `Device` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[panelId]` on the table `NanoleafAuthToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[propertiesId]` on the table `NanoleafEffects` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[layoutId]` on the table `NanoleafGlobalOrientationValue` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[propertiesId]` on the table `NanoleafPanelLayout` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[layoutId]` on the table `NanoleafPosition` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rhythmId]` on the table `NanoleafPosition` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[propertiesId]` on the table `NanoleafRhythm` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[propertiesId]` on the table `NanoleafState` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stateId]` on the table `NanoleafStateValue` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ip` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertiesId` to the `NanoleafEffects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `layoutId` to the `NanoleafGlobalOrientationValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertiesId` to the `NanoleafPanelLayout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertiesId` to the `NanoleafRhythm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertiesId` to the `NanoleafState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stateId` to the `NanoleafStateValue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "NanoleafAuthToken" DROP CONSTRAINT "NanoleafAuthToken_nanoLeafPanelId_fkey";

-- DropForeignKey
ALTER TABLE "NanoleafAuthToken" DROP CONSTRAINT "NanoleafAuthToken_nanoLeafUserId_fkey";

-- DropForeignKey
ALTER TABLE "NanoleafEffects" DROP CONSTRAINT "NanoleafEffects_nanoLeafPropertiesId_fkey";

-- DropForeignKey
ALTER TABLE "NanoleafGlobalOrientationValue" DROP CONSTRAINT "NanoleafGlobalOrientationValue_nanoLeafLayoutId_fkey";

-- DropForeignKey
ALTER TABLE "NanoleafPanelLayout" DROP CONSTRAINT "NanoleafPanelLayout_nanoLeafPropertiesId_fkey";

-- DropForeignKey
ALTER TABLE "NanoleafPosition" DROP CONSTRAINT "NanoleafPosition_nanoLeafLayoutId_fkey";

-- DropForeignKey
ALTER TABLE "NanoleafPosition" DROP CONSTRAINT "NanoleafPosition_nanoLeafRhythmId_fkey";

-- DropForeignKey
ALTER TABLE "NanoleafRhythm" DROP CONSTRAINT "NanoleafRhythm_nanoLeafPropertiesId_fkey";

-- DropForeignKey
ALTER TABLE "NanoleafState" DROP CONSTRAINT "NanoleafState_nanoLeafPropertiesId_fkey";

-- DropForeignKey
ALTER TABLE "NanoleafStateValue" DROP CONSTRAINT "NanoleafStateValue_nanoLeafStateId_fkey3";

-- DropForeignKey
ALTER TABLE "NanoleafStateValue" DROP CONSTRAINT "NanoleafStateValue_nanoLeafStateId_fkey4";

-- DropForeignKey
ALTER TABLE "NanoleafStateValue" DROP CONSTRAINT "NanoleafStateValue_nanoLeafStateId_fkey";

-- DropForeignKey
ALTER TABLE "NanoleafStateValue" DROP CONSTRAINT "NanoleafStateValue_nanoLeafStateId_fkey2";

-- DropForeignKey
ALTER TABLE "NanoleafStateValue" DROP CONSTRAINT "NanoleafStateValue_nanoLeafStateId_fkey1";

-- DropIndex
DROP INDEX "NanoleafAuthToken_nanoLeafPanelId_unique";

-- DropIndex
DROP INDEX "NanoleafEffects.nanoLeafPropertiesId_unique";

-- DropIndex
DROP INDEX "NanoleafGlobalOrientationValue.nanoLeafLayoutId_unique";

-- DropIndex
DROP INDEX "NanoleafPanelLayout.nanoLeafPropertiesId_unique";

-- DropIndex
DROP INDEX "NanoleafPosition.nanoLeafLayoutId_unique";

-- DropIndex
DROP INDEX "NanoleafPosition.nanoLeafRhythmId_unique";

-- DropIndex
DROP INDEX "NanoleafRhythm.nanoLeafPropertiesId_unique";

-- DropIndex
DROP INDEX "NanoleafState.nanoLeafPropertiesId_unique";

-- DropIndex
DROP INDEX "NanoleafStateValue.nanoLeafStateId_unique";

-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "ip" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NanoleafAuthToken" DROP COLUMN "nanoLeafPanelId",
DROP COLUMN "nanoLeafUserId",
ADD COLUMN     "nanoleafUserId" TEXT,
ADD COLUMN     "panelId" TEXT;

-- AlterTable
ALTER TABLE "NanoleafEffects" DROP COLUMN "nanoLeafPropertiesId",
ADD COLUMN     "propertiesId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NanoleafGlobalOrientationValue" DROP COLUMN "nanoLeafLayoutId",
ADD COLUMN     "layoutId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NanoleafPanelLayout" DROP COLUMN "nanoLeafPropertiesId",
ADD COLUMN     "propertiesId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NanoleafPosition" DROP COLUMN "nanoLeafLayoutId",
DROP COLUMN "nanoLeafRhythmId",
ADD COLUMN     "layoutId" TEXT,
ADD COLUMN     "rhythmId" TEXT;

-- AlterTable
ALTER TABLE "NanoleafRhythm" DROP COLUMN "nanoLeafPropertiesId",
ADD COLUMN     "propertiesId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NanoleafState" DROP COLUMN "nanoLeafPropertiesId",
ADD COLUMN     "propertiesId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NanoleafStateValue" DROP COLUMN "nanoLeafStateId",
ADD COLUMN     "stateId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Device.ip_unique" ON "Device"("ip");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafAuthToken_panelId_unique" ON "NanoleafAuthToken"("panelId");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafEffects.propertiesId_unique" ON "NanoleafEffects"("propertiesId");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafGlobalOrientationValue.layoutId_unique" ON "NanoleafGlobalOrientationValue"("layoutId");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafPanelLayout.propertiesId_unique" ON "NanoleafPanelLayout"("propertiesId");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafPosition.layoutId_unique" ON "NanoleafPosition"("layoutId");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafPosition.rhythmId_unique" ON "NanoleafPosition"("rhythmId");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafRhythm.propertiesId_unique" ON "NanoleafRhythm"("propertiesId");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafState.propertiesId_unique" ON "NanoleafState"("propertiesId");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafStateValue.stateId_unique" ON "NanoleafStateValue"("stateId");

-- AddForeignKey
ALTER TABLE "NanoleafAuthToken" ADD FOREIGN KEY ("panelId") REFERENCES "NanoleafProperties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafAuthToken" ADD FOREIGN KEY ("nanoleafUserId") REFERENCES "NanoleafUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafState" ADD FOREIGN KEY ("propertiesId") REFERENCES "NanoleafProperties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafStateValue" ADD FOREIGN KEY ("stateId") REFERENCES "NanoleafState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafStateValue" ADD FOREIGN KEY ("stateId") REFERENCES "NanoleafState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafStateValue" ADD FOREIGN KEY ("stateId") REFERENCES "NanoleafState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafStateValue" ADD FOREIGN KEY ("stateId") REFERENCES "NanoleafState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafStateValue" ADD FOREIGN KEY ("stateId") REFERENCES "NanoleafState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafEffects" ADD FOREIGN KEY ("propertiesId") REFERENCES "NanoleafProperties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafPanelLayout" ADD FOREIGN KEY ("propertiesId") REFERENCES "NanoleafProperties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafPosition" ADD FOREIGN KEY ("layoutId") REFERENCES "NanoleafLayout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafPosition" ADD FOREIGN KEY ("rhythmId") REFERENCES "NanoleafRhythm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafGlobalOrientationValue" ADD FOREIGN KEY ("layoutId") REFERENCES "NanoleafLayout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafRhythm" ADD FOREIGN KEY ("propertiesId") REFERENCES "NanoleafProperties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
