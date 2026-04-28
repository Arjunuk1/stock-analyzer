const profileInfo = document.getElementById('profileInfo');
const profileError = document.getElementById('profileError');

async function loadProfile() {
	const token = localStorage.getItem('token');

	if (!token) {
		profileError.textContent = 'Please login first';
		return;
	}

	try {
		const response = await fetch('/profile', {
			headers: { Authorization: `Bearer ${token}` }
		});

		const data = await response.json();

		if (!response.ok) {
			profileError.textContent = data.message || 'Failed to load profile';
			return;
		}

		profileInfo.innerHTML = `
			<p><strong>Name:</strong> ${data.name}</p>
			<p><strong>Email:</strong> ${data.email}</p>
			${data.profilePic ? `<img src="${data.profilePic}" alt="Profile" width="120" />` : '<p>No profile image</p>'}
		`;
	} catch (error) {
		profileError.textContent = 'Request failed';
	}
}

loadProfile();
