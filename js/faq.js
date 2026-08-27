document.addEventListener('DOMContentLoaded', () => {
    const faqs = [
        { cat: 'Booking', q: 'How early should we book?', a: 'We recommend booking 6-8 months in advance.' },
        { cat: 'Travel', q: 'Do you travel for weddings?', a: 'Yes, we travel across India and internationally. Travel and stay are billed extra.' },
        { cat: 'Photography', q: 'Do you provide candid and traditional photography?', a: 'Yes, our packages can include both candid and traditional photography to ensure all moments and formal family portraits are covered.' },
        { cat: 'Video', q: 'Do you provide cinematic films?', a: 'Absolutely! Our cinematic team creates beautiful highlight films, full documentaries, and teasers.' },
        { cat: 'Drone', q: 'Is drone coverage available?', a: 'Yes, we provide drone coverage for outdoor venues and establishing shots, subject to local permissions.' },
        { cat: 'Albums', q: 'Do you provide albums?', a: 'Yes, we offer premium, custom-designed lay-flat albums in various sizes and finishes.' },
        { cat: 'Booking', q: 'Can packages be customized?', a: 'Yes, all our packages can be tailored to suit your specific requirements and budget.' },
        { cat: 'Delivery', q: 'How long does delivery take?', a: 'Photos are usually delivered within 4-6 weeks, and cinematic films within 8-10 weeks.' },
        { cat: 'Payment', q: 'What are your payment terms?', a: 'We require a 30% advance to block the date, 50% on the event day, and 20% before final delivery.' },
        { cat: 'Photography', q: 'How many photos do we get?', a: 'It depends on the event size, but we typically deliver 400-600 edited images for a full day wedding.' },
        { cat: 'Video', q: 'How long is the cinematic video?', a: 'A highlight reel is usually 4-7 minutes, while the full documentary can be 30-45 minutes long.' },
        { cat: 'Booking', q: 'Do we sign a contract?', a: 'Yes, we have a standard contract to protect both parties and ensure clarity on deliverables.' },
        { cat: 'Delivery', q: 'Do we get raw files?', a: 'We do not provide raw files as they are unfinished products. We provide beautifully edited high-resolution JPEGs.' },
        { cat: 'Albums', q: 'How many pages are in an album?', a: 'Our standard albums come with 40-50 pages, but can be upgraded.' },
        { cat: 'Travel', q: 'Who books the travel?', a: 'Clients usually handle travel and accommodation bookings for our team to simplify logistics.' },
        { cat: 'Video', q: 'Can we choose the music for the film?', a: 'We welcome your suggestions and will select legally licensed music that fits the cinematic mood of your film.' },
        { cat: 'Delivery', q: 'How do you deliver the photos?', a: 'We deliver through a secure, private online gallery where you can download high-resolution images.' },
        { cat: 'Photography', q: 'Do you shoot in natural light?', a: 'We love natural light but are also fully equipped with professional lighting gear for indoor and night events.' },
        { cat: 'Booking', q: 'What happens if we need to reschedule?', a: 'We will try our best to accommodate new dates subject to availability, as per our rescheduling policy.' },
        { cat: 'Photography', q: 'Do you do pre-wedding shoots?', a: 'Yes, pre-wedding shoots are a great way for us to get comfortable working together before the big day.' }
    ];

    const faqList = document.getElementById('faqList');
    const searchInput = document.getElementById('faqSearch');

    function renderFaqs(items) {
        faqList.innerHTML = '';
        items.forEach((item, index) => {
            const faqEl = document.createElement('div');
            faqEl.className = 'faq-item';
            faqEl.innerHTML = `
                <div class="faq-question">
                    <div>
                        <span class="faq-category">${item.cat}</span>
                        ${item.q}
                    </div>
                    <span class="faq-icon">+</span>
                </div>
                <div class="faq-answer">${item.a}</div>
            `;
            
            faqEl.querySelector('.faq-question').addEventListener('click', () => {
                const isActive = faqEl.classList.contains('active');
                document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
                if (!isActive) faqEl.classList.add('active');
            });
            
            faqList.appendChild(faqEl);
        });
    }

    renderFaqs(faqs);

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = faqs.filter(faq => 
                faq.q.toLowerCase().includes(query) || 
                faq.a.toLowerCase().includes(query) ||
                faq.cat.toLowerCase().includes(query)
            );
            renderFaqs(filtered);
        });
    }
});
