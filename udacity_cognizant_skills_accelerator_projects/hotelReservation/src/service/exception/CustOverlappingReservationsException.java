package service.exception;

import java.util.Date;

public class CustOverlappingReservationsException extends RuntimeException{
  public CustOverlappingReservationsException(String email, Date checkinDate, Date checkoutDate) {
    super(String.format(
      "Customer %s has a room reserved during check-in date (%tD) and check-out date (%tD), inclusively",
      email,
      checkinDate,
      checkoutDate
    ));
  }
}
