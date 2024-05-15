BEGIN;

INSERT INTO category(name) VALUES 
('Fruit'), 
('Vegetable');

INSERT INTO product(latin_name, name, description, picture, plantation_date, harvest_date, soil_type, diseases, watering_frequency, category_id) VALUES 
('Cucurbita Pepo', 'Courgette', 'La courgette est une plante herbacée de la famille des cucurbitacées. Elle existe sous la forme coureuse ou non coureuse (la dernière est la plus courante). Les courgettes sont cultivées pour leur fruit, qui se consomme comme un légume. La fleur de courgette est également comestible et se déguste farcie ou en beignet. Il est conseillé de récolter les fleurs mâles, afin de ne pas stopper le développement de la plante. En fonction de la variété, le fruit peut être allongé ou rond et la peau de couleurs différentes (vert foncé, vert clair strié de blanc, jaune). La courgette est faible en calories et riche en nutriments. Sa chair tendre à la saveur douce et sucrée', ''  );


INSERT INTO tutorial(title, article, picture, theme) VALUES 
();


COMMIT;
