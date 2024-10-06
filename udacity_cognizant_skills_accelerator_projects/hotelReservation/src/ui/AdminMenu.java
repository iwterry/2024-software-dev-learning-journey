package ui;

import api.AdminResource;
import java.util.Collection;
import java.util.List;
import model.Customer;
import model.FreeRoom;
import model.IRoom;
import model.Room;
import model.RoomType;
import service.exception.DuplicateRoomException;
import ui.exception.InvalidUserInputChoiceException;
import ui.helper.UserInputHelper;

public class AdminMenu {
  private static final AdminResource adminResource = AdminResource.getInstance();

  public static void init(boolean hasReservationOccurred) {

    boolean isTimeToExit = false;

    while (!isTimeToExit) {
      System.out.println("\n----------- ADMIN MENU -------------");
      System.out.println("1. See all customers");
      System.out.println("2. See all rooms");
      System.out.println("3. See all reservations");
      System.out.println("4. Add a room");
      System.out.println("5. Back to main menu");
      System.out.println("-----------------------------------");

      try {
        final String userChoice = UserInputHelper.getTrimmedUserInputString(
          "Please enter a number from the menu above: "
        );

        switch (userChoice) {
          case "1":
            seeAllCustomers();
            break;
          case "2":
            seeAllRooms();
            break;
          case "3":
            seeAllReservations(hasReservationOccurred);
            break;
          case "4":
            addNewRoom();
            break;
          case "5":
            isTimeToExit = true;
            break;
          default:
            throw new InvalidUserInputChoiceException();
        }
      } catch (InvalidUserInputChoiceException ignored) { }
    }
  }

  private static void seeAllCustomers() {
    final Collection<Customer> allCustomers = adminResource.getAllCustomers();

    if (allCustomers.isEmpty()) {
      System.out.println("There are no customers.");
      return;
    }

    System.out.println("********** CUSTOMERS *********");
    for (Customer customer : allCustomers) {
      System.out.println(customer);
    }
    System.out.println("*******************************");
  }

  private static void seeAllRooms() {
    final Collection<IRoom> allRooms = adminResource.getAllRooms();

    if (allRooms.isEmpty()) {
      System.out.println("There are no rooms.");
      return;
    }

    System.out.println("********** ROOMS *********");
    for (IRoom room : allRooms) {
      System.out.println(room);
    }
    System.out.println("*******************************");
  }

  private static void seeAllReservations(boolean hasReservationOccurred) {
    if (!hasReservationOccurred) {
      System.out.println("There are no reservations.");
      return;
    }

    System.out.println("********** RESERVATIONS *********");
    adminResource.displayAllReservations();
    System.out.println("*******************************");
  }

  private static void addNewRoom() {
    do {
      final IRoom room = createRoom();

      try {
        adminResource.addRooms(List.of(room));
        final boolean isUserAddingAnotherRoom =UserInputHelper.getYesOrNoUserInput(
          "Would you like to add another room (Y for yes, N for no): "
        ) == 'Y';

        if (!isUserAddingAnotherRoom) return;
      } catch (DuplicateRoomException ex) {
        System.out.println(ex.getLocalizedMessage());
        return;
      }

    } while(true);
  }

  private static IRoom createRoom() {
    do {
      try {
        final String roomNumber = UserInputHelper.getTrimmedUserInputString(
          "Enter room number: "
        );
        final RoomType roomType = getRoomTypeFromAdmin();
        final double roomPrice = getRoomPriceFromAdmin();
        if (roomPrice == 0.0) return new FreeRoom(roomNumber, roomType);
        return new Room(roomNumber, roomPrice, roomType);
      } catch (IllegalArgumentException ex) {
        System.out.println(ex.getLocalizedMessage());
      }
    } while(true);
  }

  private static RoomType getRoomTypeFromAdmin() {
    String userInput;
    RoomType roomType = null;

    do {
      userInput = UserInputHelper.getTrimmedUserInputString(
        "Enter room type (1 for single room, 2 for double room): "
      );

      if (userInput.equals("1")) {
        roomType = RoomType.SINGLE;
      }
      if (userInput.equals("2")) {
        roomType = RoomType.DOUBLE;
      }
    } while(roomType == null);

    return roomType;
  }

  private static double getRoomPriceFromAdmin() {
    double roomPrice = -1.0;

    do {
      try {
        roomPrice = Double.parseDouble(
          UserInputHelper.getTrimmedUserInputString("Enter room price per night: $")
        );
      } catch (NumberFormatException ignored) { }
    } while(roomPrice < 0);

    return roomPrice;
  }



}
