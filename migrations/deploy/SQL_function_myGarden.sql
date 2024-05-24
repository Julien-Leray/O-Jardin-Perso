-- Deploy ojardin:SQL_function_myGarden to pg

BEGIN;

CREATE OR REPLACE FUNCTION get_user_and_products(userId INT)
RETURNS JSON AS $$
  SELECT json_build_object(
    'user', json_build_object(
        'id', u.id,
        'email', u.email,
        'firstname', u.firstname,
        'lastname', u.lastname,
        'address', u.address,
        'zip_code', u.zip_code,
        'city', u.city,
        'watering_alert', u.watering_alert,
        'forecast_alert', u.forecast_alert
    ),
    'products', json_agg(
        json_build_object(
            'id', p.id,
            'latin_name', p.latin_name,
            'name', p.name,
            'description', p.description,
            'picture', p.picture,
            'plantation_date', p.plantation_date,
            'harvest_date', p.harvest_date,
            'soil_type', p.soil_type,
            'diseases', p.diseases,
            'watering_frequency', p.watering_frequency,
            'sowing_tips', p.sowing_tips,
            'category_id', p.category_id
        )
    )
  )
  FROM 
    "user" u
  JOIN 
    "user_has_product" uhp ON u.id = uhp.user_id
  JOIN 
    "product" p ON uhp.product_id = p.id
  WHERE 
    u.id = user_id
  GROUP BY 
    u.id;
$$ LANGUAGE SQL;

COMMIT;
