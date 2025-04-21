package com.health.track.healthtrack.model.request;


import lombok.Data;
import lombok.Generated;

@Data
@Generated
public class MetricSummaryResponse {
    private String metricType;
    private double totalValue;
    private double averageValue;
    private int count;

    public MetricSummaryResponse(String metricType) {
        this.metricType = metricType;
        this.totalValue = 0;
        this.count = 0;
    }

    public void addToTotal(double value) {
        this.totalValue += value;
    }

    public void incrementCount() {
        this.count++;
    }

    public void calculateAverage() {
        this.averageValue = count > 0 ? totalValue / count : 0;
    }

    // Getters and setters...
}
