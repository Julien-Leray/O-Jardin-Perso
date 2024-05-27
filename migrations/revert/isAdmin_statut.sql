-- Revert ojardin:isAdmin_statut from pg

BEGIN;

ALTER TABLE "user"
DROP COLUMN "is_admin";

DELETE FROM "user" WHERE "email" = 'admin@admin.com';

COMMIT;
