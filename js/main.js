/* ==========================================================================
   Main JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Video Preloader Logic
    const preloader = document.getElementById('video-preloader');
    const preloaderVideo = document.getElementById('preloader-video');
    
    if (preloader && preloaderVideo) {
        // Prevent scrolling while preloader is active
        document.body.style.overflow = 'hidden';
        
        const removePreloader = () => {
            if (!preloader.classList.contains('fade-out')) {
                preloader.classList.add('fade-out');
                document.body.style.overflow = '';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 800);
            }
        };

        // When video ends, remove preloader
        preloaderVideo.addEventListener('ended', removePreloader);
        
        // Fallback: If video fails or takes too long (e.g. 8 seconds)
        setTimeout(removePreloader, 8000);
    }
    
    // Header Scroll Effect
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on load
    
    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu on link click
        const mobileLinks = mobileMenu.querySelectorAll('.nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Modal Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                activeModal.classList.remove('active');
            }
        }
    });

    // Close Modal on overlay click
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
});
