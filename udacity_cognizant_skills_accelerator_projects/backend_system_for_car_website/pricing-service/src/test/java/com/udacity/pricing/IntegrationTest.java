package com.udacity.pricing;

import com.udacity.pricing.domain.price.Price;
import org.assertj.core.api.Assertions;
import org.hamcrest.CoreMatchers;
import org.hamcrest.MatcherAssert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class IntegrationTest {
  @LocalServerPort
  private int port;

  @Autowired
  private TestRestTemplate testRestTemplate;

  @Test
  public void testGetVehiclePriceWhenGivenVehicleId() {
    ResponseEntity<Price> response = testRestTemplate.getForEntity("http://localhost:" + port + "/prices/1", Price.class);
    MatcherAssert.assertThat(response.getStatusCode(), CoreMatchers.equalTo(HttpStatus.OK));

    Price returnedPrice = response.getBody();

    Assertions.assertThat(returnedPrice).isNotNull();
    Assertions.assertThat(returnedPrice.getVehicleId()).isEqualTo(1L);
    Assertions.assertThat(returnedPrice.getPrice()).isNotNull();
  }
}
