const loginForm = document.getElementById('loginForm');
const googleLoginBtn = document.getElementById('googleLogin');
const loginError = document.getElementById('loginError');

const queryParams = new URLSearchParams(window.location.search);
const googleToken = queryParams.get('token');
const googleError = queryParams.get('error');

if (googleToken) {
	localStorage.setItem('token', googleToken);
	window.location.href = '/dashboard.html';
}

if (googleError === 'google_not_configured') {
	loginError.textContent = 'Google login is not configured on server. Add Google env variables.';
}

if (googleError === 'google_login_failed') {
	loginError.textContent = 'Google login failed. Please try again.';
}

loginForm.addEventListener('submit', async (event) => {
	event.preventDefault();
	loginError.textContent = 'Logging in...';

	const formData = new FormData(loginForm);
	const email = formData.get('email');
	const password = formData.get('password');

	try {
		const response = await fetch('/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		const data = await response.json();

		if (!response.ok) {
			loginError.textContent = data.message || 'Login failed';
			return;
		}

		localStorage.setItem('token', data.token);
		window.location.href = '/dashboard.html';
	} catch (error) {
		loginError.textContent = 'Request failed';
	}
});

googleLoginBtn.addEventListener('click', async () => {
	window.location.href = '/auth/google';
});
