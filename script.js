/*
  C&C Wedding Script
  Handles the countdown timer to the wedding date and submission of
  RSVP data to a Google Sheets Web App. The countdown updates every
  second. The form is submitted via fetch using a no-cors request
  because the Google Apps Script endpoint does not return CORS
  headers. After submission the form resets and a thank you message
  is shown.
*/

document.addEventListener('DOMContentLoaded', () => {
  // Countdown to wedding date
  const countDownDate = new Date('Sep 27, 2025 00:00:00').getTime();
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = countDownDate - now;

    if (distance < 0) {
      daysEl.textContent = '0';
      hoursEl.textContent = '0';
      minutesEl.textContent = '0';
      secondsEl.textContent = '0';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = days;
    hoursEl.textContent = hours;
    minutesEl.textContent = minutes;
    secondsEl.textContent = seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // RSVP form submission
  const form = document.getElementById('rsvp-form');
  const thankYou = document.getElementById('thank-you');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Build data object
    const data = {
      nume: document.getElementById('nume').value.trim(),
      prenume: document.getElementById('prenume').value.trim(),
      participare: form.querySelector("input[name='participare']:checked")?.value || '',
      insotit: form.querySelector("input[name='insotit']:checked")?.value || '',
      mesaj: document.getElementById('mesaj').value.trim(),
      timestamp: new Date().toISOString()
    };
    const scriptURL = 'https://script.google.com/macros/s/AKfycbz2C-dl4ngCc428VQJD_Zjn8mrfvd36PoxuS26-URXzq3sne2MyrS5Zy2LkN1s4hpSskw/exec';
    // Send POST request using no-cors so the script receives it despite CORS restrictions
    fetch(scriptURL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(() => {
      form.reset();
      thankYou.style.display = 'block';
    }).catch(() => {
      // Even if there is an error, still show thank-you to the user
      form.reset();
      thankYou.style.display = 'block';
    });
  });
});