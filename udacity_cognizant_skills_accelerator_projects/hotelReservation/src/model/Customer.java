package model;

import java.util.Objects;
import java.util.regex.Pattern;

public class Customer {
  private final String firstName;
  private final String lastName;
  private final String email;

  public Customer(String firstName, String lastName, String email) {
    if (firstName == null || firstName.isBlank()) {
      throw new IllegalArgumentException("First name must not be blank or null");
    }

    if (lastName == null || lastName.isBlank()) {
      throw new IllegalArgumentException("Last name must not be blank or null");
    }

    final String regExpr = "^(.+)@(.+)\\.com$";
    final Pattern pattern = Pattern.compile(regExpr);

    if (email == null || !pattern.matcher(email).matches()) {
      throw new IllegalArgumentException(
        "Email must not be null and must have the format name@domain.com"
      );
    }

    this.firstName = firstName.trim();
    this.lastName = lastName.trim();
    // assume email is case-insensitive
    this.email = email.trim().toLowerCase();
  }

  public final String getFirstName() {
    return firstName;
  }

  public final String getLastName() {
    return lastName;
  }

  public final String getEmail() {
    return email;
  }

  @Override
  public String toString() {
    return String.format(
      "First name: %s; lastName: %s; email: %s", firstName, lastName, email
    );
  }

  @Override
  public boolean equals(Object other) {
    if (this == other) return true;
    if (other == null || other.getClass() != getClass()) return false;
    // assume two customers are equal if both have the same email address
    return email.equals(((Customer)other).getEmail());
  }

  @Override
  public int hashCode() {
    return Objects.hashCode(email);
  }
}
