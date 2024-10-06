-- -------------------------------------------------------------
-- NUMERIC FUNCTIONS
-- -------------------------------------------------------------
SELECT ROUND(5.735), ROUND(5.735, 1), ROUND(5.735, 2); -- ---> 6, 5.7, 5.74
SELECT ROUND(-5.735), ROUND(-5.735, 1), ROUND(-5.735, 2); -- --> -6, -5.7, -5.74

SELECT TRUNCATE(5.735, 0), TRUNCATE(5.735, 1), TRUNCATE(5.735, 2); -- --> 5, 5.7, 5.73
SELECT TRUNCATE(-5.735, 0), TRUNCATE(-5.735, 1), TRUNCATE(-5.735, 2); -- --> -5, -5.7, -5.73

SELECT CEILING(5.7), CEILING(5.3);    -- --> 6, 6
SELECT CEILING(-5.7), CEILING(-5.3);  -- --> -5, -5

SELECT FLOOR(5.7), FLOOR(5.3);    -- --> 5, 5
SELECT FLOOR(-5.7), FLOOR(-5.3);  -- --> -6, -6

SELECT ABS(5.7), ABS(5.3);    -- --> 5.7, 5.3
SELECT ABS(-5.7), ABS(-5.3);  -- --> 5.7, 5.3

SELECT RAND(); -- --> generates a random number between 0 (inclusively) and 1 (exclusively)
-- RAND can optionally take an argument that represent the seed value

-- -------------------------------------------------------------
-- STRING FUNCTIONS
-- -------------------------------------------------------------
SELECT LENGTH(''), LENGTH('HELLO'); -- --> 0, 5

SELECT UPPER('Hello!'); -- --> HELLO!
SELECT LOWER('Hello!'); -- --> hello!

SELECT TRIM('  Hello!  '), LENGTH(TRIM('  Hello!  ')); -- --> Hello!, 6
	-- NOTE: both the leading and trailing spaces are removed using the TRIM function
SELECT LTRIM('  Hello!  '), LENGTH(LTRIM('  Hello!  ')); -- --> Hello!, 8
	-- NOTE: only the leading spaces are removed using the LTRIM function
SELECT RTRIM('  Hello!  '), LENGTH(RTRIM('  Hello!  ')); -- --> Hello!, 8
	-- NOTE: only the trailing spaces are removed using the RTRIM function

SELECT LEFT('Hello!!!', 1), LEFT('Hello!!!', 6); -- --> H, Hello!
SELECT RIGHT('Hello!!!', 1), RIGHT('Hello!!!', 6); -- --> !, llo!!!

SELECT
	SUBSTRING('Hello!!!', 3, 3),     -- --> llo
    SUBSTRING('Hello!!!', 5, 2),     -- --> o!
    SUBSTRING('Hello!!!', 1, 5),     -- --> Hello
    SUBSTRING('Hello!!!', 3);        -- --> llo!!!

SELECT 
	LOCATE('TWO', 'ONE TWO THREE'),  -- --> 5
    LOCATE('tWo', 'ONE TWO THREE'),  -- --> 5
    LOCATE('three', 'ONE TWO THREE'),  -- --> 9
    LOCATE('does-not-exists', 'ONE TWO THREE');  -- --> 0
    
SELECT
	REPLACE('https://www.amazon.com', 'amazon', 'google'), -- --> https://www.google.com
    REPLACE('https://www.amazon.com', 'Amazon', 'google'); -- --> https://www.amazon.com
    
		-- NOTE: the REPLACE function is case sensitive
        
SELECT CONCAT('hello', ' ',  'world', '!'); -- --> hello world!

-- -------------------------------------------------------------
-- DATE FUNCTIONS IN MYSQL
-- -------------------------------------------------------------
SELECT NOW(); -- --> getS the current date and time (local time zone)
SELECT CURDATE(); -- --> gets the current date
SELECT CURTIME(); -- --> gets the current time (local time zone)

SELECT YEAR('2024-08-16'); -- --> 2024
SELECT MONTH('2024-08-16'); -- --> 8
SELECT MONTHNAME('2024-08-16'); -- --> August
SELECT DAY('2024-08-16'); -- --> 16
SELECT DAYNAME('2024-08-16'); -- --> Friday

SELECT 
	HOUR('05:20:45'),     -- --> 5
	MINUTE('05:20:45'),   -- --> 20
    SECOND('05:20:45');   -- --> 45
    
SELECT EXTRACT(YEAR FROM '2024-08-16'); -- --> 2024
SELECT EXTRACT(MONTH FROM '2024-08-16'); -- --> 8
SELECT EXTRACT(DAY FROM '2024-08-16'); -- --> 16
SELECT EXTRACT(HOUR FROM '05:20:45'); -- --> 5
SELECT EXTRACT(MINUTE FROM '05:20:45'); -- --> 20
SELECT EXTRACT(SECOND FROM '05:20:45'); -- --> 45

SELECT EXTRACT(YEAR FROM NOW());

-- EXTRACT follows the SQL standard

SELECT *
FROM sql_store.orders
WHERE EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM NOW()); 
    

-- -------------------------------------------------------------
-- FORMATTING DATES AND TIMES
-- -------------------------------------------------------------
SELECT DATE_FORMAT('2024-08-16', '%W, %M %e, %Y'); -- --> Friday, August 16, 2024
SELECT TIME_FORMAT('17:20:45', '%r'); -- --> 05:20:45 PM

-- -------------------------------------------------------------
-- CALCULATING DATES AND TIMES
-- -------------------------------------------------------------

-- option #1 for adding dates and times
SELECT
	'2024-08-16 17:20:45' AS orig_date_time,
    DATE_ADD('2024-08-16 17:20:45', INTERVAL 1 SECOND) AS '1 SECOND ADDED',
    DATE_ADD('2024-08-16 17:20:45', INTERVAL 1 MINUTE) AS '1 MINUTE ADDED',
    DATE_ADD('2024-08-16 17:20:45', INTERVAL 1 HOUR) AS '1 HOUR ADDED',
    DATE_ADD('2024-08-16 17:20:45', INTERVAL 1 DAY) AS '1 DAY ADDED',
    DATE_ADD('2024-08-16 17:20:45', INTERVAL 1 WEEK) AS '1 WEEK ADDED',
    DATE_ADD('2024-08-16 17:20:45', INTERVAL 1 MONTH) AS '1 MONTH ADDED',
    DATE_ADD('2024-08-16 17:20:45', INTERVAL 1 YEAR) AS '1 YEAR ADDED';
    
-- option #2 for adding dates and times    
SELECT
	'2024-08-16 17:20:45' AS orig_date_time,
    '2024-08-16 17:20:45' + INTERVAL 1 SECOND AS '1 SECOND ADDED',
    '2024-08-16 17:20:45' + INTERVAL 1 MINUTE AS '1 MINUTE ADDED',
    '2024-08-16 17:20:45' + INTERVAL 1 HOUR AS '1 HOUR ADDED',
    '2024-08-16 17:20:45' + INTERVAL 1 DAY AS '1 DAY ADDED',
    '2024-08-16 17:20:45' + INTERVAL 1 WEEK AS '1 WEEK ADDED',
    '2024-08-16 17:20:45' + INTERVAL 1 MONTH AS '1 MONTH ADDED',
    '2024-08-16 17:20:45' + INTERVAL 1 YEAR AS '1 YEAR ADDED';
    
-- NOTE: to subtract some interval from a date/time, either use negative numbers (instead of positive numbers) or use DATE_SUB (instead of DATE_ADD)
-- NOTE: no timezone conversions (or changes) occur when adding to or subtracting from time

-- difference between dates and times
SELECT 
	DATEDIFF('2024-08-17', '2024-08-16'), -- --> 1 
    DATEDIFF('2024-08-16', '2024-08-17'); -- --> -1
    
SELECT
	TIMEDIFF('17:20:45', '17:19:45'), -- --> 00:01:00
	TIMEDIFF('17:19:45', '17:20:45'), -- --> -00:01:00
    TIMEDIFF('18:20:45', '17:19:45'), -- --> 01:01:00
    TIMEDIFF('17:20:45', '17:19:46'); -- --> 00:00:59
    
-- conversion of time to seconds
SELECT TIME_TO_SEC('01:01:00'); -- --> 3660  
	-- TIME_TO_SEC provides the time in seconds that has elapsed since midnight;
    

-- -------------------------------------------------------------
-- THE IFNULL AND COALESCE FUNCTIONS
-- -------------------------------------------------------------
SELECT
	order_id,
    shipper_id,
    comments,
    IFNULL(shipper_id, 'NOT ASSIGNED'),
    COALESCE(shipper_id, 'NOT ASSIGNED'),
    COALESCE(shipper_id, comments, 'NOT ASSIGNED')
FROM sql_store.orders;

-- EXPLANATION:
--   IFNULL(shipper_id, 'NOT ASSIGNED') means the following:
--     if shipper_id is not null, use shipper_id
--     if shipper_id is null, use the value 'NOT ASSIGNED'
--   COALESCE(shipper_id, 'NOT ASSIGNED') means the same as IFNULL(shipper_id, 'NOT ASSIGNED')
--   COALESCE(shipper_id, comments, 'NOT ASSIGNED') means the following:
--     if shipper_id is not null, use shipper_id
--     if shipper_id is null, then
--       if comments is not null, use comments
--       if comments is null, use the value 'NOT ASSIGNED'

SELECT 
	CONCAT(first_name, ' ', last_name) AS customer_fullname, 
    COALESCE(phone, 'Unknown') AS phone
FROM sql_store.customers;


-- -------------------------------------------------------------
-- THE IF FUNCTION
-- -------------------------------------------------------------
SELECT
	order_id,
    order_date,
    IF(EXTRACT(YEAR FROM order_date) = '2019', 'ACTIVE', 'ARCHIVED')  AS status
FROM sql_store.orders;

SELECT 
	p.product_id,
    p.name,
    COUNT(*) as num_of_orders,
	IF(COUNT(*) > 1, 'Many times', 'Once') AS frequency
FROM sql_store.products AS p
	JOIN sql_store.order_items AS oi
    ON p.product_id = oi.product_id
GROUP BY p.product_id, p.name;


-- -------------------------------------------------------------
-- THE CASE OPERATOR
-- -------------------------------------------------------------
SELECT
	order_id,
    order_date,
    CASE
		WHEN EXTRACT(YEAR FROM order_date) = '2019' THEN 'Active'
        WHEN EXTRACT(YEAR FROM order_date) = 2018 THEN 'Last Year'
        WHEN EXTRACT(YEAR FROM order_date) < 2018 THEN 'Archived'
        ELSE 'Future'
	END AS category
FROM sql_store.orders;

SELECT
	customer_id,
    CONCAT(first_name, ' ', last_name) AS fullname,
    points,
    CASE
		WHEN points < 2000 THEN 'Bronze'
        WHEN points BETWEEN 2000 AND 3000 THEN 'Silver' -- WHEN points <= 3000 THEN 'Silver'  <-- using this probably more preferable 
        ELSE 'Gold'
	END AS category
FROM sql_store.customers
ORDER BY points DESC;