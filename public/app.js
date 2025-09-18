const monthSelect = document.getElementById("monthSelect");
const themeToggle = document.getElementById("themeToggle");

let tournaments = [];

// Inicializar selector de meses
const monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
monthNames.forEach((name, idx) => {
  const option = document.createElement("option");
  option.value = idx;
  option.textContent = name;
  monthSelect.appendChild(option);
});

// Set mes actual
const now = new Date();
monthSelect.value = now.getMonth();

// Modo oscuro
themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "Modo claro" : "Modo oscuro";
}

// --- Cargar torneos ---
async function loadTournaments() {
  const res = await fetch("/api/tournaments");
  tournaments = await res.json();
  renderCalendar();
}

monthSelect.onchange = renderCalendar;

function renderCalendar() {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  const year = now.getFullYear();
  const month = parseInt(monthSelect.value);

  // Agrupar torneos por fecha
  const grouped = {};
  tournaments.forEach(t => {
    grouped[t.date] = grouped[t.date] || [];
    grouped[t.date].push(t);
  });

  // Días de la semana
  const weekdays = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
  weekdays.forEach(day => {
    const d = document.createElement("div");
    d.className = "day header";
    d.textContent = day;
    calendar.appendChild(d);
  });

  // Primer día del mes
  const firstDay = new Date(year, month, 1).getDay();
  for(let i=0;i<firstDay;i++){
    const empty = document.createElement("div");
    empty.className="day empty";
    calendar.appendChild(empty);
  }

  const daysInMonth = new Date(year, month+1,0).getDate();

  for(let day=1;day<=daysInMonth;day++){
    const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    const dayDiv = document.createElement("div");
    dayDiv.className="day";
    dayDiv.textContent=day;

    if(grouped[dateStr]){
      dayDiv.style.background = "var(--highlight)";
      dayDiv.style.fontWeight="bold";
      dayDiv.onclick = () => openModal(grouped[dateStr]);
    }

    calendar.appendChild(dayDiv);
  }
}

// --- Modal ---
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalDate = document.getElementById("modal-date");
const modalFormat = document.getElementById("modal-format");
const modalDesc = document.getElementById("modal-desc");
document.getElementById("close").onclick = () => modal.classList.add("hidden");

function openModal(tournaments){
  if(!tournaments || tournaments.length===0) return;
  modal.classList.remove("hidden");

  if(tournaments.length===1){
    const t = tournaments[0];
    modalTitle.textContent=t.titulo;
    modalDate.textContent="Fecha: "+t.date + (t.hora?" "+t.hora:"");
    modalFormat.textContent="Formato: "+t.formato;
    modalDesc.textContent=t.descripcion||"";
  } else {
    modalTitle.textContent="Torneos múltiples";
    modalDate.textContent="";
    modalFormat.textContent="";
    modalDesc.innerHTML = tournaments.map(t => `<strong>${t.titulo}</strong> (${t.formato})<br>${t.descripcion||''}`).join("<hr>");
  }
}

// Inicializar
loadTournaments();
