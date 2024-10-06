-- --------------------------------
-- INSERTING A ROW
-- --------------------------------
INSERT INTO sql_store.customers
VALUES (DEFAULT, 'John', 'Smith', '1990-01-01', NULL, '1234 ABC Street', 'City1', 'GA', DEFAULT);

INSERT INTO sql_store.customers(
	first_name,
    last_name,
    birth_date,
    address,
    city,
    state
)
VALUES ('John', 'Smith', '1991-01-01', '1235 ABC Street', 'City2', 'GA');

-- ------------------------------------
-- INSERTING MULTIPLE ROWS
-- ------------------------------------
INSERT INTO sql_store.shippers(name)
VALUES ('Shipper1'), ('Shipper2'), ('Shipper3');

INSERT INTO sql_store.products(name, quantity_in_stock, unit_price)
VALUES ('Product1', 5, 5.50),
	   ('Product2', 20, 25),
       ('Product3', 3, 7.5);

-- -------------------------------------       
-- INSERTING HIERARCHICAL ROWS
-- -------------------------------------
INSERT INTO sql_store.orders (customer_id, order_date, status)
VALUES (1, '2019-01-01', 1);
INSERT INTO sql_store.order_items (order_id, product_id, quantity, unit_price)
VALUES  (LAST_INSERT_ID(), 1, 3, 5.5), (LAST_INSERT_ID(), 2, 1, 2);

-- the builtin function LAST_INSERT_ID  returns the id of the last inserted record

-- --------------------------------------------------
-- CREATING A COPY  OF A TABLE
-- ---------------------------------------------------
CREATE TABLE sql_store.orders_archived AS
SELECT * FROM sql_store.orders;

INSERT INTO sql_store.orders_archived
SELECT * FROM sql_store.orders WHERE order_date < '2019-01-01';

SELECT * FROM sql_store.orders_archived;

CREATE TABLE sql_invoicing.invoicing_archived AS
SELECT
	i.invoice_id,
    i.number,
    c.name AS client_name,
    i.invoice_total,
    i.payment_total,
    i.invoice_date,
    i.due_date,
    i.payment_date
FROM sql_invoicing.invoices AS i
	JOIN sql_invoicing.clients AS c
    ON i.client_id = c.client_id
WHERE i.payment_date IS NOT NULL
ORDER BY i.invoice_id;

-- --------------------------------
-- UPDATING A SINGLE ROW
-- --------------------------------
UPDATE sql_invoicing.invoices
SET    payment_total = 10,
       payment_date = '2019-03-01'
WHERE  invoice_id = 1;

UPDATE sql_invoicing.invoices
SET    payment_total = 0,
       payment_date = NULL
WHERE  invoice_id = 1;

UPDATE sql_invoicing.invoices
SET    payment_total = DEFAULT,
       payment_date = NULL
WHERE  invoice_id = 1;

UPDATE sql_invoicing.invoices
SET    payment_total = invoice_total * 0.5,
       payment_date = due_date
WHERE  invoice_id = 3;

SELECT * FROM sql_invoicing.invoices;


-- --------------------------------
-- UPDATING MULTIPLE ROWS
-- --------------------------------
UPDATE sql_invoicing.invoices
SET    payment_total = invoice_total * 0.5,
       payment_date = due_date
WHERE  client_id = 3;

UPDATE sql_store.customers
SET    points = points + 50
WHERE  birth_date < '1990-01-01';

-- ------------------------------------
-- USING SUBQUERIES IN UPDATES
-- ------------------------------------
UPDATE sql_invoicing.invoices
SET    payment_total = invoice_total * 0.5,
       payment_date = due_date
WHERE  client_id = (
	SELECT client_id
	FROM sql_invoicing.clients
	WHERE name = 'Myworks'
);

UPDATE sql_invoicing.invoices
SET    payment_total = invoice_total * 0.5,
       payment_date = due_date
WHERE  client_id IN (
	SELECT client_id
	FROM sql_invoicing.clients
	WHERE state IN ('CA', 'NY')
);

UPDATE sql_store.orders
SET    comments = 'Gold Customer'
WHERE  customer_id IN (
	SELECT customer_id
	FROM sql_store.customers
	WHERE points > 3000
);


-- -------------------------------------------
-- DELETING ROWS
-- -------------------------------------------
DELETE FROM sql_invoicing.invoices
WHERE       invoice_id = 1;

DELETE FROM sql_invoicing.invoices
WHERE       client_id = (
	SELECT client_id
	FROM sql_invoicing.clients
	WHERE name = 'Myworks'
);