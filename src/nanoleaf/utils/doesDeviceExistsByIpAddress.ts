import { PrismaClient } from '@prisma/client';
import { UserInputError } from 'apollo-server';
import { errors } from 'nanoleaf/definitions';

const doesDeviceExistsByIpAddress = async (
  prisma: PrismaClient,
  ipAddress: string
): Promise<void> => {
  const doesDeviceExist = await prisma.device.findUnique({
    where: {
      ip: ipAddress,
    },
  });

  //* IP addresses much be unique, so throw error accordingly
  if (doesDeviceExist) {
    const error = errors.deviceConflict(ipAddress);

    throw new UserInputError(error.message, error);
  }
};

export default doesDeviceExistsByIpAddress;
