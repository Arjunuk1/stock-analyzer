const signupForm = document.getElementById('signupForm');
const signupError = document.getElementById('signupError');

signupForm.addEventListener('submit', async (event) => {
	event.preventDefault();
	signupError.textContent = 'Creating account...';

	try {
		const formData = new FormData(signupForm);

		const response = await fetch('http://localhost:3000/api/signup', {
			method: 'POST',
			body: formData
		});

		const data = await response.json();

		if (!response.ok) {
			signupError.textContent = data.message || 'Signup failed';
			return;
		}

		localStorage.setItem('token', data.token); // Automatically log the user in
		signupError.style.color = '#138a4f';
		signupError.textContent = 'Signup successful. Redirecting to dashboard...';
		setTimeout(() => {
			window.location.href = './dashboard.html';
		}, 1000);
	} catch (error) {
		signupError.textContent = 'Request failed';
	}
});
