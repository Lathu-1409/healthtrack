// package com.health.track.healthtrack.service;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.mongodb.core.MongoTemplate;
// import org.springframework.data.mongodb.core.aggregation.Aggregation;
// import org.springframework.data.mongodb.core.aggregation.AggregationResults;
// import org.springframework.data.mongodb.core.query.Criteria;
// import org.springframework.stereotype.Service;
// import org.springframework.data.domain.Sort; // Ensure correct import of Sort
// import com.health.track.healthtrack.repository.UserRepository;
// import com.health.track.healthtrack.repository.HealthMetricsRepository;
// import com.health.track.healthtrack.model.request.User;
// import com.health.track.healthtrack.model.request.HealthMetrics;
// import com.health.track.healthtrack.model.request.LeaderboardResult;

// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;

// @Service
// public class AnalyticsService {

//     @Autowired
//     private UserRepository userRepository;

//     @Autowired
//     private HealthMetricsRepository healthMetricsRepository;

//     @Autowired
//     private MongoTemplate mongoTemplate;

//     // 1. User Activity Analytics
//     public Map<String, Object> getUserActivityAnalytics() {
//         List<User> users = userRepository.findAll();
//         Map<String, Object> analytics = new HashMap<>();

//         for (User user : users) {
//             analytics.put(user.getUserName(), "Last Login: " + user.getLastLogin());
//         }

//         analytics.put("inactiveUsers", users.stream()
//             .filter(user -> user.getLastLogin() == null)
//             .count());

//         return analytics;
//     }

//     // 2. Health Metrics Insights
//     public List<HealthMetrics> getHealthMetricsInsights(String userId, String startDate, String endDate) {
//         return healthMetricsRepository.findByUserIdAndDateRange(userId, startDate, endDate);
//     }

//     // 3. Goal Achievement Insights
//     public Map<String, Object> getGoalAchievementInsights(String userId, String timePeriod) {
//         Aggregation aggregation = Aggregation.newAggregation(
//             Aggregation.match(Criteria.where("userId").is(userId)),
//             Aggregation.group("metric").count().as("totalCount"),
//             Aggregation.project().and("metric").previousOperation().and("totalCount").as("totalCount")
//         );
//         AggregationResults<Map> results = mongoTemplate.aggregate(aggregation, "healthMetrics", Map.class);

//         return results.getUniqueMappedResult();
//     }

//     // 4. Leaderboard
//     public List<LeaderboardResult> getLeaderboard(String metric, Integer limit) {
//         Aggregation aggregation = Aggregation.newAggregation(
//             Aggregation.match(Criteria.where("metric").is(metric)),
//             Aggregation.group("userId").sum("value").as("total"),
//             Aggregation.project().and("userId").previousOperation().and("total").as("total"),
//             Aggregation.sort(Sort.by(Sort.Direction.DESC, "total")), // Correct Sort usage
//             Aggregation.limit(limit)
//         );

//         AggregationResults<LeaderboardResult> results = mongoTemplate.aggregate(aggregation, "healthMetrics", LeaderboardResult.class);
//         return results.getMappedResults();
//     }

//     // 5. User Growth Analytics
//     public List<User> getUserGrowthAnalytics() {
//         return userRepository.findAll(); // Placeholder; you can add aggregation logic
//     }

//     // 6. Churn Prediction
//     public List<User> getChurnPrediction(String startDate, String endDate) {
//         Aggregation aggregation = Aggregation.newAggregation(
//             Aggregation.match(Criteria.where("lastLogin").gte(startDate).lte(endDate)),
//             Aggregation.sort(Sort.by(Sort.Direction.ASC, "lastLogin")) // Correct Sort usage
//         );
//         AggregationResults<User> results = mongoTemplate.aggregate(aggregation, "users", User.class);
//         return results.getMappedResults();
//     }

//     // 7. Progress Dashboard
//     public Map<String, Object> getProgressDashboard(String userId, String startDate, String endDate) {
//         List<HealthMetrics> metrics = healthMetricsRepository.findByUserIdAndDateRange(userId, startDate, endDate);
//         Map<String, Object> progressSummary = new HashMap<>();

//         for (HealthMetrics metric : metrics) {
//             progressSummary.put(metric.getMetric(), metric.getValue());
//         }

//         return progressSummary;
//     }

//     // 8. Habit Trends
//     public Map<String, Object> getHabitTrends(String userId, String timePeriod) {
//         // Define the aggregation pipeline
//         Aggregation aggregation = Aggregation.newAggregation(
//             Aggregation.match(Criteria.where("userId").is(userId)), // Match user ID
//             Aggregation.group("date").sum("steps").as("totalSteps"), // Group by date and calculate total steps
//             Aggregation.project().andExpression("_id").as("date").and("totalSteps").as("totalSteps") // Proper projection mapping
//         );
    
//         // Execute the aggregation
//         AggregationResults<Map> results = mongoTemplate.aggregate(aggregation, "healthMetrics", Map.class);
    
//         // Populate trendSummary
//         Map<String, Object> trendSummary = new HashMap<>();
//         for (Map<String, Object> result : results.getMappedResults()) {
//             trendSummary.put(result.get("date").toString(), result.get("totalSteps")); // Use "date" from projection
//         }
    
//         return trendSummary; // Return trendSummary containing the trend data
//     }
// }