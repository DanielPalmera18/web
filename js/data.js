// Base de datos en localStorage
function getEquipos() {
    return JSON.parse(localStorage.getItem('equipos_biomedicos')) || [];
}

function saveEquipos(equipos) {
    localStorage.setItem('equipos_biomedicos', JSON.stringify(equipos));
}

function getEquipoBySerie(serie) {
    return getEquipos().find(e => e.serie === serie);
}

function addEquipo(equipo) {
    const equipos = getEquipos();
    
    // Validar serie única
    if (equipos.some(e => e.serie === equipo.serie)) {
        alert("⚠️ Ya existe un equipo con esta serie");
        return false;
    }
    
    equipos.push(equipo);
    saveEquipos(equipos);
    return true;
}

function deleteEquipo(serie) {
    const equipos = getEquipos().filter(e => e.serie !== serie);
    saveEquipos(equipos);
}

function updateEquipo(serie, nuevosDatos) {
    const equipos = getEquipos().map(e => 
        e.serie === serie ? { ...e, ...nuevosDatos } : e
    );
    saveEquipos(equipos);
}
