/*
  Warnings:

  - Added the required column `invitedById` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "invitedById" TEXT NOT NULL,
ADD COLUMN     "invites" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "AccessKey" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expireAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccessKey.key_unique" ON "AccessKey"("key");

-- CreateIndex
CREATE UNIQUE INDEX "AccessKey.email_unique" ON "AccessKey"("email");

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
