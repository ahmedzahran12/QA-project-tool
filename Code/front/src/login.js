document.getElementById('loginBtn').addEventListener('click', async () => {
  document.querySelectorAll('.error-msg').forEach(el => {
    el.innerText = '';
    el.style.display = 'none';
  });

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  let isValid = true;

  const showError = (id, msg) => {
    const el = document.getElementById(id);
    el.innerText = msg;
    el.style.display = 'block';
    isValid = false;
  };

  if (!email) showError('emailError', 'This field is required');
  if (!password) showError('passwordError', 'This field is required');

  if (!isValid) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError('emailError', 'Invalid email format');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users') || '[]');

  if (!users.find(u => u.email === 'admin@horizon.com')) {
    users.push({
      id: 1,
      email: 'admin@horizon.com',
      password: 'admin',
      firstName: 'Jack',
      lastName: 'Admin',
      role: 'admin',
      registrationDate: new Date().toISOString()
    });
  }


  if (!users.find(u => u.email === 'user@horizon.com')) {
    users.push({
      id: 2,
      email: 'user@horizon.com',
      password: 'user123',
      firstName: 'Elena',
      lastName: 'Rossi',
      role: 'user',
      registrationDate: new Date().toISOString()
    });
  }

  localStorage.setItem('users', JSON.stringify(users));

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem('token', 'mock-jwt-token-' + user.id);


    const userToSave = { ...user };
    delete userToSave.password;

    localStorage.setItem('user', JSON.stringify(userToSave));

    if (user.role === 'admin') {
      window.location.href = 'admin-users.html';
    } else {
      window.location.href = 'index.html';
    }
  } else {
    showError('generalError', 'invalid email or password');
  }
});
