package model;

import java.util.Collection;
import java.util.Collections;
import java.util.Date;

public class AvailableRoomsSearchResults {
  private final Collection<IRoom> availableRooms;
  private final Date checkinDate;
  private final Date checkoutDate;
  private final boolean isAnyRoomAvailable;

  public AvailableRoomsSearchResults(
    Collection<IRoom> availableRooms, Date checkinDate, Date checkoutDate
  ) {

    isAnyRoomAvailable = !(availableRooms == null) && !availableRooms.isEmpty();

    if (availableRooms == null) {
      this.availableRooms = Collections.emptySet();
    } else {
      this.availableRooms = availableRooms;
    }

    this.checkinDate = checkinDate;
    this.checkoutDate = checkoutDate;
  }

  public Collection<IRoom> getAvailableRooms() {
    return availableRooms;
  }

  public boolean isAnyRoomAvailable() {
    return isAnyRoomAvailable;
  }

  public Date getCheckoutDate() {
    return checkoutDate;
  }

  public Date getCheckinDate() {
    return checkinDate;
  }
}
