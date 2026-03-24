-- CreateTable
CREATE TABLE "media" (
    "id" SERIAL NOT NULL,
    "alt" TEXT,
    "url" TEXT,
    "filename" TEXT,
    "mime_type" TEXT,
    "filesize" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "sizes" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- Clear existing product_images data (dev environment — no production data)
DELETE FROM "product_images";

-- AlterTable: drop url, add media_id on product_images
ALTER TABLE "product_images" DROP COLUMN "url",
ADD COLUMN "media_id" INTEGER NOT NULL;

-- AlterTable: drop logo_url, add logo_media_id on vendors
ALTER TABLE "vendors" DROP COLUMN "logo_url",
ADD COLUMN "logo_media_id" INTEGER;

-- AddForeignKey: product_images -> media
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_media_id_fkey"
    FOREIGN KEY ("media_id") REFERENCES "media"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: vendors -> media
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_logo_media_id_fkey"
    FOREIGN KEY ("logo_media_id") REFERENCES "media"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
