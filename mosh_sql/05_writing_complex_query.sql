-- ----------------------------------------
-- SUBQUERIES
-- ----------------------------------------
SELECT *
FROM sql_store.products
WHERE unit_price > (
	SELECT unit_price
	FROM sql_store.products
	WHERE product_id = 3
);

SELECT employee_id, salary
FROM sql_hr.employees
WHERE salary > (
	SELECT AVG(salary)
	FROM sql_hr.employees
);

-- ------------------------------------------
-- THE IN OPERATOR
-- ------------------------------------------
SELECT product_id
FROM sql_store.products
WHERE product_id NOT IN (
	SELECT DISTINCT product_id
	FROM sql_store.order_items
);

SELECT client_id
FROM sql_invoicing.clients
WHERE client_id NOT IN (
	SELECT DISTINCT client_id
	FROM sql_invoicing.invoices
);

-- -----------------------------------------------
-- SUBQUERIES VS JOINS
-- -----------------------------------------------
SELECT c.client_id
FROM sql_invoicing.clients AS c
	LEFT JOIN sql_invoicing.invoices AS i
    ON c.client_id = i.client_id
WHERE i.invoice_id IS NULL;

SELECT customer_id, first_name, last_name
FROM sql_store.customers
WHERE customer_id IN (
	SELECT DISTINCT customer_id
	FROM sql_store.orders
	WHERE order_id IN (
		SELECT order_id
		FROM sql_store.order_items
		WHERE product_id = 3
	)
);

SELECT DISTINCT c.customer_id, c.first_name, c.last_name
FROM sql_store.customers AS c
	JOIN sql_store.orders AS o
    ON c.customer_id = o.customer_id
    JOIN sql_store.order_items AS oi
    ON o.order_id = oi.order_id
WHERE oi.product_id = 3;

-- ----------------------------------------------
-- THE ALL KEYWORD
-- ----------------------------------------------
-- the following query can be rewritten using the ALL keyword:
SELECT *
FROM sql_invoicing.invoices
WHERE invoice_total > (
	SELECT MAX(invoice_total)
	FROM sql_invoicing.invoices
	WHERE client_id = 3
);

-- using the ALL keyword, the query is the following
SELECT *
FROM sql_invoicing.invoices
WHERE invoice_total > ALL (
	SELECT invoice_total
	FROM sql_invoicing.invoices
	WHERE client_id = 3
);

-- ----------------------------------------------------
-- THE ANY KEYWORD
-- ----------------------------------------------------
-- the following query can be rewritten using the ANY keyword:
SELECT client_id, name
FROM sql_invoicing.clients
WHERE client_id IN (
	SELECT client_id
	FROM sql_invoicing.invoices
	GROUP BY client_id
	HAVING COUNT(*) >= 2
);

-- using the ANY keyword, the query is the following:
SELECT client_id, name
FROM sql_invoicing.clients
WHERE client_id = ANY (
	SELECT client_id
	FROM sql_invoicing.invoices
	GROUP BY client_id
	HAVING COUNT(*) >= 2
);

-- ----------------------------------------
-- CORRELATED SUBQUERIES
-- ----------------------------------------
SELECT *
FROM sql_hr.employees AS e
WHERE salary > (
	SELECT AVG(salary)
	FROM sql_hr.employees
	WHERE office_id = e.office_id
);

SELECT invoice_id, client_id, payment_total
FROM sql_invoicing.invoices AS i
WHERE invoice_total > (
	SELECT AVG(invoice_total)
	FROM sql_invoicing.invoices
	WHERE client_id = i.client_id
);


-- ----------------------------------------------
-- THE EXISTS OPERATOR
-- ----------------------------------------------
-- the following query can be rewritten using the EXISTS operator
SELECT *
FROM sql_invoicing.clients
WHERE client_id IN (
	SELECT DISTINCT client_id
	FROM sql_invoicing.invoices
);

-- using the EXISTS operator, the query is the following:
SELECT *
FROM sql_invoicing.clients AS c
WHERE EXISTS (
	SELECT DISTINCT client_id
	FROM sql_invoicing.invoices
    WHERE client_id = c.client_id
);

-- the EXISTS operator is looking to see if there exists a row in the given subquery for each client

-- another example
SELECT *
FROM sql_store.products AS p
WHERE NOT EXISTS (
	SELECT *
	FROM sql_store.order_items
	WHERE product_id = p.product_id
);


-- ---------------------------------------------------------
-- SUBQUERIES IN THE SELECT CLAUSE
-- ----------------------------------------------------------
SELECT
	invoice_id,
    invoice_total,
    (
		SELECT AVG(invoice_total)
        FROM sql_invoicing.invoices
    ) as avg_invoice_total,
    invoice_total - (SELECT avg_invoice_total) AS difference  -- avg_invoice_total is used in a subquery here because we would not be able to reference it otherwise
FROM sql_invoicing.invoices;
    
SELECT
	invoice_id,
    invoice_total,
    (
		SELECT AVG(invoice_total)
        FROM sql_invoicing.invoices
    ) as avg_invoice_total,
    invoice_total - (
		SELECT AVG(invoice_total)
        FROM sql_invoicing.invoices
    ) AS difference
FROM sql_invoicing.invoices;

-- NOTE: both of the two above queries produce the same result, but using the first one looks neater and has less repetition

SELECT
	client_id,
    name,
    (
		SELECT SUM(i.invoice_total)
        FROM sql_invoicing.invoices AS i
        WHERE i.client_id = c.client_id
    ) AS total_sales,
	(
		SELECT AVG(i.invoice_total)
        FROM sql_invoicing.invoices AS i
    ) AS average,
    (
		SELECT total_sales - average
    ) AS difference
FROM sql_invoicing.clients AS c;

-- -----------------------------------------------------------
-- SUBQUERIES IN THE FROM CLAUSE
-- -----------------------------------------------------------
