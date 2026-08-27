document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('bookingForm');
    const dateInput = document.getElementById('weddingDate');
    
    if (dateInput) {
        // Prevent past dates
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation for services
            const checkboxes = document.querySelectorAll('#servicesRequired input[type="checkbox"]');
            let isChecked = false;
            checkboxes.forEach(cb => {
                if(cb.checked) isChecked = true;
            });
            
            if (!isChecked) {
                alert('Please select at least one service.');
                return;
            }
            
            // Show Success Modal
            const modal = document.getElementById('success-modal');
            modal.classList.add('active');
            
            // Reset form
            bookingForm.reset();
        });
    }
});
