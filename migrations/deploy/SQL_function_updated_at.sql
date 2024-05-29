-- Deploy ojardin:SQL_function_updated_at to pg

BEGIN;

CREATE OR REPLACE FUNCTION maj_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trig_maj_updated_at_category
BEFORE UPDATE ON "category"
FOR EACH ROW
EXECUTE FUNCTION maj_updated_at();

CREATE TRIGGER trig_maj_updated_at_product
BEFORE UPDATE ON "product"
FOR EACH ROW
EXECUTE FUNCTION maj_updated_at();

CREATE TRIGGER trig_maj_updated_at_user
BEFORE UPDATE ON "user"
FOR EACH ROW
EXECUTE FUNCTION maj_updated_at();

CREATE TRIGGER trig_maj_updated_at_tutorial
BEFORE UPDATE ON "tutorial"
FOR EACH ROW
EXECUTE FUNCTION maj_updated_at();


COMMIT;
