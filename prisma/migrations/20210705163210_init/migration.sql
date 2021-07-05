-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('NANOLEAF', 'LIFX', 'HUE');

-- CreateEnum
CREATE TYPE "DevicePropertyType" AS ENUM ('NanoleafProperties', 'LifxProperties', 'HueProperties');

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mac" TEXT NOT NULL,
    "type" "DeviceType" NOT NULL,
    "userId" TEXT NOT NULL,
    "properties" "DevicePropertyType" NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NanoleafUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NanoleafAuthToken" (
    "id" TEXT NOT NULL,
    "authToken" TEXT NOT NULL,
    "nanoLeafPanelId" TEXT NOT NULL,
    "nanoLeafUserId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NanoleafProperties" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "serialNo" TEXT NOT NULL,
    "firmwareVersion" TEXT NOT NULL,
    "model" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NanoleafState" (
    "id" TEXT NOT NULL,
    "colorMode" TEXT NOT NULL,
    "nanoLeafPropertiesId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NanoleafStateValue" (
    "value" BOOLEAN NOT NULL,
    "max" INTEGER,
    "min" INTEGER,
    "nanoLeafStateId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "NanoleafEffects" (
    "select" TEXT NOT NULL,
    "effectsList" TEXT[],
    "nanoLeafPropertiesId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "NanoleafPanelLayout" (
    "id" TEXT NOT NULL,
    "nanoLeafPropertiesId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NanoleafLayout" (
    "id" TEXT NOT NULL,
    "numPanels" INTEGER NOT NULL,
    "sideLength" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NanoleafPosition" (
    "id" TEXT NOT NULL,
    "panelId" INTEGER,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "o" INTEGER NOT NULL,
    "nanoLeafLayoutId" TEXT,
    "nanoLeafRhythmId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NanoleafGlobalOrientationValue" (
    "value" BOOLEAN NOT NULL,
    "max" INTEGER,
    "min" INTEGER,
    "nanoLeafLayoutId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "NanoleafRhythm" (
    "id" TEXT NOT NULL,
    "rhythmConnected" BOOLEAN NOT NULL,
    "rhytmActive" BOOLEAN,
    "rhythmId" INTEGER,
    "hardwareVersion" TEXT,
    "firmwareVersion" TEXT,
    "auxAvailable" BOOLEAN,
    "rhythmMode" DOUBLE PRECISION,
    "nanoLeafPropertiesId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LifxProperties" (
    "id" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HueProperties" (
    "id" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Device.name_unique" ON "Device"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Device.mac_unique" ON "Device"("mac");

-- CreateIndex
CREATE UNIQUE INDEX "Device.userId_unique" ON "Device"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafUser.userId_unique" ON "NanoleafUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafAuthToken.authToken_unique" ON "NanoleafAuthToken"("authToken");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafAuthToken_nanoLeafPanelId_unique" ON "NanoleafAuthToken"("nanoLeafPanelId");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafProperties.serialNo_unique" ON "NanoleafProperties"("serialNo");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafState.nanoLeafPropertiesId_unique" ON "NanoleafState"("nanoLeafPropertiesId");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafStateValue.nanoLeafStateId_unique" ON "NanoleafStateValue"("nanoLeafStateId");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafEffects.nanoLeafPropertiesId_unique" ON "NanoleafEffects"("nanoLeafPropertiesId");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafPanelLayout.nanoLeafPropertiesId_unique" ON "NanoleafPanelLayout"("nanoLeafPropertiesId");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafPosition.nanoLeafLayoutId_unique" ON "NanoleafPosition"("nanoLeafLayoutId");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafPosition.nanoLeafRhythmId_unique" ON "NanoleafPosition"("nanoLeafRhythmId");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafGlobalOrientationValue.nanoLeafLayoutId_unique" ON "NanoleafGlobalOrientationValue"("nanoLeafLayoutId");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafRhythm.nanoLeafPropertiesId_unique" ON "NanoleafRhythm"("nanoLeafPropertiesId");

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Device" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafUser" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafAuthToken" ADD FOREIGN KEY ("nanoLeafPanelId") REFERENCES "NanoleafProperties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafAuthToken" ADD FOREIGN KEY ("nanoLeafUserId") REFERENCES "NanoleafUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafState" ADD FOREIGN KEY ("nanoLeafPropertiesId") REFERENCES "NanoleafProperties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafStateValue" ADD FOREIGN KEY ("nanoLeafStateId") REFERENCES "NanoleafState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafStateValue" ADD FOREIGN KEY ("nanoLeafStateId") REFERENCES "NanoleafState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafStateValue" ADD FOREIGN KEY ("nanoLeafStateId") REFERENCES "NanoleafState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafStateValue" ADD FOREIGN KEY ("nanoLeafStateId") REFERENCES "NanoleafState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafStateValue" ADD FOREIGN KEY ("nanoLeafStateId") REFERENCES "NanoleafState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafEffects" ADD FOREIGN KEY ("nanoLeafPropertiesId") REFERENCES "NanoleafProperties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafPanelLayout" ADD FOREIGN KEY ("nanoLeafPropertiesId") REFERENCES "NanoleafProperties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafPosition" ADD FOREIGN KEY ("nanoLeafLayoutId") REFERENCES "NanoleafLayout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafPosition" ADD FOREIGN KEY ("nanoLeafRhythmId") REFERENCES "NanoleafRhythm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafGlobalOrientationValue" ADD FOREIGN KEY ("nanoLeafLayoutId") REFERENCES "NanoleafLayout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafRhythm" ADD FOREIGN KEY ("nanoLeafPropertiesId") REFERENCES "NanoleafProperties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
