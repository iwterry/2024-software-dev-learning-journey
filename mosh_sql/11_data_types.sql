-- -----------------------------------------------------
-- STRING TYPES
-- -----------------------------------------------------

-- main string data  types:
--  - CHAR(n)
--    - n is the maximum number of characters to be stored
--  - VARCHAR(n)
--    - n is the maximum number of characters to be stored
--  - MEDIUMTEXT
--  - LONGTEXT

-- -----------------------------------------------------
-- INTEGER TYPES
-- -----------------------------------------------------

-- integer data types:
--  - TINYINT
--  - SMALLINT
--  - MEDIUMINT
--  - INT
--  - BIGINT

-- NOTE: the integer types are signed, but if you want to use unsigned integers, just place the UNSIGNED keyword after the data type

-- -----------------------------------------------------
-- FIXED-POINT AND FLOATING-POINT TYPES
-- -----------------------------------------------------

-- number types with decimal points:
--  - DECIMAL(p, s)
--    - p is the maximum number of total digits, and s is the number of digits after the decimal point
--  - DOUBLE
--  - FLOAT

-- -----------------------------------------------------
-- BOOLEAN TYPES
-- -----------------------------------------------------

-- the boelean data type is BOOL or BOOLEAN, and the values this type takes on are TRUE and FALSE
-- NOTE: TRUE is internally represented as a 1, annd FALSE is internally represented as a 0

-- -----------------------------------------------------
-- ENUM AND SET TYPES
-- -----------------------------------------------------
-- - ENUM
--   - example: ENUM('small', 'medium', 'large')
-- - SET
--   - similar to ENUM but can store multipe values in a column

-- NOTE: it is best to avoid using ENUM and SET


-- -----------------------------------------------------
-- DATE AND TIME TYPES
-- -----------------------------------------------------

-- data types for storing date and time values:
--  - DATE
--  - TIME
--  - DATETIME
--  - TIMESTAMP
--  - YEAR

-- -----------------------------------------------------
-- BLOB TYPES
-- -----------------------------------------------------

-- blob types are used to store large amounts of binary data (such as, images and videos)

-- the blob types:
--  - TINYBLOB
--  - BLOB
--  - MEDIUMBLOB
--  - LONGBLOB

-- -----------------------------------------------------
-- JSON TYPES
-- -----------------------------------------------------

-- NOTE: the sql_store.products table was modified to include a column called "properties" this is a JSON data type in order to perform these examples

UPDATE sql_store.products
SET properties = '
{
  "dimensions": [1, 2, 3],
  "weight": 10,
  "manufacturer": {
    "name": "sony"
  }
}
'
WHERE product_id = 1;

-- NOTE: the following is an alternative syntax for the above UPDATE statement
-- UPDATE sql_store.products
-- SET properties = JSON_OBJECT(
--  'dimensions', JSON_ARRAY(1, 2, 3),
--  'weight', 10,
--  'manufacturer', JSON_OBJECT(
--    'name', 'sony'
--  )
-- )
-- WHERE product_id = 1;

SELECT * FROM sql_store.products;

-- there are two syntaxes two retrieve information from a column that is JSON data type
-- first approach:
SELECT product_id, JSON_EXTRACT(properties, '$.weight') AS weight
FROM sql_store.products
WHERE product_id = 1;
-- second approach:
SELECT product_id, properties -> '$.weight' AS weight
FROM sql_store.products
WHERE product_id = 1;

	-- NOTE: the syntax -> is referred to as the column path operator
    

-- how to access an item in an array; note that index starts at 0
SELECT product_id, properties -> '$.dimensions[0]' AS dimension
FROM sql_store.products
WHERE product_id = 1;


-- how to access a property in an object of an object
SELECT product_id, properties -> '$.manufacturer.name' AS manufacturer_name
FROM sql_store.products
WHERE product_id = 1;
	-- NOTE: we get "sony" instead of sony; to remove the double quotations use the ->> operator instead of the -> operator
    
-- you can also use a JSON data type in the WHERE clause
SELECT product_id, properties -> '$.manufacturer.name' AS manufacturer_name
FROM sql_store.products
WHERE properties -> '$.manufacturer.name' = 'sony';
    
    
-- you can also update properties within a json object
UPDATE sql_store.products
SET properties = JSON_SET(
  properties,      -- the column name in the database
  '$.weight', 20,  -- updating a property
  '$.age', 10      -- adding a property 
)
WHERE product_id = 1;
    
SELECT properties
FROM sql_store.products
WHERE product_id = 1;


-- you can also remove properties within a json object
UPDATE sql_store.products
SET properties = JSON_REMOVE(
  properties,      -- the column name in the database
  '$.age'          -- the property to remove
)
WHERE product_id = 1;
    
SELECT properties
FROM sql_store.products
WHERE product_id = 1;




