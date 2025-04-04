import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs, 
  doc, deleteDoc, updateDoc, query, where 
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { 
  getStorage, ref, uploadBytes, getDownloadURL 
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "TU_API_KEY_REAL",
  authDomain: "equiposbiomedicos-b03f1.firebaseapp.com",
  projectId: "equiposbiomedicos-b03f1",
  storageBucket: "equiposbiomedicos-b03f1.appspot.com",
  messagingSenderId: "599755378621",
  appId: "TU_APP_ID_REAL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Función segura para formatear texto
const safeFormat = (text) => {
  return text ? String(text).toLowerCase().replace(/\s+/g, '-') : '';
};

export async function getEquipos() {
  try {
    const snapshot = await getDocs(collection(db, "equipos"));
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        serie: data.serie || 'N/A',
        nombre: data.nombre || 'N/A',
        marca: data.marca || 'N/A',
        modelo: data.modelo || 'N/A',
        condicion: data.condicion || 'No especificado',
        ubicacion: data.ubicacion || 'No especificado',
        fecha_servicio: data.fecha_servicio || '',
        fecha_proximo: data.fecha_proximo || '',
        certificadoURL: data.certificadoURL || '',
        hojaVidaURL: data.hojaVidaURL || ''
      };
    });
  } catch (error) {
    console.error("Error al obtener equipos:", error);
    return [];
  }
}

export async function addEquipo(equipo) {
  try {
    // Validación de campos requeridos
    if (!equipo.serie) throw new Error("El número de serie es obligatorio");
    
    // Subir archivos si existen
    if (equipo.certificadoFile) {
      equipo.certificadoURL = await uploadFile(equipo.certificadoFile, `certificados/${equipo.serie}`);
    }
    if (equipo.hojaVidaFile) {
      equipo.hojaVidaURL = await uploadFile(equipo.hojaVidaFile, `hojas-vida/${equipo.serie}`);
    }

    const docRef = await addDoc(collection(db, "equipos"), equipo);
    return docRef.id;
  } catch (error) {
    console.error("Error al agregar equipo:", error);
    throw error;
  }
}

async function uploadFile(file, path) {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

export async function deleteEquipo(id) {
  await deleteDoc(doc(db, "equipos", id));
}

export async function updateEquipo(id, nuevosDatos) {
  await updateDoc(doc(db, "equipos", id), nuevosDatos);
}

export async function searchEquipos(termino) {
  const q = query(
    collection(db, "equipos"),
    where("serie", ">=", termino),
    where("serie", "<=", termino + '\uf8ff')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}