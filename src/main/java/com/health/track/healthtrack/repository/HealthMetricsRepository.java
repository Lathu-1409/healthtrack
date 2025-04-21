package com.health.track.healthtrack.repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;

import com.health.track.healthtrack.model.request.HealthMetrics;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public interface HealthMetricsRepository extends MongoRepository<HealthMetrics, String> {

    // Custom query to find metrics within a date range
    @Query("{ 'userName': ?0, 'date': { $gte: ?1, $lte: ?2 } }")
    List<HealthMetrics> findByUserNameAndDateRange(String userName, Date startDate, Date endDate); 

   
}