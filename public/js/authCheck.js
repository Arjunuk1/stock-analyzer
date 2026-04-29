// Apply to protected routes. If token missing, blur background and show modal overlay.
const isAuthRoute = window.location.pathname === '/login.html' || window.location.pathname === '/signup.html';

if (!localStorage.getItem('token') && !isAuthRoute) {
    // Hide initially to prevent FOUC
    document.documentElement.style.display = 'none';

    document.addEventListener('DOMContentLoaded', () => {
        // Reveal the HTML, but restrict the body directly
        document.documentElement.style.display = '';
        
        // Prevent scrolling of underlying page
        document.body.style.overflow = 'hidden';
        
        // Blur all normal body contents to "hide main content below it"
        const contentChildren = Array.from(document.body.children);
        contentChildren.forEach(child => {
            if (child.tagName !== 'SCRIPT') {
                child.style.filter = 'blur(8px)';
                child.style.pointerEvents = 'none';
                child.style.userSelect = 'none';
            }
        });

        // Create the separate login overlay
        const overlay = document.createElement('div');
        overlay.id = 'auth-overlay';
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(10, 13, 20, 0.85); z-index: 999999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px);';

        // Render the modal window 
        overlay.innerHTML = `
            <div class="card panel reveal" style="pointer-events: auto; user-select: auto; width: 380px; padding: 2.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1);">
                <h2 style="margin: 0 0 0.5rem 0; text-align: center;">Login Required</h2>
                <p class="muted" style="margin: 0 0 1.5rem 0; text-align: center;">Unlock main content below by securely logging in.</p>
                
                <form id="overlayLoginForm" style="display: flex; flex-direction: column; gap: 1.25rem;">
                    <div>
                        <label style="font-weight: 600; margin-bottom: 0.5rem; display: block;">Email</label>
                        <input type="email" name="email" required style="width: 100%; padding: 0.75rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: #fff; font-family: inherit;" />
                    </div>
                    <div>
                        <label style="font-weight: 600; margin-bottom: 0.5rem; display: block;">Password</label>
                        <input type="password" name="password" required style="width: 100%; padding: 0.75rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: #fff; font-family: inherit;" />
                    </div>
                    
                    <button type="submit" class="btn" style="width: 100%; margin-top: 0.5rem;">Secure Login</button>
                    <div id="overlayLoginError" style="color: #ff6b6b; text-align: center; font-size: 0.9rem; min-height: 1.2rem; margin-top: -0.5rem;"></div>
                </form>
                
                <div style="display: flex; align-items: center; margin: 1.5rem 0;">
                    <div style="flex: 1; height: 1px; background: rgba(255,255,255,0.1);"></div>
                    <span style="padding: 0 1rem; color: #888; font-size: 0.85rem;">or</span>
                    <div style="flex: 1; height: 1px; background: rgba(255,255,255,0.1);"></div>
                </div>

                <a href="/auth/google" class="btn btn-outline" style="width: 100%; display: block; text-align: center; text-decoration: none; box-sizing: border-box;">Sign in with Google</a>

                <div style="text-align: center; font-size: 0.9rem; margin-top: 1.5rem;">
                    <span style="color: #888;">No account?</span> 
                    <a href="/signup.html" style="color: var(--primary); text-decoration: none; font-weight: 600;">Sign up</a>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Bind login form handler inside overlay
        document.getElementById('overlayLoginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const err = document.getElementById('overlayLoginError');
            err.textContent = 'Authenticating...';
            
            const formData = new FormData(e.target);
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(Object.fromEntries(formData))
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    err.textContent = data.message || 'Login failed';
                    return;
                }
                
                // On success, save token and dismiss overlay instantly
                err.textContent = '';
                localStorage.setItem('token', data.token);
                
                overlay.remove();
                document.body.style.overflow = '';
                
                // Clear the blur from the main page content instantly
                contentChildren.forEach(child => {
                    if (child.tagName !== 'SCRIPT') {
                        child.style.filter = '';
                        child.style.pointerEvents = '';
                        child.style.userSelect = '';
                    }
                });
                
                // Optional: refresh data or navigate exactly where they intended.
            } catch (error) {
                err.textContent = 'Network or server error';
            }
        });
    });
} else {
    // Has a token, or is already on the dedicated login/signup page. Just reveal the DOM.
    document.addEventListener('DOMContentLoaded', () => {
        document.documentElement.style.display = '';
    });
}