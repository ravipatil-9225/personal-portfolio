document.addEventListener('DOMContentLoaded', () => {

    // Navbar Transition on Scroll
    const navbar = document.querySelector('.navbar');
    const mainContent = document.querySelector('.main-content');

    window.addEventListener('scroll', () => {
        // Check if we have scrolled past the hero section
        if (window.scrollY > mainContent.offsetTop - 100) {
            navbar.classList.add('dark-nav');
        } else {
            navbar.classList.remove('dark-nav');
        }
    });

    // Intersection Observer for scroll animations (fade-up)
    const fadeElements = document.querySelectorAll('.fade-up');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('span');
    const formStatus = document.getElementById('formStatus');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // UI Loading state
        const originalText = btnText.innerText;
        btnText.innerText = 'Sending...';
        submitBtn.disabled = true;
        formStatus.className = 'form-status';
        formStatus.innerText = '';

        // Gather form data
        const formData = new FormData(contactForm);

        try {
            // Web3Forms integration for real-time email notification
            formData.append("access_key", "bf33dd02-178b-4dae-ae00-3bc83d87ed0f");

            // Customize the email notification details
            formData.set("from_name", "Raviraj's Portfolio");
            formData.set("subject", "New Message from Portfolio: " + formData.get("subject"));

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            });

            const result = await response.json();

            if (response.status === 200) {
                formStatus.classList.add('success');
                formStatus.innerText = 'Thank you! Your message has been sent successfully.';
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Something went wrong.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            formStatus.classList.add('error');
            formStatus.innerText = error.message || 'Failed to send message. Please try again.';
        } finally {
            // Revert UI Loading state
            btnText.innerText = originalText;
            submitBtn.disabled = false;
        }
    });

});
