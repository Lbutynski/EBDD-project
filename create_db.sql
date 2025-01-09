CREATE DATABASE IF NOT EXISTS avion;
USE avion;

CREATE TABLE IF NOT EXISTS categories (
	id INT auto_increment primary key,
  nom VARCHAR (100) );
    
CREATE TABLE if not exists produits (
	id INT auto_increment primary key,
  nom VARCHAR(100) ,
  prix double ,
  quantité_en_stock int,
  categorie_id int,
  foreign key(categorie_id) references categories(id)) ;

CREATE TABLE IF NOT EXISTS fournisseurs(
	id int auto_increment primary key,
  nom VARCHAR(100));
    
CREATE TABLE IF NOT exists clients(
	id int auto_increment primary key,
  prenom varchar(50),
  nom varchar(50),
  addresse varchar(100));
    
CREATE TABLE IF NOT EXISTS commandes(
	id int auto_increment primary key,
  id_client int,
  foreign key (id_client) references clients(id));
  
CREATE table if not exists produits_commandes(
	id int auto_increment primary key,
  id_commande int,
  id_produit int,
  foreign key (id_commande)references commandes(id),
  foreign key (id_produit)references produits(id));
    
CREATE table if not exists produits_fournisseurs(
	id int auto_increment primary key,
  id_produit int,
  id_fournisseur int,
  foreign key (id_produit)references produits(id),
  foreign key (id_fournisseur)references fournisseurs(id));
    
