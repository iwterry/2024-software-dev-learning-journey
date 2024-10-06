package ui;

import java.util.Scanner;
import ui.helper.UserInputHelper;

public class HotelApplication {

  public static void main(String[] args) {
    try(Scanner scanner = new Scanner(System.in)) {
      UserInputHelper.setScanner(scanner);
      MainMenu.init();
    }
  }

}
