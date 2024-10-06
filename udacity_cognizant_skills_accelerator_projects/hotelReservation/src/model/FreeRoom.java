package model;

public class FreeRoom extends Room {
  public FreeRoom(String roomNumber, RoomType roomType) {
    super(roomNumber, 0.0, roomType);
  }

  @Override
  public String toString() {
    return String.format(
      "Room number: %s; Room type: %s bed room; Room price per day: Free",
      getRoomNumber(),
      getRoomType().toString().toLowerCase()
    );
  }
}
