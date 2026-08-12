-- Default stock: all variants become 1
UPDATE "ProductVariant" SET "stockQty" = 1;

-- Y EDP (id cmrfxq6q5000keoryiqrpckyn): listing-only, not for sale -> 0
UPDATE "ProductVariant" SET "stockQty" = 0
WHERE "productId" = 'cmrfxq6q5000keoryiqrpckyn';