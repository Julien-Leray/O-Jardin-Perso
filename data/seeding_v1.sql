BEGIN;

INSERT INTO category(name) VALUES 
('Fruit'), 
('Vegetable');

INSERT INTO product(latin_name, name, picture, plantation_date, harvest_date, soil_type, diseases, watering_frequency, category_id, sowing_type, description) VALUES 
('Cucurbita Pepo', 'Courgette', '../public/pictures/Courgette.jpg', '{4, 5}', '{7, 8, 9}', 'Sols riches en humus, légers, profonds et frais', 'oïdium, mildiou, pourriture grise, pucerons', 'Tous les jours', 2, 'jdhbgiecv', 'La courgette est une plante herbacée de la famille des cucurbitacées. Elle existe sous la forme coureuse ou non coureuse (la dernière est la plus courante). Les courgettes sont cultivées pour leur fruit, qui se consomme comme un légume. La fleur de courgette est également comestible et se déguste farcie ou en beignet. Il est conseillé de récolter les fleurs mâles, afin de ne pas stopper le développement de la plante. En fonction de la variété, le fruit peut être allongé ou rond et la peau de couleurs différentes (vert foncé, vert clair strié de blanc, jaune). La courgette est faible en calories et riche en nutriments. Sa chair tendre à la saveur douce et sucrée.'),
('Cichorium endivia', 'Endive', '../public/pictures/Endive.jpg', '{4, 5}', '{9, 10, 11}', 'Sols riches et humifères', 'mouche de l''endive, vers gris', 'Arrosage régulier', 2, 'jegbvaiyvuyoav', 'L''endive est une plante potagère dont on consomme les feuilles. Ces feuilles sont entières, non lobées et pointues. Il s''agit d''une espèce de chicorée consommée par l''homme. La chicorée sauvage est une espèce allogame bisannuelle ayant une bonne résistance au froid. Comme les chicorées sauvages, c''est une plante herbacée robuste, plus ou moins amère. Les inflorescences sont des capitules formés de fleurs bleues. Les fruits (akènes) sont surmontés d''une couronne de poils celluleux très courts. La racine est pivotante, riche en inuline.'),
('Helianthus tuberosus', 'Topinambour', '../public/pictures/Topinambour.jpg', '{2, 3}', '{10, 11, 12, 1}', 'Sols non humide', 'oïdium, lapins, chevreuils, campagnols, limaces', 'Arrosage modéré', 2, 'sjgcvfu ez', 'Le topinambour, appelé artichaut de Jérusalem, truffe du Canada ou soleil vivace, est une espèce de plante à fleurs de la famille des astéracées, du genre Helianthus, le même genre que le tournesol. Il est cultivé pour ses grands tubercules riches en inuline, consommés comme légume. C''est une plante vivace, décorative, et pour ses tubercules comestibles. C''est une plante vivace, caduc de trois mètres, résistant au froid, qui devient envahissante à cause de ses rhizomes tubérisés. Elle peut atteindre jusqu''à trois mètres de haut, avec de fortes tiges, très robustes.');








COMMIT;
