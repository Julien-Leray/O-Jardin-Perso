-- Revert ojardin:insertion_data_v1 from pg

BEGIN;

TRUNCATE TABLE "user" CASCADE;
TRUNCATE TABLE "product" CASCADE;
TRUNCATE TABLE "category" CASCADE;
TRUNCATE TABLE "tutorial" CASCADE;
TRUNCATE TABLE "user_has_product" CASCADE;
TRUNCATE TABLE "user_plant_product" CASCADE;
TRUNCATE TABLE "user_has_tutorial" CASCADE;

COMMIT;
