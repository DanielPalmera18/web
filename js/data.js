// Base de datos mejorada
const DB_NAME = 'equipos_biomedicos';

function getEquipos() {
    try {
        const data = localStorage.getItem(DB_NAME);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Error al leer equipos:", error);
        return [];
    }
}

function saveEquipos(equipos) {
    try {
        localStorage.setItem(DB_NAME, JSON.stringify(equipos));
        return true;
    } catch (error) {
        console.error("Error al guardar equipos:", error);
        alert("Error: No se pudieron guardar los datos. Reduzca el tamaño de los archivos.");
        return false;
    }
}

function getEquipoBySerie(serie) {
    return getEquipos().find(e => e.serie === serie);
}

function searchEquipos(term) {
    const equipos = getEquipos();
    if (!term) return equipos;
    
    return equipos.filter(e => 
        e.serie.toLowerCase().includes(term.toLowerCase()) ||
        e.nombre.toLowerCase().includes(term.toLowerCase()) ||
        e.marca.toLowerCase().includes(term.toLowerCase())
    );
}

function addEquipo(equipo) {
    const equipos = getEquipos();
    
    // Validación de serie única
    if (equipos.some(e => e.serie === equipo.serie)) {
        alert("⚠️ Ya existe un equipo con esta serie");
        return false;
    }
    
    // Limitar datos pesados
    const equipoParaGuardar = {
        ...equipo,
        certificado_calibracion: null, // No guardar archivos grandes
        hoja_vida: null
    };
    
    equipos.push(equipoParaGuardar);
    return saveEquipos(equipos);
}

function deleteEquipo(serie) {
    const equipos = getEquipos().filter(e => e.serie !== serie);
    return saveEquipos(equipos);
}

function updateEquipo(serie, nuevosDatos) {
    const equipos = getEquipos().map(e => 
        e.serie === serie ? { ...e, ...nuevosDatos } : e
    );
    return saveEquipos(equipos);
}
