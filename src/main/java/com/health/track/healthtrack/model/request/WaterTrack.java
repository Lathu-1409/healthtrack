package com.health.track.healthtrack.model.request;

import lombok.Data;

@Data
public class WaterTrack {
    private int activityLevel;
    private int dailyGoal;
    private float weight;
    private int currentIntake;
}
