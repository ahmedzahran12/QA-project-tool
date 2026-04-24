// ── Helpers ───────────────────────────────────────────────────────────────────

function showError(id, msg) {
  const el = document.getElementById(id);
  el.innerText = msg;
  el.style.display = 'block';
}

function clearErrors() {
  document.querySelectorAll('.error-msg').forEach(el => {
    el.innerText = '';
    el.style.display = 'none';
  });
}

// ── Default test accounts (seeded on first visit) ─────────────────────────────

function ensureDefaultUsers() {
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  if (!users.find(u => u.email === 'admin@horizon.com')) {
    users.push({
      id: 1, email: 'admin@horizon.com', password: 'admin',
      firstName: 'Jack', lastName: 'Admin', role: 'admin',
      registrationDate: new Date().toISOString()
    });
  }

  if (!users.find(u => u.email === 'user@horizon.com')) {
    users.push({
      id: 2, email: 'user@horizon.com', password: 'user123',
      firstName: 'Elena', lastName: 'Rossi', role: 'user',
      registrationDate: new Date().toISOString()
    });
  }

  localStorage.setItem('users', JSON.stringify(users));
  return users;
}

// ── Validation ────────────────────────────────────────────────────────────────

function validate(email, password) {
  if (!email)    { showError('emailError',    'This field is required'); return false; }
  if (!password) { showError('passwordError', 'This field is required'); return false; }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('emailError', 'Invalid email format');
    return false;
  }

  return true;
}

// ── Login Handler ─────────────────────────────────────────────────────────────

function handleLogin() {
  clearErrors();

  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!validate(email, password)) return;

  const users = ensureDefaultUsers();
  const user  = users.find(u => u.email === email && u.password === password);

  if (!user) {
    showError('generalError', 'Invalid email or password');
    return;
  }

  // Persist session — never include the password in the stored user object
  localStorage.setItem('token', 'mock-jwt-token-' + user.id);
  const { password: _removed, ...sessionUser } = user;
  localStorage.setItem('user', JSON.stringify(sessionUser));

  window.location.href = user.role === 'admin' ? 'admin-users.html' : 'index.html';
}

document.getElementById('loginBtn').addEventListener('click', handleLogin);
