-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SUPPORTER', 'ALPHA', 'BETA', 'BASIC');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT E'BASIC';
