package ui;

import api.HotelResource;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Date;
import model.AvailableRoomsSearchResults;
import model.Customer;
import model.IRoom;
import model.Reservation;
import service.exception.CustOverlappingReservationsException;
import service.exception.DuplicateCustomerEmailException;
import service.exception.RoomAlreadyReservedException;
import ui.exception.InvalidUserInputChoiceException;
import ui.helper.UserInputHelper;

public class MainMenu {
  private final static HotelResource hotelResource = HotelResource.getInstance();
  private static boolean hasReservationOccurred = false;

  public static void init() {
    boolean isTimeToExit = false;

    System.out.println("Welcome to the Hotel Reservation Application!");

    while (!isTimeToExit) {
      System.out.println("\n----------- MAIN MENU -------------");
      System.out.println("1. Find and reserve a room");
      System.out.println("2. See my reservations");
      System.out.println("3. Create an account");
      System.out.println("4. Admin");
      System.out.println("5. Exit");
      System.out.println("-----------------------------------");

      try {
        final String userChoice = UserInputHelper.getTrimmedUserInputString(
          "Please enter a number from the menu above: "
        );

        switch (userChoice) {
          case "1":
            findAndReserveARoom();
            break;
          case "2":
            viewUserReservations();
            break;
          case "3":
            createUserAccount();
            break;
          case "4":
            AdminMenu.init(hasReservationOccurred);
            break;
          case "5":
            System.out.println("Goodbye!");
            isTimeToExit = true;
            break;
          default:
            throw new InvalidUserInputChoiceException();
        }

      } catch (InvalidUserInputChoiceException ignored) { }
    }
  }

  private static void findAndReserveARoom() {
    final Date[] checkinAndCheckoutDates = getCheckinAndCheckoutDatesFromUser();
    Date checkinDate = checkinAndCheckoutDates[0];
    Date checkoutDate = checkinAndCheckoutDates[1];

    final AvailableRoomsSearchResults searchResults = hotelResource.findRooms(
      checkinDate, checkoutDate
    );

    if (!searchResults.isAnyRoomAvailable()) {
      System.out.println("Sorry, there are no rooms available.");
      return;
    }

    final Collection<IRoom> availableRooms = searchResults.getAvailableRooms();
    checkinDate = searchResults.getCheckinDate();
    checkoutDate = searchResults.getCheckoutDate();

    displayAvailableRooms(checkinDate, checkoutDate, availableRooms);

    final boolean isUserBookingRoom = UserInputHelper.getYesOrNoUserInput(
      "Would you like to book a room (Y for yes, N for no)? "
    ) == 'Y';

    if (!isUserBookingRoom) return;

    final Customer customer = getCustomerAccountFromUserInput();
    final IRoom room = findRoomFromUserInput();

    makeReservation(customer, room, checkinDate, checkoutDate);
  }

  private static void viewUserReservations() {
    Collection<Reservation> customerReservations = hotelResource.getCustomerReservations(
      UserInputHelper.getTrimmedUserInputString("Enter email: ")
    );

    if (customerReservations.isEmpty()) {
      System.out.println("There are no recommendations for the given email");
      return;
    }

    System.out.println("************ RESERVATIONS ************");
    for (Reservation reservation : customerReservations) {
      System.out.println("********** RESERVATION ***********");
      System.out.println(reservation);
      System.out.println("***********************************");
    }
    System.out.println("****************************************");
  }

  private static Customer createUserAccount() {
    final String firstName = UserInputHelper.getTrimmedUserInputString("Enter first name: ");
    final String lastName = UserInputHelper.getTrimmedUserInputString("Enter last name: ");
    String email;

    do {
      email = UserInputHelper.getTrimmedUserInputString("Enter email: ");
      try {
        hotelResource.createACustomer(email, firstName, lastName);
        return hotelResource.getCustomer(email);
      } catch (IllegalArgumentException | DuplicateCustomerEmailException ex) {
        System.out.println(ex.getLocalizedMessage());
      }
    } while(true);
  }

  private static void makeReservation(
      Customer customer, IRoom room, Date checkinDate, Date checkoutDate
  ) {

    try {
      final Reservation reservation = hotelResource.bookARoom(
        customer.getEmail(), room, checkinDate, checkoutDate
      );
      hasReservationOccurred = true;
      System.out.println("******** RESERVATION *********");
      System.out.println(reservation);
      System.out.println("******************************");
    } catch(CustOverlappingReservationsException | RoomAlreadyReservedException ex) {
      System.out.println("You are unable to make this reservation.");
      System.out.println(ex.getLocalizedMessage());
    }
  }

  private static void displayAvailableRooms(
    Date checkinDate, Date checkoutDate, Collection<IRoom> availableRooms
  ) {

    final SimpleDateFormat formatter = new SimpleDateFormat("MMMM dd, yyyy");
    System.out.println("******* ROOMS FOUND **********");

    System.out.printf(
      "\nWe have available the following rooms for check-in date %s, and check-out date %s:\n",
      formatter.format(checkinDate),
      formatter.format(checkoutDate)
    );

    for (IRoom availableRoom : availableRooms) {
      System.out.println(availableRoom);
    }

    System.out.println("********************************");
  }

  private static IRoom findRoomFromUserInput() {
    IRoom room;

    do {
      room = hotelResource.getRoom(UserInputHelper.getTrimmedUserInputString(
        "Enter room number to you want to reserve: "
      ));

      if (room != null) break;

      System.out.println("No room can be found for the given room number. Please try again.");
    } while (true);

    return room;
  }

  private static Customer getCustomerAccountFromUserInput() {
    final boolean hasExistingCustomerAccount = UserInputHelper.getYesOrNoUserInput(
        "Do you have already have account (Y for yes, N for no)? "
    ) == 'Y';
    Customer customer;

    if (hasExistingCustomerAccount) {
      do {
        customer = hotelResource.getCustomer(UserInputHelper.getTrimmedUserInputString(
          "Enter email (format: name@domain.com): "
        ));

        if (customer != null) break;

        System.out.println("No customer is found with the given email. Please try again.");
      } while(true);
    } else {
      customer = createUserAccount();
    }

    return customer;
  }

  private static Date[] getCheckinAndCheckoutDatesFromUser() {
    final Date now = new Date();
    Date checkinDate, checkoutDate;

    do {
      checkinDate = UserInputHelper.getUserInputDate(
        "Enter check-in date (format: mm/dd/yyyy example: 1/2/2024 or 01/02/2024): "
      );

      if (checkinDate.after(now)) break;

      System.out.println("Check-in date must be after today's date");
    } while(true);

    do {
      checkoutDate = UserInputHelper.getUserInputDate(
        "Enter check-out date (format: mm/dd/yyyy example: 1/2/2024 or 01/02/2024): "
      );

      if (checkoutDate.after(checkinDate)) break;

      System.out.println("Check-out date must be after check-in date");
    } while(true);

    return new Date[] { checkinDate, checkoutDate };
  }
}
