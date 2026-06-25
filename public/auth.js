const API_BASE = 'https://amertak-tools-api.onrender.com';

const statusEl = document.getElementById('status');

function showStatus(message, isError = false) {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.className = 'message';
  statusEl.style.display = 'block';
  statusEl.style.background = isError ? '#ffefef' : '#effffe';
  statusEl.style.color = isError ? '#6f1f1f' : '#0a3d7f';
}

function redirectAfterAuth() {
  const params = new URLSearchParams(window.location.search);
  const next = params.get('next');
  window.location.href = next && next.startsWith('/') ? next : '/';
}

// ---- LOGIN ----
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');

    if (submitBtn) submitBtn.disabled = true;
    showStatus('Logging in...');

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed.');
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      showStatus('Login successful! Redirecting...');
      setTimeout(redirectAfterAuth, 800);
    } catch (error) {
      showStatus(error.message || 'Login failed.', true);
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

// ---- REGISTER ----
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = registerForm.querySelector('button[type="submit"]');

    if (submitBtn) submitBtn.disabled = true;
    showStatus('Creating account...');

    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      showStatus('Account created! Redirecting...');
      setTimeout(redirectAfterAuth, 800);
    } catch (error) {
      showStatus(error.message || 'Registration failed.', true);
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
