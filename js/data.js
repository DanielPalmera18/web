import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { 
  getFirestore, collection, getDocs, 
  addDoc, doc, deleteDoc, updateDoc, query, where 
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

// Configuración de Firebase (usa tus propios valores)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Funciones de la base de datos
export async function getEquipos() {
  const querySnapshot = await getDocs(collection(db, "equipos"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addEquipo(equipo) {
  try {
    const docRef = await addDoc(collection(db, "equipos"), equipo);
    return docRef.id; // Retorna el ID del documento creado
  } catch (error) {
    console.error("Error añadiendo equipo: ", error);
    return null;
  }
}

export async function deleteEquipo(id) {
  await deleteDoc(doc(db, "equipos", id));
}

export async function updateEquipo(id, nuevosDatos) {
  await updateDoc(doc(db, "equipos", id), nuevosDatos);
}

export async function searchEquipos(term) {
  const q = query(
    collection(db, "equipos"),
    where("serie", ">=", term),
    where("serie", "<=", term + '\uf8ff')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}