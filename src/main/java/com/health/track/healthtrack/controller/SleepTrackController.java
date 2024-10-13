package com.health.track.healthtrack.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.health.track.healthtrack.model.request.SleepTrack;
import java.util.List;

@RestController
public class SleepTrackController {

    @PostMapping("/api/health/sleepTrack")
    public ResponseEntity<Object> trackWeeklySleep(@RequestBody SleepTrack request) {
        String response;
        List<Float> dailySleepHours = request.getDailySleepHours();
        
        if (dailySleepHours == null || dailySleepHours.size() != 7) {
            return ResponseEntity.badRequest().body("Please provide sleep data for all 7 days of the week.");
        }

        float totalSleep = 0;
        for (float sleep : dailySleepHours) {
            totalSleep += sleep;
        }

        float averageSleep = totalSleep / 7;
        float recommendedSleep = 8;  // Average recommended sleep hours per night

        if (averageSleep >= recommendedSleep) {
            response = "Great job! You are averaging " + averageSleep + " hours of sleep per night, which meets the recommended amount.";
        } else {
            float deficit = recommendedSleep - averageSleep;
            response = "You are averaging " + averageSleep + " hours of sleep per night. It's recommended to get at least " + recommendedSleep + " hours. Try to get " + deficit + " more hours of sleep per night.";
        }

        return ResponseEntity.ok(response);
    }
}

