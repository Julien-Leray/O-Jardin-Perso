-- Deploy ojardin:isAdmin_statut to pg

BEGIN;

ALTER TABLE "user"
ADD COLUMN "is_admin" BOOLEAN DEFAULT false;

INSERT INTO "user" ("email", "password", "firstname", "lastname", "is_admin") VALUES
('admin@admin.com', '$2b$10$E1JY.WUauF0C8/HkUxFov.14p6gVDM6DQrzQMA2Ru1lKgT6ugyg8S', 'admin', 'admin', 'true');

COMMIT;
