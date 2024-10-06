package ui.helper;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Scanner;

public class UserInputHelper {
  private static Scanner scanner;

  public static void setScanner(Scanner scanner) {
    UserInputHelper.scanner = scanner;
  }

  public static char getYesOrNoUserInput(String prompt) {
    String userInput;

    do {
      System.out.print(prompt);
      userInput = scanner.nextLine().trim().toUpperCase();
    } while (!userInput.equals("Y") && !userInput.equals("N"));

    return userInput.charAt(0);
  }

  public static String getTrimmedUserInputString(String prompt) {
    String userInput;

    do {
      System.out.print(prompt);
      userInput = scanner.nextLine().trim();
    } while(userInput.isEmpty());

    return userInput;
  }

  public static Date getUserInputDate(String prompt) {
    String userInput;

    do {
      System.out.print(prompt);
      userInput = scanner.nextLine().trim();

      if (!userInput.matches("\\d{1,2}/\\d{1,2}/\\d{4}")) {
        System.out.println("Invalid date format given.");
        continue;
      }

      final String[] userInputComponents = userInput.split("/");
      final String normalizedUserInput = "%02d/%02d/%d".formatted(
        Integer.parseInt(userInputComponents[0]),
        Integer.parseInt(userInputComponents[1]),
        Integer.parseInt(userInputComponents[2])
      );

      final String EXPECTED_DATE_FORMAT_PATTERN = "MM/dd/yyyy";
      final SimpleDateFormat formatter = new SimpleDateFormat(EXPECTED_DATE_FORMAT_PATTERN);
      try {
        Date date = formatter.parse(normalizedUserInput);
        if (normalizedUserInput.matches(formatter.format(date))) return date;
      } catch (ParseException ignored) { }
    } while(true);
  }
}
