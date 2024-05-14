-- Revert ojardin:init from pg

BEGIN;

DROP TABLE "user_has_tutorial", "user_plant_product", "user_has_product", "tutorial", "user", "product", "category";

DROP DOMAIN "zipcode_fr", "email_format";

COMMIT;
