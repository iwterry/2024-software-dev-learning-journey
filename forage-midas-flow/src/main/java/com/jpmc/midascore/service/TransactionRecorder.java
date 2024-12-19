package com.jpmc.midascore.service;

import com.jpmc.midascore.entity.TransactionRecord;
import com.jpmc.midascore.entity.UserRecord;
import com.jpmc.midascore.foundation.Incentive;
import com.jpmc.midascore.foundation.Transaction;
import com.jpmc.midascore.repository.TransactionRepository;
import com.jpmc.midascore.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class TransactionRecorder {
  private final TransactionRepository transactionRepository;
  private final UserRepository userRepository;
  private final IncentiveRetriever incentiveRetriever;

  public TransactionRecorder(
      TransactionRepository transactionRepository,
      UserRepository userRepository,
      IncentiveRetriever incentiveRetriever
  ) {
    this.transactionRepository = transactionRepository;
    this.userRepository = userRepository;
    this.incentiveRetriever = incentiveRetriever;
  }

  public void recordValidTransaction(Transaction transaction) {
    UserRecord sender = userRepository.findById(transaction.getSenderId());
    if (sender == null) return;

    UserRecord recipient = userRepository.findById(transaction.getRecipientId());
    if (recipient == null) return;

    float transactionAmount = transaction.getAmount();

    float amountLeftAfterTransaction = sender.getBalance() - transactionAmount;
    if (amountLeftAfterTransaction < 0) return;

    Incentive incentive = incentiveRetriever.requestIncentive(transaction);
    float incentiveAmount = incentive.getAmount();

    sender.setBalance(amountLeftAfterTransaction);
    recipient.setBalance(recipient.getBalance() + transactionAmount + incentiveAmount);

    userRepository.save(sender);
    userRepository.save(recipient);
    transactionRepository.save(new TransactionRecord(sender, recipient, transactionAmount, incentiveAmount));
  }
}
