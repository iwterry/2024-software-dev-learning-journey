package api;

import java.util.Collection;
import java.util.List;
import model.Customer;
import model.IRoom;
import service.CustomerService;
import service.ReservationService;

public class AdminResource {
  private static final AdminResource adminResource = new AdminResource();
  private final CustomerService customerService;
  private final ReservationService reservationService;

  private AdminResource() {
    customerService = CustomerService.getInstance();
    reservationService = ReservationService.getInstance();
  }

  public Customer getCustomer(String email) {
    return customerService.getCustomer(email);
  }

  public void addRooms(List<IRoom> rooms) {
    for (IRoom room : rooms) {
      reservationService.addRoom(room);
    }
  }

  public Collection<IRoom> getAllRooms() {
    return reservationService.getAllRooms();
  }

  public Collection<Customer> getAllCustomers() {
    return customerService.getAllCustomers();
  }

  public void displayAllReservations() {
    reservationService.printAllReservations();
  }

  public static AdminResource getInstance() {
    return adminResource;
  }
}
