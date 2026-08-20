-- Product availability: isActive -> isAvailable (rename preserves existing values)
ALTER TABLE "Product" RENAME COLUMN "isActive" TO "isAvailable";

ALTER INDEX "Product_isActive_idx" RENAME TO "Product_isAvailable_idx";

-- Remove custom-ml ordering entirely
ALTER TABLE "OrderItem" DROP COLUMN "customMl";