-- Revert ojardin:api_pictures from pg

BEGIN;

-- Revert script for removing /api from image paths
UPDATE product
SET picture = SUBSTRING(picture FROM 5)
WHERE picture LIKE '/api/pictures/%';

UPDATE tutorial
SET picture = SUBSTRING(picture FROM 5)
WHERE picture LIKE '/api/pictures/%';

COMMIT;
