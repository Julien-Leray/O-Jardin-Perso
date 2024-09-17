-- Deploy ojardin:api_pictures to pg

BEGIN;

UPDATE product
SET picture = '/api' || picture
WHERE picture LIKE '/pictures/%';

UPDATE tutorial
SET picture = '/api' || picture
WHERE picture LIKE '/pictures/%';


COMMIT;
