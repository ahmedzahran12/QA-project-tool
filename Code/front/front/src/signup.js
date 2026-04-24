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

// ── Validation ────────────────────────────────────────────────────────────────

function validateName(value, errorId, label) {
  if (!/^[a-zA-Z\s]+$/.test(value)) {
    showError(errorId, 'Only alphabetic characters are allowed');
    return false;
  }
  if (value.length < 2 || value.length > 50) {
    showError(errorId, `${label} should be between 2 and 50 characters`);
    return false;
  }
  return true;
}

function validatePassword(password) {
  if (password.length < 8) {
    showError('passwordError', 'Password cannot be less than 8 characters');
    return false;
  }
  const hasLower   = /[a-z]/.test(password);
  const hasUpper   = /[A-Z]/.test(password);
  const hasNumber  = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  if (!hasLower || !hasUpper || !hasNumber || !hasSpecial) {
    showError('passwordError', 'Password must include a lowercase letter, uppercase letter, number, and special character');
    return false;
  }
  return true;
}

function validate(fields) {
  const { firstName, lastName, email, password, confirmPassword } = fields;
  let isValid = true;

  // Required fields
  if (!firstName)       { showError('firstNameError',       'This field is required'); isValid = false; }
  if (!lastName)        { showError('lastNameError',        'This field is required'); isValid = false; }
  if (!email)           { showError('emailError',           'This field is required'); isValid = false; }
  if (!password)        { showError('passwordError',        'This field is required'); isValid = false; }
  if (!confirmPassword) { showError('confirmPasswordError', 'This field is required'); isValid = false; }

  if (!isValid) return false;

  // Field-level checks
  if (!validateName(firstName, 'firstNameError', 'First name')) isValid = false;
  if (!validateName(lastName,  'lastNameError',  'Last name'))  isValid = false;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('emailError', 'Invalid email format');
    isValid = false;
  }

  if (!validatePassword(password)) isValid = false;

  if (password !== confirmPassword) {
    showError('confirmPasswordError', "Password doesn't match");
    isValid = false;
  }

  return isValid;
}

// ── Sign-up Handler ───────────────────────────────────────────────────────────

function handleSignup() {
  clearErrors();

  const fields = {
    firstName:       document.getElementById('firstName').value.trim(),
    lastName:        document.getElementById('lastName').value.trim(),
    email:           document.getElementById('email').value.trim(),
    password:        document.getElementById('password').value,
    confirmPassword: document.getElementById('confirmPassword').value,
  };

  if (!validate(fields)) return;

  const users = JSON.parse(localStorage.getItem('users') || '[]');

  if (users.find(u => u.email === fields.email)) {
    showError('generalError', 'An account with this email already exists');
    return;
  }

  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 2,
    firstName: fields.firstName,
    lastName:  fields.lastName,
    email:     fields.email,
    password:  fields.password,
    role: 'user',
    registrationDate: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  window.location.href = 'login.html';
}

document.getElementById('registerBtn').addEventListener('click', handleSignup);
