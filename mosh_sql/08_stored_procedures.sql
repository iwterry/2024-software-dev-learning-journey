-- ------------------------------------------
-- CREATING A STORED PROCEDURE
-- ------------------------------------------
DELIMITER $$ 
-- note that the default delimiter needed to be changed

CREATE PROCEDURE sql_invoicing.get_clients()
BEGIN
	SELECT * FROM sql_invoicing.clients;
END$$

DELIMITER ; 
-- note that the default delimiter needed to be changed back

CALL sql_invoicing.get_clients();



DELIMITER $$

CREATE PROCEDURE sql_invoicing.get_invoices_with_balance()
BEGIN
	SELECT *
    FROM sql_invoicing.invoices
    WHERE invoice_total - payment_total > 0;
END$$

DELIMITER ;

CALL sql_invoicing.get_invoices_with_balance();


-- -------------------------------------------------
-- DROPPING STORED PROCEDURES
-- -------------------------------------------------
-- you can drop a procedure using the following approach:
DROP PROCEDURE sql_invoicing.get_clients;

-- but a better approach is to use the following because you will not get an error if the stored procedure does not exists:
DROP PROCEDURE IF EXISTS sql_invoicing.get_clients;

-- --------------------------------------------------
-- ADD INPUT PARAMETERS TO A STORED PROCEDURE
-- --------------------------------------------------
DELIMITER $$

CREATE PROCEDURE sql_invoicing.get_clients_by_state(
	state CHAR(2)
)
BEGIN
	SELECT *
    FROM sql_invoicing.clients AS c
    WHERE c.state = state;
    -- to distinguish the parameter called state from the column name called state, an alias called c is used for the table name
END $$

DELIMITER ;

CALL sql_invoicing.get_clients_by_state('NY');

-- what if no argument is supplied
CALL sql_invoicing.get_clients_by_state();
-- notice that an error occurred because the incorrect nummber of arguments were given



DELIMITER $$

CREATE PROCEDURE sql_invoicing.get_invoices_by_client(
	client_id INT
)
BEGIN
	SELECT *
    FROM sql_invoicing.invoices AS i
    WHERE i.client_id = client_id;
END $$

DELIMITER ;

CALL sql_invoicing.get_invoices_by_client(1);

-- ---------------------------------------------
-- PARAMETERS WITH DEFAULT VALUES
-- ---------------------------------------------
DROP PROCEDURE IF EXISTS sql_invoicing.get_clients_by_state;

DELIMITER $$

CREATE PROCEDURE sql_invoicing.get_clients_by_state(
	state CHAR(2)
)
BEGIN
	IF state IS NULL THEN
		SET state = 'CA';
	END IF;
    
	SELECT *
    FROM sql_invoicing.clients AS c
    WHERE c.state = state;
END $$

DELIMITER ;

CALL sql_invoicing.get_clients_by_state(NULL);



DROP PROCEDURE IF EXISTS sql_invoicing.get_clients_by_state;

DELIMITER $$

CREATE PROCEDURE sql_invoicing.get_clients_by_state(
	state CHAR(2)
)
BEGIN
	IF state IS NULL THEN
		SELECT *
		FROM sql_invoicing.clients;
	ELSE
    	SELECT *
		FROM sql_invoicing.clients AS c
		WHERE c.state = state;
	END IF;
END $$

DELIMITER ;

CALL sql_invoicing.get_clients_by_state('ny');


DELIMITER $$

CREATE PROCEDURE sql_invoicing.get_payments(
	client_id INT,
    payment_method_id TINYINT
)
BEGIN
	SELECT *
    FROM sql_invoicing.payments AS p
    WHERE p.client_id = IFNULL(client_id, p.client_id) AND 
		  p.payment_method = IFNULL(payment_method_id, p.payment_method);
	-- NOTE: the use of IFNULL here is a trick because p.client_id = p.client_id is always true (and so is p.payment_method = p.payment_method) 
END $$

DELIMITER ;

CALL sql_invoicing.get_payments(NULL, NULL);
CALL sql_invoicing.get_payments(3, 1);
CALL sql_invoicing.get_payments(5, NULL);
CALL sql_invoicing.get_payments(NULL, 1);


-- ------------------------------------
-- PARAMETER VALIDATION
-- ------------------------------------
DROP PROCEDURE IF EXISTS sql_invoicing.make_payment;

DELIMITER $$

CREATE PROCEDURE sql_invoicing.make_payment(
	invoice_id INT,
    payment_amount DECIMAL(9, 2),
    payment_date DATE
)
BEGIN
	-- generate an error when the payment amount is not greater than 0
	IF payment_amount <= 0 THEN
		SIGNAL SQLSTATE '22003'
			SET MESSAGE_TEXT = 'payment amount must be greater than 0';
    END IF;
    
	UPDATE sql_invoicing.invoices AS i
    SET
		i.payment_total = payment_amount,
        i.payment_date = payment_date
	WHERE i.invoice_id = invoice_id;
END $$

DELIMITER ;
CALL sql_invoicing.make_payment(2, 100, '2019-01-01');

-- the following call to the procedure will generate an error because the payment amount is not greater than 0
CALL sql_invoicing.make_payment(2, -100, '2019-01-01');


-- -----------------------------------
-- OUTPUT PARAMETERS
-- -----------------------------------
DELIMITER $$
-- by default, all parameters are input parameters  
-- use the OUT keyword before the parameter name to indicate that the parameter is an output parameter
CREATE PROCEDURE sql_invoicing.get_unpaid_invoices_for_client(
	client_id INT,
    OUT invoices_count INT,
    OUT invoices_total DECIMAL(9, 2)
)
BEGIN
	-- use the INTO keyword in the SELECT statement to store the values in the output parameters
	SELECT COUNT(*), SUM(invoice_total)
		INTO invoices_count, invoices_total
    FROM invoices AS i
    WHERE i.client_id = client_id AND i.payment_total = 0;
END $$

DELIMITER ;

-- define  and initialize the variables that will be passed as arguments to the output parameters in the procedure
SET @invoices_count = 0;
SET @invoices_total = 0;
-- call the procedure using the variables defined
CALL sql_invoicing.get_unpaid_invoices_for_client(3, @invoices_count, @invoices_total);
-- view the values of the variables after the procedure has been called
SELECT @invoices_count, @invoices_total;


-- ------------------------------------------
-- VARIABLES 
-- ------------------------------------------
-- there are two types of variables:
--  - user (or session) variables and are prefixed with @
--  - local variables that are defined inside a stored procedure or function
DELIMITER $$

CREATE PROCEDURE sql_invoicing.get_risk_factor(
	OUT risk_factor DECIMAL(9, 2)
)
BEGIN
	-- declaring local variables
	DECLARE invoices_total DECIMAL(9, 2);
    DECLARE invoices_count INT;
    
    SELECT COUNT(*), SUM(invoice_total)
		INTO invoices_count, invoices_total
	FROM sql_invoicing.invoices;
    
    SET risk_factor = invoices_total / invoices_count  * 5;
END $$

DELIMITER ;

-- defining user (or session) variable
SET @risk_factor = 0;
CALL sql_invoicing.get_risk_factor(@risk_factor);
SELECT @risk_factor;

-- --------------------------------------------------
-- FUNCTIONS
-- --------------------------------------------------
-- functions are similar to stored procedures, but functions can only return a single value (and not return result sets with multiple rows/columns)

-- every mysql function should have at least one attribute (and have more than one attribute; the following are some of the attributes:
--  - DETERMINISTIC
--    - if you give the function the same arguments, then you should get the same result each time
--    - your function cannot depend on the data in your database because the data can change and this could cause the result to change (even when you give the same arguments to the function)
--  - READS SQL DATA
--    - has a SELECT statement to read data from the database
--  - MODIFIES SQL DATA
--    - has an INSERT, UPDATE, or DELETE statement to modify the database

DROP FUNCTION IF EXISTS sql_invoicing.get_risk_factor_for_client;

DELIMITER $$

CREATE FUNCTION sql_invoicing.get_risk_factor_for_client(
	client_id INT
)
RETURNS INTEGER -- this function will return an integer
READS SQL DATA -- this function will use a SELECT statement
BEGIN
	DECLARE risk_factor DECIMAL(9, 2) DEFAULT 0;
	DECLARE invoices_total DECIMAL(9, 2);
    DECLARE invoices_count INT;
    
    SELECT COUNT(*), SUM(invoice_total)
		INTO invoices_count, invoices_total
	FROM sql_invoicing.invoices AS i
    WHERE i.client_id = client_id;
    
    SET risk_factor = invoices_total/ invoices_count  * 5;
    
	RETURN IFNULL(risk_factor, 0); -- using the RETURN statement
END $$

DELIMITER ;

-- using the function in a SELECT statement
SELECT
	client_id,
    name,
    sql_invoicing.get_risk_factor_for_client(client_id) AS client_risk_factor
FROM sql_invoicing.clients;