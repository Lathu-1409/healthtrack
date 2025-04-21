package com.health.track.healthtrack.model.request;


import java.util.List;

import lombok.Data;
import lombok.Generated;

@Data
@Generated
public class MetricsResponse {
    private List<MetricData> sleepList;
    private List<MetricData> stepList;
    private List<MetricData> waterList;

    // public MetricsResponse(List<MetricData> sleepList, List<MetricData> stepList, List<MetricData> waterList) {
    //     this.sleepList = sleepList;
    //     this.stepList = stepList;
    //     this.waterList = waterList;
    // }

    // Getters and setters...
}