
const opciones = {
  "A": ["A1", "A2"],
  "B": ["B1", "B2"],
  "C": ["C1", "C2"]
};

const categoriaSelect = document.getElementById("categoria");
const subSelect = document.getElementById("subcategoria");

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


const URL = "https://script.google.com/macros/s/AKfycbztsBLB4y4bzSOk54AvuOd2rO-l9vUHpaTR6z_8djuO-fFxB7rAgVHdPYnjLysd0Zj66A/exec"; 

document.getElementById("miForm").addEventListener("submit", function(e){
  e.preventDefault();

  let data = {
    nombre: this.nombre.value,
    apellido: this.apellido.value,
    mensaje: this.mensaje.value,
    categoria: this.categoria.value,
    subcategoria: this.subcategoria.value
  };

    fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(data), 
    redirect:"follow"
  })
  .then(res => res.text())
  .then(res => {
    alert("Datos enviados correctamente");
    this.reset();
  })
  .catch(err => {
    alert("Error enviando los datos");
    console.log(err);
  });
});
