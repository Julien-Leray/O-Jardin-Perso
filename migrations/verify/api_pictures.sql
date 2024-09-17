-- Verify ojardin:api_pictures on pg

BEGIN;

-- Verify script to ensure /api is added to image paths
SELECT 1
FROM product
WHERE picture NOT LIKE '/api/pictures/%'
LIMIT 1;

SELECT 1
FROM tutorial
WHERE picture NOT LIKE '/api/pictures/%'
LIMIT 1;

ROLLBACK;
