(() => {
  const form = document.getElementById('registration-form');
  const payment = document.querySelector('.payment-card');
  const layout = document.querySelector('.registration-layout');
  const mobilePayment = matchMedia('(max-width:760px)');
  function placePayment() {
    (mobilePayment.matches ? document.getElementById('mobile-payment-slot') : layout).append(
      payment,
    );
  }
  mobilePayment.addEventListener('change', placePayment);
  placePayment();
  const receipt = document.getElementById('receipt');
  const receiptStatus = document.getElementById('receipt-status');
  const status = document.getElementById('form-status');
  form.addEventListener('change', () => {
    status.hidden = true;
  });
  receipt.addEventListener('change', () => {
    const file = receipt.files[0];
    receipt.setCustomValidity('');
    receiptStatus.textContent = '';
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      receipt.setCustomValidity('Choose a JPG, PNG or PDF file.');
      receiptStatus.textContent = receipt.validationMessage;
    } else if (file.size > 10 * 1024 * 1024) {
      receipt.setCustomValidity('Your receipt must be 10 MB or smaller.');
      receiptStatus.textContent = receipt.validationMessage;
    } else receiptStatus.textContent = `${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} MB`;
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    status.textContent = 'Please contact helpdesk@ipswb.com to complete your registration.';
    status.hidden = false;
    status.focus();
  });
})();
