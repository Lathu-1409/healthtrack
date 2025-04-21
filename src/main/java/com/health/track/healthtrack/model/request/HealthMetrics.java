package com.health.track.healthtrack.model.request;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "healthMetrics")
public class HealthMetrics {

    @Id
    private String id;
    private String userName;
    private Date date;
    private String metricType;
    private float metricValue;

}