# Pricing Service

The Pricing Service is a REST WebService that simulates a backend that
would store and retrieve the price of a vehicle given a vehicle id as
input. In this project, you will convert it to a microservice.

Note: I changed the API endpoint from http://localhost:8082/services/price?vehicleId=<insert-a-vehicleId-here> to http://localhost:8082/prices/<insert-a-vehicleId-here>.

Note: The program creates 20 default prices and puts them in the in-memory database by using the data.sql file located in the src/main/resources path.

## Features

- REST WebService integrated with Spring Boot

## Instructions

#### TODOs

- Convert the Pricing Service to be a microservice.
- Add an additional test to check whether the application appropriately generates a price for a given vehicle ID

#### Run the code

To run this service you execute:

```
$ mvn clean package
```

```
$ java -jar target/pricing-service-0.0.1-SNAPSHOT.jar
```

It can also be imported in your IDE as a Maven project.

Note: The Eureka Server should be started before starting this service.