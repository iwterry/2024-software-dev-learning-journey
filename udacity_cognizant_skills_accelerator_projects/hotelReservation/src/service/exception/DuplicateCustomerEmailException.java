package service.exception;

public class DuplicateCustomerEmailException extends RuntimeException {
  public DuplicateCustomerEmailException(String email) {
    super(String.format("Customer with the given email %s already exist", email));
  }
}
