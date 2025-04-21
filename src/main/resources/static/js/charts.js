// Initialize all charts
function initializeCharts(healthData) {
    const { data, correlations } = healthData;
    
    // Timeline Chart
    initializeTimelineChart(data);
    
    // Comparison Chart
    initializeComparisonChart(data);
    
    // Distribution Chart
    initializeDistributionChart(data);
    
    // Forecast Chart
    initializeForecastChart(data);
    
    // Correlation Chart
    initializeCorrelationChart(correlations, data);
  }
  
  // Timeline Chart - Shows one metric over time
  function initializeTimelineChart(data) {
    const ctx = document.getElementById('timeline-chart').getContext('2d');
    
    // Default to sleep data
    const chartData = prepareTimelineData(data.sleepData, 'sleep');
    
    // Helper function to format dates
    const dateFormatter = (value) => {
      const date = new Date(value);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    const timelineChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Sleep (hours)',
          data: chartData,
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--color-sleep').trim(),
          backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--color-sleep-light').trim(),
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary').trim(),
            titleColor: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim(),
            bodyColor: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim(),
            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim(),
            borderWidth: 1,
            callbacks: {
              title: (tooltipItems) => {
                return dateFormatter(tooltipItems[0].parsed.x);
              }
            }
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'MMM d, yyyy'
            },
            adapters: {
              date: {
                locale: luxon.DateTime.local().locale
              }
            },
            grid: {
              display: false
            },
            ticks: {
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 7,
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
            }
          },
          y: {
            beginAtZero: false,
            grid: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim(),
              drawBorder: false
            },
            ticks: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
            }
          }
        }
      }
    });
    
    // Store the chart instance for later updates
    window.timelineChart = timelineChart;
    
    // Set up event listeners for metric buttons
    document.querySelectorAll('.metric-btn').forEach(button => {
      button.addEventListener('click', () => {
        const metric = button.dataset.metric;
        const buttons = document.querySelectorAll('.metric-btn');
        
        // Update active button
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update chart data based on selected metric
        let newData;
        let label;
        let color;
        let backgroundColor;
        
        switch (metric) {
          case 'sleep':
            newData = prepareTimelineData(data.sleepData, 'sleep');
            label = 'Sleep (hours)';
            color = getComputedStyle(document.documentElement).getPropertyValue('--color-sleep').trim();
            backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--color-sleep-light').trim();
            break;
          case 'steps':
            newData = prepareTimelineData(data.stepsData, 'steps');
            label = 'Steps';
            color = getComputedStyle(document.documentElement).getPropertyValue('--color-steps').trim();
            backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--color-steps-light').trim();
            break;
          case 'water':
            newData = prepareTimelineData(data.waterData, 'water');
            label = 'Water (ml)';
            color = getComputedStyle(document.documentElement).getPropertyValue('--color-water').trim();
            backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--color-water-light').trim();
            break;
        }
        
        // Update chart
        timelineChart.data.datasets[0].data = newData;
        timelineChart.data.datasets[0].label = label;
        timelineChart.data.datasets[0].borderColor = color;
        timelineChart.data.datasets[0].backgroundColor = backgroundColor;
        timelineChart.update();
      });
    });
  }
  
  // Prepare data for timeline chart
  function prepareTimelineData(dataArray, type) {
    return dataArray.map(item => ({
      x: item.date,
      y: item.value
    }));
  }
  
  // Comparison Chart - Compare all metrics over time
  function initializeComparisonChart(data) {
    const ctx = document.getElementById('comparison-chart').getContext('2d');
    
    // Prepare data for comparison chart
    // We need to normalize the data to show all metrics on the same scale
    const sleepNormalized = normalizeData(data.sleepData, GOALS.sleep);
    const stepsNormalized = normalizeData(data.stepsData, GOALS.steps);
    const waterNormalized = normalizeData(data.waterData, GOALS.water);
    
    const comparisonChart = new Chart(ctx, {
      type: 'bar',
      data: {
        datasets: [
          {
            label: 'Sleep',
            data: sleepNormalized,
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--color-sleep').trim(),
            borderRadius: 4
          },
          {
            label: 'Steps',
            data: stepsNormalized,
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--color-steps').trim(),
            borderRadius: 4
          },
          {
            label: 'Water',
            data: waterNormalized,
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--color-water').trim(),
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              boxWidth: 8,
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary').trim(),
            titleColor: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim(),
            bodyColor: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim(),
            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim(),
            borderWidth: 1,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label;
                const value = context.parsed.y;
                
                // Convert normalized value back to original
                let originalValue;
                if (label === 'Sleep') {
                  originalValue = (value * GOALS.sleep).toFixed(1) + ' hours';
                } else if (label === 'Steps') {
                  originalValue = Math.round(value * GOALS.steps).toLocaleString() + ' steps';
                } else {
                  originalValue = Math.round(value * GOALS.water).toLocaleString() + ' ml';
                }
                
                return `${label}: ${originalValue} (${Math.round(value * 100)}% of goal)`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'MMM d, yyyy'
            },
            adapters: {
              date: {
                locale: luxon.DateTime.local().locale
              }
            },
            stacked: true,
            grid: {
              display: false
            },
            ticks: {
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 7,
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
            }
          },
          y: {
            stacked: false,
            beginAtZero: true,
            max: 1.2, // Set max to 120% of goal for visibility
            grid: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim(),
              drawBorder: false
            },
            ticks: {
              callback: (value) => {
                return value * 100 + '%';
              },
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
            }
          }
        }
      }
    });
    
    // Store chart instance
    window.comparisonChart = comparisonChart;
  }
  
  // Normalize data for comparison chart (as percentage of goal)
  function normalizeData(dataArray, goalValue) {
    return dataArray.map(item => ({
      x: item.date,
      y: item.value / goalValue
    }));
  }
  
  // Distribution Chart - Show frequency distribution of metrics
  function initializeDistributionChart(data) {
    const ctx = document.getElementById('distribution-chart').getContext('2d');
    
    // Prepare sleep data for distribution chart
    const sleepDistribution = prepareDistributionData(data.sleepData, 'sleep');
    
    const distributionChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sleepDistribution.labels,
        datasets: [{
          label: 'Frequency',
          data: sleepDistribution.values,
          backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--color-sleep').trim(),
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary').trim(),
            titleColor: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim(),
            bodyColor: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim(),
            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim(),
            borderWidth: 1
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Sleep Duration (hours)',
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
            },
            grid: {
              display: false
            },
            ticks: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Frequency',
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
            },
            grid: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim(),
              drawBorder: false
            },
            ticks: {
              precision: 0,
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
            }
          }
        }
      }
    });
    
    // Store chart instance
    window.distributionChart = distributionChart;
    
    // Set up event listeners for distribution buttons
    document.querySelectorAll('.distribution-btn').forEach(button => {
      button.addEventListener('click', () => {
        const metric = button.dataset.metric;
        const buttons = document.querySelectorAll('.distribution-btn');
        
        // Update active button
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update chart data based on selected metric
        let newData;
        let xAxisTitle;
        let color;
        
        switch (metric) {
          case 'sleep':
            newData = prepareDistributionData(data.sleepData, 'sleep');
            xAxisTitle = 'Sleep Duration (hours)';
            color = getComputedStyle(document.documentElement).getPropertyValue('--color-sleep').trim();
            break;
          case 'steps':
            newData = prepareDistributionData(data.stepsData, 'steps');
            xAxisTitle = 'Daily Steps';
            color = getComputedStyle(document.documentElement).getPropertyValue('--color-steps').trim();
            break;
          case 'water':
            newData = prepareDistributionData(data.waterData, 'water');
            xAxisTitle = 'Water Intake (ml)';
            color = getComputedStyle(document.documentElement).getPropertyValue('--color-water').trim();
            break;
        }
        
        // Update chart
        distributionChart.data.labels = newData.labels;
        distributionChart.data.datasets[0].data = newData.values;
        distributionChart.data.datasets[0].backgroundColor = color;
        distributionChart.options.scales.x.title.text = xAxisTitle;
        distributionChart.update();
      });
    });
  }
  
  // Prepare data for distribution chart
  function prepareDistributionData(dataArray, type) {
    // Define bins based on metric type
    let bins;
    switch (type) {
      case 'sleep':
        bins = [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5];
        break;
      case 'steps':
        bins = [4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000];
        break;
      case 'water':
        bins = [800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400];
        break;
    }
    
    // Count frequency for each bin
    const frequency = new Array(bins.length).fill(0);
    
    dataArray.forEach(item => {
      const value = item.value;
      for (let i = 0; i < bins.length; i++) {
        if (i === bins.length - 1 || value < bins[i + 1]) {
          frequency[i]++;
          break;
        }
      }
    });
    
    // Format labels
    const labels = bins.map((bin, i) => {
      if (i === bins.length - 1) {
        return `${bin}+`;
      }
      return `${bin} - ${bins[i + 1]}`;
    });
    
    return {
      labels,
      values: frequency
    };
  }
  
  // Forecast Chart - Show forecast of all metrics
  function initializeForecastChart(data) {
    const ctx = document.getElementById('forecast-chart').getContext('2d');
    
    // Get past data and forecast data
    const pastDays = 7; // Show last 7 days
    const allSleepData = [...data.sleepData].sort((a, b) => a.date - b.date);
    const recentSleepData = allSleepData.slice(-pastDays);
    
    // Combine recent data with forecast
    const combinedSleep = [...recentSleepData, ...data.sleepForecast];
    
    // Find the index where forecast starts
    const forecastStartIndex = recentSleepData.length;
    
    const forecastChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Sleep (actual)',
          data: combinedSleep.slice(0, forecastStartIndex).map(item => ({
            x: item.date,
            y: item.value
          })),
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--color-sleep').trim(),
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Sleep (forecast)',
          data: combinedSleep.slice(forecastStartIndex).map(item => ({
            x: item.date,
            y: item.value
          })),
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--color-sleep').trim(),
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 3,
          pointStyle: 'triangle',
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              boxWidth: 8,
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
            }
          },
          tooltip: {
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary').trim(),
            titleColor: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim(),
            bodyColor: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim(),
            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim(),
            borderWidth: 1,
            callbacks: {
              title: (tooltipItems) => {
                const date = new Date(tooltipItems[0].parsed.x);
                return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
              },
              label: (context) => {
                const isForecast = context.datasetIndex === 1;
                const value = context.parsed.y.toFixed(1);
                return `${isForecast ? 'Forecast' : 'Actual'}: ${value} hours`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'MMM d, yyyy'
            },
            adapters: {
              date: {
                locale: luxon.DateTime.local().locale
              }
            },
            grid: {
              display: false
            },
            ticks: {
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 7,
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
            }
          },
          y: {
            grid: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim(),
              drawBorder: false
            },
            ticks: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
            }
          }
        }
      }
    });
    
    // Store chart instance
    window.forecastChart = forecastChart;
    
    // Calculate average forecast value
    const avgForecast = data.sleepForecast.reduce((sum, item) => sum + item.value, 0) / data.sleepForecast.length;
    
    // Update forecast message
    const forecastMessage = document.getElementById('forecast-message');
    forecastMessage.textContent = `Projected average sleep: ${avgForecast.toFixed(1)} hours per night next week.`;
  }
  
  // Correlation Chart - Show correlations between metrics
  function initializeCorrelationChart(correlations, data) {
    const ctx = document.getElementById('correlation-chart').getContext('2d');
    
    const correlationData = [
      { x: 0, y: 0, r: Math.abs(correlations.sleepSteps) * 20, label: 'Sleep vs Steps', value: correlations.sleepSteps },
      { x: 1, y: 0, r: Math.abs(correlations.sleepWater) * 20, label: 'Sleep vs Water', value: correlations.sleepWater },
      { x: 0, y: 1, r: Math.abs(correlations.stepsWater) * 20, label: 'Steps vs Water', value: correlations.stepsWater }
    ];
    
    const getBubbleColor = (correlation) => {
      if (correlation > 0.3) return getComputedStyle(document.documentElement).getPropertyValue('--color-positive').trim();
      if (correlation < -0.3) return getComputedStyle(document.documentElement).getPropertyValue('--color-negative').trim();
      return getComputedStyle(document.documentElement).getPropertyValue('--color-neutral').trim();
    };
    
    const correlationChart = new Chart(ctx, {
      type: 'bubble',
      data: {
        datasets: [{
          data: correlationData,
          backgroundColor: correlationData.map(d => getBubbleColor(d.value)),
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary').trim(),
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary').trim(),
            titleColor: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim(),
            bodyColor: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim(),
            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim(),
            borderWidth: 1,
            callbacks: {
              label: (context) => {
                const data = context.raw;
                const correlation = data.value.toFixed(2);
                const strength = Math.abs(data.value) < 0.3 ? 'Weak' : 
                                Math.abs(data.value) < 0.6 ? 'Moderate' : 'Strong';
                const direction = data.value > 0 ? 'Positive' : data.value < 0 ? 'Negative' : 'No';
                
                return [
                  data.label,
                  `${direction} correlation: ${correlation}`,
                  `Strength: ${strength}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            min: -0.5,
            max: 1.5,
            grid: {
              display: false
            },
            ticks: {
              display: false
            }
          },
          y: {
            min: -0.5,
            max: 1.5,
            grid: {
              display: false
            },
            ticks: {
              display: false
            }
          }
        }
      }
    });
    
    // Store chart instance
    window.correlationChart = correlationChart;
    
    // Update correlation message
    const correlationMessage = document.getElementById('correlation-message');
    
    // Find the strongest correlation
    const correlationValues = [
      { name: 'Sleep and Steps', value: correlations.sleepSteps },
      { name: 'Sleep and Water intake', value: correlations.sleepWater },
      { name: 'Steps and Water intake', value: correlations.stepsWater }
    ];
    
    correlationValues.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
    const strongest = correlationValues[0];
    
    let message;
    if (Math.abs(strongest.value) < 0.3) {
      message = `No strong correlations found between your health metrics.`;
    } else {
      const direction = strongest.value > 0 ? 'positive' : 'negative';
      message = `The strongest relationship is between ${strongest.name} (${direction}, ${Math.abs(strongest.value).toFixed(2)}).`;
      
      if (strongest.name === 'Sleep and Steps' && strongest.value > 0) {
        message += ' Higher step counts typically coincide with better sleep.';
      } else if (strongest.name === 'Sleep and Water intake' && strongest.value > 0) {
        message += ' Better hydration appears to correlate with improved sleep quality.';
      } else if (strongest.name === 'Steps and Water intake' && strongest.value > 0) {
        message += ' More active days seem to coincide with higher water intake.';
      }
    }
    
    correlationMessage.textContent = message;
  }