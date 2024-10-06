package model;

import java.util.Date;
import java.util.Objects;

public class Reservation {
  private final Customer customer;
  private final IRoom room;
  private final Date checkinDate;
  private final Date checkoutDate;

  public Reservation(Customer customer, IRoom room, Date checkinDate, Date checkoutDate) {
    if (customer == null || room == null || checkinDate == null || checkoutDate == null) {
      throw new IllegalArgumentException("A null argument was given");
    }

    if (!checkoutDate.after(checkinDate)) {
      throw new IllegalArgumentException("Check-out date must be after check-in date");
    }

    this.customer = customer;
    this.room = room;
    this.checkinDate = checkinDate;
    this.checkoutDate = checkoutDate;
  }

  public final Date getCheckinDate() {
    return checkinDate;
  }

  public final Date getCheckoutDate() {
    return checkoutDate;
  }

  public final IRoom getRoom() {
    return room;
  }

  public final Customer getCustomer() {
    return customer;
  }

  @Override
  public String toString() {
    final double roomPrice = room.getRoomPrice();

    return """
      Name: %s %s (%s)
      Room: %s - %s bedroom room
      Price: %s
      Check-in date: %s
      Check-out date: %s""".formatted(
        customer.getFirstName(),
        customer.getLastName(),
        customer.getEmail(),
        room.getRoomNumber(),
        room.getRoomType().toString().toLowerCase(),
        (roomPrice == 0.0) ? "Free" : String.format("$%.2f", roomPrice),
        getFormattedDate(checkinDate),
        getFormattedDate(checkoutDate)
      );
  }

  private static String getFormattedDate(Date date) {
    final String[] dateComponents = date.toString().split(" ");

    return String.format(
      "%s, %s %s, %s", dateComponents[0], dateComponents[1], dateComponents[2], dateComponents[5]
    );
  }

  @Override
  public boolean equals(Object other) {
    if (this == other) return true;
    if (other == null || getClass() != other.getClass()) return false;

    Reservation otherReservation = (Reservation) other;

    return customer.equals(otherReservation.getCustomer()) &&
          checkinDate.equals(otherReservation.getCheckinDate()) &&
          checkoutDate.equals(otherReservation.getCheckoutDate());
  }

  @Override
  public int hashCode() {
    return Objects.hash(customer, checkinDate, checkoutDate);
  }
}
