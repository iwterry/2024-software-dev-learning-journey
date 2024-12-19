package com.jpmc.midascore.service;

import com.jpmc.midascore.foundation.Incentive;
import com.jpmc.midascore.foundation.Transaction;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class IncentiveRetriever {
  private final RestTemplate restTemplate;
  @Value("${incentive-api-endpoint}")
  private String incentiveApiEndpoint;

  public IncentiveRetriever(RestTemplate restTemplate) {
    this.restTemplate = restTemplate;
  }

  public Incentive requestIncentive(Transaction transaction) {
    return restTemplate
        .postForEntity(incentiveApiEndpoint, new HttpEntity<>(transaction), Incentive.class)
        .getBody();
  }
}
