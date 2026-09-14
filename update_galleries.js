const fs = require('fs');

const files = ['index.html', 'portfolio.html'];

const newCSS = `        .masonry-grid {
            column-count: 3;
            column-gap: var(--spacing-sm);
        }
        @media (max-width: 900px) {
            .masonry-grid { column-count: 2; }
        }
        @media (max-width: 600px) {
            .masonry-grid { column-count: 1; }
        }
        .masonry-item {
            position: relative;
            overflow: hidden;
            border-radius: 6px;
            margin-bottom: var(--spacing-sm);
            display: block;
            break-inside: avoid;
            cursor: pointer;
        }
        .masonry-item img {
            width: 100%;
            height: auto;
            display: block;
            object-fit: cover;
            transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        /* Hover Effects */
        .masonry-item:hover img {
            transform: scale(1.05);
        }
        .masonry-item::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.5), transparent 50%);
            opacity: 0;
            transition: opacity 0.4s ease;
            pointer-events: none;
        }
        .masonry-item:hover::after {
            opacity: 1;
        }
        
        /* Lightbox Styles */
        .lightbox-modal {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.95);
            backdrop-filter: blur(10px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }
        .lightbox-modal.active {
            opacity: 1;
            pointer-events: auto;
        }
        .lightbox-img {
            max-width: 90%;
            max-height: 90vh;
            border-radius: 4px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            transform: scale(0.95);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .lightbox-modal.active .lightbox-img {
            transform: scale(1);
        }
        .lightbox-close {
            position: absolute;
            top: 1.5rem;
            right: 2rem;
            color: white;
            font-size: 2.5rem;
            cursor: pointer;
            background: none;
            border: none;
            padding: 10px;
            line-height: 1;
            z-index: 10000;
        }`;

const lightboxHTML = `
    <!-- Lightbox Modal -->
    <div class="lightbox-modal" id="lightbox">
        <button class="lightbox-close" id="lightbox-close">&times;</button>
        <img src="" alt="Fullscreen View" class="lightbox-img" id="lightbox-img">
    </div>`;

const lightboxJS = `
    // Lightbox Logic
    document.addEventListener('DOMContentLoaded', () => {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.getElementById('lightbox-close');
        
        if(!lightbox) return;

        // Open lightbox
        document.querySelectorAll('.masonry-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault(); // In case it's an anchor tag
                const img = item.querySelector('img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightbox.classList.add('active');
                }
            });
        });

        // Close lightbox
        const closeLightbox = () => lightbox.classList.remove('active');
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    });
`;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Replace CSS
    // For portfolio.html: .masonry-grid to .masonry-item img { ... }
    // For index.html: .masonry-grid to .masonry-overlay:hover { ... }
    if (file === 'portfolio.html') {
        content = content.replace(/\.masonry-grid[\s\S]*?transition: transform 0\.5s ease;\s*\}/, newCSS);
    } else if (file === 'index.html') {
        content = content.replace(/\.masonry-grid[\s\S]*?\.masonry-item:hover \.masonry-overlay \{\s*opacity: 1;\s*\}/, newCSS);
    }

    // 2. Add HTML
    if (!content.includes('id="lightbox"')) {
        content = content.replace('</body>', `${lightboxHTML}\n</body>`);
    }

    // 3. Add JS
    if (!content.includes('// Lightbox Logic')) {
        content = content.replace('</script>\n</body>', `${lightboxJS}\n</script>\n</body>`);
    }

    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
}
