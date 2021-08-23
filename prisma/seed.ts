import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.create({
    data: {
      email: 'hartigan.hm@gmail.com',
      name: 'Hugh Hartigan',
      role: 'ADMIN',
    },
  });

  console.log(admin);
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
