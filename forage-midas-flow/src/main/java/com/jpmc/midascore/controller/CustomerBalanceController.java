package com.jpmc.midascore.controller;

import com.jpmc.midascore.entity.UserRecord;
import com.jpmc.midascore.foundation.Balance;
import com.jpmc.midascore.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CustomerBalanceController {
  private final UserRepository userRepository;

  public CustomerBalanceController(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @GetMapping("/balance")
  public ResponseEntity<Balance> getCustomerBalance(@RequestParam(name = "userId") long userId) {
    UserRecord retrievedUser = userRepository.findById(userId);

    if (retrievedUser == null) return ResponseEntity.ok(new Balance(0));

    return ResponseEntity.ok(new Balance(retrievedUser.getBalance()));
  }
}
