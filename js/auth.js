import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "TU_API_KEY_REAL",
    authDomain: "equiposbiomedicos-b03f1.firebaseapp.com",
    projectId: "equiposbiomedicos-b03f1",
    storageBucket: "equiposbiomedicos-b03f1.appspot.com",
    messagingSenderId: "599755378621",
    appId: "TU_APP_ID_REAL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function login(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error de login:", error);
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

export function initAuth(callback) {
    return onAuthStateChanged(auth, callback);
}