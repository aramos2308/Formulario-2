const opciones = {
  "A": ["A1", "A2"],
  "B": ["B1", "B2"],
  "C": ["C1", "C2"]
};

const categoriaSelect = document.getElementById("categoria");
const subSelect = document.getElementById("subcategoria");


const URL = "https://script.google.com/macros/s/AKfycbwz3_OJ4fk5hhDhFZldM5qAxYzJxksJo3r_UUy4KRVZTIYbUmQoPBfdBTbn0cammCG6Nw/exec"; 


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
  const formData = new FormData(form);


  fetch(URL, {
    method: "POST",
    body: formData, 
    redirect: "follow"
  })
  .then(res => {
  
    if (res.ok) {
        return res.text();
    }
    
    throw new Error('Respuesta de red no satisfactoria: ' + res.statusText);
  })
  .then(res => {

    alert(" Datos enviados correctamente.");
    form.reset(); 
  })
  .catch(err => {
    console.error(" Error de Fetch/Apps Script:", err);
    alert(" Error enviando los datos. Revisa la consola para más detalles.");
  })
  .finally(() => {
    
  });
});
