// Importaciones Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs, 
  doc, deleteDoc, updateDoc, query, where 
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { 
  getStorage, ref, uploadBytes, getDownloadURL 
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-storage.js";

// Configuración EXACTA para tu proyecto
const firebaseConfig = {
  apiKey: "AIzaSyDqY7vRjHkXk9X7Q2Zq3Y6w3Xv0ZxYyXxX", // Reemplaza con tu API Key real
  authDomain: "equiposbiomedicos-b03f1.firebaseapp.com",
  projectId: "equiposbiomedicos-b03f1",
  storageBucket: "equiposbiomedicos-b03f1.appspot.com",
  messagingSenderId: "599755378621",
  appId: "1:599755378621:web:abcd1234" // Reemplaza con tu App ID real
};

// Inicialización
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Funciones CRUD Mejoradas
export async function getEquipos() {
  try {
    const querySnapshot = await getDocs(collection(db, "equipos"));
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      // Formatea fechas para mostrar
      fechaServicio: doc.data().fecha_servicio ? new Date(doc.data().fecha_servicio).toLocaleDateString('es-ES') : 'N/A',
      fechaProximo: doc.data().fecha_proximo ? new Date(doc.data().fecha_proximo).toLocaleDateString('es-ES') : 'N/A'
    }));
  } catch (error) {
    console.error("Error al obtener equipos:", error);
    throw new Error("No se pudieron cargar los equipos");
  }
}

export async function addEquipo(equipo) {
  try {
    // Validación de campos requeridos
    if (!equipo.serie || !equipo.nombre) {
      throw new Error("Serie y Nombre son campos obligatorios");
    }

    // Subir archivos si existen
    if (equipo.certificadoFile) {
      equipo.certificadoURL = await uploadFile(equipo.certificadoFile, `certificados/${equipo.serie}`);
    }
    if (equipo.hojaVidaFile) {
      equipo.hojaVidaURL = await uploadFile(equipo.hojaVidaFile, `hojas-vida/${equipo.serie}`);
    }

    // Guardar en Firestore
    const docRef = await addDoc(collection(db, "equipos"), {
      ...equipo,
      fecha_registro: new Date().toISOString()
    });
    
    return { id: docRef.id, ...equipo };
  } catch (error) {
    console.error("Error al agregar equipo:", error);
    throw error;
  }
}

async function uploadFile(file, path) {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error al subir archivo:", error);
    throw new Error("No se pudo subir el archivo");
  }
}

export async function deleteEquipo(id) {
  try {
    await deleteDoc(doc(db, "equipos", id));
    return true;
  } catch (error) {
    console.error("Error al eliminar equipo:", error);
    throw new Error("No se pudo eliminar el equipo");
  }
}

export async function updateEquipo(id, nuevosDatos) {
  try {
    await updateDoc(doc(db, "equipos", id), nuevosDatos);
    return true;
  } catch (error) {
    console.error("Error al actualizar equipo:", error);
    throw new Error("No se pudo actualizar el equipo");
  }
}

export async function searchEquipos(termino) {
  try {
    const q = query(
      collection(db, "equipos"),
      where("serie", ">=", termino),
      where("serie", "<=", termino + '\uf8ff')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al buscar equipos:", error);
    throw new Error("Error en la búsqueda");
  }
}