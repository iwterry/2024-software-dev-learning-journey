-- NOTE: the sql script load_1000_customers.sql was ran for this

-- ---------------------------------------------
-- CREATING INDEXES
-- ----------------------------------------------
EXPLAIN SELECT customer_id
FROM sql_store.customers
WHERE state = 'CA';

-- analyzing the output of the previous statement:
--  - in the column "type", you will see the value "ALL" and this means that MySQL is doing a full table scan
--  - in the column "rows", you will see the number of rows scanned (which in this case is 1010 rows)

CREATE INDEX indx_state ON sql_store.customers (state);
	-- NOTE: "indx_state" is the name of the index that has been given; it is optional to name the index

EXPLAIN SELECT customer_id
FROM sql_store.customers
WHERE state = 'CA';

-- analyzing the output of the previous statement:
--  - in the column "type", you will see the value "ref" and so a full table scan is no longer happening
--  - in the column "rows", you will see that 112 rows were scanned
--  - in the column "possible_keys", you will see the possible indexes that MySQL will use (because there can be multiple indexes)
--  - in the column "key", you will see the index that MySQL has used

-- the following is another example of creating indexes and seeing the impact of the index

EXPLAIN SELECT customer_id, points
FROM sql_store.customers
WHERE points > 1000; 

CREATE INDEX indx_points ON sql_store.customers (points);

EXPLAIN SELECT customer_id, points
FROM sql_store.customers
WHERE points > 1000;

-- ---------------------------------------------
-- VIEWING INDEXES
-- ---------------------------------------------
ANALYZE TABLE sql_store.customers; --  generates table statistics

SHOW INDEXES FROM sql_store.customers;
	-- NOTE: the ANALYZE statement was ran before this to provide a more accurate value for the column "Cardinality"; otherwise, only an estimate would be given

-- after executing the previous statement, you will see multiple indexes

-- in MySQL, an index is created on the primary key by default and this index is given the name "PRIMARY"

-- a table can have only one primary index

-- a table can have multiple secondary indexes

-- in MySQL, each secondary index includes the primary key


-- ----------------------------------------------
-- PREFIX INDEXES
-- ---------------------------------------------
-- let's say we want to create an index on the column last_name in database sql_store.customers;
--   because it is a string column, it can take up more space in memory than necessary to store an index for that column;
--   to store less space, we can store the first n characters of the last name for the custumers

-- we can choose an appropriate value for n by doing following:
SELECT
	COUNT(DISTINCT LEFT(last_name, 1)) AS first_character,
    COUNT(DISTINCT LEFT(last_name, 5)) AS first_5_characters,
    COUNT(DISTINCT LEFT(last_name, 10)) AS first_10_characters,
    COUNT(DISTINCT LEFT(last_name, 15)) AS first_15_characters,
    COUNT(DISTINCT last_name) AS all_characters
FROM sql_store.customers; 

-- we can see that a good choice is to include the first 5 characters of last names for the customers

-- to create  an index on the first five characters, we use a prefix index
CREATE INDEX prefix_indx_lastname ON sql_store.customers (last_name(5));

SHOW INDEX FROM sql_store.customers;
	-- NOTE: in the column Sub_part of the output table, there is a 5 for prefix_indx_lastname
    
-- ------------------------------------------------
-- FULL-TEXT INDEXES
-- -----------------------------------------------
-- NOTE: the sql script create-db-blog.sql was ran for this

CREATE FULLTEXT INDEX fulltxt_indx_title_body ON sql_blog.posts(title, body);

SELECT *
FROM sql_blog.posts
WHERE MATCH(title, body) AGAINST ('react redux'); -- matches when title or body contain the word react and the word redux

-- -------------------------------------------------
-- COMPOSITE INDEXES
-- -------------------------------------------------
EXPLAIN
	SELECT customer_id
    FROM sql_store.customers
    WHERE state = 'CA' AND points > 1000;
		
-- the problem that we have is that MySQL will perform a full table scan with one colummn after narrowing down 
--     the results with the use of the other column's index; MySQL does not make use of both the index on the column
--     "state" and the index on the column "points"; it will only make use of one index

-- this is where composite indexes come in and can be created by doing the following:
CREATE INDEX indx_state_points ON sql_store.customers (state, points);
	-- NOTE: the order of the columns does matter
    
EXPLAIN
	SELECT customer_id
    FROM sql_store.customers
    WHERE state = 'CA' AND points > 1000;
    
-- now let's drop a couple of indexes
DROP INDEX indx_points ON sql_store.customers;
DROP INDEX indx_state ON sql_store.customers;


EXPLAIN SELECT customer_id
FROM sql_store.customers
WHERE state = 'CA';

EXPLAIN SELECT customer_id
FROM sql_store.customers
WHERE points > 1000;

-- notice that after executing each of the previous two statements, the composite index was use

-- --------------------------------------------
-- ORDER OF COLUMNS IN COMPOSITE INDEXES
-- --------------------------------------------
-- how to order columns in a composite index:
--   - put the most frequently used columns first
--   - put the columns with the higher cardinality first
--      - NOTE: a column's cardinality represents the number of unique values in that column
--   - take your queries into account and try to understand how MySQL will execute your queries


-- you can force MySQL to use a particular index (when there are multiple indexes that MySQL can choose from)
--     by doing the following:
EXPLAIN
	SELECT customer_id
    FROM sql_store.customers
    USE INDEX (indx_state_points) 
    WHERE state = 'CA' AND points > 1000;
    
-- ----------------------------------------------------
-- WHEN INDEXES ARE IGNORED
-- ----------------------------------------------------
EXPLAIN
	SELECT customer_id
    FROM sql_store.customers
    WHERE state = 'CA' OR points > 1000;
    -- this looks like a full table scan because all the rows were scanned, but when you look at the column "type" from
    --    the output table, you can see that an index was used
    
-- we can make better use of the index by doing the following:
EXPLAIN
	SELECT customer_id
    FROM sql_store.customers
    WHERE state = 'CA'
    UNION
	SELECT customer_id
    FROM sql_store.customers
    USE INDEX (indx_state_points)
    WHERE  points > 1000;
    
-- notice that less rows needed to be scanned with the above query

-- we can try creating an index for points:
CREATE INDEX indx_points ON sql_store.customers (points);

EXPLAIN
	SELECT customer_id
    FROM sql_store.customers
    WHERE state = 'CA'
    UNION
	SELECT customer_id
    FROM sql_store.customers
    WHERE  points > 1000;
    
-- here is a different example 
EXPLAIN
	SELECT customer_id
    FROM sql_store.customers
    WHERE  points + 4 > 1000;
    -- notice that all the rows needed to be scanned
    
EXPLAIN
	SELECT customer_id
    FROM sql_store.customers
    WHERE  points > 996;
	-- notice that much less row were scanned even though the SELECT query will give the same rows as the SELECT query before this one
    
-- when you use a column in an expression (points + 4 > 1000) MySQL is not able to take advantage of the index on the column

-- -----------------------------------------------------
-- USING INDEXES FOR SORTING
-- -----------------------------------------------------
EXPLAIN
	SELECT customer_id
    FROM sql_store.customers
    ORDER BY state;
    
-- when using indexes for sorting, make sure the columns in the ORDER BY clause are in same order
--     and same direction (or all columns are opposite direction) to the order and direction of the
--     columns in the index:

-- if index is (A asc, B asc), then to make use of the index, the ORDER BY clause should have the following:
--  - A asc, B asc
--  - A desc, B desc
--  - A asc
--  - A desc
--  - NOTE: you do not want to use column B in the ORDER BY clause by itself unless column A is
--      used to filter rows in the WHERE clause
--  - NOTE: you do not want to have another column between A and B in the ORDER BY clause

-- ----------------------------------------------
-- COVERING INDEXES
-- ----------------------------------------------
EXPLAIN
	SELECT customer_id
    FROM sql_store.customers
    ORDER BY state;
    
EXPLAIN
	SELECT customer_id, state
    FROM sql_store.customers
    ORDER BY state;
    
EXPLAIN
	SELECT customer_id, points, state 
    FROM sql_store.customers
    ORDER BY state;
    
EXPLAIN
	SELECT first_name
    FROM sql_store.customers
    ORDER BY state;
    -- notice that this query is different from the previous three in that this one
    --   does a full table scan, and we can see in the column "Extra" that filesort
    --   is being used
    
-- the first three queries have what is known as a covering index, which means
--   that all the columns in the SELECT clause are covered by the index
--   indx_state_points, which contain the columns state, points, and customer_id
--   (because customer_id is the primary key and all secondary indexes contain
--   the primary key)

-- the last query does not have a covering index because the column first_name is not
--   in the index indx_state_points

-- ------------------------------------------------
-- INDEX MAINTENANCE
-- -----------------------------------------------
-- before creating new indexes, check the existing ones to make sure you are not doing one of the following:
--   - creating duplicate indexes (because MySQL does not prevent this)
--   - creating redundant indexes (such as creating an index on column A when you already have an existing index (A, B))