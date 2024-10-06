-- ----------------------------------------
-- TRIGGERS
-- ----------------------------------------
-- a trigger is a block of SQL code that automatically gets executed before or after an INSERT, UPDATE, or DELETE statement.

DELIMITER $$

CREATE TRIGGER sql_invoicing.payments_after_insert
	AFTER INSERT ON sql_invoicing.payments
    FOR EACH ROW
BEGIN
	UPDATE sql_invoicing.invoices
    SET payment_total = payment_total + NEW.amount
    WHERE invoice_id = NEW.invoice_id;
END $$

DELIMITER ;

INSERT INTO sql_invoicing.payments (
	client_id,
    invoice_id,
    date,
    amount,
    payment_method
)
VALUES (
	5,
    3,
    '2019-01-01',
    10,
    1
);

SELECT * FROM sql_invoicing.invoices;


DELIMITER $$

CREATE TRIGGER sql_invoicing.payments_after_delete
	AFTER DELETE ON sql_invoicing.payments
    FOR EACH ROW
BEGIN
	UPDATE sql_invoicing.invoices
    SET    payment_total = payment_total - OLD.amount
    WHERE  invoice_id = OLD.invoice_id;
END $$

DELIMITER ;

DELETE FROM sql_invoicing.payments
WHERE payment_id = LAST_INSERT_ID();

SELECT * FROM sql_invoicing.invoices;

-- ---------------------------------------------------
-- VIEWING TRIGGERS
-- ---------------------------------------------------
SHOW TRIGGERS FROM sql_invoicing;


-- ----------------------------------------------------
-- DROPPING TRIGGERS
-- ---------------------------------------------------
DROP TRIGGER IF EXISTS sql_invoicing.payments_after_insert;


-- -------------------------------------------------------
-- USING TRIGGERS FOR AUDITING
-- -------------------------------------------------------
DELIMITER $$

CREATE TRIGGER sql_invoicing.payments_after_insert
	AFTER INSERT ON sql_invoicing.payments
    FOR EACH ROW
BEGIN
	UPDATE sql_invoicing.invoices
    SET payment_total = payment_total + NEW.amount
    WHERE invoice_id = NEW.invoice_id;
    
    -- the following is used for auditing
    INSERT INTO sql_invoicing.payments_audit
    VALUES (
		NEW.client_id, new.date, new.amount, 'INSERT', NOW()
    );
END $$

DELIMITER ;

INSERT INTO sql_invoicing.payments (
	client_id,
    invoice_id,
    date,
    amount,
    payment_method
)
VALUES (
	5,
    3,
    '2019-01-01',
    10,
    1
);

SELECT * FROM sql_invoicing.invoices;
SELECT * FROM sql_invoicing.payments_audit;

-- -------------------------------------------------
-- EVENTS
-- ------------------------------------------------
-- an event is a task (or block of SQL code) that gets executed according to a schedule

