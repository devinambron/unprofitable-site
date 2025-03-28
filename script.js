// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create and animate the trading chart
    createTradingChart();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation class to elements when they come into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeIn');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all section elements
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Display current year in footer
    const yearElement = document.querySelector('.current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// Function to create and animate the trading chart
function createTradingChart() {
    const chartContainer = document.getElementById('trading-chart');
    if (!chartContainer) return;
    
    const containerWidth = chartContainer.clientWidth;
    const containerHeight = chartContainer.clientHeight;
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${containerWidth} ${containerHeight}`);
    svg.style.position = 'absolute';
    
    // Generate a downward trend path
    const numPoints = 12;
    const points = [];
    
    // Start from top left
    const startX = 0;
    const startY = containerHeight * 0.2; // Start at 20% from the top
    
    for (let i = 0; i < numPoints; i++) {
        const progress = i / (numPoints - 1);
        
        // X coordinate increases linearly
        const x = startX + progress * containerWidth;
        
        // Y coordinate trends downward with some randomness
        // Overall trend is downward, using cubic function for acceleration
        let y = startY + (containerHeight * 0.6) * Math.pow(progress, 1.5);
        
        // Add some randomness to make it look like a trading chart
        if (i > 0 && i < numPoints - 1) {  // Keep first and last points fixed
            y += (Math.random() - 0.3) * containerHeight * 0.1;  // Biased toward downward movement
        }
        
        points.push({ x, y });
    }
    
    // Create the path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.classList.add('chart-line', 'animate-drawLine', 'animate-pulsate');
    
    // Generate path data
    let pathData = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        // Use curved lines for smoother appearance
        const cp1x = points[i-1].x + (points[i].x - points[i-1].x) / 2;
        const cp1y = points[i-1].y;
        const cp2x = points[i-1].x + (points[i].x - points[i-1].x) / 2;
        const cp2y = points[i].y;
        
        pathData += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${points[i].x},${points[i].y}`;
    }
    
    path.setAttribute('d', pathData);
    svg.appendChild(path);
    
    // Add dots at each data point for emphasis
    points.forEach((point, index) => {
        if (index % 2 === 0) { // Only add dots at some points to avoid crowding
            const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            dot.setAttribute('cx', point.x);
            dot.setAttribute('cy', point.y);
            dot.setAttribute('r', 3);
            dot.classList.add('chart-dot', 'animate-pulsate');
            // Delay the animation of each dot
            dot.style.animationDelay = `${index * 0.5}s`;
            svg.appendChild(dot);
        }
    });
    
    chartContainer.appendChild(svg);
}