const descriptions = {
  createPalette:
    'Creates a Palette that belongs to the authenticated user (Does not sync with external APIs)',
  deletePaletteById:
    'Deletes a given Palette by ID that belongs to the authenticated user (Does not sync with external APIs)',
  getAllPalettesByUserId:
    'Returns all Pallettes that belong to the authenticated user',
  getPaletteById:
    'Returns a given Pallette by ID that belongs to the authenticated user',
  setPaletteToAllDevices:
    'Sets a given Palette by ID to all Devices that belong to the authenticated user (Currently only works with Nanoleaf)',
  setPaletteToDeviceById:
    'Sets a given Palette by ID to a given Device by ID that belongs to the authenticated user (Currently only works with Nanoleaf)',
  setPaletteToDeviceByType:
    'Sets a given Pallette by ID to a group of Devices by type that belong to the authenticated user (Currently only works with Nanoleaf)',
  syncPalettesByDeviceId:
    'Fetch and save all Palettes by a given Device ID to the database. Any existing Palettes will be updated and any new Palettes will be created. External APIs are considered a source of truth and any differences in the application database will be overwritten (Currently only works with Nanoleaf).',
  updatePaletteColorsById:
    "Updates a given Palette's colors by ID. Optionally syncs with external APIs based on any associated Devices (Currently only works with Nanoleaf).",
  updatePaletteNameById:
    "Updates a give Palette's name by ID. Optionally syncs with external APIs based on any associated Devices (Currently only works with Nanoleaf)",
};

const copy = { descriptions };

export default copy;
