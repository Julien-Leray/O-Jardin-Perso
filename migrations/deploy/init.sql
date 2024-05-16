-- Deploy ojardin:init to pg

BEGIN;

CREATE DOMAIN "email_format" AS text
CHECK (value ~ '(?:[a-z0-9!#$%&''*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&''*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])');

CREATE DOMAIN zipcode_fr AS text
CHECK (
  value ~ '^0[1-9]\d{3}$' -- départements metropole de 01 à 09
  OR value ~ '^[1-8]\d{4}$' -- départements metropole de 10 à 89
  OR value ~ '^9[0-5]\d{3}$' -- départements metropole de 90 à 95
  OR value ~ '^97[0-5]\d{2}$' -- DOM
  OR value ~ '^98[6-8]\d{2}$' -- TOM
  OR value ~ '^98000$' -- Monaco
);

CREATE TABLE "category" (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" text NOT NULL UNIQUE,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz
);

CREATE TABLE "product" (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "latin_name" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "picture" text NOT NULL,
  "plantation_date" int[] NOT NULL,
  "harvest_date" int[] NOT NULL,
  "soil_type" text NOT NULL,
  "diseases" text NOT NULL,
  "watering_frequency" text NOT NULL,
  "sowing_tips" text NOT NULL,
  "category_id" int NOT NULL REFERENCES "category"("id"),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz
);

CREATE TABLE "user" (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "email" email_format NOT NULL UNIQUE ,
  "password" text NOT NULL,
  "firstname" text NOT NULL,
  "lastname" text NOT NULL,
  "address" text NOT NULL,
  "zip_code" zipcode_fr NOT NULL,
  "city" text NOT NULL,
  "watering_alert" BOOLEAN DEFAULT false,
  "forecast_alert" BOOLEAN DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz
);

CREATE TABLE "tutorial" (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "title" text NOT NULL UNIQUE,
  "article" text NOT NULL,
  "picture" text NOT NULL,
  "theme" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz
);

CREATE TABLE "user_has_product" (
  "user_id" int NOT NULL REFERENCES "user"("id"),
  "product_id" int NOT NULL REFERENCES "product"("id")
);

CREATE TABLE "user_plant_product" (
  "user_id" int NOT NULL REFERENCES "user"("id"),
  "product_id" int NOT NULL REFERENCES "product"("id"),
  "quantity" int,
  "position" int[] 
);

CREATE TABLE "user_has_tutorial" (
  "user_id" int NOT NULL REFERENCES "user"("id"),
  "tutorial_id" int NOT NULL REFERENCES "tutorial"("id")
);

COMMIT;

