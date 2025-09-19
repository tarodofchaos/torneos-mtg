const partnerForm = document.getElementById("partnerForm");
const partnersList = document.getElementById("partnersList");
const torneoSelect = document.getElementById("torneoId");

let partners = [];

// --- Modal parejas 2HG ---
const partnersModal = document.getElementById("partnersModal");
const openPartnersBtn = document.getElementById("openPartnersBtn");
const closePartnersBtn = document.getElementById("closePartnersBtn");

// Abrir modal
openPartnersBtn.onclick = () => {
  partnersModal.classList.remove("hidden");
  loadTournaments();
  loadPartners();
};

// Cerrar modal
closePartnersBtn.onclick = () => {
  partnersModal.classList.add("hidden");
};

// Cerrar modal clicando fuera
window.addEventListener("click", (e) => {
  if (e.target === partnersModal) {
    partnersModal.classList.add("hidden");
  }
});

// Cargar torneos (solo 2HG)
async function loadTournaments() {
  const res = await fetch("/api/tournaments");
  tournaments = await res.json();
  torneoSelect.innerHTML = "";
  tournaments.filter(t => t.formato.toLowerCase().includes("2hg"))
    .forEach(t => {
      const option = document.createElement("option");
      option.value = t.id;
      option.textContent = t.titulo + " (" + t.date + ")";
      torneoSelect.appendChild(option);
    });
}

// Cargar solicitudes
async function loadPartners() {
  const res = await fetch("/api/partners");
  partners = await res.json();
  renderPartners();
}

function renderPartners() {
  partnersList.innerHTML = "";
  partners.forEach(p => {
    const div = document.createElement("div");
    div.className = "partnerCard";
    div.innerHTML = `
      <strong>${p.nombre}</strong> - Mazo: ${p.deckType || "N/A"} - Busca: ${p.buscaDeckType || "N/A"}<br>
      Propuestas: ${p.propuestas.join(", ") || "Ninguna"} 
      <button onclick="propose('${p.id}')">Proponer jugar</button>
    `;
    partnersList.appendChild(div);
  });
}

// Añadir solicitud
partnerForm.onsubmit = async (e) => {
  e.preventDefault();
  const data = {
    nombre: document.getElementById("nombre").value,
    torneoId: torneoSelect.value,
    deckType: document.getElementById("deckType").value,
    buscaDeckType: document.getElementById("buscaDeckType").value
  };
  await fetch("/api/partners", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(data)
  });
  partnerForm.reset();
  loadPartners();
}

// Proponer a alguien
async function propose(id) {
  const proponente = prompt("Tu nombre para proponer pareja:");
  if(!proponente) return;
  await fetch(`/api/partners/${id}/propose`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({proponente})
  });
  loadPartners();
}

// Inicializar
loadTournaments();
loadPartners();
