document.getElementById('registerBtn').addEventListener('click', async () => {

  document.querySelectorAll('.error-msg').forEach(el => {
    el.innerText = '';
    el.style.display = 'none';
  });

  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  let isValid = true;

  const showError = (id, msg) => {
    const el = document.getElementById(id);
    el.innerText = msg;
    el.style.display = 'block';
    isValid = false;
  };

  if (!firstName) showError('firstNameError', 'This field is required');
  if (!lastName) showError('lastNameError', 'This field is required');
  if (!email) showError('emailError', 'This field is required');
  if (!password) showError('passwordError', 'This field is required');
  if (!confirmPassword) showError('confirmPasswordError', 'This field is required');

  if (!isValid) return;


  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(firstName)) {
    showError('firstNameError', 'Only alphabetic characters are allowed');
  } else if (firstName.length < 2 || firstName.length > 50) {
    showError('firstNameError', 'Name should be between 2 and 50 characters');
  }

  if (!nameRegex.test(lastName)) {
    showError('lastNameError', 'Only alphabetic characters are allowed');
  } else if (lastName.length < 2 || lastName.length > 50) {
    showError('lastNameError', 'Name should be between 2 and 50 characters');
  }


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError('emailError', 'Invalid email format');
  }


  if (password.length < 8) {
    showError('passwordError', 'password cannot be less than 8 characters');
  } else {
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasLower || !hasUpper || !hasNumber || !hasSpecial) {
      showError('passwordError', 'password should have one small letter,one capital letter,one number and one special character');
    }
  }


  if (password !== confirmPassword) {
    showError('confirmPasswordError', "password doesn't match");
  }

  if (!isValid) return;


  const users = JSON.parse(localStorage.getItem('users') || '[]');

  if (users.find(u => u.email === email)) {
    showError('generalError', 'Email already has an account');
    return;
  }

  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 2,
    firstName,
    lastName,
    email,
    password,
    role: 'user',
    registrationDate: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  window.location.href = 'login.html';
});
