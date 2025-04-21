// package com.health.track.healthtrack.controller;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;
// import com.health.track.healthtrack.service.AnalyticsService;
// import com.health.track.healthtrack.model.request.User;
// import com.health.track.healthtrack.model.request.HealthMetrics;
// import com.health.track.healthtrack.model.request.LeaderboardResult;

// import java.util.List;
// import java.util.Map;

// @RestController
// @RequestMapping("/api/analytics")
// public class AnalyticsController {

//     @Autowired
//     private AnalyticsService analyticsService;

//     // 1. User Activity Analytics
//     @GetMapping("/user-activity")
//     public Map<String, Object> getUserActivityAnalytics() {
//         return analyticsService.getUserActivityAnalytics();
//     }

//     // 2. Health Metrics Insights
//     @GetMapping("/health-metrics")
//     public List<HealthMetrics> getHealthMetricsInsights(
//             @RequestParam String userId,
//             @RequestParam String startDate,
//             @RequestParam String endDate) {
//         return analyticsService.getHealthMetricsInsights(userId, startDate, endDate);
//     }

//     // 3. Goal Achievement Insights
//     @GetMapping("/goal-achievement")
//     public Map<String, Object> getGoalAchievementInsights(
//             @RequestParam String userId,
//             @RequestParam String timePeriod) {
//         return analyticsService.getGoalAchievementInsights(userId, timePeriod);
//     }

//     // 4. Leaderboard
//     @GetMapping("/leaderboard")
//     public List<LeaderboardResult> getLeaderboard(
//             @RequestParam String metric,
//             @RequestParam Integer limit) {
//         return analyticsService.getLeaderboard(metric, limit);
//     }

//     // 5. User Growth Analytics
//     @GetMapping("/user-growth")
//     public List<User> getUserGrowthAnalytics() {
//         return analyticsService.getUserGrowthAnalytics();
//     }

//     // 6. Churn Prediction
//     @GetMapping("/churn-prediction")
//     public List<User> getChurnPrediction(
//             @RequestParam String startDate,
//             @RequestParam String endDate) {
//         return analyticsService.getChurnPrediction(startDate, endDate);
//     }

//     // 7. Progress Dashboard
//     @GetMapping("/progress-dashboard")
//     public Map<String, Object> getProgressDashboard(
//             @RequestParam String userId,
//             @RequestParam String startDate,
//             @RequestParam String endDate) {
//         return analyticsService.getProgressDashboard(userId, startDate, endDate);
//     }

//     // 8. Habit Trends
//     @GetMapping("/habit-trends")
//     public Map<String, Object> getHabitTrends(
//             @RequestParam String userId,
//             @RequestParam String timePeriod) {
//         return analyticsService.getHabitTrends(userId, timePeriod);
//     }
// }