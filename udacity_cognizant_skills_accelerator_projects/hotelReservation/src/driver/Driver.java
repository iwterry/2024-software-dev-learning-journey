package driver;

import java.util.Calendar;
import java.util.Date;
import model.Customer;
import model.Reservation;
import model.Room;
import model.RoomType;

public class Driver {

  public static void main(String[] args) {
    testCustomerEmail();
    testReservationDate();
  }

  private static void testCustomerEmail() {
    System.out.println("------ testCustomerEmail begins ------");

    Customer customer = new Customer("first", "second", "j@domain.com");
    System.out.println(customer);

    System.out.println();
    try {
      customer = new Customer("first", "second", "email");
      System.out.println(customer);
    } catch (IllegalArgumentException ex) {
      System.out.println("IllegalArgumentException occurred when testing invalid email format");
      System.out.println(ex.getLocalizedMessage());
    }

    System.out.println("----------- testCustomerEmail ends --------");
  }

  private static void testReservationDate() {
    System.out.println("---------- testReservationDate begins ---------");

    Calendar date2 = Calendar.getInstance();
    date2.setTime(new Date());

    try {
      Reservation reservation = new Reservation(
          new Customer("John", "Doe", "john.doe@example.com"),
          new Room("23", 2.3, RoomType.DOUBLE),
          new Date(),
          date2.getTime()
      );
    } catch(IllegalArgumentException ex) {
      System.out.println(
        "IllegalArgumentException occurred when testing check-out date is not after check-in date"
      );
      System.out.println(ex.getLocalizedMessage());
    }

    System.out.println();

    date2.add(Calendar.DATE,1);
    System.out.println(
        new Reservation(
            new Customer("John", "Doe", "john.doe@example.com"),
            new Room("23", 2.3, RoomType.DOUBLE),
            new Date(),
            date2.getTime()
        )
    );

    System.out.println("-------- testReservationDate ends -----------");
  }
}
