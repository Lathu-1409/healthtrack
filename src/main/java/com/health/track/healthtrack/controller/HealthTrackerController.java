package com.health.track.healthtrack.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.health.track.healthtrack.model.request.User;
import com.health.track.healthtrack.model.request.UserLogin;
import com.health.track.healthtrack.model.request.WaterTrack;
import com.health.track.healthtrack.repository.HealthMetricsRepository;
import com.health.track.healthtrack.model.request.HealthMetrics;
import com.health.track.healthtrack.model.request.MetricData;
import com.health.track.healthtrack.model.request.MetricSummaryResponse;
import com.health.track.healthtrack.model.request.MetricsResponse;
import com.health.track.healthtrack.model.request.SleepTrack;
import com.health.track.healthtrack.model.request.StepTrack;
import com.health.track.healthtrack.service.HealthRegisterService;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class HealthTrackerController {

    @Autowired
    HealthRegisterService services;
 @Autowired
    private HealthMetricsRepository healthMetricsRepository;
    
    // User Registration Endpoint
    @PostMapping("/api/health/register")
    public ResponseEntity<Object> registerUser(@RequestBody User request) {
        System.out.println("Request received: " + request.toString());

        String response = services.insertUserDetails(request);

        System.out.println("response : " + response);

        return ResponseEntity.ok(response);
    }

    // User Login Endpoint
    @PostMapping("/api/health/login")
    public ResponseEntity<Object> loginUser(@RequestBody UserLogin request) {
        System.out.println("Request received: " + request.toString());

        String response = services.loginCheck(request);

        System.out.println("response : " + response);

        return ResponseEntity.ok(response);
    }

    // Water Intake Tracking Endpoint
    @PostMapping("/api/health/waterTrack")
public ResponseEntity<Object> trackWaterIntake(@RequestParam String username, @RequestBody WaterTrack request) {
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

    // Save to health metrics collection
    HealthMetrics metrics = new HealthMetrics();
    metrics.setUserName(username);
    metrics.setDate(new Date());
    metrics.setMetricType("water");
    metrics.setMetricValue(intake);

    healthMetricsRepository.save(metrics); // Save operation

    return ResponseEntity.ok(response);
}

 // Helper Method to Calculate Daily Water Intake Goal
    private float calculateDailyGoal(float weight, int activityLevel) {
        float baseGoal = weight * 30; // 30 ml per kg of body weight
        switch (activityLevel) {
            case 1: return baseGoal;
            case 2: return baseGoal + 500;
            case 3: return baseGoal + 1000;
            default: return baseGoal;
        }
    }
@PostMapping("/api/health/sleepTrack")
public ResponseEntity<Object> trackWeeklySleep(@RequestParam String username, @RequestBody SleepTrack request) {
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
    float recommendedSleep = 8; // Average recommended sleep hours per night

    if (averageSleep >= recommendedSleep) {
        response = "Great job! You are averaging " + averageSleep + " hours of sleep per night, which meets the recommended amount.";
    } else {
        float deficit = recommendedSleep - averageSleep;
        response = "You are averaging " + averageSleep + " hours of sleep per night. It's recommended to get at least " + recommendedSleep + " hours. Try to get " + deficit + " more hours of sleep per night.";
    }

    // Save to health metrics collection
    HealthMetrics metrics = new HealthMetrics();
    metrics.setUserName(username);
    metrics.setDate(new Date());
    metrics.setMetricType("sleep");
    metrics.setMetricValue(averageSleep);

    healthMetricsRepository.save(metrics); // Save operation

    return ResponseEntity.ok(response);
}

@PostMapping("/api/health/stepTrack")
public ResponseEntity<Object> trackStepCount(@RequestParam String username, @RequestBody StepTrack request) {
    String response;
    int dailyGoal = request.getDailyGoal();
    int steps = request.getCurrentSteps();

    if (steps >= dailyGoal) {
        response = "Awesome! You've achieved your daily step goal.";
    } else {
        int remaining = dailyGoal - steps;
        response = "You need " + remaining + " more steps to reach your daily goal.";
    }

    // Save to health metrics collection
    HealthMetrics metrics = new HealthMetrics();
    metrics.setUserName(username);
    metrics.setDate(new Date());
    metrics.setMetricType("step");
    metrics.setMetricValue(steps);

    healthMetricsRepository.save(metrics); // Save operation

    return ResponseEntity.ok(response);
}


@GetMapping("/api/health/metricsSummary")
public ResponseEntity<Object> getMetricsSummary(
        @RequestParam String userId,
        @RequestParam String startDate,
        @RequestParam String endDate) {

    try {
        // Parse the start and end date strings into LocalDateTime
        LocalDateTime startDateTime = LocalDateTime.parse(startDate);
        LocalDateTime endDateTime = LocalDateTime.parse(endDate);

        // Convert LocalDateTime to Date
        Date start = java.util.Date.from(startDateTime.atZone(ZoneId.systemDefault()).toInstant());
        Date end = java.util.Date.from(endDateTime.atZone(ZoneId.systemDefault()).toInstant());

        // Fetch metrics for the user within the date range
        List<HealthMetrics> metrics = healthMetricsRepository.findByUserNameAndDateRange(userId, start, end);

        // Group metrics into separate lists by type
        MetricsResponse response = groupMetrics(metrics);

        System.out.println(response.toString());
        // Return the response
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        // Handle exceptions and return a proper response
        return ResponseEntity.badRequest().body("Error fetching or grouping metrics: " + e.getMessage());
    }
}
private MetricsResponse groupMetrics(List<HealthMetrics> metrics) {
    List<MetricData> sleepList = new ArrayList<>();
    List<MetricData> stepList = new ArrayList<>();
    List<MetricData> waterList = new ArrayList<>();

    for (HealthMetrics metric : metrics) {
        MetricData data = new MetricData(metric.getDate(), metric.getMetricValue());

        switch (metric.getMetricType()) {
            case "sleep":
                sleepList.add(data);
                break;
            case "step":
                stepList.add(data);
                break;
            case "water":
                waterList.add(data);
                break;
            default:
                // Handle unsupported metric types (if any)
                break;
        }
    }
    MetricsResponse metricsResponse=new MetricsResponse();
    metricsResponse.setSleepList(sleepList);
    metricsResponse.setStepList(stepList);
    metricsResponse.setWaterList(waterList);
    return metricsResponse;
}

}