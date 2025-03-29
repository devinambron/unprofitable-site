// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create and animate the trading chart after a short delay to ensure DOM is rendered
    setTimeout(createTradingChart, 100);
    
    // Redraw chart on window resize
    window.addEventListener('resize', function() {
        const chartContainer = document.getElementById('trading-chart');
        if (chartContainer) {
            // Clear existing chart
            chartContainer.innerHTML = '';
            // Recreate chart
            createTradingChart();
        }
    });
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    
    if (mobileMenuToggle && mobileMenu && menuIcon && closeIcon) {
        console.log('Mobile menu elements found, initializing...');
        
        // Make sure icons are in correct initial state
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
        
        const toggleMobileMenu = () => {
            const isMenuVisible = !mobileMenu.classList.contains('hidden');
            console.log('Toggle mobile menu, current visibility:', isMenuVisible);
            
            if (isMenuVisible) {
                // Hide menu with Tailwind
                mobileMenu.classList.add('hidden');
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
                console.log('Menu hidden');
                
                // Reset overflow
                document.body.style.overflow = '';
            } else {
                // Show menu with Tailwind
                mobileMenu.classList.remove('hidden');
                menuIcon.classList.add('hidden');
                closeIcon.classList.remove('hidden');
                console.log('Menu shown');
                
                // Prevent scrolling when menu is open
                document.body.style.overflow = 'hidden';
            }
        };

        mobileMenuToggle.addEventListener('click', (e) => {
            console.log('Mobile menu button clicked');
            e.preventDefault(); // Prevent default behavior
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        // Close mobile menu when a link is clicked
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleMobileMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const isMenuVisible = !mobileMenu.classList.contains('hidden');
            if (isMenuVisible && !mobileMenu.contains(e.target) && e.target !== mobileMenuToggle) {
                toggleMobileMenu();
            }
        });

        // Prevent menu close when clicking inside menu
        mobileMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // Skip empty hrefs or just '#'
            if (!targetId || targetId === '#') {
                return;
            }
            
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

    // Modal functionality
    const applyButton = document.getElementById('apply-button');
    const boardApplyButton = document.getElementById('board-apply-button');
    const modal = document.getElementById('apply-modal');
    const closeModal = document.getElementById('close-modal');
    const applicationForm = document.getElementById('application-form');
    const formSuccess = document.querySelector('.form-success');
    const formError = document.querySelector('.form-error');

    // Function to initialize modal buttons
    const initModalButtons = () => {
        // Ensure we have all required elements for modal functionality
        if (modal && closeModal) {
            // Apply button handler (top announcement bar)
            if (applyButton) {
                applyButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            }
            
            // Board apply button handler (new section)
            if (boardApplyButton) {
                boardApplyButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            }

            // Close modal function
            const closeModalFunction = () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                if (formSuccess) formSuccess.style.display = 'none';
                if (formError) formError.style.display = 'none';
                // Reset form when modal is closed
                if (applicationForm) {
                    applicationForm.reset();
                }
            };

            closeModal.addEventListener('click', closeModalFunction);

            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModalFunction();
                }
            });

            // Handle form submission
            if (applicationForm) {
                applicationForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const submitButton = applicationForm.querySelector('button[type="submit"]');
                    submitButton.disabled = true;
                    
                    try {
                        const response = await fetch(applicationForm.action, {
                            method: 'POST',
                            body: new FormData(applicationForm),
                            headers: {
                                'Accept': 'application/json'
                            }
                        });

                        if (response.ok) {
                            if (formSuccess) formSuccess.style.display = 'block';
                            if (formError) formError.style.display = 'none';
                            // Close modal after showing success message briefly
                            setTimeout(closeModalFunction, 1500);
                        } else {
                            throw new Error('Form submission failed');
                        }
                    } catch (error) {
                        if (formError) formError.style.display = 'block';
                        if (formSuccess) formSuccess.style.display = 'none';
                    } finally {
                        submitButton.disabled = false;
                    }
                });
            }
        }
    };

    // Initialize modal buttons
    initModalButtons();

    // Safari compatibility: If the board button wasn't found initially, 
    // try again after a short delay to ensure the DOM is fully loaded
    if (!boardApplyButton) {
        setTimeout(() => {
            const delayedBoardApplyButton = document.getElementById('board-apply-button');
            if (delayedBoardApplyButton && modal) {
                delayedBoardApplyButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            }
        }, 500);
    }
});

// Function to create and animate the trading chart
function createTradingChart() {
    const chartContainer = document.getElementById('trading-chart');
    if (!chartContainer) return;
    
    // Check if chart already exists to prevent duplicates
    if (chartContainer.querySelector('svg')) {
        console.log('Chart already exists, skipping creation');
        return;
    }
    
    // Force a minimum height if container has zero height
    if (chartContainer.clientHeight < 200) {
        chartContainer.style.height = '400px';
    }
    
    const containerWidth = chartContainer.clientWidth || window.innerWidth;
    const containerHeight = chartContainer.clientHeight || 400;
    
    console.log('Chart container dimensions:', containerWidth, containerHeight); // Debug
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${containerWidth} ${containerHeight}`);
    svg.style.position = 'absolute';
    
    // Generate a volatile downward trend with more randomization
    const numPoints = 24; // More points for increased volatility
    const points = [];
    
    // Start higher up
    const startX = containerWidth * 0.05; // Start 5% from left
    const startY = containerHeight * 0.05; // Start 5% from top
    
    // Generate more randomized volatility patterns
    // Create semi-random patterns that ensure overall downward trend
    const generateRandomizedVolatility = () => {
        const patterns = [];
        
        // Generate more random volatility but ensure overall downward trend
        let cumulativeDirection = 0; // Track cumulative direction to ensure downward trend
        
        for (let i = 0; i < numPoints; i++) {
            const progress = i / (numPoints - 1);
            
            // Higher probability of downward movement as we progress
            const downBias = 0.3 + (progress * 0.4); // Bias increases from 0.3 to 0.7
            
            // Generate more drastic movements in the middle, smoother at start/end
            let volatilityFactor;
            if (progress < 0.15 || progress > 0.85) {
                volatilityFactor = 0.05; // Smoother at beginning and end
            } else {
                volatilityFactor = 0.12; // More volatile in the middle
            }
            
            // Create a semi-random movement with downward bias
            let movement;
            
            // If we've moved up too much recently, force a downward correction
            if (cumulativeDirection > 0.15) {
                movement = -Math.random() * 0.15 - 0.05; // Force downward
            } 
            // If at certain points, increase likelihood of major drops
            else if (progress > 0.4 && progress < 0.6 && Math.random() < 0.5) {
                movement = -Math.random() * 0.25; // Potential market crash
            }
            // Otherwise, use biased random movement
            else {
                movement = (Math.random() - downBias) * volatilityFactor;
            }
            
            // Update cumulative direction
            cumulativeDirection += movement;
            
            // Final sharp drop at the end
            if (progress > 0.85) {
                movement -= progress * 0.15; // Ensure final decline
            }
            
            patterns.push(movement);
        }
        
        return patterns;
    };
    
    const volatilityPatterns = generateRandomizedVolatility();
    
    // Base downward trajectory function - less steep at first, then accelerating down
    const baseFunction = (t) => {
        // Start slow, accelerate the drop toward the end
        if (t < 0.6) {
            return t * 0.35; // Slower decline initially
        } else {
            // Accelerate the drop for the final crash
            return 0.21 + (t - 0.6) * 1.7;
        }
    };
    
    for (let i = 0; i < numPoints; i++) {
        const progress = i / (numPoints - 1);
        
        // X coordinate increases linearly
        const x = startX + progress * (containerWidth * 0.9);
        
        // Base Y coordinate with downward trend
        let baseY = startY + (containerHeight * 0.85) * baseFunction(progress);
        
        // Add volatility from pattern
        let volatilityAdjustment = 0;
        if (i < volatilityPatterns.length) {
            volatilityAdjustment = volatilityPatterns[i] * containerHeight;
        }
        
        // Calculate final Y with volatility, but ensure we don't go above the top or below the bottom
        let y = Math.max(startY, Math.min(containerHeight * 0.95, baseY + volatilityAdjustment));
        
        points.push({ x, y });
    }
    
    // Create the path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.classList.add('chart-line', 'animate-drawLine');
    
    // Generate path data with smoother curves
    let pathData = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        // Use curved lines for smoother appearance
        const cp1x = points[i-1].x + (points[i].x - points[i-1].x) * 0.4;
        const cp1y = points[i-1].y + (points[i].y - points[i-1].y) * 0.2;
        const cp2x = points[i-1].x + (points[i].x - points[i-1].x) * 0.6;
        const cp2y = points[i].y - (points[i].y - points[i-1].y) * 0.2;
        
        pathData += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${points[i].x},${points[i].y}`;
    }
    
    path.setAttribute('d', pathData);
    svg.appendChild(path);
    
    // Create an area fill below the line to emphasize the chart
    const areaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let areaPathData = pathData; // Start with the same line
    
    // Add points to close the path at the bottom
    areaPathData += ` L ${points[points.length-1].x},${containerHeight}`;
    areaPathData += ` L ${points[0].x},${containerHeight}`;
    areaPathData += ` Z`; // Close the path
    
    areaPath.setAttribute('d', areaPathData);
    areaPath.setAttribute('fill', 'url(#redGradient)');
    areaPath.setAttribute('opacity', '0.25');
    areaPath.classList.add('animate-fadeIn');
    
    // Create gradient
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'redGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '0%');
    gradient.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#ff0000');
    stop1.setAttribute('stop-opacity', '0.7');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#ff0000');
    stop2.setAttribute('stop-opacity', '0.1');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.appendChild(gradient);
    svg.appendChild(defs);
    
    // Add the area fill below the line
    svg.appendChild(areaPath);
    
    // Add dots at local peaks and troughs to highlight volatility
    const findLocalExtrema = (points, windowSize = 3) => {
        const extrema = [];
        
        for (let i = windowSize; i < points.length - windowSize; i++) {
            // Check if it's a local maximum
            let isLocalMax = true;
            for (let j = i - windowSize; j <= i + windowSize; j++) {
                if (j !== i && points[j].y < points[i].y) {
                    isLocalMax = false;
                    break;
                }
            }
            
            // Check if it's a local minimum
            let isLocalMin = true;
            for (let j = i - windowSize; j <= i + windowSize; j++) {
                if (j !== i && points[j].y > points[i].y) {
                    isLocalMin = false;
                    break;
                }
            }
            
            if (isLocalMax || isLocalMin) {
                extrema.push(i);
            }
        }
        
        // Also include first and last points
        extrema.push(0);
        extrema.push(points.length - 1);
        
        // Return unique sorted indices
        return [...new Set(extrema)].sort((a, b) => a - b);
    };
    
    // Get extreme points plus a few fixed points
    const extremaIndices = findLocalExtrema(points);
    
    // Add dots at key points
    extremaIndices.forEach(index => {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', points[index].x);
        dot.setAttribute('cy', points[index].y);
        dot.setAttribute('r', 4);
        dot.classList.add('chart-dot', 'animate-pulsate');
        // Delay the animation of each dot
        dot.style.animationDelay = `${index * 0.2}s`;
        svg.appendChild(dot);
    });
    
    chartContainer.appendChild(svg);
}