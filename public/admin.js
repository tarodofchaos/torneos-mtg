const form = document.getElementById("tournamentForm");
const message = document.getElementById("message");

form.onsubmit = async (e) => {
  e.preventDefault();

  const data = {
    titulo: document.getElementById("titulo").value,
    formato: document.getElementById("formato").value,
    descripcion: document.getElementById("descripcion").value,
    date: document.getElementById("date").value,
    hora: document.getElementById("hora").value,
    ubicacion: document.getElementById("ubicacion").value,
    precio: document.getElementById("precio").value,
    premios: document.getElementById("premios").value
  };

  const pass = document.getElementById("adminPass").value;

  try {
    const res = await fetch("/api/tournaments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": pass
      },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      message.textContent = "Torneo añadido correctamente!";
      message.style.color = "green";
      form.reset();
    } else if(res.status===401){
      message.textContent = "Contraseña incorrecta";
      message.style.color = "red";
    } else {
      const text = await res.text();
      message.textContent = "Error: " + text;
      message.style.color = "red";
    }

  } catch(err) {
    message.textContent = "Error de conexión: " + err.message;
    message.style.color = "red";
  }
};
