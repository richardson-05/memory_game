const sec_home_page = document.querySelector(".sec_home_page");

function inicioApp() {
  const dv_inicio_app = document.createElement("div");
  dv_inicio_app.setAttribute("class", "dv_inicio_app");

  const dv_container = document.createElement("div");
  dv_container.setAttribute("class", "dv_container");

  const pregunta_inicio = document.createElement("div");
  pregunta_inicio.setAttribute("class", "dv_pregunta_inicio")
  pregunta_inicio.innerHTML = "<p class='logo_inicio'>{RM}</p>" +
                                "<p>¿Puedes resolverlo?</p>" +
                                "<span class='question_face'>🤔</span>";

  dv_container.appendChild(pregunta_inicio);
  dv_inicio_app.appendChild(dv_container);
  sec_home_page.appendChild(dv_inicio_app);
}
inicioApp();

// Ya estan declaradas en el otro archivo
dv_values.style.display = "none";
dv_cards.style.display = "none";

function eliminarPantallaInicio() {
  sec_home_page.remove();
  dv_cards.style.display = "flex";
  dv_values.style.display = "block";
}

