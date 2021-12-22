-- Insert Tags
INSERT INTO `tag` (`id`,`name`) VALUES (1,'VEGAN');
INSERT INTO `tag` (`id`,`name`) VALUES (2,'RENEWABLE');
INSERT INTO `tag` (`id`,`name`) VALUES (3,'REUSABLE');
INSERT INTO `tag` (`id`,`name`) VALUES (4,'LOCALLY_ABUNDANT');
INSERT INTO `tag` (`id`,`name`) VALUES (5,'BY_PRODUCT');
INSERT INTO `tag` (`id`,`name`) VALUES (6,'HOME_COMPOSTABLE');


-- Insert Users
INSERT INTO `user` (`id`,`email`,`password`,`firstname`,`lastname`,`organisation`,`is_admin`,`img_path`,`verified`)
VALUES (1,'Jack@hva.nl','$2a$31$sXYEHMGpZv5lFTy41QcVxOejoVAtaa.gubWx7qnTLfg5OJTGLwvVa','Jack','Foo','Github',0,NULL,1);

-- Password: Test1234
INSERT INTO `user` (`id`,`email`,`password`,`firstname`,`lastname`,`organisation`,`is_admin`,`img_path`,`verified`)
VALUES (2,'klaas@hva.nl','$2a$31$Runus/pXkM4LAKb//SMz6ON/ZDsEuEm.UN6oc1VXzauA5LjR33Lou','Klaas','Ipsum','Github',1,NULL,1);

INSERT INTO `user` (`id`,`email`,`password`,`firstname`,`lastname`,`organisation`,`is_admin`,`img_path`,`verified`)
VALUES (3,'johndoe@test.com','$2a$31$WRekP81zmCgEQBL9QNRl4.cNNhFWm3XqA7YwbYzZtp1djiwI7pMfW','John','Doe','Github',0,NULL,0);

-- Insert Ingredients
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (50,'Gelatine','Powder');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (51,'Glycerine','Liquid');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (52,'Water ','Liquid');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (53,'Potato Starch','Powder');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (54,'White Vinegar','Liquid');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (55,'Dried and ground egg shells','Solid');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (56,'Sodium Alginate','Powder');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (57,'Sunflower Oil','Liquid');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (58,'Agar','Powder');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (59,'CalciumChloride','Liquid');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (60,'Alum','Powder');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (61,'Silk','Solid');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (62,'Denatured alcohol 96%','Liquid');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (63,'Coffee Filters','Solid');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (64,'Sugar','Powder');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (66,'Coconut Oil','Liquid');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (67,'Beeswax','Liquid');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (68,'Bouquet of withered flowers','Solid');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (69,'Overripe Mango','Fruit');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (70,'Salt','Powder');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (71,'Vegetable Oil','Liquid');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (72,'Banana Peels','Fruit');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (73,'Soda Ash','Powder');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (74,'Fresh Uncooked Fish Skins','Solid');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (75,'Dish washing soap','Liquid');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (76,'Citric Acid','Liquid');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (77,'Red Cabage Dye','Solid');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (78,'Yellow Onion Skins ','Solid');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (79,'Madder Roots','Solid');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (94,'Fresh uncooked fish skins','Salmon');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (229,'Sugar','Cane');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (238,'Glycerine','plant-based');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (239,'Acorn','Caps');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (240,'gallnuts','oak galls');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (241,'Oak galls','Gall nuts');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (242,'wool','muslin');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (247,'Red Cabbage','Shredded');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (248,'Clove','whole');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (250,'Fairy dust','For real');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (268,'Unicorn hair','pinnk');
INSERT INTO `ingredient` (`id`,`name`,`type`) VALUES (269,'Kombu','algae');

-- Insert Materials
INSERT INTO `material` (`sequence_number`,`name`,`steps`,`changes`,`status`,`type`,`creation_date`,`qrcode_url`,`overview_url`,`user_id`,`parent_sequence_number`, `reference`)
VALUES (14,'Biosugar','Add sugar to the mix','https://bit.ly/3jR5Scx','DRAFT','MICROBIAL','2020-11-13','https://bit.ly/3jR5Scx',NULL,1,NULL, 'By John Doe - Foo bar - 2019');

INSERT INTO `material` (`sequence_number`,`name`,`steps`,`changes`,`status`,`type`,`creation_date`,`qrcode_url`,`overview_url`,`user_id`,`parent_sequence_number`, `reference`)
VALUES (26,'Biofoam','Cook|Pot|Scale|Spoons|Whisk|Lego sheet|Egg holders','https://bit.ly/37o04DX','DRAFT','MICROBIAL','2020-11-14','https://bit.ly/37o04DX',NULL,1,NULL, 'By John Doe - Foo bar - 2019');

INSERT INTO `material` (`sequence_number`,`name`,`steps`,`changes`,`status`,`type`,`creation_date`,`qrcode_url`,`overview_url`,`user_id`,`parent_sequence_number`, `reference`)
VALUES (42,'Glas','Verwarm het zand','https://bit.ly/3jR5Scx','DRAFT','ANIMAL_BASED','2020-11-16','https://bit.ly/3jR5Scx',NULL,1,NULL, 'By John Doe - Foo bar - 2019');

INSERT INTO `material` (`sequence_number`,`name`,`steps`,`changes`,`status`,`type`,`creation_date`,`qrcode_url`,`overview_url`,`user_id`,`parent_sequence_number`, `reference`)
VALUES (84,'Biofoam','Preparation|Mixing and dissolving the ingredients|Cooking the ingredients, creating foam|Casting the foam','https://bit.ly/37o04DX','PUBLISHED','FUNGAL','2020-11-16','https://bit.ly/37o04DX',NULL,1,NULL, 'By John Doe - Foo bar - 2019');

INSERT INTO `material` (`sequence_number`,`name`,`steps`,`changes`,`status`,`type`,`creation_date`,`qrcode_url`,`overview_url`,`user_id`,`parent_sequence_number`, `reference`)
VALUES (85,'Gelatin Foil','Preparation|Mixing and dissolving the ingredients|Cooking the ingredients|Casting','https://bit.ly/32Q3fl3','PUBLISHED','ANIMAL_BASED','2020-11-16','https://bit.ly/32Q3fl3',NULL,1,NULL, 'By John Doe - Foo bar - 2019');

INSERT INTO `material` (`sequence_number`,`name`,`steps`,`changes`,`status`,`type`,`creation_date`,`qrcode_url`,`overview_url`,`user_id`,`parent_sequence_number`, `reference`)
VALUES (86,'Kombucha Scoby ','Create a sterile environment|Prepare the sugary tea|Mix in the kombucha and seal|Let it grow|Use your SCOBY','https://bit.ly/35AOgwO','PUBLISHED','FUNGAL','2020-11-16','https://bit.ly/35AOgwO',NULL,1,NULL, 'By John Doe - Foo bar - 2019');

INSERT INTO `material` (`sequence_number`,`name`,`steps`,`changes`,`status`,`type`,`creation_date`,`qrcode_url`,`overview_url`,`user_id`,`parent_sequence_number`, `reference`)
VALUES (87,'Mango Leather','Preparation|Mixing the ingredients and activating the starch|Casting and dehydrating in the oven|Air drying','https://bit.ly/36HQytn','PUBLISHED','PLANT_BASED','2020-11-16','https://bit.ly/36HQytn',NULL,1,NULL, 'By John Doe - Foo bar - 2019');

INSERT INTO `material` (`sequence_number`,`name`,`steps`,`changes`,`status`,`type`,`creation_date`,`qrcode_url`,`overview_url`,`user_id`,`parent_sequence_number`, `reference`)
VALUES (89,'Starch Rubber','Preparation|Mixing and dissolving the ingredients|Cooking the ingredients|Casting','https://bit.ly/3kGyVPz','PUBLISHED','ANIMAL_BASED','2020-11-16','https://bit.ly/3kGyVPz',NULL,3,NULL, 'By John Doe - Foo bar - 2019');

INSERT INTO `material` (`sequence_number`,`name`,`steps`,`changes`,`status`,`type`,`creation_date`,`qrcode_url`,`overview_url`,`user_id`,`parent_sequence_number`, `reference`)
 VALUES (90,'Flower Paper','Drying the flowers|Separating and boiling|Option A: Pounding|Option B: Blending|Moulding slurry onto the screen|Drying and pressing|Saving the boiling liquid as dye','https://bit.ly/2UvtIPZ','PUBLISHED','PLANT_BASED','2020-11-16','https://bit.ly/2UvtIPZ',NULL,3,NULL, 'By John Doe - Foo bar - 2019');

INSERT INTO `material` (`sequence_number`,`name`,`steps`,`changes`,`status`,`type`,`creation_date`,`qrcode_url`,`overview_url`,`user_id`,`parent_sequence_number`, `reference`)
VALUES (230,'Mango Leather','Preparation|Mixing the ingredients and activating the starch|Casting and dehydrating in the oven|Air drying','https://bit.ly/36HQytn','DRAFT','PLANT_BASED','2020-12-08','https://bit.ly/36HQytn',NULL,1,NULL, 'By John Doe - Foo bar - 2019');

INSERT INTO `material` (`sequence_number`,`name`,`steps`,`changes`,`status`,`type`,`creation_date`,`qrcode_url`,`overview_url`,`user_id`,`parent_sequence_number`, `reference`)
VALUES (231,'Flower Paper','Drying the flowers|Separating and boiling|Option A: Pounding|Option B: Blending|Moulding slurry onto the screen|Drying and pressing|Saving the boiling liquid as dye','https://bit.ly/2UvtIPZ','DRAFT','PLANT_BASED','2020-12-08','https://bit.ly/2UvtIPZ',NULL,1,NULL, 'By John Doe - Foo bar - 2019');

INSERT INTO `material` (`sequence_number`,`name`,`steps`,`changes`,`status`,`type`,`creation_date`,`qrcode_url`,`overview_url`,`user_id`,`parent_sequence_number`, `reference`)
VALUES (232,'Flower Paperr','Drying the flowers|Separating and boiling|Option A: Pounding|Option B: Blending|Moulding slurry onto the screen|Drying and pressing|Saving the boiling liquid as dye','https://bit.ly/2UvtIPZ','DRAFT','PLANT_BASED','2020-12-08','https://bit.ly/2UvtIPZ',NULL,1,NULL, 'By John Doe - Foo bar - 2019');

INSERT INTO `material` (`sequence_number`,`name`,`steps`,`changes`,`status`,`type`,`creation_date`,`qrcode_url`,`overview_url`,`user_id`,`parent_sequence_number`, `reference`)
 VALUES (233,'Flower Paper','Drying the flowers|Separating and boiling|Option A: Pounding|Option B: Blending|Moulding slurry onto the screen|Drying and pressing|Saving the boiling liquid as dye','https://bit.ly/2UvtIPZ','DRAFT','PLANT_BASED','2020-12-08','https://bit.ly/2UvtIPZ',NULL,1,NULL, 'By John Doe - Foo bar - 2019');

INSERT INTO `material` (`sequence_number`,`name`,`steps`,`changes`,`status`,`type`,`creation_date`,`qrcode_url`,`overview_url`,`user_id`,`parent_sequence_number`, `reference`)
VALUES (234,'Kombucha Scoby 2','Create a sterile environment|Prepare the sugary tea|Mix in the kombucha and seal|Let it grow|Use your SCOBY','https://bit.ly/35AOgwO','DRAFT','FUNGAL','2020-12-09','https://bit.ly/35AOgwO',NULL,1,NULL, 'By John Doe - Foo bar - 2019');

-- Insert MaterialTags
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (14,1);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (26,1);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (86,1);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (87,1);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (90,1);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (26,2);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (42,2);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (84,2);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (85,2);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (86,2);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (87,2);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (90,2);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (14,3);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (26,3);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (84,3);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (85,3);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (86,3);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (87,3);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (89,3);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (90,3);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (42,4);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (234,4);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (86,5);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (87,5);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (89,5);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (90,5);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (84,6);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (85,6);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (87,6);
INSERT INTO `material_has_tag` (`sequence_number`,`id`) VALUES (90,6);

-- Insert MaterialIngredients

INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (84,50,12);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (84,51,12);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (84,52,150);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (84,75,10);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (85,50,24);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (85,51,18);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (85,52,200);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (86,52,330);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (86,62,10);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (86,63,2);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (86,64,30);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (87,53,10);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (87,54,8);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (87,69,1);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (87,70,5);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (87,71,10);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (89,50,50);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (89,51,100);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (89,52,100);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (89,53,50);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (89,54,15);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (90,52,10);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (90,63,1);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (90,68,1);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (90,73,15);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (230,53,10);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (230,54,8);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (230,69,1);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (230,70,5);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (230,71,10);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (231,52,10);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (231,63,1);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (231,68,1);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (231,73,15);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (232,52,10);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (232,63,1);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (232,68,1);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (232,73,15);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (233,52,10);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (233,63,1);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (233,68,1);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (233,73,15);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (234,52,330);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (234,62,10);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (234,63,2);
INSERT INTO `material_has_ingredient` (`sequence_number`,`id`,`amount`) VALUES (234,64,30);

-- Default app config
INSERT INTO `app_config` (`key_name`, `value`) VALUES ('email_suffix', 'hva.nl');
INSERT INTO `app_config` (`key_name`, `value`) VALUES ('organisation', 'Github');
INSERT INTO `app_config` (`key_name`, `value`) VALUES ('logo_path', 'assets/images/HvAlogo.png');
