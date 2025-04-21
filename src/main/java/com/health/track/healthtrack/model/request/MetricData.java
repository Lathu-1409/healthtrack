package com.health.track.healthtrack.model.request;

import java.util.Date;

import lombok.Data;
import lombok.Generated;

@Data
@Generated
public class MetricData {
    private Date date;
    private double value;

    public MetricData(Date date, double value) {
        this.date = date;
        this.value = value;
    }

    // Getters and setters...
}