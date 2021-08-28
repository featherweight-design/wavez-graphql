const descriptions = {
  discoverWifiDevices:
    "Returns a list of local Wi-Fi devices on the user's local network",
  discoverWifiDevicesByType:
    "Returns a list of local Wi-Fi devices on the user's local network by type, filtering by a substring of the type's Mac Address",
  getAllDevicesByUserId:
    'Returns a list of registered devices that belong to the authenticated user',
  getDeviceById:
    'Returns a given device by ID that belongs to the authenticated user',
  deleteDeviceById:
    'Returns a boolean when a device by ID that belongs to the authenticated user is successfully deleted',
  updateDeviceNameById:
    'Updates the name of a given device by ID that belongs to the authenticated user',
  updateAllDevicePowerByUserId:
    'Updates the power state of all devices that belong to the authenticated user',
  updateDevicePowerById:
    'Updates the power state of a given device by ID that belongs to the authenticated user',
  updateDevicePowerByType:
    'Updates the power state of a given group of devices by that belong to the authenticated user',
};

const copy = { descriptions };

export default copy;
