-- Revert ojardin:insertion_data_v1 from pg

BEGIN;

TRUNCATE TABLE "user";
TRUNCATE TABLE "product";
TRUNCATE TABLE "category";

COMMIT;
