-- CreateTable
CREATE TABLE "Palette" (
    "id" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Color" (
    "id" TEXT NOT NULL,
    "hue" INTEGER NOT NULL,
    "saturation" INTEGER NOT NULL,
    "Brightness" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PalettesOnColors" (
    "paletteId" TEXT NOT NULL,
    "colorId" TEXT NOT NULL,

    PRIMARY KEY ("paletteId","colorId")
);

-- CreateTable
CREATE TABLE "Effect" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "loop" BOOLEAN NOT NULL,
    "paletteId" TEXT NOT NULL,
    "transTimeId" TEXT,
    "windowSize" INTEGER,
    "flowFactor" INTEGER,
    "delayTimeId" TEXT,
    "colorTypes" TEXT,
    "animType" TEXT,
    "explodeFactor" INTEGER,
    "brightnessRangeId" TEXT,
    "direction" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EffectRange" (
    "id" TEXT NOT NULL,
    "maxValue" INTEGER NOT NULL,
    "minValue" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Effect.name_unique" ON "Effect"("name");

-- AddForeignKey
ALTER TABLE "PalettesOnColors" ADD FOREIGN KEY ("paletteId") REFERENCES "Palette"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PalettesOnColors" ADD FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Effect" ADD FOREIGN KEY ("paletteId") REFERENCES "Palette"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Effect" ADD FOREIGN KEY ("transTimeId") REFERENCES "EffectRange"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Effect" ADD FOREIGN KEY ("delayTimeId") REFERENCES "EffectRange"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Effect" ADD FOREIGN KEY ("brightnessRangeId") REFERENCES "EffectRange"("id") ON DELETE SET NULL ON UPDATE CASCADE;
