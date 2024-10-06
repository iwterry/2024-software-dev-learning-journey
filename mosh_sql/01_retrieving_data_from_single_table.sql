USE sql_store;

SELECT *
FROM customers;

SELECT *
FROM customers
WHERE customer_id = 1;

SELECT *
FROM customers
ORDER BY first_name;

SELECT 1, 2;

SELECT first_name, last_name, points
FROM customers;

SELECT first_name, last_name, points + 10
FROM customers;

SELECT
	first_name,
    last_name,
    points,
    (points + 10) * 50 AS 'extra points'
FROM customers;

SELECT * FROM customers WHERE points >= 3000;

SELECT * FROM customers WHERE state = 'va';  -- = is case-insensitve

SELECT * FROM customers WHERE birth_date < '1986-04-13';

SELECT * FROM customers WHERE birth_date > '1990-01-01' AND points < 3000;

SELECT * FROM customers WHERE birth_date > '1990-01-01' OR points > 3000;

SELECT * FROM order_items WHERE order_id = 6 AND (quantity * unit_price) > 30;

SELECT * FROM customers WHERE state IN  ('VA', 'CO');

SELECT * FROM customers WHERE state NOT IN  ('VA', 'CO');

SELECT * FROM products WHERE quantity_in_stock IN (49, 38, 72);

SELECT * FROM customers WHERE points BETWEEN 2273 AND 2967; -- BETWEEN is inclusive on both ends

SELECT * FROM customers WHERE birth_date BETWEEN '1990-01-01' AND '2000-01-01';

SELECT * FROM customers WHERE last_name LIKE '%Widd%'; -- LIKE is case-insensitve and % WILL match any 0 or more characters

SELECT * FROM customers WHERE last_name LIKE 'b%';

SELECT * FROM customers WHERE last_name LIKE 'BET_HLE_'; -- _ matches only any one character

SELECT * FROM customers WHERE last_name LIKE 'betchley'; -- without _ or %, exact match occurs and still case insensitve 

SELECT * FROM customers WHERE (address LIKE '%trail%') OR (address LIKE '%avenue%');

SELECT * FROM customers WHERE phone LIKE '%9';

SELECT * FROM customers WHERE phone NOT LIKE '%9';

SELECT * FROM customers WHERE last_name REGEXP 'field'; -- REGEXP is case insensitive; this checks to see if last_name contains 'field'

SELECT * FROM customers WHERE address REGEXP 'trail|avenue'; -- address REGEXP 'trail|avenue' is just like doing (address LIKE '%trail%') OR (address LIKE '%avenue%');

SELECT * FROM customers WHERE first_name REGEXP '^elka$|^ambur$'; -- matches exactly elka or ambur (case insensitive, of course) 

SELECT * FROM customers WHERE last_name REGEXP 'ey$|on$';

SELECT * FROM customers WHERE last_name REGEXP '^my' OR last_name REGEXP 'se';

SELECT * FROM customers WHERE last_name REGEXP '^my|se'; -- should be same as last_name REGEXP '^my' OR last_name REGEXP 'se'

SELECT * FROM customers WHERE last_name REGEXP 'b[ru]'; -- contains b followed by r or by u

SELECT * FROM customers WHERE phone != '123-456-7890'; -- can return phone number that is null

SELECT * FROM customers WHERE phone IS NULL;

SELECT * FROM customers WHERE phone IS NOT NULL;

SELECT * FROM orders WHERE shipped_date IS NULL;

SELECT *, quantity * unit_price AS total_price FROM order_items WHERE order_id = 2 ORDER BY total_price DESC;

SELECT * FROM customers LIMIT 4;

SELECT * FROM customers LIMIT 2 OFFSET 3;

SELECT * FROM customers ORDER BY points DESC LIMIT 3;
