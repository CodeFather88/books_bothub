/*
  Warnings:

  - The `roles` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "roles",
ADD COLUMN     "roles" INTEGER[] DEFAULT ARRAY[0]::INTEGER[];
