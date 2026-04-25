// Use globally exposed data from data.js (loaded before this script)
// ── Destinations Section ───────────────────────────────────────────────────────

function buildDestinationCard(dest) {
  const starSvg = '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
  return `
    <div class="dest-card">
      <div class="dest-card-img-wrapper">
        <img src="${dest.images}" alt="${dest.name}" class="dest-card-img" />
      </div>
      <div class="dest-card-content">
        <div class="dest-card-header">
          <div>
            <h3 class="dest-card-title">${dest.name}</h3>
            <div class="dest-card-rating">
              ${starSvg}
              <span>${dest.rating}</span>
            </div>
          </div>
          <p class="dest-card-price">€${dest.cost.toLocaleString()}</p>
        </div>
        <a href="destination-${dest.country.toLowerCase()}.html?id=${dest.id}" class="btn-card-action">View Tour</a>
      </div>
    </div>
  `;
}

function renderDestinations(country) {
  const container = document.getElementById('destinations-container');
  if (!container) return;

  const filtered = destinations
    .filter(d => d.country.toLowerCase() === country.toLowerCase())
    .slice(0, 9);

  if (filtered.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); padding: 40px 0; text-align: center; grid-column: 1/-1;">No destinations found for this country.</p>';
    return;
  }

  container.innerHTML = filtered.map(buildDestinationCard).join('');
}

function setupDestinationTabs() {
  const tabs = document.querySelectorAll('.filter-tag');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => { t.classList.remove('active'); t.innerHTML = t.textContent.trim(); });
      const btn = e.currentTarget;
      btn.classList.add('active');
      const country = btn.textContent.trim();
      btn.innerHTML = `<span class="dot"></span>${country}`;
      renderDestinations(country);
    });
  });
}

// ── Testimonials Section ───────────────────────────────────────────────────────

function buildTestimonialCard(t) {
  const starSvg = '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
  return `
    <div class="testi-card">
      <div class="testi-header">
        <div>
          <h4 class="testi-name">${t.name}</h4>
          <p class="testi-loc">${t.location || 'TRAVELER'}</p>
        </div>
      </div>
      <div class="testi-stars">
        ${Array(t.rating).fill(starSvg).join('')}
      </div>
      <p class="testi-text">${t.text}</p>
    </div>
  `;
}

function renderTestimonials() {
  const container = document.getElementById('testimonials-container');
  if (!container) return;

  let reviews = JSON.parse(localStorage.getItem('reviews') || '[]');

  // Remove any leftover demo reviews from old data
  const demoNames = ['Elena Rossi', 'Julian Hayes', 'Marcus Chen'];
  const cleaned = reviews.filter(r => !demoNames.includes(r.name));
  if (cleaned.length !== reviews.length) {
    localStorage.setItem('reviews', JSON.stringify(cleaned));
    reviews = cleaned;
  }

  const lastThree = reviews.slice(-3).reverse();

  if (lastThree.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); padding: 40px 0; text-align: center; grid-column: 1/-1; font-weight: 500;">No reviews yet. Be the first to share your experience!</p>';
    return;
  }

  container.classList.remove('grid-3');
  container.classList.add(`reviews-grid-${lastThree.length}`);
  container.innerHTML = lastThree.map(buildTestimonialCard).join('');
}

// ── Entry Point ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('destinations-container')) {
    renderDestinations('Italy');
    setupDestinationTabs();
  }
  renderTestimonials();
});
