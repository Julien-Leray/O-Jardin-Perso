-- Deploy ojardin:update_plantation_date_value to pg

BEGIN;

UPDATE product SET plantation_date = '{3, 4, 5}' WHERE name = 'Concombre';
UPDATE product SET plantation_date = '{2, 3, 4, 5, 6, 7, 8, 9}' WHERE name = 'Radis';
UPDATE product SET harvest_date = '{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11}' WHERE name = 'Radis';
UPDATE product SET plantation_date = '{1, 2, 3}' WHERE name = 'Aubergine';
UPDATE product SET harvest_date = '{7, 8, 9}' WHERE name = 'Aubergine';
UPDATE product SET plantation_date = '{9, 10, 11}' WHERE name = 'Framboise';
UPDATE product SET harvest_date = '{6, 7, 8, 9}' WHERE name = 'Framboise';

COMMIT;
