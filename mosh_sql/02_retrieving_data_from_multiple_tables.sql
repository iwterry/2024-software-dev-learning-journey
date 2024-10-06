USE sql_store;

-- ---------------------------
-- INNER JOINS
-- --------------------------
SELECT order_id, first_name, last_name, customers.customer_id
FROM orders
	INNER JOIN customers ON orders.customer_id = customers.customer_id;
-- NOTE: the INNER keyword is optional

SELECT order_id, first_name, last_name, customers.customer_id
FROM orders
	JOIN customers ON orders.customer_id = customers.customer_id;
    
SELECT order_id, first_name, last_name, c.customer_id
FROM orders AS o
	JOIN customers AS c ON o.customer_id = c.customer_id;
-- NOTE: the AS keyword is optional
    
SELECT order_id, first_name, last_name, c.customer_id
FROM orders o
	JOIN customers c ON o.customer_id = c.customer_id;
    
SELECT order_id, p.product_id, name AS product_name, quantity AS order_quantity, oi.unit_price AS order_unit_price
FROM order_items AS oi
	JOIN products AS p ON oi.product_id = p.product_id;
    
-- -----------------------------------------    
-- JOINING ACROSS DIFFERENT DATABASES
-- -----------------------------------------
SELECT *
FROM sql_store.order_items AS oi
	JOIN sql_inventory.products AS p
    ON oi.product_id = p.product_id;
    
-- ----------------------------------
-- SELF JOINS 
-- ----------------------------------
SELECT 
	e.employee_id AS employee_id,
    e.first_name AS employee_first_name,
    e.last_name AS employee_last_name,
    m.employee_id AS manager_employee_id,
    m.first_name AS manager_first_name,
    m.last_name AS manager_last_name
FROM sql_hr.employees AS e
	JOIN sql_hr.employees AS m
    ON e.reports_to = m.employee_id;
    
-- --------------------------------------
-- JOINING MULTIPLE (MORE THAN TWO) TABLES
-- ---------------------------------------
SELECT order_id, c.customer_id, c.first_name, c.last_name, order_status_id, name
FROM sql_store.orders AS o
	JOIN sql_store.customers AS c
    ON o.customer_id = c.customer_id
    JOIN sql_store.order_statuses AS os
	ON o.status = os.order_status_id;
    
SELECT
	p.payment_id,
	c.client_id,
    i.invoice_id,
    i.invoice_date AS invoice_date,
    c.name AS client_name,
    pm.name AS payment_type_name
FROM sql_invoicing.payments AS p
	JOIN sql_invoicing.invoices AS i
    ON p.invoice_id = i.invoice_id
    JOIN sql_invoicing.clients AS c
	ON p.client_id = c.client_id
    JOIN sql_invoicing.payment_methods AS pm
    ON p.payment_method = pm.payment_method_id;
    
-- -----------------------------------
-- COMPOUND JOIN CONDITIONS
-- -----------------------------------
SELECT *
FROM sql_store.order_items AS oi
	JOIN sql_store.order_item_notes AS oin
    ON oi.order_id = oin.order_id AND oi.product_id = oin.product_id;
    
-- ---------------------------------
-- IMPLICIT JOIN SYNTAX
-- ---------------------------------
SELECT *
FROM orders o, customers c
WHERE o.customer_id = c.customer_id; 

-- NOTE: if you forget the WHERE clause here, then you will get a cross join

-- ---------------------------------------------
-- OUTER JOINS
-- ----------------------------------------------
SELECT c.customer_id, c.first_name, o.order_id
FROM sql_store.customers AS c
	 LEFT OUTER JOIN sql_store.orders AS o
	ON c.customer_id = o.customer_id
ORDER BY c.customer_id;

SELECT c.customer_id, c.first_name, o.order_id
FROM sql_store.customers AS c
	RIGHT OUTER JOIN sql_store.orders AS o
	ON c.customer_id = o.customer_id
ORDER BY c.customer_id;

-- 	NOTE: the OUTER keyword is optional for left outer joins and right outer joins

SELECT p.product_id, p.name, oi.quantity
FROM sql_store.products AS p
	LEFT JOIN sql_store.order_items AS oi
    ON p.product_id = oi.product_id
ORDER BY p.product_id;

-- -----------------------------------
-- OUTER JOIN BETWEEN MULTIPLE (MORE THAN TWO) TABLES
-- -------------------------------------
SELECT c.customer_id, c.first_name, o.order_id, s.name AS shipper_name
FROM sql_store.customers AS c
	LEFT OUTER JOIN sql_store.orders AS o
	ON c.customer_id = o.customer_id
	LEFT OUTER JOIN sql_store.shippers AS s
    ON o.shipper_id = s.shipper_id
ORDER BY c.customer_id;

SELECT o.order_date, o.order_id, c.first_name, s.name AS shipper_name, os.name AS status
FROM sql_store.orders AS o
	LEFT OUTER JOIN sql_store.customers AS c
    ON o.customer_id = c.customer_id
    LEFT OUTER JOIN sql_store.shippers AS s
    ON o.shipper_id = s.shipper_id
    LEFT OUTER JOIN sql_store.order_statuses AS os
    ON o.status = os.order_status_id
ORDER BY status;

-- -------------------------------------
-- SELF OUTER JOINS
-- -------------------------------------
SELECT
	e.employee_id,
    e.first_name,
    m.employee_id AS manager_employee_id,
    m.first_name AS manager_first_name
FROM sql_hr.employees AS e
	LEFT OUTER JOIN sql_hr.employees AS m
    ON e.reports_to = m.employee_id
ORDER BY e.employee_id;

-- ------------------------------------------
-- THE USING CLAUSE
-- -----------------------------------------

-- ------------------------------------------
-- NATURAL JOINS
-- ------------------------------------------

-- -----------------------------------------
-- CROSS JOINS
-- ----------------------------------------


-- --------------------------------------
-- UNION
-- -------------------------------------
SELECT order_id, order_date, 'Active' AS status
FROM sql_store.orders
WHERE order_date >= '2019-01-01'
UNION
SELECT order_id, order_date, 'Archived' AS status
FROM sql_store.orders
WHERE order_date < '2019-01-01';

SELECT first_name
FROM sql_store.customers
UNION
SELECT name
FROM sql_store.shippers;

SELECT customer_id, first_name, points, 'Bronze' AS type
FROM sql_store.customers
WHERE points < 2000
UNION
SELECT customer_id, first_name, points, 'Silver' AS type
FROM sql_store.customers
WHERE points BETWEEN 2000 AND 3000
UNION
SELECT customer_id, first_name, points, 'Gold' AS type
FROM sql_store.customers
WHERE points > 3000
ORDER BY first_name;


