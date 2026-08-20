-- ysl-y-edp is intentionally unavailable (per data/products.csv, FALSE).
-- Prod inherited TRUE from an older revision of 20260813000000_import_products;
-- align prod with the intended catalog data.
UPDATE "Product" SET "isAvailable" = false WHERE "slug" = 'ysl-y-edp';