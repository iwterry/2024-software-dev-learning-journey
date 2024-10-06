package service.exception;

public class DuplicateRoomException extends RuntimeException {
  public DuplicateRoomException(String roomNumber) {
    super(String.format("Room with the given room number %s already exists", roomNumber));
  }
}
