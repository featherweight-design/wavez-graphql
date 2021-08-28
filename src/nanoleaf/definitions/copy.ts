const descriptions = {
  authenticateWithDeviceByUserId:
    'Authenticates a user with a given Nanoleaf device by IP Address that is on their local network by creating a new NanoleafAuthToken, new Device, and, optionally, new Palettes associated with the Nanoleaf device',
  deleteNanoleafAuthToken: 'Deletes a given NanoleafAuthToken by ID',
  updateCurrentStateAll:
    'Updates the current state (on, brightness, hue, sat, ct, colorMode) of a all Nanoleaf devices that belong to the authenticated user',
  updateCurrentStateByDeviceId:
    'Updates the current state (on, brightness, hue, sat, ct, colorMode) of a given Nanoleaf device by ID that belongs to the authenticated user',
};

const copy = { descriptions };

export default copy;
