package service.exception;

public class RoomNotAddedException extends RuntimeException {

  public RoomNotAddedException(String roomNumber) {
    super(String.format("The room %s has not been added", roomNumber));
  }
}
