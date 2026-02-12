document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('form');
    const submitBtn = document.querySelector('.contact-submit-btn');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get Input Values
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const subject = document.getElementById('contact-subject').value.trim();
        const message = document.getElementById('contact-message').value.trim();

        // Validation
        if (!name || !email || !message) {
            alert('Please fill in all required fields (Name, Email, Message).');
            return;
        }

        // Show Loading State
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';

        try {
            const apiBase = (typeof API_URL !== 'undefined') ? API_URL.replace('/api', '') : '';
            // If API_URL is http://localhost:5000/api, we want http://localhost:5000/api/contact
            // Check config.js for API_URL definition. Usually it includes /api
            // So we can just use API_URL + '/contact'

            const targetUrl = (typeof API_URL !== 'undefined') ? `${API_URL}/contact` : '/api/contact';

            const res = await fetch(targetUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, subject, message })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Success
                alert('Message sent successfully! We will get back to you soon.');
                contactForm.reset();
            } else {
                throw new Error(data.message || 'Failed to send message');
            }

        } catch (err) {
            console.error('Contact Form Error:', err);
            alert('Failed to send message. Please try again later.');
        } finally {
            // Restore Button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
        }
    });

    // Make the button type="submit" to trigger the event
    if (submitBtn.type !== 'submit') {
        submitBtn.type = 'submit';
    }
});
