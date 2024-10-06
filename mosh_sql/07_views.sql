-- ------------------------------------------------
-- CREATING VIEWS
-- ------------------------------------------------
CREATE VIEW sql_invoicing.sales_by_client AS
SELECT
	c.client_id,
    c.name,
    SUM(i.invoice_total) AS total_sales
FROM sql_invoicing.clients AS c
	JOIN sql_invoicing.invoices AS i
    ON c.client_id = i.client_id
GROUP BY c.client_id, c.name;

SELECT * 
FROM sql_invoicing.sales_by_client
WHERE total_sales > 500;

CREATE VIEW sql_invoicing.clients_balance AS
SELECT
	c.client_id,
    c.name,
    SUM(IF(i.invoice_id IS NULL, 0, i.invoice_total - i.payment_total)) AS balance
FROM sql_invoicing.clients AS c
	LEFT JOIN sql_invoicing.invoices AS i
    ON c.client_id = i.client_id
GROUP BY c.client_id, c.name;

SELECT *
FROM sql_invoicing.clients_balance;

-- ------------------------------------------------
-- ALTERING OR DROPPING VIEWS
-- ------------------------------------------------
-- to change an existing view, you can either drop the existing view and then create it like how it was done above
DROP VIEW sql_invoicing.sales_by_client;

-- another way to change an existing view is to use the "CREATE OR REPLACE VIEW" syntax instead of "CREATE VIEW" syntax; this way you do not need to drop the view first
CREATE OR REPLACE VIEW sql_invoicing.sales_by_client AS
SELECT
	c.client_id,
    c.name,
    SUM(i.invoice_total) AS total_sales
FROM sql_invoicing.clients AS c
	JOIN sql_invoicing.invoices AS i
    ON c.client_id = i.client_id
GROUP BY c.client_id, c.name;

-- ------------------------------------------------
-- UPDATABLE VIEWS
-- ------------------------------------------------
-- NOTE: an updatable view is a view that does not contain any of the following:
--  - the DISTINCT keyword
--  - aggregate functions (such as MIN, MAX, AVG, SUM)
--  - GROUP BY or HAVING clauses
--  - the UNION keyword

-- NOTE: you can use an updatable view to update data, which means you can use the updatable view in UPDATE, INSERT, or DELETE statements.
-- NOTE: if a view is not an updateable view, then you cannot use it in  UPDATE, INSERT, or DELETE statements
-- NOTE: in order to insert data into a table using a view, the view must have all the required columns of the table


CREATE OR REPLACE VIEW sql_invoicing.invoices_with_balance AS
SELECT 
	invoice_id,
    number,
    client_id,
    invoice_total,
    payment_total,
    invoice_total - payment_total AS balance,
    invoice_date,
    due_date,
    payment_date
FROM sql_invoicing.invoices
WHERE (invoice_total - payment_total) > 0;

-- note that the above view meets the conditions to be an updatable view

DELETE FROM sql_invoicing.invoices_with_balance
WHERE invoice_id = 1;

SELECT *
FROM sql_invoicing.invoices;

-- note that the invoice with invoice_id equal to 1 is now deleted

UPDATE sql_invoicing.invoices_with_balance
SET due_date = (due_date + INTERVAL 2 DAY)
WHERE invoice_id = 2;

SELECT *
FROM sql_invoicing.invoices;

-- note that the invoice with invoice_id equal to 2 has now had its due_date updated

-- ------------------------------------------------
-- THE WITH OPTION CHECK CLAUSE
-- ------------------------------------------------
UPDATE sql_invoicing.invoices_with_balance
SET payment_total = invoice_total
WHERE invoice_id = 2;

SELECT *
FROM sql_invoicing.invoices_with_balance;

-- notice that invoice with invoice_id equal to 2 is no longer displayed (this is because of the WHERE clause for the view)

-- NOTE: to prevent rows from not being displayed from the view due to UPDATE and DELETE statements, you can use WITH CHECK OPTION when creating the view

CREATE OR REPLACE VIEW sql_invoicing.invoices_with_balance AS
SELECT 
	invoice_id,
    number,
    client_id,
    invoice_total,
    payment_total,
    invoice_total - payment_total AS balance,
    invoice_date,
    due_date,
    payment_date
FROM sql_invoicing.invoices
WHERE (invoice_total - payment_total) > 0
WITH CHECK OPTION;

UPDATE sql_invoicing.invoices_with_balance
SET payment_total = invoice_total
WHERE invoice_id = 3;

-- notice that an error occurred; this is due using WITH CHECK OPTION; the WITH CHECK OPTION prevent the row update because the update would have caused the row being updated from being seen in the view

SELECT *
FROM sql_invoicing.invoices_with_balance;