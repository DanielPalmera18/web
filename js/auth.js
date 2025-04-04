import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { 
  getAuth, signInWithEmailAndPassword, signOut 
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

// Configuración (debe coincidir con data.js)
const firebaseConfig = {
  apiKey: "AIzaSyDqY7vRjHkXk9X7Q2Zq3Y6w3Xv0ZxYyXxX",
  authDomain: "equiposbiomedicos-b03f1.firebaseapp.com",
  projectId: "equiposbiomedicos-b03f1",
  storageBucket: "equiposbiomedicos-b03f1.appspot.com",
  messagingSenderId: "599755378621",
  appId: "1:599755378621:web:abcd1234"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function iniciarSesion(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error de autenticación:", error);
    throw error;
  }
}

export async function logout() {
  try {
    await signOut(auth);
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
}

// Verificación de sesión
export function onAuthStateChanged(callback) {
  return onAuthStateChanged(auth, callback);
}