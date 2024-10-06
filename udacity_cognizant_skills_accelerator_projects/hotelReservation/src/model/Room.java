package model;

import java.util.Objects;
import java.util.regex.Pattern;

public class Room implements IRoom {
  private final String roomNumber;
  private final Double roomPrice;
  private final RoomType roomType;

  public Room(String roomNumber, Double roomPrice, RoomType roomType) {
    if (roomNumber == null || roomNumber.isBlank()) {
      throw new IllegalArgumentException("Room number must not be null or blank");
    }

    final String regExpr = "(.+)(\\.\\d{3,})";
    final Pattern pattern = Pattern.compile(regExpr);

    if (roomPrice == null || roomPrice.isNaN() || roomPrice.isInfinite() || roomPrice < 0) {
      throw new IllegalArgumentException("Room price must be a finite and non-negative");
    }

    if (pattern.matcher(roomPrice.toString()).matches()) {
      throw new IllegalArgumentException(
        "Room price must not have more than two digits after decimal point"
      );
    }

    if (roomType == null) {
      throw new IllegalArgumentException("Room type cannot be null");
    }

    // assume room number is case-insensitive
    this.roomNumber = roomNumber.trim().toLowerCase();
    this.roomPrice = roomPrice;
    this.roomType = roomType;
  }

  @Override
  public final String getRoomNumber() {
    return roomNumber;
  }

  @Override
  public final Double getRoomPrice() {
    return roomPrice;
  }

  @Override
  public final RoomType getRoomType() {
    return roomType;
  }

  @Override
  public final boolean isFree() {
    return roomPrice.equals(0.0);
  }

  @Override
  public String toString() {
    return String.format(
      "Room number: %s; Room type: %s bed room; Room price per day: $%.2f",
      roomNumber,
      roomType.toString().toLowerCase(),
      roomPrice
    );
  }

  @Override
  public boolean equals(Object other) {
    if (this == other) return true;
    if (!(other instanceof IRoom)) return false;
    // assume two rooms are equal if they have the same room number
    return roomNumber.equals(((IRoom) other).getRoomNumber());
  }

  @Override
  public int hashCode() {
    return Objects.hashCode(roomNumber);
  }
}
