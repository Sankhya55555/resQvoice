// API base URL - local in VS Code, deployed backend on Netlify.
const API_BASE_URL = ["localhost", "127.0.0.1"].includes(window.location.hostname)
  ? "http://localhost:5000/api"
  : "https://resqvoice-q67t.onrender.com/api";

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Authentication functions
const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

const loginUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await handleResponse(response);

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    }

    return data;
  } catch (error) {
    throw error;
  }
};

const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const updateUserProfile = (user) => {
  if (!user || !user.name) {
    return;
  }

  const greeting = document.getElementById("userGreeting");
  const avatar = document.getElementById("userAvatar");

  if (greeting) {
    greeting.textContent = `Welcome ${user.name}`;
  }

  if (avatar) {
    const encodedName = encodeURIComponent(user.name);
    avatar.src = `https://ui-avatars.com/api/?name=${encodedName}&background=random`;
    avatar.alt = user.name;
  }
};


// UI Helper functions
const showError = (message) => {
  // Create error message element
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  errorDiv.style.cssText = `
    background: #ff4757;
    color: white;
    padding: 10px;
    border-radius: 5px;
    margin: 10px 0;
    text-align: center;
  `;

  // Insert at top of login form
  const loginForm = document.querySelector('.login-form');
  loginForm.insertBefore(errorDiv, loginForm.firstChild);

  // Remove after 5 seconds
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
};

const showSuccess = (message) => {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.textContent = message;
  successDiv.style.cssText = `
    background: #2ed573;
    color: white;
    padding: 10px;
    border-radius: 5px;
    margin: 10px 0;
    text-align: center;
  `;

  const loginForm = document.querySelector('.login-form');
  loginForm.insertBefore(successDiv, loginForm.firstChild);

  setTimeout(() => {
    successDiv.remove();
  }, 3000);
};

// Handle login form submission
const handleLogin = async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email || !password) {
    showError('Please fill in all fields');
    return;
  }

  try {
    const userData = await loginUser({ email, password });
    updateUserProfile(userData);
    showSuccess('Login successful!');
    setTimeout(() => {
      navigateTo('home-screen');
    }, 1000);
  } catch (error) {
    showError(error.message);
  }
};

// Handle register button click (for now, just navigate)
const handleRegister = () => {
  // For now, just show a message that registration is not implemented in UI
  showError('Registration form coming soon. Use login for now.');
};

// Screen Navigation Logic
function navigateTo(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });

    // Show the target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
        // Small delay to allow display:flex to apply before animation
        setTimeout(() => {
            targetScreen.classList.add('active');
        }, 10);
    }

    // Handle bottom navigation visibility
    const bottomNav = document.getElementById('bottom-nav');
    if (screenId === 'login-screen' || screenId === 'sos-alert-screen') {
        bottomNav.classList.add('hidden');
    } else {
        bottomNav.classList.remove('hidden');
    }

    // Make sure we have the correct active state on the bottom nav if applicable
    updateBottomNavState(screenId);
}

function navigateNav(screenId, navElement) {
    // Navigate
    navigateTo(screenId);

    // Update active nav button explicitly
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    navElement.classList.add('active');
}

function updateBottomNavState(screenId) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    const bottomNavMap = {
        'home-screen': 0,
        'map-screen': 1,
        'trusted-contacts-screen': 2,
        'settings-screen': 3
        // Add more mapping if needed
    };

    const index = bottomNavMap[screenId];
    if (index !== undefined && navItems[index]) {
        navItems[index].classList.add('active');
    }
}

function showSignup() {
  const loginFormBox = document.querySelector(".login-form");
  const signupFormBox = document.getElementById("signup-screen");
  const forgotFormBox = document.getElementById("forgot-screen");

  if (loginFormBox && signupFormBox) {
    loginFormBox.style.display = "none";
    if (forgotFormBox) {
      forgotFormBox.style.display = "none";
    }
    signupFormBox.style.display = "block";
  }
}

function showLogin() {
  const loginFormBox = document.querySelector(".login-form");
  const signupFormBox = document.getElementById("signup-screen");
  const forgotFormBox = document.getElementById("forgot-screen");

  if (loginFormBox && signupFormBox) {
    loginFormBox.style.display = "block";
    signupFormBox.style.display = "none";
    if (forgotFormBox) {
      forgotFormBox.style.display = "none";
    }
  }
}

const handleSignup = async (event) => {
  event.preventDefault();

  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if (!name || !email || !password) {
    alert("Please fill in all fields");
    return;
  }

  try {
    const data = await registerUser({ name, email, password });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    updateUserProfile(data);

    alert("Account created successfully");
    navigateTo("home-screen");
  } catch (error) {
    alert(error.message || "Signup failed");
  }
};

// Forgot Password UI
function showForgot() {
  const loginFormBox = document.querySelector(".login-form");
  const signupFormBox = document.getElementById("signup-screen");
  const forgotFormBox = document.getElementById("forgot-screen");

  if (loginFormBox && signupFormBox && forgotFormBox) {
    loginFormBox.style.display = "none";
    signupFormBox.style.display = "none";
    forgotFormBox.style.display = "block";
  }
}

const requestPasswordOtp = async (email) => {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return await handleResponse(response);
};

const resetPasswordWithOtp = async ({ email, otp, newPassword }) => {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp, newPassword }),
  });

  return await handleResponse(response);
};

const handleSendOTP = async (event) => {
  event.preventDefault();

  const email = document.getElementById("forgotEmail").value;

  if (!email) {
    alert("Enter email");
    return;
  }

  try {
    const data = await requestPasswordOtp(email);
    const resetPasswordForm = document.getElementById("resetPasswordForm");

    if (resetPasswordForm) {
      resetPasswordForm.style.display = "block";
    }

    alert(data.otp ? `${data.message} OTP: ${data.otp}` : data.message);
  } catch (error) {
    alert(error.message);
  }
};

const handleResetPassword = async (event) => {
  event.preventDefault();

  const email = document.getElementById("forgotEmail").value;
  const otp = document.getElementById("resetOtp").value;
  const newPassword = document.getElementById("resetNewPassword").value;
  const confirmPassword = document.getElementById("resetConfirmPassword").value;

  if (!email || !otp || !newPassword || !confirmPassword) {
    alert("Fill all fields");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const data = await resetPasswordWithOtp({ email, otp, newPassword });
    alert(data.message);
    showLogin();
  } catch (error) {
    alert(error.message);
  }
};

// MAIN INIT
document.addEventListener("DOMContentLoaded", () => {
  const screens = document.querySelectorAll(".screen");
  screens.forEach((screen) => {
    if (screen.id !== "login-screen") {
      screen.classList.add("hidden");
    }
  });

  // Forms
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const sendOtpForm = document.getElementById("sendOtpForm");
  const resetPasswordForm = document.getElementById("resetPasswordForm");

  if (loginForm) loginForm.addEventListener("submit", handleLogin);
  if (signupForm) signupForm.addEventListener("submit", handleSignup);
  if (sendOtpForm) sendOtpForm.addEventListener("submit", handleSendOTP);
  if (resetPasswordForm) resetPasswordForm.addEventListener("submit", handleResetPassword);

  // Switch forms
  document.getElementById("showSignupLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    showSignup();
  });

  document.getElementById("showLoginLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    showLogin();
  });

  document.getElementById("showForgotLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    showForgot();
  });

  document.getElementById("backToLoginFromForgot")?.addEventListener("click", (e) => {
    e.preventDefault();
    showLogin();
  });

  // Auto login
  if (isAuthenticated()) {
    const user = getCurrentUser();
    updateUserProfile(user);
    navigateTo("home-screen");
  }
});
