package com.health.track.healthtrack.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.health.track.healthtrack.model.request.WaterTrack;
@RestController
public class MyHealthTrackerController {


    @PostMapping("/api/health/waterTrack")
    public ResponseEntity<Object> trackWaterIntake(@RequestBody WaterTrack request) {
        String response;
        float weight = request.getWeight();
        int activityLevel = request.getActivityLevel(); // 1: Low, 2: Moderate, 3: High
        float intake = request.getCurrentIntake();
        
        float goal = calculateDailyGoal(weight, activityLevel);
    
        if (intake >= goal) {
            response = "Great job! You've met your daily water intake goal.";
        } else {
            float remaining = goal - intake;
            response = "You need to drink " + remaining + " more ml of water to reach your daily goal.";
        }
    
        return ResponseEntity.ok(response);
    }
    
    private float calculateDailyGoal(float weight, int activityLevel) {
        float baseGoal = weight * 30; // 30 ml per kg of body weight
        switch (activityLevel) {
            case 1: return baseGoal;
            case 2: return baseGoal + 500;
            case 3: return baseGoal + 1000;
            default: return baseGoal;
        }
    }
    

}
