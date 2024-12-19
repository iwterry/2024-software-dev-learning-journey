package com.jpmc.midascore;

import com.jpmc.midascore.foundation.Transaction;
import com.jpmc.midascore.service.TransactionRecorder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class KafkaConsumer {
  private static final Logger logger = LoggerFactory.getLogger(KafkaConsumer.class);
  private final TransactionRecorder transactionRecorder;

  public KafkaConsumer(TransactionRecorder transactionRecorder) {
    this.transactionRecorder = transactionRecorder;
  }


  @KafkaListener(topics = {"${general.kafka-topic}"})
  public void receive(Transaction transaction) {
    logger.info("----- transaction ----- {}", transaction);
    transactionRecorder.recordValidTransaction(transaction);
  }
}
