-- -----------------------------------
-- AGGREGATE FUNCTION
-- ------------------------------------
SELECT 
	MAX(invoice_total) AS max_invoice_total,
    MIN(invoice_total) AS min_invoice_total,
    AVG(invoice_total) AS avg_invoice_total,
    SUM(invoice_total) AS sum_invoice_total,
    COUNT(invoice_total) AS count_invoice_total
FROM sql_invoicing.invoices;

-- NOTE: the function used do not operation on NULL values

SELECT COUNT(payment_date) -- NULL values for payment_date are not counted with the COUNT function
FROM sql_invoicing.invoices;

SELECT COUNT(DISTINCT client_id) -- get the total number unique clients in the database table
FROM sql_invoicing.invoices;

SELECT COUNT(*) -- get the total number of rows in the database table
FROM sql_invoicing.invoices;

SELECT 
	'First half of 2019' AS date_range,
    SUM(invoice_total) AS total_sales,
    SUM(payment_total) AS total_payments,
	SUM(invoice_total - payment_total) AS what_we_expect
FROM sql_invoicing.invoices
WHERE invoice_date BETWEEN '2019-01-01' AND '2019-06-30'
UNION
SELECT 
	'Second half of 2019' AS date_range,
    SUM(invoice_total) AS total_sales,
    SUM(payment_total) AS total_payments,
	SUM(invoice_total - payment_total) AS what_we_expect
FROM sql_invoicing.invoices
WHERE invoice_date BETWEEN '2019-07-01' AND '2019-12-31'
UNION
SELECT 
	'Total' AS date_range,
    SUM(invoice_total) AS total_sales,
    SUM(payment_total) AS total_payments,
	SUM(invoice_total - payment_total) AS what_we_expect
FROM sql_invoicing.invoices
WHERE invoice_date BETWEEN '2019-01-01' AND '2019-12-31';


-- -----------------------------------
-- THE GROUP BY CLAUSE
-- -----------------------------------
SELECT
	client_id,
	SUM(invoice_total) AS total_sales
FROM sql_invoicing.invoices
WHERE invoice_date >= '2019-07-01'
GROUP BY client_id
ORDER BY total_sales DESC;

SELECT
	c.city,
    c.state,
	SUM(invoice_total) AS total_sales
FROM sql_invoicing.invoices AS i
	JOIN sql_invoicing.clients AS c
    ON i.client_id = c.client_id
GROUP BY c.city, c.state;

SELECT p.date, pm.name AS payment_method_name, SUM(p.amount) AS total_payments
FROM sql_invoicing.payments AS p
JOIN sql_invoicing.payment_methods AS pm
ON p.payment_method = pm.payment_method_id
GROUP BY p.date, payment_method_name
ORDER BY p.date, payment_method_name DESC;

-- -------------------------------------------
-- THE HAVING CLAUSE
-- -------------------------------------------
SELECT
	client_id,
    SUM(invoice_total) AS total_sales,
    COUNT(*) AS number_of_invoices
FROM sql_invoicing.invoices
GROUP BY client_id
HAVING total_sales > 500;


SELECT
	client_id,
    SUM(invoice_total) AS total_sales,
    COUNT(*) AS number_of_invoices
FROM sql_invoicing.invoices
GROUP BY client_id
HAVING total_sales > 500 AND number_of_invoices > 5;

SELECT
	c.customer_id,
    SUM(quantity * unit_price) as total_amount_spent
FROM sql_store.customers AS c
	JOIN sql_store.orders AS o
    ON c.customer_id = o.customer_id
    JOIN sql_store.order_items AS oi
    ON o.order_id = oi.order_id
WHERE c.state = 'VA'
GROUP BY c.customer_id
HAVING total_amount_spent > 100;

-- ----------------------------------------------
-- THE ROLLUP OPERATOR
-- ----------------------------------------------
SELECT
	c.city,
    c.state,
    SUM(invoice_total) AS total_sales
FROM sql_invoicing.invoices AS i
	JOIN sql_invoicing.clients AS c
    ON i.client_id = c.client_id
GROUP BY c.city, c.state WITH ROLLUP;

SELECT 
	pm.name AS payment_method_name,
    SUM(p.amount) AS total
FROM sql_invoicing.payment_methods AS pm
	LEFT OUTER JOIN sql_invoicing.payments AS p
    ON pm.payment_method_id = p.payment_method
GROUP BY payment_method_name WITH ROLLUP;
    






