// Utility functions for the health dashboard

// Format a number with comma separators
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  // Format a date in a readable format
  function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  // Calculate percentage change
  function calculatePercentChange(current, previous) {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }
  
  // Add trend class based on percentage change
  function getTrendClass(percentChange) {
    if (percentChange > 0) return 'positive';
    if (percentChange < 0) return 'negative';
    return 'neutral';
  }
  
  // Update the summary cards with the latest data
  function updateSummaryCards(summaries) {
    // Sleep card
    document.getElementById('avg-sleep').textContent = summaries.sleep.average.toFixed(1);
    
    const sleepTrend = document.getElementById('sleep-trend');
    sleepTrend.textContent = `${Math.abs(summaries.sleep.trend).toFixed(1)}%`;
    sleepTrend.className = `trend ${getTrendClass(summaries.sleep.trend)}`;
    
    document.getElementById('sleep-goal-progress').style.width = `${Math.min(100, summaries.sleep.goalPercent)}%`;
    document.getElementById('sleep-goal-percent').textContent = Math.round(summaries.sleep.goalPercent);
    
    // Steps card
    document.getElementById('avg-steps').textContent = formatNumber(Math.round(summaries.steps.average));
    
    const stepsTrend = document.getElementById('steps-trend');
    stepsTrend.textContent = `${Math.abs(summaries.steps.trend).toFixed(1)}%`;
    stepsTrend.className = `trend ${getTrendClass(summaries.steps.trend)}`;
    
    document.getElementById('steps-goal-progress').style.width = `${Math.min(100, summaries.steps.goalPercent)}%`;
    document.getElementById('steps-goal-percent').textContent = Math.round(summaries.steps.goalPercent);
    
    // Water card
    document.getElementById('avg-water').textContent = formatNumber(Math.round(summaries.water.average));
    
    const waterTrend = document.getElementById('water-trend');
    waterTrend.textContent = `${Math.abs(summaries.water.trend).toFixed(1)}%`;
    waterTrend.className = `trend ${getTrendClass(summaries.water.trend)}`;
    
    document.getElementById('water-goal-progress').style.width = `${Math.min(100, summaries.water.goalPercent)}%`;
    document.getElementById('water-goal-percent').textContent = Math.round(summaries.water.goalPercent);
  }
  
  // Create insight cards based on the data
  function createInsightCards(insights) {
    const insightsContainer = document.getElementById('insights-container');
    insightsContainer.innerHTML = '';
    
    insights.forEach(insight => {
      const card = document.createElement('div');
      card.className = 'insight-card';
      
      const getIconUrl = (type) => {
        switch (type) {
          case 'sleep':
            return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17 20.5H3'/%3E%3Cpath d='M21 4H7'/%3E%3Cpath d='M3 17.5C3 15 5 13 7.5 13h5c2.5 0 4.5 2 4.5 4.5'/%3E%3Cpath d='M21 7.5C21 10 19 12 16.5 12h-5c-2.5 0 -4.5-2-4.5-4.5'/%3E%3C/svg%3E";
          case 'steps':
            return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 5.5C19 7.433 17.433 9 15.5 9S12 7.433 12 5.5S13.567 2 15.5 2S19 3.567 19 5.5Z'/%3E%3Cpath d='M12 14.5c0 1.933-1.567 3.5-3.5 3.5S5 16.433 5 14.5 6.567 11 8.5 11s3.5 1.567 3.5 3.5Z'/%3E%3Cpath d='m14 15 2 5 2-5'/%3E%3Cpath d='m8 5-2 5-2-5'/%3E%3C/svg%3E";
          case 'water':
            return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z'/%3E%3C/svg%3E";
          case 'calendar':
            return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='4' rx='2' ry='2'/%3E%3Cline x1='16' x2='16' y1='2' y2='6'/%3E%3Cline x1='8' x2='8' y1='2' y2='6'/%3E%3Cline x1='3' x2='21' y1='10' y2='10'/%3E%3C/svg%3E";
          default:
            return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21.21 15.89A10 10 0 1 1 8 2.83'/%3E%3Cpath d='M22 12A10 10 0 0 0 12 2v10z'/%3E%3C/svg%3E";
        }
      };
      
      card.innerHTML = `
        <h3>
          <span class="insight-icon" style="mask-image: url('${getIconUrl(insight.icon)}')"></span>
          ${insight.title}
        </h3>
        <p>${insight.description}</p>
        <div class="insight-data">
          ${insight.metrics.map(metric => `
            <div class="insight-metric">
              <div class="insight-value">${metric.value}</div>
              <div class="insight-label">${metric.label}</div>
            </div>
          `).join('')}
        </div>
      `;
      
      insightsContainer.appendChild(card);
    });
  }
  
  // Update last updated date
  function updateLastUpdated() {
    const lastUpdated = document.getElementById('last-updated');
    const now = new Date();
    lastUpdated.textContent = now.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  // Toggle theme between light and dark
  function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('dark-theme');
    
    if (isDark) {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    }
    
    // Update charts with new theme colors if they exist
    if (window.timelineChart) window.timelineChart.update();
    if (window.comparisonChart) window.comparisonChart.update();
    if (window.distributionChart) window.distributionChart.update();
    if (window.forecastChart) window.forecastChart.update();
    if (window.correlationChart) window.correlationChart.update();
  }
  
  // Set theme based on localStorage or system preference
  function setInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }