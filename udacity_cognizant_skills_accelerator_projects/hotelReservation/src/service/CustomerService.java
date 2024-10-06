package service;

import java.util.Collection;
import java.util.HashSet;
import model.Customer;
import service.exception.DuplicateCustomerEmailException;

public class CustomerService {
  private final static CustomerService customerService = new CustomerService();
  private final Collection<Customer> customers;

  private CustomerService() {
    customers = new HashSet<>();
  }

  public void addCustomer(String email, String firstName, String lastName) {
    final Customer newCustomer = new Customer(firstName, lastName, email);

    if (customers.contains(newCustomer)) {
      throw new DuplicateCustomerEmailException(email);
    }

    customers.add(newCustomer);
  }

  public Customer getCustomer(String customerEmail) {
    for (Customer customer : customers) {
      if (customer.getEmail().equalsIgnoreCase(customerEmail)) return customer;
    }

    return null;
  }

  public Collection<Customer> getAllCustomers() {
    // return a copy of the collection of customers to avoid client altering data of the class
    return new HashSet<>(customers);
  }

  public static CustomerService getInstance() {
    return customerService;
  }
}
