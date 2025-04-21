// API endpoint configuration
const API_CONFIG = {
    baseUrl: '/api',
    endpoints: {
      metrics: '/health/metricsSummary'
    }
  };
  
  // Goals for each metric
  const GOALS = {
    sleep: 8, // 8 hours per day
    steps: 10000, // 10,000 steps per day
    water: 2000 // 2000 ml per day
  };
  
  // Fetch metrics data from the API
  async function fetchMetricsData() {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30); // Last 30 days
      
      const params = new URLSearchParams({
        userId: 'john_doe', // This would normally come from user authentication
        startDate: startDate.toISOString().split('.')[0], // Format: YYYY-MM-DDTHH:mm:ss
        endDate: new Date().toISOString().split('.')[0]
      });
      
      const response = await fetch(`/api/health/metricsSummary?${params}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch metrics data');
      }
      
      const data = await response.json();
      
      // Transform API data to match our application's format
      return {
        sleepData: data.sleepList.map(item => ({
          date: new Date(item.date),
          value: item.value
        })),
        stepsData: data.stepList.map(item => ({
          date: new Date(item.date),
          value: item.value
        })),
        waterData: data.waterList.map(item => ({
          date: new Date(item.date),
          value: item.value
        }))
      };
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  }
  
  // Process the data to get metrics for summary cards
  function calculateMetricSummaries(data) {
    const { sleepData, stepsData, waterData } = data;
    
    // Get last 30 days of data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Get last 60 days of data for trend calculation
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    // Filter data for relevant time periods
    const recentSleepData = sleepData.filter(d => d.date >= thirtyDaysAgo);
    const previousSleepData = sleepData.filter(d => d.date < thirtyDaysAgo && d.date >= sixtyDaysAgo);
    
    const recentStepsData = stepsData.filter(d => d.date >= thirtyDaysAgo);
    const previousStepsData = stepsData.filter(d => d.date < thirtyDaysAgo && d.date >= sixtyDaysAgo);
    
    const recentWaterData = waterData.filter(d => d.date >= thirtyDaysAgo);
    const previousWaterData = waterData.filter(d => d.date < thirtyDaysAgo && d.date >= sixtyDaysAgo);
    
    // Calculate averages
    const avgSleep = recentSleepData.length > 0 
      ? recentSleepData.reduce((sum, d) => sum + d.value, 0) / recentSleepData.length 
      : 0;
    
    const prevAvgSleep = previousSleepData.length > 0 
      ? previousSleepData.reduce((sum, d) => sum + d.value, 0) / previousSleepData.length 
      : 0;
    
    const avgSteps = recentStepsData.length > 0 
      ? recentStepsData.reduce((sum, d) => sum + d.value, 0) / recentStepsData.length 
      : 0;
    
    const prevAvgSteps = previousStepsData.length > 0 
      ? previousStepsData.reduce((sum, d) => sum + d.value, 0) / previousStepsData.length 
      : 0;
    
    const avgWater = recentWaterData.length > 0 
      ? recentWaterData.reduce((sum, d) => sum + d.value, 0) / recentWaterData.length 
      : 0;
    
    const prevAvgWater = previousWaterData.length > 0 
      ? previousWaterData.reduce((sum, d) => sum + d.value, 0) / previousWaterData.length 
      : 0;
    
    // Calculate trends (percentage change)
    let sleepTrend = 0;
    if (prevAvgSleep > 0) {
      sleepTrend = ((avgSleep - prevAvgSleep) / prevAvgSleep) * 100;
    }
    
    let stepsTrend = 0;
    if (prevAvgSteps > 0) {
      stepsTrend = ((avgSteps - prevAvgSteps) / prevAvgSteps) * 100;
    }
    
    let waterTrend = 0;
    if (prevAvgWater > 0) {
      waterTrend = ((avgWater - prevAvgWater) / prevAvgWater) * 100;
    }
    
    // Calculate goal achievement percentages
    const sleepGoalPercent = (avgSleep / GOALS.sleep) * 100;
    const stepsGoalPercent = (avgSteps / GOALS.steps) * 100;
    const waterGoalPercent = (avgWater / GOALS.water) * 100;
    
    return {
      sleep: {
        average: avgSleep,
        trend: sleepTrend,
        goalPercent: sleepGoalPercent
      },
      steps: {
        average: avgSteps,
        trend: stepsTrend,
        goalPercent: stepsGoalPercent
      },
      water: {
        average: avgWater,
        trend: waterTrend,
        goalPercent: waterGoalPercent
      }
    };
  }
  
  // Generate forecast data based on historical data
  function generateForecastData(data) {
    const { sleepData, stepsData, waterData } = data;
    
    // Sort data by date
    const sortedSleepData = [...sleepData].sort((a, b) => a.date - b.date);
    const sortedStepsData = [...stepsData].sort((a, b) => a.date - b.date);
    const sortedWaterData = [...waterData].sort((a, b) => a.date - b.date);
    
    // Get the last 14 days of data for trend analysis
    const last14DaysSleep = sortedSleepData.slice(-14);
    const last14DaysSteps = sortedStepsData.slice(-14);
    const last14DaysWater = sortedWaterData.slice(-14);
    
    const forecastDays = 7; // Forecast for the next 7 days
    const today = new Date();
    
    const sleepForecast = [];
    const stepsForecast = [];
    const waterForecast = [];
    
    // Calculate average of last 7 days for baseline
    const last7DaysSleepAvg = last14DaysSleep.slice(-7).reduce((sum, d) => sum + d.value, 0) / 7;
    const last7DaysStepsAvg = last14DaysSteps.slice(-7).reduce((sum, d) => sum + d.value, 0) / 7;
    const last7DaysWaterAvg = last14DaysWater.slice(-7).reduce((sum, d) => sum + d.value, 0) / 7;
    
    // Calculate trend (average daily change)
    const sleepTrend = (last14DaysSleep.slice(-1)[0]?.value - last14DaysSleep[0]?.value) / 14;
    const stepsTrend = (last14DaysSteps.slice(-1)[0]?.value - last14DaysSteps[0]?.value) / 14;
    const waterTrend = (last14DaysWater.slice(-1)[0]?.value - last14DaysWater[0]?.value) / 14;
    
    // Generate forecast data points
    for (let i = 1; i <= forecastDays; i++) {
      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + i);
      
      // Apply the trend with some randomness
      const sleepValue = last7DaysSleepAvg + (sleepTrend * i) + (Math.random() * 0.6 - 0.3);
      const stepsValue = last7DaysStepsAvg + (stepsTrend * i) + (Math.random() * 800 - 400);
      const waterValue = last7DaysWaterAvg + (waterTrend * i) + (Math.random() * 200 - 100);
      
      sleepForecast.push({
        date: new Date(forecastDate),
        value: Math.max(5, Math.min(9, sleepValue)),
        isForecast: true
      });
      
      stepsForecast.push({
        date: new Date(forecastDate),
        value: Math.max(4000, Math.min(15000, stepsValue)),
        isForecast: true
      });
      
      waterForecast.push({
        date: new Date(forecastDate),
        value: Math.max(800, Math.min(2500, waterValue)),
        isForecast: true
      });
    }
    
    return {
      sleepForecast,
      stepsForecast,
      waterForecast
    };
  }
  
  // Generate insights based on the data
  function generateInsights(data, summaries) {
    const { sleepData, stepsData, waterData } = data;
    const insights = [];
    
    // Insight 1: Sleep consistency
    const last14DaysSleep = sleepData.slice(-14);
    const sleepValues = last14DaysSleep.map(d => d.value);
    const sleepStdDev = calculateStandardDeviation(sleepValues);
    const sleepConsistency = 100 - (sleepStdDev / GOALS.sleep) * 100;
    
    insights.push({
      title: "Sleep Consistency",
      description: sleepConsistency > 80 
        ? "Your sleep schedule has been very consistent lately. Great job maintaining a regular sleep routine!"
        : "Your sleep schedule has been somewhat irregular. Consistent sleep times may improve your rest quality.",
      icon: "sleep",
      metrics: [
        { label: "Consistency", value: `${sleepConsistency.toFixed(0)}%` },
        { label: "Variation", value: `±${sleepStdDev.toFixed(1)}hrs` }
      ]
    });
    
    // Insight 2: Activity level
    const avgSteps = summaries.steps.average;
    let activityLevel = "Moderate";
    let activityDescription = "Your activity level is within a healthy range.";
    
    if (avgSteps < 5000) {
      activityLevel = "Low";
      activityDescription = "Your step count is below recommended levels. Consider adding more daily movement.";
    } else if (avgSteps > 10000) {
      activityLevel = "High";
      activityDescription = "You're exceeding the recommended 10,000 steps! Your activity level is excellent.";
    }
    
    insights.push({
      title: "Activity Level",
      description: activityDescription,
      icon: "steps",
      metrics: [
        { label: "Level", value: activityLevel },
        { label: "Daily Avg", value: `${Math.round(avgSteps).toLocaleString()}` }
      ]
    });
    
    // Insight 3: Hydration pattern
    const avgWater = summaries.water.average;
    const waterPercentage = (avgWater / GOALS.water) * 100;
    
    insights.push({
      title: "Hydration Status",
      description: waterPercentage >= 90
        ? "You're well hydrated! Keep up the good water intake."
        : "You're below your hydration target. Consider increasing your daily water intake.",
      icon: "water",
      metrics: [
        { label: "Status", value: waterPercentage >= 90 ? "Optimal" : "Below Target" },
        { label: "Daily Avg", value: `${Math.round(avgWater).toLocaleString()} ml` }
      ]
    });
    
    // Insight 4: Weekend vs. Weekday patterns
    const weekdaySleep = sleepData.filter(d => d.date.getDay() > 0 && d.date.getDay() < 6).map(d => d.value);
    const weekendSleep = sleepData.filter(d => d.date.getDay() === 0 || d.date.getDay() === 6).map(d => d.value);
    
    const avgWeekdaySleep = weekdaySleep.length > 0 ? weekdaySleep.reduce((sum, val) => sum + val, 0) / weekdaySleep.length : 0;
    const avgWeekendSleep = weekendSleep.length > 0 ? weekendSleep.reduce((sum, val) => sum + val, 0) / weekendSleep.length : 0;
    const sleepDifference = avgWeekendSleep - avgWeekdaySleep;
    
    insights.push({
      title: "Weekend vs. Weekday",
      description: Math.abs(sleepDifference) > 1.5
        ? "There's a significant difference between your weekend and weekday sleep patterns."
        : "Your sleep schedule is fairly consistent between weekdays and weekends.",
      icon: "calendar",
      metrics: [
        { label: "Weekday", value: `${avgWeekdaySleep.toFixed(1)} hrs` },
        { label: "Weekend", value: `${avgWeekendSleep.toFixed(1)} hrs` }
      ]
    });
    
    return insights;
  }
  
  // Helper function to calculate standard deviation
  function calculateStandardDeviation(values) {
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squareDiffs = values.map(value => {
      const diff = value - avg;
      return diff * diff;
    });
    const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
  }
  
  // Analyze correlation between metrics
  function calculateCorrelations(data) {
    const { sleepData, stepsData, waterData } = data;
    
    // Map data to a daily format for correlation analysis
    const dateMap = new Map();
    
    sleepData.forEach(item => {
      const dateStr = item.date.toISOString().split('T')[0];
      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, {});
      }
      dateMap.get(dateStr).sleep = item.value;
    });
    
    stepsData.forEach(item => {
      const dateStr = item.date.toISOString().split('T')[0];
      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, {});
      }
      dateMap.get(dateStr).steps = item.value;
    });
    
    waterData.forEach(item => {
      const dateStr = item.date.toISOString().split('T')[0];
      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, {});
      }
      dateMap.get(dateStr).water = item.value;
    });
    
    // Find days that have all three metrics
    const completeDataDays = [];
    
    dateMap.forEach((data, dateStr) => {
      if (data.sleep !== undefined && data.steps !== undefined && data.water !== undefined) {
        completeDataDays.push({
          date: new Date(dateStr),
          sleep: data.sleep,
          steps: data.steps,
          water: data.water
        });
      }
    });
    
    // Function to calculate correlation coefficient
    function calculateCorrelation(x, y) {
      const n = x.length;
      
      if (n === 0) return 0;
      
      let sumX = 0;
      let sumY = 0;
      let sumXY = 0;
      let sumX2 = 0;
      let sumY2 = 0;
      
      for (let i = 0; i < n; i++) {
        sumX += x[i];
        sumY += y[i];
        sumXY += x[i] * y[i];
        sumX2 += x[i] * x[i];
        sumY2 += y[i] * y[i];
      }
      
      const numerator = n * sumXY - sumX * sumY;
      const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
      
      if (denominator === 0) return 0;
      
      return numerator / denominator;
    }
    
    // Extract arrays for correlation calculation
    const sleepValues = completeDataDays.map(d => d.sleep);
    const stepsValues = completeDataDays.map(d => d.steps);
    const waterValues = completeDataDays.map(d => d.water);
    
    // Calculate correlations
    const sleepStepsCorrelation = calculateCorrelation(sleepValues, stepsValues);
    const sleepWaterCorrelation = calculateCorrelation(sleepValues, waterValues);
    const stepsWaterCorrelation = calculateCorrelation(stepsValues, waterValues);
    
    return {
      sleepSteps: sleepStepsCorrelation,
      sleepWater: sleepWaterCorrelation,
      stepsWater: stepsWaterCorrelation
    };
  }
  
  // Main function to process all data
  async function processHealthData() {
    try {
      // Fetch data from API
      const healthData = await fetchMetricsData();
      
      // Calculate summary metrics
      const summaries = calculateMetricSummaries(healthData);
      
      // Generate forecast data
      const forecasts = generateForecastData(healthData);
      
      // Generate insights
      const insights = generateInsights(healthData, summaries);
      
      // Calculate correlations
      const correlations = calculateCorrelations(healthData);
      
      // Add forecast data to the original data
      const completeData = {
        sleepData: [...healthData.sleepData, ...forecasts.sleepForecast],
        stepsData: [...healthData.stepsData, ...forecasts.stepsForecast],
        waterData: [...healthData.waterData, ...forecasts.waterForecast],
        sleepForecast: forecasts.sleepForecast,
        stepsForecast: forecasts.stepsForecast,
        waterForecast: forecasts.waterForecast
      };
      
      return {
        data: completeData,
        summaries,
        insights,
        correlations
      };
    } catch (error) {
      console.error('Error processing health data:', error);
      throw error;
    }
  }