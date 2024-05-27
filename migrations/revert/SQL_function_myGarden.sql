-- Revert ojardin:SQL_function_myGarden from pg

BEGIN;

DROP FUNCTION get_user_and_products(INT);

COMMIT;
