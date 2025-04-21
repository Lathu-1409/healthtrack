// Main JavaScript file for the Health Metrics Dashboard

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the dashboard
    initializeDashboard();
    
    // Set up event listeners
    setupEventListeners();
  });
  
  // Initialize the dashboard with data and charts
  async function initializeDashboard() {
    try {
      // Show loading state
      showLoading();
      
      // Process the health data
      const healthData = await processHealthData();
      
      // Update the summary cards
      updateSummaryCards(healthData.summaries);
      
      // Create insight cards
      createInsightCards(healthData.insights);
      
      // Initialize all charts
      initializeCharts(healthData);
      
      // Update last updated date
      updateLastUpdated();
      
      // Set initial theme
      setInitialTheme();
      
      // Hide loading state
      hideLoading();
    } catch (error) {
      console.error('Error initializing dashboard:', error);
      showError('Failed to load health metrics data. Please try again later.');
    }
  }
  
  // Show loading state
  function showLoading() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
      <div class="loading-spinner"></div>
      <p>Loading your health data...</p>
    `;
    document.body.appendChild(loadingOverlay);
  }
  
  // Hide loading state
  function hideLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.remove();
    }
  }
  
  // Show error message
  function showError(message) {
    const errorOverlay = document.createElement('div');
    errorOverlay.className = 'error-overlay';
    errorOverlay.innerHTML = `
      <div class="error-content">
        <p>${message}</p>
        <button onclick="location.reload()">Retry</button>
      </div>
    `;
    document.body.appendChild(errorOverlay);
  }
  
  // Set up all event listeners
  function setupEventListeners() {
    // Theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', toggleTheme);
    
    // Chart tab navigation
    const chartTabs = document.querySelectorAll('.chart-tab');
    const chartViews = document.querySelectorAll('.chart-view');
    
    chartTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Update active tab
        chartTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show corresponding view
        const targetView = tab.dataset.chart;
        chartViews.forEach(view => {
          view.classList.remove('active');
        });
        document.getElementById(`${targetView}-view`).classList.add('active');
        
        // Trigger window resize to properly size the chart
        window.dispatchEvent(new Event('resize'));
      });
    });
    
    // Date range dropdown
    const dateDropdown = document.getElementById('date-dropdown');
    const dateDropdownMenu = document.getElementById('date-dropdown-menu');
    
    dateDropdown.addEventListener('click', () => {
      dateDropdown.classList.toggle('active');
      dateDropdownMenu.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (!dateDropdown.contains(event.target)) {
        dateDropdown.classList.remove('active');
        dateDropdownMenu.classList.remove('show');
      }
    });
    
    // Date range options
    const dateOptions = document.querySelectorAll('.date-option');
    dateOptions.forEach(option => {
      option.addEventListener('click', async () => {
        const days = option.dataset.days;
        let label = option.textContent;
        
        if (days === 'custom') {
          // In a real application, this would show a date picker
          // For this demo, we'll just update the label
          label = 'Custom Range';
        }
        
        dateDropdown.textContent = label + ' ';
        const arrow = document.createElement('span');
        arrow.className = 'arrow-down';
        dateDropdown.appendChild(arrow);
        
        // Close the dropdown
        dateDropdownMenu.classList.remove('show');
        dateDropdown.classList.remove('active');
        
        // Refresh data with new date range
        try {
          showLoading();
          const healthData = await processHealthData();
          updateSummaryCards(healthData.summaries);
          createInsightCards(healthData.insights);
          initializeCharts(healthData);
          hideLoading();
        } catch (error) {
          console.error('Error refreshing data:', error);
          showError('Failed to refresh data. Please try again.');
        }
      });
    });
    
    // Window resize event to properly size charts
    window.addEventListener('resize', () => {
      // Resize any visible charts
      if (window.timelineChart) window.timelineChart.resize();
      if (window.comparisonChart) window.comparisonChart.resize();
      if (window.distributionChart) window.distributionChart.resize();
      if (window.forecastChart) window.forecastChart.resize();
      if (window.correlationChart) window.correlationChart.resize();
    });
  }