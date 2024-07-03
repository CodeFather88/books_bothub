/*
  Warnings:

  - A unique constraint covering the columns `[verificationLink]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.
  - The required column `verificationLink` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "username" TEXT NOT NULL,
ADD COLUMN     "verificationLink" TEXT NOT NULL,
ADD COLUMN     "verificationStatus" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "users_verificationLink_key" ON "users"("verificationLink");
