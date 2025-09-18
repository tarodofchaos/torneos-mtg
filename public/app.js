// Llama a la API para mostrar torneos
async function loadTournaments() {
  const res = await fetch("/api/tournaments");
  const tournaments = await res.json();
  const div = document.getElementById("calendar");
  div.innerHTML = "";
  tournaments.forEach(t => {
    const d = document.createElement("div");
    d.textContent = `${t.date} - ${t.titulo} (${t.formato})`;
    div.appendChild(d);
  });
}

loadTournaments();
