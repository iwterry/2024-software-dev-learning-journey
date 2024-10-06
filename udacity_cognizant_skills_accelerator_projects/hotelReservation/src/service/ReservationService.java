package service;

import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import model.AvailableRoomsSearchResults;
import model.Customer;
import model.IRoom;
import model.Reservation;
import service.exception.CustOverlappingReservationsException;
import service.exception.DuplicateRoomException;
import service.exception.RoomAlreadyReservedException;
import service.exception.RoomNotAddedException;

public class ReservationService {
  private final static ReservationService reservationService = new ReservationService();
  private final Collection<Reservation> reservations;
  private final Map<String, IRoom> roomMap;

  private ReservationService() {
    reservations = new HashSet<>();
    roomMap = new HashMap<>();
  }

  public void addRoom(IRoom newRoom) {
    if (newRoom == null) {
      throw new IllegalArgumentException("A null argument is not allowed");
    }

    final String roomNumber = newRoom.getRoomNumber().toLowerCase();

    if (roomMap.containsKey(roomNumber)) {
      throw new DuplicateRoomException(roomNumber);
    }

    roomMap.put(roomNumber, newRoom);
  }

  public IRoom getARoom(String roomNumber) {
    if (roomNumber == null) {
      throw new IllegalArgumentException("A null argument is not allowed");
    }
    return roomMap.get(roomNumber.toLowerCase());
  }

  public Collection<IRoom> getAllRooms() {
    return roomMap.values();
  }

  private Collection<IRoom> findUnreservedRooms(Date checkinDate, Date checkoutDate) {
    final Collection<IRoom> reservedRooms = findReservedRooms(reservations, checkinDate, checkoutDate);

    final Collection<IRoom> unreservedRooms = new HashSet<>();
    final Collection<IRoom> allRooms = roomMap.values();

    for (IRoom room : allRooms) {
      if (!reservedRooms.contains(room)) {
        unreservedRooms.add(room);
      }
    }

    return unreservedRooms;
  }

  private static Collection<IRoom> findReservedRooms(
    Collection<Reservation> reservations, Date checkinDate, Date checkoutDate
  ) {

    final Collection<IRoom> reservedRooms = new HashSet<>();
    for (Reservation reservation : reservations) {
      if (!(
        checkinDate.after(reservation.getCheckoutDate()) ||
        checkoutDate.before(reservation.getCheckinDate())
      )) {

        reservedRooms.add(reservation.getRoom());
      }
    }
    return reservedRooms;
  }

  /**
   * Reserves the hotel room for the customer from check-in date to check-out date (inclusively).
   * <ol>
   *   <li>
   *     If any arguments given to the method is null, an {@link IllegalArgumentException} occurs.
   *   </li>
   *  <li>
   *    If the hotel room is not a room that has been added previously, then
   *    {@link RoomNotAddedException} occurs.
   *  </li>
   *  <li>
   *    If the customer has an existing reservation during these dates (inclusively), a
   *    {@link CustOverlappingReservationsException} occurs.
   *  </li>
   *  <li>
   *    If the room is already reserved during these dates (inclusively), a
   *    {@link RoomAlreadyReservedException} occurs.
   *   </li>
   * </ol>
   *
   * <p>
   *   As an example, assume that a customer reserves room A for September 2, 2024
   *   (the check-in date) through September 4, 2024 (the check-out date). If this
   *   customer makes another reservation that includes September 2nd, 3rd, or 4th,
   *   {@link CustOverlappingReservationsException} occurs. If a different customer
   *   tries to make a reservation for the room A on days that include September 2nd,
   *   3rd, or 4th, {@link RoomAlreadyReservedException} occurs.
   * </p>
   *
   * @param customer The customer that the reservation is for
   * @param room The hotel room being reserved
   * @param checkinDate The check-in date for the reservation
   * @param checkoutDate The check-out date for the reservation
   * @return The reservation that has been made.
   */
  public Reservation reserveARoom(
    Customer customer, IRoom room, Date checkinDate, Date checkoutDate
  ) {

    if (customer == null || room == null || checkinDate == null || checkoutDate == null) {
      throw new IllegalArgumentException("A null argument is not allowed.");
    }
    // check to make sure the room exists

    if (!roomMap.containsKey(room.getRoomNumber()) ) {
      throw new RoomNotAddedException(room.getRoomNumber());
    }

    /*
      Check to make sure the customer is not attempting to make multiple reservations
      within the range of check-in and check-out dates
    */

    final Collection<IRoom> customerReservedRoomsInSameDates = findReservedRooms(
      getCustomerReservations(customer), checkinDate, checkoutDate
    );

    if (!customerReservedRoomsInSameDates.isEmpty()) {
      throw new CustOverlappingReservationsException(customer.getEmail(), checkinDate, checkoutDate);
    }

    //  check to make sure the room is not already reserved

    final Collection<IRoom> unreservedRooms = findUnreservedRooms(checkinDate, checkoutDate);
    if (!unreservedRooms.contains(room)) {
      throw new RoomAlreadyReservedException(room.getRoomNumber(), checkinDate, checkoutDate);
    }

    // make reservation

    final Reservation newReservation = new Reservation(customer, room, checkinDate, checkoutDate);
    reservations.add(newReservation);

    return newReservation;
  }

  /**
   * Gets the collection of hotel rooms that are available from check-in date to
   * check-out date (inclusively).
   * Throws {@link IllegalArgumentException} if any argument is null.
   *
   * <p>
   *   If there are no hotel rooms available between the check-in date and check-out (inclusively),
   *   then a search for hotel rooms that are available between check-in date + 7 days and
   *   check-out date + 7 days (inclusively) is performed.
   * </p>
   *
   * <p>
   *   As an example, if room A is reserved for September 2, 2024, through September 4th, 2024,
   *   then room A will not be an available room for September 2nd, 3rd, and 4th.
   * </p>
   *
   * @param checkinDate The check-in date used for searching for available rooms
   * @param checkoutDate The check-out date used for searching for available rooms
   * @return An {@link AvailableRoomsSearchResults} object that contains
   * any available rooms found and during which check-in and check-out dates
   * available rooms found (if any available rooms were found), inclusively.
   */
  public AvailableRoomsSearchResults findRooms(Date checkinDate, Date checkoutDate) {
    if (checkinDate == null || checkoutDate == null) {
      throw new IllegalArgumentException("A null argument is not allowed");
    }

    final Calendar checkinDateCal = Calendar.getInstance();
    final Calendar checkoutDateCal = Calendar.getInstance();
    final byte NUM_DAYS_TO_INCREMENT = 7;

    Collection<IRoom> unreservedRooms = findUnreservedRooms(checkinDate, checkoutDate);

    if (!unreservedRooms.isEmpty()) {
      return new AvailableRoomsSearchResults(unreservedRooms, checkinDate, checkoutDate);
    }

    /*
      search again for unreserved rooms with alternative dates because there are no
      unreserved rooms for the original given check-in and check-out times
    */

    checkinDateCal.setTime(checkinDate);
    checkoutDateCal.setTime(checkoutDate);
    checkinDateCal.add(Calendar.DATE, NUM_DAYS_TO_INCREMENT);
    checkoutDateCal.add(Calendar.DATE, NUM_DAYS_TO_INCREMENT);

    final Date alternativeCheckinDate = checkinDateCal.getTime();
    final Date alternativeCheckoutDate = checkoutDateCal.getTime();

    unreservedRooms = findUnreservedRooms(alternativeCheckinDate, alternativeCheckoutDate);

    return new AvailableRoomsSearchResults(
      unreservedRooms, alternativeCheckinDate, alternativeCheckoutDate
    );
  }

  public Collection<Reservation> getCustomerReservations(Customer customer) {
    final Collection<Reservation> customerReservations = new HashSet<>();

    for (Reservation reservation : reservations) {
      if (reservation.getCustomer().equals(customer)) {
        customerReservations.add(reservation);
      }
    }

    return customerReservations;
  }

  public static ReservationService getInstance() {
    return reservationService;
  }

  public void printAllReservations() {

    for (Reservation reservation : reservations) {
      System.out.println(reservation);
      System.out.println();
    }
  }
}
