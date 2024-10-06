-- --------------------------------------
-- CREATING A USER
-- --------------------------------------

CREATE USER IF NOT EXISTS john IDENTIFIED BY 'password';

-- syntax: CREATE USER IF NOT EXISTS <username>@<host> IDENTIFIED BY <password>;

-- john
--   - the user "john" can connect from any where
-- john@127.0.0.1
--   - the user "john" can connect only from the IP address 127.0.0.1
-- john@localhost
--   - the user "john" can connect only from locahost
-- john@example.com
--   - the user "john" can connect only from example.com (NOTE: this does not include subdomains of example.com)
-- john@'%.example.com
--   - the user "john" can connect from from example.com and any of its subdomains

-- -----------------------------------------
-- VIEWING USERS
-- -----------------------------------------
SELECT * FROM mysql.user;


-- --------------------------------
-- DROPPING USERS
-- --------------------------------
CREATE USER IF NOT EXISTS bob@localhost IDENTIFIED BY 'password';
DROP USER IF EXISTS bob@localhost;

-- --------------------------------
-- CHANGING PASSWORDS
-- ---------------------------------
-- SET PASSWORD FOR john = 'password123';

-- SET PASSWORD = 'password123';
--    - sets the password for the current logged in user

-- -------------------------------------------
-- GRANTING PRIVILEGES
-- -------------------------------------------
-- SCENARIO: web application that needs to only read and write to the database
CREATE USER IF NOT EXISTS my_web_app IDENTIFIED BY 'password';

GRANT INSERT, SELECT, UPDATE, DELETE, EXECUTE
ON sql_store.*
TO my_web_app;
	-- NOTE: the privilege EXECUTE can deal with being able to execute stored procedures and functions

-- SCENARIO: admin user
GRANT ALL
ON sql_store.*
TO john;

-- ON sql_store.*
--   - the granted privileges apply to all tables in the sql_store database
-- ON sql_store.customers
--   - the grapnted privileges apply to only the customers table in the sql_store database
-- ON *.*
--   - the granted privileges apply to all databases and tables 

-- -----------------------------------------
-- VIEW PRIVILEGES
-- -----------------------------------------
SHOW GRANTS FOR john;
SHOW GRANTS FOR my_web_app;

SHOW GRANTS;
	-- show grants for current logged in user
    
-- ------------------------------------------
-- REVOKING PRIVILEGES
-- -------------------------------------------
-- assume that we want to grant my_web_app the ability to create views for the sql_store database
GRANT CREATE VIEW
ON sql_store.*
TO my_web_app;

SHOW GRANTS FOR my_web_app;

-- after some time, we now decide that my_web_app should not be able to grant views for the sql_store database

-- we can revoke the ability for my_web_app to create views on the sql_store database by doing the following:
REVOKE CREATE VIEW
ON sql_store.*
FROM my_web_app;

SHOW GRANTS FOR my_web_app;

-- -------------------------------------
-- CLEANING UP AFTER COURSE
-- --------------------------------------
DROP USER IF EXISTS my_web_app;
DROP USER IF EXISTS john;
DROP DATABASE IF EXISTS sql_blog;
DROP DATABASE IF EXISTS sql_hr;
DROP DATABASE IF EXISTS sql_inventory;
DROP DATABASE IF EXISTS sql_invoicing;
DROP DATABASE IF EXISTS sql_store;
DROP DATABASE IF EXISTS sql_store2;