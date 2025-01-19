-- Populate the categories table
INSERT INTO categories (nom) VALUES
('Electronics'),
('Clothing'),
('Books'),
('Home Appliances');

-- Populate the produits table
INSERT INTO produits (nom, prix, quantité_en_stock, categorie_id) VALUES
('Smartphone', 699.99, 50, 1),
('Laptop', 1199.99, 30, 1),
('T-shirt', 19.99, 100, 2),
('Novel', 14.99, 200, 3),
('Blender', 49.99, 20, 4);

-- Populate the fournisseurs table
INSERT INTO fournisseurs (nom) VALUES
('TechSupplier Inc.'),
('FashionHub Ltd.'),
('BookWorld'),
('ApplianceDepot');

-- Populate the clients table
INSERT INTO clients (prenom, nom, addresse) VALUES
('Alice', 'Smith', '123 Maple Street'),
('Bob', 'Johnson', '456 Oak Avenue'),
('Charlie', 'Brown', '789 Pine Road'),
('Diana', 'Adams', '101 Elm Boulevard');

-- Populate the commandes table
INSERT INTO commandes (id_client,date_commande) VALUES
(1,"2023-01-15"),
(2,"2023-05-78"),
(3,"2025-01-29"),
(4,"2020-11-13");


-- Populate the produits_commandes table
INSERT INTO produits_commandes (id_commande, id_produit,quantite) VALUES
(1, 1,1),
(1, 3,2),
(2, 2,1),
(3, 4, 5),
(4, 5, 4);

-- Populate the produits_fournisseurs table
INSERT INTO produits_fournisseurs (id_produit, id_fournisseur) VALUES
(1, 1),
(2, 1),
(3, 2),
(4, 3),
(5, 4);
