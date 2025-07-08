import { auth } from './firebaseConfig.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';

const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    localStorage.setItem("user", JSON.stringify({ uid: user.uid, email: user.email }));

    window.location.href = "profile.html";
  } catch (error) {
    showMessage(loginMessage, "Login failed: " + error.message, "error");
  }
});

function showMessage(element, message, type = "error") {
  element.textContent = message;
  element.className = `auth-message ${type}`;
}
