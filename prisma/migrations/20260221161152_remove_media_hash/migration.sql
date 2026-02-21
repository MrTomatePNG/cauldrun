/*
  Warnings:

  - The values [failed] on the enum `PostStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `mediaHash` on the `posts` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PostStatus_new" AS ENUM ('pending', 'processing', 'completed', 'rejected', 'banned');
ALTER TABLE "public"."posts" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "posts" ALTER COLUMN "status" TYPE "PostStatus_new" USING ("status"::text::"PostStatus_new");
ALTER TYPE "PostStatus" RENAME TO "PostStatus_old";
ALTER TYPE "PostStatus_new" RENAME TO "PostStatus";
DROP TYPE "public"."PostStatus_old";
ALTER TABLE "posts" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "mediaHash";
