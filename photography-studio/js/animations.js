/* ==========================================================================
   Animations JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        
        // Intersection Observer for animations
        const animationObserverOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };
        
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Unobserve after animating once
                    observer.unobserve(entry.target);
                }
            });
        }, animationObserverOptions);
        
        // Elements to animate
        const fadeUpElements = document.querySelectorAll('.fade-up');
        const revealElements = document.querySelectorAll('.img-reveal, .text-reveal');
        
        fadeUpElements.forEach(el => animationObserver.observe(el));
        revealElements.forEach(el => animationObserver.observe(el));
        
        // Custom Cursor (Desktop only)
        if (window.innerWidth >= 1024) {
            const cursorDot = document.createElement('div');
            cursorDot.classList.add('cursor-dot');
            
            const cursorOutline = document.createElement('div');
            cursorOutline.classList.add('cursor-outline');
            
            document.body.appendChild(cursorDot);
            document.body.appendChild(cursorOutline);
            
            window.addEventListener('mousemove', (e) => {
                cursorDot.style.left = `${e.clientX}px`;
                cursorDot.style.top = `${e.clientY}px`;
                
                // Slight delay for outline for smooth effect
                setTimeout(() => {
                    cursorOutline.style.left = `${e.clientX}px`;
                    cursorOutline.style.top = `${e.clientY}px`;
                }, 50);
            });
            
            // Hover states
            const hoverElements = document.querySelectorAll('a, button, .service-card, .masonry-item, .play-btn');
            
            hoverElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                    cursorOutline.style.backgroundColor = 'rgba(176, 141, 87, 0.1)';
                    cursorDot.style.opacity = '0';
                });
                
                el.addEventListener('mouseleave', () => {
                    cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                    cursorOutline.style.backgroundColor = 'transparent';
                    cursorDot.style.opacity = '1';
                });
            });
        }
    } else {
        // If reduced motion, immediately show elements
        document.querySelectorAll('.fade-up, .img-reveal, .text-reveal').forEach(el => {
            el.classList.add('visible');
            el.style.transition = 'none';
            el.style.animation = 'none';
        });
    }
});
