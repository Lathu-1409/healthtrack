package com.health.track.healthtrack.model.request;


import lombok.Data;
import java.util.List;
@Data
public class SleepTrack {
    private List<Float> dailySleepHours;
}
