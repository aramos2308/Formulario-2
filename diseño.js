const opciones = {
  "A": ["A1", "A2"],
  "B": ["B1", "B2"],
  "C": ["C1", "C2"]
};

const categoriaSelect = document.getElementById("categoria");
const subSelect = document.getElementById("subcategoria");


const URL = "/api/submit";


categoriaSelect.addEventListener("change", function() {
  const cat = this.value;
  subSelect.innerHTML = "<option value=''>-- Seleccionar --</option>";

  if (opciones[cat]) {
    opciones[cat].forEach(sub => {
      let opt = document.createElement("option");
      opt.value = sub;
      opt.textContent = sub;
      subSelect.appendChild(opt);
    });
  }
});


document.getElementById("miForm").addEventListener("submit", function(e){
  e.preventDefault();

  const form = e.target;
  const data = {
    nombre: form.nombre.value, 
    apellido: form.apellido.value, 
    mensaje: form.mensaje.value, 
    categoria: form.categoria.value,
    subcategoria: form.subcategoria.value
  };
    
  fetch(URL, {
    method: "POST",
    headers: {
      "content-Type": "application/json"
    },
    body: JSON.stringify(data), 
    redirect: "follow"
  })
  .then(res => res.json()) // Esperamos una respuesta JSON del servidor
  .then(data => {
    if (data.success) {
        alert(" Datos enviados correctamente.");
        form.reset();
    } else {
        throw new Error(data.error || "Error desconocido");
    }
  })
  .catch(err => {
    console.error(" Error de Fetch/Apps Script:", err);
    alert(" Error enviando los datos. Revisa la consola para más detalles.");
  })
  .finally(() => {
    
  });
});
