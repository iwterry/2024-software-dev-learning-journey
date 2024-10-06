package com.udacity.vehicles.config;

import java.util.Set;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig {
  @Bean
  public Docket api() {
    return new Docket(DocumentationType.SWAGGER_2)
        .select()
        .apis(RequestHandlerSelectors.any())
        // only allow access to the path /car (and not to others such as /error)
        .paths(PathSelectors.ant("/cars/**"))
        .build()
        .apiInfo(apiInfo())
        .produces(Set.of("application/json"));
  }


  private ApiInfo apiInfo() {
    return new ApiInfoBuilder()
        .title("Vehicles API")
        .description("This API allows for creating, listing, updating, and deleting cars.")
        .version("1.0.0")
        .build();
  }
}
