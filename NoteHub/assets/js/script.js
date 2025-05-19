document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.showcase-tab');
    const contents = document.querySelectorAll('.showcase-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update content
            contents.forEach(content => {
                content.classList.remove('active');
                if (content.getAttribute('data-content') === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
});

window.addEventListener('scroll', () => {
    if (window.innerWidth > 768) {  // Only on desktop
        const scrolled = window.pageYOffset;
        const headerBg = document.querySelector('.header-bg');
        headerBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});


        document.addEventListener('DOMContentLoaded', () => {
            // Mobile Menu Toggle
            const menuBtn = document.querySelector('.menu-btn');
            const navLinks = document.querySelector('.nav-links');

            menuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });

            // Close mobile menu when clicking a link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                });
            });


            // Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        // Check if the href is more than just "#"
        if (targetId.length > 1) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

            // Add scroll animation for elements
            const observerOptions = {
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.feature-card, .showcase-content, .price-card').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'all 0.6s ease-out';
                observer.observe(el);
            });
        });


       // Form submission handler that works with translations
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('form');
  const result = document.getElementById('result');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get the form data regardless of language
      const formData = new FormData(form);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);
      
      // Set result message based on current language
      const waitMessage = languageState === 'bulgarian' ? 'Моля изчакайте...' : 'Please wait...';
      const successMessage = languageState === 'bulgarian' ? 'Формата е изпратена успешно' : 'Form submitted successfully';
      const errorMessage = languageState === 'bulgarian' ? 'Нещо се обърка!' : 'Something went wrong!';
      
      if (result) {
        result.innerHTML = waitMessage;
        result.style.display = "block";
      }
      
      // Make sure form field IDs and names don't change during translation
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      })
      .then(async (response) => {
        let jsonResponse = await response.json();
        if (response.status == 200) {
          if (result) result.innerHTML = successMessage;
        } else {
          console.log(response);
          if (result) result.innerHTML = jsonResponse.message || errorMessage;
        }
      })
      .catch(error => {
        console.log(error);
        if (result) result.innerHTML = errorMessage;
      })
      .finally(function() {
        form.reset();
        setTimeout(() => {
          if (result) result.style.display = "none";
        }, 3000);
      });
    });
  }
});