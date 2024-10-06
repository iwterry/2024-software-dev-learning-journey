-- ---------------------------------------------
-- DATA MODELING
-- ---------------------------------------------
-- steps in data modeling:
--  - understand the requirements
--  - build a conceptual model
--    - represents the entities and their relationships
--  - build a logical model
--    - a logical model is independent of database technnologies; it is an abstact data model/structure for storing data that shows the entities and their relationships
--  - build a physical model
--    - a physical model is the implementation of a logical model for a specific database technology


-- ----------------------------------------------
-- FOREIGN KEY CONSTRAINTS
-- ----------------------------------------------
--  - ON UPDATE
--    - RESTRICT
--    - CASCADE
--    - SET NULL
--  - ON DELETE
--    - RESTRICT
--    - CASCADE
--    - SET NULL


-- --------------------------------------------------
-- FIRST NORMAL FORM
-- --------------------------------------------------

-- each cell in a row should have a single value and there can be no repeated columns


-- ---------------------------------------------------
-- SECOND NORMAL FORM
-- ---------------------------------------------------

-- every table should describe one entity, and every column in that table should describe that entity


-- -----------------------------------------------------
-- THIRD NORMAL FORM
-- ----------------------------------------------------

-- a column in a table should not be derived from other columns


-- -------------------------------------------------------
--  CREATING AND DROPPING DATABASES
-- -------------------------------------------------------
CREATE DATABASE IF NOT EXISTS sql_store2;

DROP DATABASE IF EXISTS sql_store2;


-- -------------------------------------------
-- CREATING AND DROPPING TABLES
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS sql_store2.customers (
	customer_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    points INT NOT NULL DEFAULT 0,
	email VARCHAR(255) NOT NULL UNIQUE
);

DROP TABLE IF EXISTS sql_store2.customers;


-- -----------------------------------------
-- ALTERING TABLES
-- ----------------------------------------
-- add a column
ALTER TABLE sql_store2.customers
ADD last_name VARCHAR(50) NOT NULL;
	-- NOTE: last_name appears as the last columnn (which would be after email column)

-- remove a column
ALTER TABLE sql_store2.customers
DROP last_name;

ALTER TABLE sql_store2.customers
ADD last_name VARCHAR(50) NOT NULL AFTER first_name;
	-- NOTE: last_name appears directly after first_name column
    
ALTER TABLE sql_store2.customers
DROP last_name;

-- add, modify, and remove columns using a single ALTER statement
ALTER TABLE sql_store2.customers
ADD last_name VARCHAR(50) NOT NULL AFTER first_name,
ADD city VARCHAR(50) NOT NULL,
MODIFY COLUMN first_name VARCHAR(50) DEFAULT '',   -- note that this removed the non-null constraint on the first_name column
DROP points;


-- ----------------------------------------------------
-- CREATING RELATIONSHIPS
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS sql_store2.orders (
	order_id INT PRIMARY KEY,
    customer_id INT NOT NULL,
    FOREIGN KEY fk_orders_customers (customer_id)
		REFERENCES sql_store2.customers(customer_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

	-- NOTE: fk_orders_customers is the name of the index/constraint and providing it is optional

-- possible options for ON UPDATE:
--   - RESTRICT
--   - CASCADE
--   - SET NULL
--  possible options for ON DELETE:
--   - RESTRICT
--   - CASCADE
--   - SET NULL

-- --------------------------------------------------
-- ALTERING PRIMARY AND FOREIGN KEY CONSTRAINTS
-- --------------------------------------------------
-- NOTE: the following ALTER TABLE statement does not work because the name of the constraint is not fk_orders_customers:
ALTER TABLE sql_store2.orders
DROP FOREIGN KEY fk_orders_customers;

-- NOTE: in order to drop the foreign key constraint, you need to know the name of the constraint;
--      you can use the following statement to get the name of the constraint;
SHOW CREATE TABLE sql_store2.orders;
	-- NOTE: the name of the constraint is orders_ibfk_1

ALTER TABLE sql_store2.orders
DROP FOREIGN KEY orders_ibfk_1;

ALTER TABLE sql_store2.orders
ADD FOREIGN KEY fk_orders_customers (customer_id)
	REFERENCES sql_store2.customers(customer_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
    
ALTER TABLE sql_store2.orders
DROP PRIMARY KEY;

ALTER TABLE sql_store2.orders
ADD PRIMARY KEY (order_id);
    
    
-- --------------------------------------------
-- CHARACTER SETS AND COLLATIONS
-- --------------------------------------------

-- show the different character sets that this verison of MySQL supports
SHOW CHARSET;

-- a collation is basically a bunch of rules that determine how the characters in a given language are sorted

-- CREATE DATABASE <database-name> CHARACTER SET <character-set-name>;
-- ALTER DATABASE <database-name> CHARACTER SET <character-set-name>;
-- CREATE TABLE <table-name> (...) CHARACTER SET <character-set-name>;
-- ALTER TABLE <table-name> CHARACTER SET <character-set-name>;


-- -----------------------------------
-- STORAGE ENGINES
-- -----------------------------------
-- MySQL supports several database engines; a database engine determines how the data is stored and what features are available

-- show the list of database engines
SHOW ENGINES;

-- ALTER TABLE <table-name> ENGINE = <engine-name>;