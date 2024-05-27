-- Revert ojardin:insertion_data_v1 from pg

BEGIN;

TRUNCATE TABLE "user" CASCADE;
TRUNCATE TABLE "product" CASCADE;
TRUNCATE TABLE "category" CASCADE;

COMMIT;
