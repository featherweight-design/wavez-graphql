-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('NANOLEAF', 'LIFX', 'HUE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mac" TEXT NOT NULL,
    "type" "DeviceType" NOT NULL,
    "userId" TEXT NOT NULL,
    "nanoleafAuthTokenId" TEXT,
    "nanoleafPropertiesId" TEXT,
    "lifxPropertiesId" TEXT,
    "huePropertiesId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NanoleafAuthToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "deviceId" TEXT,
    "panelId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NanoleafProperties" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "serialNo" TEXT NOT NULL,
    "firmwareVersion" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NanoleafEffect" (
    "id" TEXT NOT NULL,
    "animName" TEXT NOT NULL,
    "animType" TEXT NOT NULL,
    "colorType" TEXT NOT NULL,
    "paletteId" TEXT NOT NULL,
    "pluginType" TEXT NOT NULL,
    "pluginUuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LifxProperties" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HueProperties" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Palette" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Color" (
    "id" TEXT NOT NULL,
    "hue" INTEGER NOT NULL,
    "saturation" INTEGER NOT NULL,
    "brightness" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_NanoleafEffectToNanoleafProperties" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ColorToPalette" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Device.ip_unique" ON "Device"("ip");

-- CreateIndex
CREATE UNIQUE INDEX "Device.name_unique" ON "Device"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Device.mac_unique" ON "Device"("mac");

-- CreateIndex
CREATE UNIQUE INDEX "Device.nanoleafAuthTokenId_unique" ON "Device"("nanoleafAuthTokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Device.nanoleafPropertiesId_unique" ON "Device"("nanoleafPropertiesId");

-- CreateIndex
CREATE UNIQUE INDEX "Device.lifxPropertiesId_unique" ON "Device"("lifxPropertiesId");

-- CreateIndex
CREATE UNIQUE INDEX "Device.huePropertiesId_unique" ON "Device"("huePropertiesId");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafAuthToken.token_unique" ON "NanoleafAuthToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafAuthToken.deviceId_unique" ON "NanoleafAuthToken"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafAuthToken.panelId_unique" ON "NanoleafAuthToken"("panelId");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafProperties.serialNo_unique" ON "NanoleafProperties"("serialNo");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafProperties_deviceId_unique" ON "NanoleafProperties"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafEffect.animName_unique" ON "NanoleafEffect"("animName");

-- CreateIndex
CREATE UNIQUE INDEX "NanoleafEffect_paletteId_unique" ON "NanoleafEffect"("paletteId");

-- CreateIndex
CREATE UNIQUE INDEX "LifxProperties.deviceId_unique" ON "LifxProperties"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "HueProperties.deviceId_unique" ON "HueProperties"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "Palette.name_unique" ON "Palette"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_NanoleafEffectToNanoleafProperties_AB_unique" ON "_NanoleafEffectToNanoleafProperties"("A", "B");

-- CreateIndex
CREATE INDEX "_NanoleafEffectToNanoleafProperties_B_index" ON "_NanoleafEffectToNanoleafProperties"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ColorToPalette_AB_unique" ON "_ColorToPalette"("A", "B");

-- CreateIndex
CREATE INDEX "_ColorToPalette_B_index" ON "_ColorToPalette"("B");

-- AddForeignKey
ALTER TABLE "Device" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafAuthToken" ADD FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafAuthToken" ADD FOREIGN KEY ("panelId") REFERENCES "NanoleafProperties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafAuthToken" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafProperties" ADD FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NanoleafEffect" ADD FOREIGN KEY ("paletteId") REFERENCES "Palette"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LifxProperties" ADD FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HueProperties" ADD FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NanoleafEffectToNanoleafProperties" ADD FOREIGN KEY ("A") REFERENCES "NanoleafEffect"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NanoleafEffectToNanoleafProperties" ADD FOREIGN KEY ("B") REFERENCES "NanoleafProperties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ColorToPalette" ADD FOREIGN KEY ("A") REFERENCES "Color"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ColorToPalette" ADD FOREIGN KEY ("B") REFERENCES "Palette"("id") ON DELETE CASCADE ON UPDATE CASCADE;
