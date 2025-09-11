-- CreateTable
CREATE TABLE "articles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "imageFolder" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "category" TEXT,
    "author" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "readTime" INTEGER,
    "viewCount" INTEGER DEFAULT 0,
    "isFeatured" BOOLEAN DEFAULT false,
    "publishedAt" TIMESTAMP(6),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_isPublished_idx" ON "articles"("isPublished");

-- CreateIndex
CREATE INDEX "articles_isFeatured_idx" ON "articles"("isFeatured");

-- CreateIndex
CREATE INDEX "articles_category_idx" ON "articles"("category");

-- CreateIndex
CREATE INDEX "articles_slug_idx" ON "articles"("slug");
