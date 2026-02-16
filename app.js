document.addEventListener('DOMContentLoaded', () => {
    AOS.init();

    const landingPage = document.getElementById('landing-page');
    const mainContent = document.getElementById('main-content');
    const goBtn = document.getElementById('go-memories-btn');
    const timelineContainer = document.getElementById('timeline');

    // Handle "Go Memories" Click
    goBtn.addEventListener('click', () => {
        landingPage.style.transition = "opacity 1s ease-out";
        landingPage.style.opacity = 0;
        setTimeout(() => {
            landingPage.style.display = 'none';
            mainContent.style.display = 'block';
            window.scrollTo(0, 0); // Reset scroll
        }, 1000);
    });

    // Fetch and Render Timeline
    fetch(`public/data.json?t=${Date.now()}`)
        .then(response => response.json())
        .then(data => {
            data.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = `timeline-item ${index % 2 === 0 ? 'left' : 'right'}`;
                div.setAttribute('data-aos', index % 2 === 0 ? 'fade-right' : 'fade-left');

                const dateObj = new Date(item.date);
                const dateStr = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

                div.innerHTML = `
                    <div class="content">
                        <div class="date">${dateStr}</div>
                        <img src="${item.src}" alt="Memory from ${dateStr}" loading="lazy">
                        <p>${item.caption || ''}</p>
                    </div>
                `;
                timelineContainer.appendChild(div);
            });
        })
        .catch(err => {
            console.error('Error loading timeline data:', err);
            timelineContainer.innerHTML = '<p style="text-align:center;">Could not load memories. Please check back later!</p>';
        });
});
