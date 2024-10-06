package com.udacity.pricing.config;

import com.udacity.pricing.domain.price.Price;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;

// https://stackoverflow.com/questions/44046659/return-ids-in-json-response-from-spring-data-rest
@Configuration
public class CustomRepositoryRestConfigurer  {
  @Bean
  public RepositoryRestConfigurer repositoryRestConfigurer() {
    return new RepositoryRestConfigurer() {
      @Override
      public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        config.exposeIdsFor(Price.class);
      }
    };
  }
}
