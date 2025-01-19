CREATE DATABASE IF NOT EXISTS avion;
USE avion;

CREATE TABLE IF NOT EXISTS categories (
	id INT auto_increment primary key,
  nom VARCHAR (100) );
    
CREATE TABLE if not exists produits (
	id INT auto_increment primary key,
  nom VARCHAR(100) NOT NULL,
  prix double NOT NULL,
  quantité_en_stock int NOT NULL DEFAULT 0,
  categorie_id int NOT NULL,
  foreign key(categorie_id) references categories(id)) ;

CREATE TABLE IF NOT EXISTS fournisseurs(
	id int auto_increment primary key,
  nom VARCHAR(100));
    
CREATE TABLE IF NOT exists clients(
	id int auto_increment primary key,
  prenom varchar(50) NOT NULL,
  nom varchar(50) NOT NULL,
  addresse varchar(100));
    
CREATE TABLE IF NOT EXISTS commandes(
	id int auto_increment primary key,
  id_client int NOT NULL,
  date_commande date NOT NULL,
  foreign key (id_client) references clients(id));
  
CREATE table if not exists produits_commandes(
	id int auto_increment primary key,
  id_commande int NOT NULL,
  id_produit int NOT NULL,
  quantite int NOT NULL DEFAULT 1,
  foreign key (id_commande)references commandes(id),
  foreign key (id_produit)references produits(id));
    
CREATE table if not exists produits_fournisseurs(
	id int auto_increment primary key,
  id_produit int NOT NULL,
  id_fournisseur int NOT NULL,
  foreign key (id_produit)references produits(id),
  foreign key (id_fournisseur)references fournisseurs(id));
    
