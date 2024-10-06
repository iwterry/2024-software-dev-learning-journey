-- -------------------------------------
-- TRANSACTIONS
-- ---------------------------------------

--  a transaction is a group of SQL statements that represent a single unit of work

-- ACID properties:
--  - atomicity:
--  - consistency:
--  - isolation
--  - durability

START TRANSACTION;

INSERT INTO sql_store.orders (customer_id, order_date, status)
VALUES (1, '2019-01-01', 1);

INSERT INTO sql_store.order_items
VALUES (LAST_INSERT_ID(), 1, 1, 1);

-- ROLLBACK;   -- used when you do not want to save the changes
COMMIT;       -- used when you do want to save the changes

-- -----------------------------------------------------
-- CONCURRENCY AND LOCKING
-- -----------------------------------------------------
-- by default, MySQL uses locks to prevent two transactions from updating the same data at the same time


-- ---------------------------------------------------
-- CONCURRENCY PROBLEMS
-- ---------------------------------------------------

-- problems:
--  - lost updates: when two transactions that occur at the same time try to update the same data without using locks; the transaction that commit last will override the changes made by the previous transaction 
--  - dirty reads: when a transaction reads data that has not yet been committed
--  - non-repeatable reads: when reading the same data in a transaction but get different results
--  - phantom reads: 

-- -----------------------------------------------
-- TRANSACTION ISOLATION LEVELS
-- -----------------------------------------------
-- levels:
--  - READ UNCOMMITTED: does not provide any protection
--  - READ COMMITTED: protects against dirty reads
--  - REPEATABLE READ: protects againsts dirty reads, lost updates, and non-repeating reads
--  - SERIALIZABLE: protects againsts dirty reads, lost updates, non-repeating reads, and phantom reads

-- the default isolation level in MySQL is REPEATABLE READ

-- to view the current transaction isolation level, use the following:
SHOW VARIABLES LIKE '%TRANSACTION%'; -- then look through the variables to find a variable that deals with transaction isolations

-- to change the transaction isolation level for only the next transaction,, use the following:
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; -- you can set the isolation level to other values besides SERIALIZABLE
-- or you change the transactiion isolation level for the entire user session, by using the following:
SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE; -- you can set the isolation level to other values besides SERIALIZABLE


-- ----------------------------------------------
-- READ UNCOMMITTED ISOLATION LEVEL
-- -----------------------------------------------


-- ----------------------------------------------
-- READ COMMITTED ISOLATION LEVEL
-- -----------------------------------------------


-- ----------------------------------------------
-- REPEATABLE READ ISOLATION LEVEL
-- -----------------------------------------------


-- ----------------------------------------------
-- SERIALIZABLE ISOLATION LEVEL
-- -----------------------------------------------