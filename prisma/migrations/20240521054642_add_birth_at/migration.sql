/*
  Warnings:

  - You are about to drop the column `createdat` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedat` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdat",
DROP COLUMN "updatedat",
ADD COLUMN     "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "birthAt" DROP NOT NULL,
ALTER COLUMN "birthAt" SET DATA TYPE DATE;
