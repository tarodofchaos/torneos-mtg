// admin.js

// Obtener contraseña del sessionStorage
const ADMIN_PASSWORD = sessionStorage.getItem("ADMIN_PASSWORD") || "";

// Si no hay contraseña válida, redirigir al calendario
if (!ADMIN_PASSWORD) {
  alert("Acceso no autorizado. Vuelve al calendario.");
  window.location.href = "index.html";
}

// Referencias a elementos del formulario
const form = document.getElementById("tournamentForm");
const message = document.getElementById("message");

// Envío del formulario
form.onsubmit = async (e) => {
  e.preventDefault();

  // Obtener los datos del formulario
  const data = {
    titulo: document.getElementById("titulo").value,
    formato: document.getElementById("formato").value,
    descripcion: tinymce.get("descripcion").getContent(), // descripción enriquecida
    date: document.getElementById("date").value,
    hora: document.getElementById("hora").value,
    ubicacion: document.getElementById("ubicacion").value,
    precio: document.getElementById("precio").value,
    premios: document.getElementById("premios").value
  };

  try {
    // Enviar datos a la API usando la contraseña del sessionStorage
    const res = await fetch("/api/tournaments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": ADMIN_PASSWORD
      },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      message.textContent = "Torneo añadido correctamente!";
      message.style.color = "green";

      // Limpiar formulario
      form.reset();
      tinymce.get("descripcion").setContent("");
    } else {
      const text = await res.text();
      message.textContent = "Error: " + text;
      message.style.color = "red";
    }
  } catch (err) {
    message.textContent = "Error de conexión: " + err.message;
    message.style.color = "red";
  }
};
