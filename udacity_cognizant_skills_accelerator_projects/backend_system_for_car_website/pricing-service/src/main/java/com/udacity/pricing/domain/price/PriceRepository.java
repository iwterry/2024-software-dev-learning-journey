package com.udacity.pricing.domain.price;

import org.springframework.data.repository.CrudRepository;

/*
// No longer needed
@Repository
public class PriceRepository {

}
*/

public interface PriceRepository extends CrudRepository<Price, Long> {
}

