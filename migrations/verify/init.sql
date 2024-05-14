-- Verify ojardin:init on pg

BEGIN;

SELECT * FROM "category" WHERE FALSE;
SELECT * FROM "product" WHERE FALSE;
SELECT * FROM "user" WHERE FALSE;
SELECT * FROM "tutorial" WHERE FALSE;
SELECT * FROM "user_has_product" WHERE FALSE;
SELECT * FROM "user_plant_product" WHERE FALSE;
SELECT * FROM "user_has_tutorial" WHERE FALSE;

ROLLBACK;
