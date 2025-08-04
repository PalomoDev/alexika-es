/*
  Warnings:

  - You are about to drop the column `category` on the `features` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `features` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `features` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `specifications` table. All the data in the column will be lost.
  - You are about to drop the column `options` on the `specifications` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "features_category_idx";

-- AlterTable
ALTER TABLE "features" DROP COLUMN "category",
DROP COLUMN "color",
DROP COLUMN "icon";

-- AlterTable
ALTER TABLE "specifications" DROP COLUMN "icon",
DROP COLUMN "options",
ADD COLUMN     "imageIds" UUID[] DEFAULT ARRAY[]::UUID[];
