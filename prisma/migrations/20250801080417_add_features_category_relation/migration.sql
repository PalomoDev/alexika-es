-- AlterTable
ALTER TABLE "features" ADD COLUMN     "categoryId" UUID;

-- AddForeignKey
ALTER TABLE "features" ADD CONSTRAINT "features_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
