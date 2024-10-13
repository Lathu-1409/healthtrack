package com.health.track.healthtrack.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.health.track.healthtrack.model.request.StepTrack;


@RestController
public class StepCountController {

    @PostMapping("/api/health/stepTrack")
    public ResponseEntity<Object> trackStepCount(@RequestBody StepTrack request) {
        String response;
        int dailyGoal = request.getDailyGoal();
        int steps = request.getCurrentSteps();

        if (steps >= dailyGoal) {
            response = "Awesome! You've achieved your daily step goal.";
        } else {
            int remaining = dailyGoal - steps;
            response = "You need " + remaining + " more steps to reach your daily goal.";
        }

        return ResponseEntity.ok(response);
    }
}

