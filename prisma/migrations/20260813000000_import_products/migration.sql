-- Import products and variants from data/products.csv
-- (INSERT on new slug, UPDATE on existing slug/variant)

-- Rare Reef (MEN)
INSERT INTO "Product" ("id", "slug", "brand", "name", "concentration", "gender", "description", "topNotes", "middleNotes", "baseNotes", "actualBottleMl", "images", "isActive", "updatedAt")
VALUES (gen_random_uuid()::text, 'afnan-rare-reef-edp', 'Afnan', 'Rare Reef', 'EDP', 'MEN'::"Gender", 'Fresh, bright, and pure - Rare Reef brings the feeling of a peaceful escape by the ocean. It opens with a burst of energy, then softens into smooth, green layers that feel both refreshing and calm. The scent gently settles into a warm, comforting base that stays with you like the memory of a perfect day. Clean, modern, and beautifully balanced, Rare Reef is made for anyone who embraces life with clarity and ease.', ARRAY['Bergamot', 'Marine accord', 'Apple']::text[], ARRAY['Lavender', 'Cardamom', 'Clary sage']::text[], ARRAY['Amber', 'Musk', 'Woody notes']::text[], 100, ARRAY['rare-reef.webp']::text[], TRUE, now())

ON CONFLICT ("slug") DO UPDATE SET "brand" = EXCLUDED."brand", "name" = EXCLUDED."name", "concentration" = EXCLUDED."concentration", "gender" = EXCLUDED."gender", "description" = EXCLUDED."description", "topNotes" = EXCLUDED."topNotes", "middleNotes" = EXCLUDED."middleNotes", "baseNotes" = EXCLUDED."baseNotes", "actualBottleMl" = EXCLUDED."actualBottleMl", "images" = EXCLUDED."images", "isActive" = EXCLUDED."isActive", "updatedAt" = now();

INSERT INTO "ProductVariant" ("id", "productId", "size", "priceBdt", "stockQty", "sku")
SELECT gen_random_uuid()::text, p."id", v."size", v."priceBdt", v."stockQty", v."sku"
FROM "Product" p
CROSS JOIN (VALUES
    ('FULL_BOTTLE'::"VariantSize", 3750, 0, NULL::text),
    ('DECANT_5ML'::"VariantSize", 320, 0, NULL::text),
    ('DECANT_10ML'::"VariantSize", 560, 0, NULL::text)
) AS v("size", "priceBdt", "stockQty", "sku")
WHERE p."slug" = 'afnan-rare-reef-edp'

ON CONFLICT ("productId", "size") DO UPDATE SET "priceBdt" = EXCLUDED."priceBdt", "stockQty" = EXCLUDED."stockQty", "sku" = EXCLUDED."sku";

-- Supremacy Collector's Edition (MEN)
INSERT INTO "Product" ("id", "slug", "brand", "name", "concentration", "gender", "description", "topNotes", "middleNotes", "baseNotes", "actualBottleMl", "images", "isActive", "updatedAt")
VALUES (gen_random_uuid()::text, 'afnan-supremacy-collectors-edition-edp', 'Afnan', 'Supremacy Collector''s Edition', 'EDP', 'MEN'::"Gender", 'Supremacy Collector''s Edition is a captivating masculine fragrance that honors the legacy of Afnan''s beloved Supremacy collection. This exquisite scent combines the classic allure of a timeless classic with a refreshing twist of white floral and amber notes, creating a sophisticated and invigorating scent experience perfect for special occasions.', ARRAY['Pineapple', 'Bergamot', 'White Flowers', 'Apple']::text[], ARRAY['Orange Blossom', 'Birch', 'Amber']::text[], ARRAY['Oak Moss', 'Musk', 'Ambergris']::text[], 100, ARRAY['supremacy-collectors-edition.webp']::text[], TRUE, now())

ON CONFLICT ("slug") DO UPDATE SET "brand" = EXCLUDED."brand", "name" = EXCLUDED."name", "concentration" = EXCLUDED."concentration", "gender" = EXCLUDED."gender", "description" = EXCLUDED."description", "topNotes" = EXCLUDED."topNotes", "middleNotes" = EXCLUDED."middleNotes", "baseNotes" = EXCLUDED."baseNotes", "actualBottleMl" = EXCLUDED."actualBottleMl", "images" = EXCLUDED."images", "isActive" = EXCLUDED."isActive", "updatedAt" = now();

INSERT INTO "ProductVariant" ("id", "productId", "size", "priceBdt", "stockQty", "sku")
SELECT gen_random_uuid()::text, p."id", v."size", v."priceBdt", v."stockQty", v."sku"
FROM "Product" p
CROSS JOIN (VALUES
    ('FULL_BOTTLE'::"VariantSize", 6200, 0, NULL::text),
    ('DECANT_5ML'::"VariantSize", 410, 0, NULL::text),
    ('DECANT_10ML'::"VariantSize", 800, 0, NULL::text)
) AS v("size", "priceBdt", "stockQty", "sku")
WHERE p."slug" = 'afnan-supremacy-collectors-edition-edp'

ON CONFLICT ("productId", "size") DO UPDATE SET "priceBdt" = EXCLUDED."priceBdt", "stockQty" = EXCLUDED."stockQty", "sku" = EXCLUDED."sku";

-- 9pm Night Out (MEN)
INSERT INTO "Product" ("id", "slug", "brand", "name", "concentration", "gender", "description", "topNotes", "middleNotes", "baseNotes", "actualBottleMl", "images", "isActive", "updatedAt")
VALUES (gen_random_uuid()::text, 'afnan-9pm-night-out-edp', 'Afnan', '9pm Night Out', 'EDP', 'MEN'::"Gender", '9 PM Night Out is a statement of confidence, created for nights that leave a lasting impression. From the first moment, it feels energetic and polished - bright, vibrant, and immediately captivating, setting the tone for what’s to come. As the fragrance unfolds, it reveals a smooth, modern warmth with an elegant edge. There’s a refined sensuality at its core - confident, stylish, and magnetic, balancing freshness with depth in a way that feels effortless and contemporary. When it settles on the skin, the scent becomes deeper and more intense, wrapping itself in warmth and richness that lingers long after the moment has passed. Bold yet refined, 9PM Night Out leaves a powerful signature, one that speaks without words and defines the night as yours.', ARRAY['Dragon Fruit', 'Bergamot', 'Cognac', 'Lavender', 'Apple']::text[], ARRAY['Cardamom', 'Mahonial', 'Suede', 'Toffee', 'Cedar']::text[], ARRAY['Tonka Bean', 'Akigalawood', 'Ambrofix', 'Patchouli']::text[], 100, ARRAY['nine-pm-night-out.webp']::text[], TRUE, now())

ON CONFLICT ("slug") DO UPDATE SET "brand" = EXCLUDED."brand", "name" = EXCLUDED."name", "concentration" = EXCLUDED."concentration", "gender" = EXCLUDED."gender", "description" = EXCLUDED."description", "topNotes" = EXCLUDED."topNotes", "middleNotes" = EXCLUDED."middleNotes", "baseNotes" = EXCLUDED."baseNotes", "actualBottleMl" = EXCLUDED."actualBottleMl", "images" = EXCLUDED."images", "isActive" = EXCLUDED."isActive", "updatedAt" = now();

INSERT INTO "ProductVariant" ("id", "productId", "size", "priceBdt", "stockQty", "sku")
SELECT gen_random_uuid()::text, p."id", v."size", v."priceBdt", v."stockQty", v."sku"
FROM "Product" p
CROSS JOIN (VALUES
    ('FULL_BOTTLE'::"VariantSize", 5800, 0, NULL::text),
    ('DECANT_5ML'::"VariantSize", 430, 0, NULL::text),
    ('DECANT_10ML'::"VariantSize", 850, 0, NULL::text)
) AS v("size", "priceBdt", "stockQty", "sku")
WHERE p."slug" = 'afnan-9pm-night-out-edp'

ON CONFLICT ("productId", "size") DO UPDATE SET "priceBdt" = EXCLUDED."priceBdt", "stockQty" = EXCLUDED."stockQty", "sku" = EXCLUDED."sku";

-- Hawas Ice (MEN)
INSERT INTO "Product" ("id", "slug", "brand", "name", "concentration", "gender", "description", "topNotes", "middleNotes", "baseNotes", "actualBottleMl", "images", "isActive", "updatedAt")
VALUES (gen_random_uuid()::text, 'rasasi-hawas-ice-edp', 'Rasasi', 'Hawas Ice', 'EDP', 'MEN'::"Gender", 'Hawas Ice opens with a vibrant and icily refreshing burst of crisp Apple, zesty Sicilian Bergamot, bright Italian Lemon, and aromatic Star Anise, fresh and energetic with an immediate aura of cool masculine clarity that commands attention from the very first moment. As the fragrance evolves, the heart unfolds into a sophisticated and richly fruity-floral accord of juicy Plum, fragrant Orange Blossom, and spicy Cardamom, raising the character from citrus to deeply elegant and unmistakably layered with refined warmth that contrasts beautifully against the icy opening. The base settles into a lasting, comforting foundation of earthy Moss, sensual Musk, weathered Driftwood, and warm Amber that wraps the wearer in a quietly powerful and mystical woody-aromatic trail. Crisp, aquatic, fruity-spicy, and deeply lasting.', ARRAY['Apple', 'Italian Lemon', 'Sicilian Bergamot', 'Star Anise']::text[], ARRAY['Plum', 'Orange Blossom', 'Cardamon']::text[], ARRAY['Musk', 'Amber', 'Driftwood', 'Moss']::text[], 100, ARRAY['hawas-ice.webp']::text[], TRUE, now())

ON CONFLICT ("slug") DO UPDATE SET "brand" = EXCLUDED."brand", "name" = EXCLUDED."name", "concentration" = EXCLUDED."concentration", "gender" = EXCLUDED."gender", "description" = EXCLUDED."description", "topNotes" = EXCLUDED."topNotes", "middleNotes" = EXCLUDED."middleNotes", "baseNotes" = EXCLUDED."baseNotes", "actualBottleMl" = EXCLUDED."actualBottleMl", "images" = EXCLUDED."images", "isActive" = EXCLUDED."isActive", "updatedAt" = now();

INSERT INTO "ProductVariant" ("id", "productId", "size", "priceBdt", "stockQty", "sku")
SELECT gen_random_uuid()::text, p."id", v."size", v."priceBdt", v."stockQty", v."sku"
FROM "Product" p
CROSS JOIN (VALUES
    ('FULL_BOTTLE'::"VariantSize", 3200, 0, NULL::text),
    ('DECANT_5ML'::"VariantSize", 280, 0, NULL::text),
    ('DECANT_10ML'::"VariantSize", 500, 0, NULL::text)
) AS v("size", "priceBdt", "stockQty", "sku")
WHERE p."slug" = 'rasasi-hawas-ice-edp'

ON CONFLICT ("productId", "size") DO UPDATE SET "priceBdt" = EXCLUDED."priceBdt", "stockQty" = EXCLUDED."stockQty", "sku" = EXCLUDED."sku";

-- Y EDP (MEN)
INSERT INTO "Product" ("id", "slug", "brand", "name", "concentration", "gender", "description", "topNotes", "middleNotes", "baseNotes", "actualBottleMl", "images", "isActive", "updatedAt")
VALUES (gen_random_uuid()::text, 'ysl-y-edp', 'Yves Saint Laurent', 'Y EDP', 'EDP', 'MEN'::"Gender", 'The signature YSL Y cologne is a bold and woody men''s fragrance, infused with sophisticated and revitalizing notes of sage and geranium and rounded out with a hint of sensual wood. A long-lasting, seductive fragrance for the accomplished, self-made man, it is an intense portrayal of masculinity in a sophisticated cologne inspired by the iconic Yves Saint Laurent "white t-shirt and black jacket" look. The blue glass features a striking silver Y that slashes through the square-shouldered bottle -- an ultra-desirable piece for the self-made man.', ARRAY['Apple', 'Ginger', 'Bergamot']::text[], ARRAY['Sage', 'Juniper Berries', 'Geranium']::text[], ARRAY['Amberwood', 'Tonka Bean', 'Cedar', 'Vetiver', 'Olibanum']::text[], 100, ARRAY['y-edp.webp']::text[], FALSE, now())

ON CONFLICT ("slug") DO UPDATE SET "brand" = EXCLUDED."brand", "name" = EXCLUDED."name", "concentration" = EXCLUDED."concentration", "gender" = EXCLUDED."gender", "description" = EXCLUDED."description", "topNotes" = EXCLUDED."topNotes", "middleNotes" = EXCLUDED."middleNotes", "baseNotes" = EXCLUDED."baseNotes", "actualBottleMl" = EXCLUDED."actualBottleMl", "images" = EXCLUDED."images", "isActive" = EXCLUDED."isActive", "updatedAt" = now();

INSERT INTO "ProductVariant" ("id", "productId", "size", "priceBdt", "stockQty", "sku")
SELECT gen_random_uuid()::text, p."id", v."size", v."priceBdt", v."stockQty", v."sku"
FROM "Product" p
CROSS JOIN (VALUES
    ('FULL_BOTTLE'::"VariantSize", 11800, 0, NULL::text),
    ('DECANT_5ML'::"VariantSize", 720, 0, NULL::text),
    ('DECANT_10ML'::"VariantSize", 1400, 0, NULL::text)
) AS v("size", "priceBdt", "stockQty", "sku")
WHERE p."slug" = 'ysl-y-edp'

ON CONFLICT ("productId", "size") DO UPDATE SET "priceBdt" = EXCLUDED."priceBdt", "stockQty" = EXCLUDED."stockQty", "sku" = EXCLUDED."sku";

-- Marwa (MEN)
INSERT INTO "Product" ("id", "slug", "brand", "name", "concentration", "gender", "description", "topNotes", "middleNotes", "baseNotes", "actualBottleMl", "images", "isActive", "updatedAt")
VALUES (gen_random_uuid()::text, 'marwa-edp', 'Arabiyat Prestige', 'Marwa', NULL, 'MEN'::"Gender", 'Designed for the man who leads with confidence, Marwa opens with an invigorating blend of Calabrian bergamot, lemon, and Sicilian orange, creating a radiant burst of freshness that feels sharp, clean, and full of life. This bright introduction instantly captures attention with its uplifting and energetic personality. At the heart, Nigerian ginger, Ceylon cinnamon, and Tunisian neroli unfold, adding a spicy and aromatic warmth that gives the fragrance sophistication and movement. The ginger adds freshness with edge, while cinnamon and neroli create a unique balance between warmth and elegance. As it dries down, ambroxan, Chinese black tea, olibanum, and guaiac wood create a rich and mysterious base. The result is a smoky, woody, and slightly ambery trail with a refined tea nuance that lingers with confidence and elegance. Fresh, bold, and undeniably modern — Marwa is a fragrance crafted for men who seek energy at the top, complexity in the heart, and unforgettable depth in the finish.', ARRAY['Calabrian Bergamot', 'Lemon', 'Sicilian Orange']::text[], ARRAY['Nigerian Ginger', 'Ceylon Cinnamon', 'Tunisian Neroli']::text[], ARRAY['Ambroxan', 'Chinese Black Tea', 'Olibanum', 'Guaiac Wood']::text[], 100, ARRAY['marwa.webp']::text[], TRUE, now())

ON CONFLICT ("slug") DO UPDATE SET "brand" = EXCLUDED."brand", "name" = EXCLUDED."name", "concentration" = EXCLUDED."concentration", "gender" = EXCLUDED."gender", "description" = EXCLUDED."description", "topNotes" = EXCLUDED."topNotes", "middleNotes" = EXCLUDED."middleNotes", "baseNotes" = EXCLUDED."baseNotes", "actualBottleMl" = EXCLUDED."actualBottleMl", "images" = EXCLUDED."images", "isActive" = EXCLUDED."isActive", "updatedAt" = now();

INSERT INTO "ProductVariant" ("id", "productId", "size", "priceBdt", "stockQty", "sku")
SELECT gen_random_uuid()::text, p."id", v."size", v."priceBdt", v."stockQty", v."sku"
FROM "Product" p
CROSS JOIN (VALUES
    ('FULL_BOTTLE'::"VariantSize", 4250, 0, NULL::text),
    ('DECANT_5ML'::"VariantSize", 325, 0, NULL::text),
    ('DECANT_10ML'::"VariantSize", 590, 0, NULL::text)
) AS v("size", "priceBdt", "stockQty", "sku")
WHERE p."slug" = 'marwa-edp'

ON CONFLICT ("productId", "size") DO UPDATE SET "priceBdt" = EXCLUDED."priceBdt", "stockQty" = EXCLUDED."stockQty", "sku" = EXCLUDED."sku";

-- 9pm (MEN)
INSERT INTO "Product" ("id", "slug", "brand", "name", "concentration", "gender", "description", "topNotes", "middleNotes", "baseNotes", "actualBottleMl", "images", "isActive", "updatedAt")
VALUES (gen_random_uuid()::text, 'nine-pm-edp', 'Afnan', '9pm', 'EDP', 'MEN'::"Gender", 'A bold and provocative fragrance that exudes masculinity and sensuality. It opens with a burst of freshness, featuring top notes of bergamot and pear, which provide a crisp and invigorating introduction. As the scent develops, it reveals its heart notes of mint, lavender, and cinnamon, adding depth and complexity to the composition. Overall, 9PM Black is a fragrance that is both powerful and refined, making it perfect for the modern man who wants to make a bold statement. Its distinctive blend of fresh and spicy notes ensures that it stands out from the crowd, making it a timeless classic in the world of men''s fragrances. This fragrance draws inspiration from the iconic Jean-Paul Gaultier Ultra-Male, yet it boasts a unique twist infused with Afnan Perfumes'' special ingredients.', ARRAY['Apple', 'Cinnamon', 'Wild Lavender', 'Bergamot']::text[], ARRAY['Apple', 'Cinnamon', 'Wild Lavender', 'Bergamot']::text[], ARRAY['Vanilla', 'Tonka Bean', 'Amber', 'Patchouli']::text[], 100, ARRAY['nine-pm.webp']::text[], TRUE, now())

ON CONFLICT ("slug") DO UPDATE SET "brand" = EXCLUDED."brand", "name" = EXCLUDED."name", "concentration" = EXCLUDED."concentration", "gender" = EXCLUDED."gender", "description" = EXCLUDED."description", "topNotes" = EXCLUDED."topNotes", "middleNotes" = EXCLUDED."middleNotes", "baseNotes" = EXCLUDED."baseNotes", "actualBottleMl" = EXCLUDED."actualBottleMl", "images" = EXCLUDED."images", "isActive" = EXCLUDED."isActive", "updatedAt" = now();

INSERT INTO "ProductVariant" ("id", "productId", "size", "priceBdt", "stockQty", "sku")
SELECT gen_random_uuid()::text, p."id", v."size", v."priceBdt", v."stockQty", v."sku"
FROM "Product" p
CROSS JOIN (VALUES
    ('FULL_BOTTLE'::"VariantSize", 3800, 0, NULL::text),
    ('DECANT_5ML'::"VariantSize", 300, 0, NULL::text),
    ('DECANT_10ML'::"VariantSize", 560, 0, NULL::text)
) AS v("size", "priceBdt", "stockQty", "sku")
WHERE p."slug" = 'nine-pm-edp'

ON CONFLICT ("productId", "size") DO UPDATE SET "priceBdt" = EXCLUDED."priceBdt", "stockQty" = EXCLUDED."stockQty", "sku" = EXCLUDED."sku";

-- Nocturno Elixir (MEN)
INSERT INTO "Product" ("id", "slug", "brand", "name", "concentration", "gender", "description", "topNotes", "middleNotes", "baseNotes", "actualBottleMl", "images", "isActive", "updatedAt")
VALUES (gen_random_uuid()::text, 'rayhaan-nocturno-elixir-edp', 'Rayhaan', 'Nocturno Elixir', 'EDP', 'MEN'::"Gender", 'Some fragrances enter a room, others change the air entirely. Nocturno Elixir moves through the night like a quiet force, unseen, undeniable, unforgettable. Golden amber twists through shadow, circling a scent made for midnight rituals.  It opens with a clean burst of fresh citrus, giving it a fresher and more uplifting feel right from the start. The heart keeps that classic aromatic blue structure, but feels more open compared to the original. Nocturno Elixir leans versatile, and easier to wear. It is perfect for daily use, warmer weather, or anyone who wants that Bleu de Chanel Exclusif style without being too heavy or dark.', ARRAY['Lemon Zest', 'Bergamot', 'Mint', 'Artemisia']::text[], ARRAY['Geranium', 'Lavender', 'Pineapple']::text[], ARRAY['Sandalwood']::text[], 100, ARRAY['nocturno-elixir.webp']::text[], TRUE, now())

ON CONFLICT ("slug") DO UPDATE SET "brand" = EXCLUDED."brand", "name" = EXCLUDED."name", "concentration" = EXCLUDED."concentration", "gender" = EXCLUDED."gender", "description" = EXCLUDED."description", "topNotes" = EXCLUDED."topNotes", "middleNotes" = EXCLUDED."middleNotes", "baseNotes" = EXCLUDED."baseNotes", "actualBottleMl" = EXCLUDED."actualBottleMl", "images" = EXCLUDED."images", "isActive" = EXCLUDED."isActive", "updatedAt" = now();

INSERT INTO "ProductVariant" ("id", "productId", "size", "priceBdt", "stockQty", "sku")
SELECT gen_random_uuid()::text, p."id", v."size", v."priceBdt", v."stockQty", v."sku"
FROM "Product" p
CROSS JOIN (VALUES
    ('FULL_BOTTLE'::"VariantSize", 2100, 0, NULL::text),
    ('DECANT_5ML'::"VariantSize", 240, 0, NULL::text),
    ('DECANT_10ML'::"VariantSize", 400, 0, NULL::text)
) AS v("size", "priceBdt", "stockQty", "sku")
WHERE p."slug" = 'rayhaan-nocturno-elixir-edp'

ON CONFLICT ("productId", "size") DO UPDATE SET "priceBdt" = EXCLUDED."priceBdt", "stockQty" = EXCLUDED."stockQty", "sku" = EXCLUDED."sku";

-- Daarej Sport (MEN)
INSERT INTO "Product" ("id", "slug", "brand", "name", "concentration", "gender", "description", "topNotes", "middleNotes", "baseNotes", "actualBottleMl", "images", "isActive", "updatedAt")
VALUES (gen_random_uuid()::text, 'rasasi-daarej-sport-edp', 'Rasasi', 'Daarej Sport', 'EDP', 'MEN'::"Gender", 'Daarej Pour Homme Sport by Rasasi is a energetic, fresh flanker to the popular original Daarej line. It shifts from the heavy, sweet-spicy warmth of the original oriental version into a cleaner, marine-infused woody and aromatic profile tailored for warm weather, casual wear, and active settings.', ARRAY['Bergamot', 'Mandarin', 'Pink Pepper']::text[], ARRAY['Cedarwood', 'Iris', 'Spices']::text[], ARRAY['Patchouli', 'Amber', 'Vanilla', 'Musk']::text[], 100, ARRAY['daarej-sport.webp']::text[], TRUE, now())

ON CONFLICT ("slug") DO UPDATE SET "brand" = EXCLUDED."brand", "name" = EXCLUDED."name", "concentration" = EXCLUDED."concentration", "gender" = EXCLUDED."gender", "description" = EXCLUDED."description", "topNotes" = EXCLUDED."topNotes", "middleNotes" = EXCLUDED."middleNotes", "baseNotes" = EXCLUDED."baseNotes", "actualBottleMl" = EXCLUDED."actualBottleMl", "images" = EXCLUDED."images", "isActive" = EXCLUDED."isActive", "updatedAt" = now();

INSERT INTO "ProductVariant" ("id", "productId", "size", "priceBdt", "stockQty", "sku")
SELECT gen_random_uuid()::text, p."id", v."size", v."priceBdt", v."stockQty", v."sku"
FROM "Product" p
CROSS JOIN (VALUES
    ('FULL_BOTTLE'::"VariantSize", 2000, 0, NULL::text),
    ('DECANT_5ML'::"VariantSize", 200, 0, NULL::text),
    ('DECANT_10ML'::"VariantSize", 365, 0, NULL::text)
) AS v("size", "priceBdt", "stockQty", "sku")
WHERE p."slug" = 'rasasi-daarej-sport-edp'

ON CONFLICT ("productId", "size") DO UPDATE SET "priceBdt" = EXCLUDED."priceBdt", "stockQty" = EXCLUDED."stockQty", "sku" = EXCLUDED."sku";
