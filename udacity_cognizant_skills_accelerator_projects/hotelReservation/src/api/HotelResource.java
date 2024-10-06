package api;

import java.util.Collection;
import java.util.Date;
import model.AvailableRoomsSearchResults;
import model.Customer;
import model.IRoom;
import model.Reservation;
import service.CustomerService;
import service.ReservationService;

public class HotelResource {
  private final static HotelResource hotelResource = new HotelResource();
  private final CustomerService customerService;
  private final ReservationService reservationService;

  private HotelResource() {
    customerService = CustomerService.getInstance();
    reservationService = ReservationService.getInstance();
  }

  public Customer getCustomer(String email) {
    return customerService.getCustomer(email);
  }

  public void createACustomer(String email, String firstName, String lastName) {
    customerService.addCustomer(email, firstName, lastName);
  }

  public IRoom getRoom(String roomNumber) {
    return reservationService.getARoom(roomNumber);
  }

  public Reservation bookARoom(String email, IRoom room, Date checkinDate, Date checkoutDate) {
    return reservationService.reserveARoom(
      customerService.getCustomer(email), room, checkinDate, checkoutDate
    );
  }

  public Collection<Reservation> getCustomerReservations(String email) {
    return reservationService.getCustomerReservations(customerService.getCustomer(email));
  }

  public AvailableRoomsSearchResults findRooms(Date checkinDate, Date checkoutDate) {
    return reservationService.findRooms(checkinDate, checkoutDate);
  }

  public static HotelResource getInstance() {
    return hotelResource;
  }
}
