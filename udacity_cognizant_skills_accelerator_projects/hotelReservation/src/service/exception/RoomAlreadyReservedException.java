package service.exception;

import java.util.Date;

public class RoomAlreadyReservedException extends RuntimeException {

  public RoomAlreadyReservedException(String roomNumber, Date checkinDate, Date checkoutDate) {
    super(String.format(
      "Room number %s is already reserved during check-in date (%tD) and check-out date (%tD), inclusively",
      roomNumber,
      checkinDate,
      checkoutDate
    ));
  }
}
