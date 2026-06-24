document.addEventListener("DOMContentLoaded", () => {
    // 1. Custom Flashlight Cursor Logic (Golden Glow)
    const cursor = document.querySelector('.glow-cursor');
    const spotlightTargets = document.querySelectorAll('.spotlight-target');
    
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
            
            // Interactive Spotlight Effect
            spotlightTargets.forEach(target => {
                const rect = target.getBoundingClientRect();
                const targetX = rect.left + rect.width / 2;
                const targetY = rect.top + rect.height / 2;
                const dist = Math.sqrt(Math.pow(e.clientX - targetX, 2) + Math.pow(e.clientY - targetY, 2));
                
                // Brightens up when the cursor is within 500px radius
                if(dist < 500) {
                    target.style.opacity = 1 - (dist / 1000);
                } else {
                    target.style.opacity = 0.3;
                }
            });
        });
    }

    // 2. Cinematic Scroll Reveals (Images and Text blocks)
    const reveals = document.querySelectorAll('.reveal-on-scroll');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -100px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove the translate and opacity to reveal smoothly
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        // Initial state before reveal
        reveal.style.opacity = 0;
        reveal.style.transform = 'translateY(80px)';
        reveal.style.transition = 'all 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
        revealObserver.observe(reveal);
    });

    // 3. Web3Forms Submission without default alert
    const form = document.getElementById('pledgeForm');
    const resultDiv = document.getElementById('formResult');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            resultDiv.innerHTML = "يتم نقش عهدك في السجلات...";
            resultDiv.style.color = "#a0aec0";

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
                    // Simulating the user seeing their name dynamically
                    resultDiv.innerHTML = `تم قبول عهدك يا ${object.name}. أهلاً بك في صناع الأمل.`;
                    resultDiv.style.color = "var(--accent-gold)";
                    form.reset();
                } else {
                    console.log(response);
                    resultDiv.innerHTML = "حدث خطأ غير متوقع.";
                    resultDiv.style.color = "red";
                }
            })
            .catch(error => {
                console.log(error);
                resultDiv.innerHTML = "فشل الاتصال بالخادم.";
                resultDiv.style.color = "red";
            });
        });
    }
});
