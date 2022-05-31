let playing = false, can_play = false, is_pause = false;
let movimientos = 0, clicks = 0, cartas_encontradas = 0;
let minutos = 0, mins = 0, segs = 0, segundos = 0;
let lvl_played = null, next_lvl = null, lvl_toChange = null;

const header = document.querySelector("header");
const btn_menu = document.querySelector(".btn_menu");
let show_menu = false;

let interval = null;

btn_menu.addEventListener("click", (e) => {
  e.preventDefault();
  header.classList.toggle("active_menu");
  header.classList.toggle("inactive_menu");
  document.querySelector("body").classList.toggle("no_scroll")

  setTimeout(() => {
    document.querySelector(".btn_menu i").classList.toggle("fa-bars");
    document.querySelector(".btn_menu i").classList.toggle("fa-arrow-left");
  }, 200);
});

window.addEventListener("resize", saberSize);
function saberSize() {
  const dv_values_playing = document.querySelector(".dv_values");
  if (playing) {
    if (screen.width <= 880) {
      dv_values_playing.classList.add("playing");
    } else { dv_values_playing.classList.remove("playing"); }
  }
}


//#region Botones para seleccionar dificultad de juego
const btns = document.querySelectorAll(".btn");

btns.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    if (!playing) {
      eliminarPantallaInicio();
      movimientos = 0;
      crearContadorMovimientos();
      crearTiempo();
      switch (i) {
        case 0:
          modoFacil();
          break;
        case 1:
          modoMedio();
          break;
        default: // case 2
          modoDificil();
          break;
      }
      crearContadorCartasEncontradas();
      crearBtnPausarReiniciar();
      saberSize();
      senalRetirarPartida();
    } else {
      //alert("Ya estas en partida.\n\nDesea reiniciar?"); // Prueba
      if (i == 0) { lvl_toChange = "fácil"; }
      else if (i == 1) { lvl_toChange = "medio"; }
      else { lvl_toChange = "dificil"; }
      cambiarNivel();
    }
  });
});



function modoFacil() {
  console.log("Modo: Facil");
  crearTarjetas(4, 4);
  crearImagenes();
  lvl_played = "fácil";
}

function modoMedio() {
  console.log("Modo: Medio");
  if (screen.width <= 340) {
    crearTarjetas(6, 4);
  } else { crearTarjetas(4, 6); } // Original
  crearImagenes();
  lvl_played = "medio";
}

function modoDificil() {
  console.log("Modo: Dificil");
  if (screen.width <= 370) {
    crearTarjetas(6, 5);
  } else { crearTarjetas(5, 6); } // Original
  crearImagenes();
  lvl_played = "dificil";
}
//#endregion


//#region Crear tarjetas
const dv_cards = document.querySelector(".dv_cards");
function crearTarjetas(ejeX, ejeY) {
  for (let i = 0; i < ejeX; i++) {
    const fila_tarjetas = document.createElement("div");
    fila_tarjetas.setAttribute("class", "fila_tarjetas");

    dv_cards.appendChild(fila_tarjetas);
    for (let j = 0; j < ejeY; j++) {
      const nueva_tarjeta = document.createElement("div");
      nueva_tarjeta.setAttribute("class", "nueva_tarjeta");

      const tarjeta = document.createElement("div");
      tarjeta.setAttribute("class", "tarjeta");
      //tarjeta.classList.add("desactiva");
      tarjeta.classList.add("activa");

      // Mostrar la solución por 2 segundos
      setTimeout(() => {
        tarjeta.classList.remove("activa");
        tarjeta.classList.add("desactiva");
      }, 2000);

      const frente_tarjeta = document.createElement("div");
      frente_tarjeta.setAttribute("class", "frente_tarjeta");

      tarjeta.appendChild(frente_tarjeta);
      nueva_tarjeta.appendChild(tarjeta)
      fila_tarjetas.appendChild(nueva_tarjeta);
    }
    playing = true;
    can_play = true;
  }

  // Controlar tarjetas (clicks)
  const tarjetas = document.querySelectorAll(".tarjeta");
  tarjetas.forEach((tarjeta) => {
    tarjeta.addEventListener("click", () => {
      if (tarjeta.classList == "tarjeta desactiva") {
          if (can_play) {
            tarjeta.classList.add("activa");
            //tarjeta.classList.toggle("activa"); // Prueba
            clicks++;
            if (clicks >= 2) {
              can_play = false;
              setTimeout(saberCorrecta, 700);
            }
          }
        }
      virarUltimas();
    });
  });
}
//#endregion


//#region Crear y colocar imagenes por tarjetas
let fotos_utilizar = [];
function crearImagenes() {
  const todas_tarjetas = document.querySelectorAll(".nueva_tarjeta");
  console.log("Cantidad de tarjetas: " + todas_tarjetas.length);

  let cantidad_fotos_utilizar = todas_tarjetas.length / 2;
  console.log("Fotos a utilizar: " + cantidad_fotos_utilizar);

  // Colocar imagenes
  for (let i = 0; i < cantidad_fotos_utilizar; i++) {
    for (let j = 0; j < 2; j++) {
      colocarImagen(i)
    }
  }
}


function colocarImagen(foto_turno) {
  const frente_tarjeta = document.querySelectorAll(".frente_tarjeta");
  
  let tarjeta_random = Math.floor(Math.random() * frente_tarjeta.length);
  //console.log(tarjeta_random); // Prueba

  if (frente_tarjeta[tarjeta_random].innerHTML == "") {
    frente_tarjeta[tarjeta_random].innerHTML = `<img src="./img/${foto_turno + 1}.png" class="img_tarjeta">`;
  }
  else {
    colocarImagen(foto_turno)
  }
}
//#endregion


//#region Saber las cartas correctas
function saberCorrecta() {
  let activas = document.querySelectorAll(".activa")
  
  if (activas.length >= 2) {
    if (activas[0].innerHTML === activas[1].innerHTML) {
      //alert("Correcta"); // Prueba
      for (let i = 0; i < activas.length; i++) {
        activas[i].classList.add("correcta");
        activas[i].classList.remove("activa", "desactiva");
      }
    } else {
      for (let j = 0; j < activas.length; j++) {
        activas[j].classList.remove("activa");
      }
    }
    actualizarMovimientos();
    actualizarCartasEncontradas();
  }
  can_play = true;
  clicks = 0;
}
//#endregion


// Uso del dv_values
const dv_values = document.querySelector(".dv_values");

//#region Crear contador de movimientos
function crearContadorMovimientos() {
  const dv_contador_movimientos = document.createElement("div");
  dv_contador_movimientos.setAttribute("class", "dv_contador_movimientos");

  const valor_contador = document.createElement("p");
  valor_contador.setAttribute("class", "valor_contador");

  valor_contador.textContent = movimientos;

  dv_contador_movimientos.appendChild(valor_contador);
  dv_values.appendChild(dv_contador_movimientos);
}

function actualizarMovimientos() {
  movimientos++;
  document.querySelector(".valor_contador").textContent = movimientos;
}
//#endregion


//#region Crear tiempo de juego
function crearTiempo() {
  const dv_tiempo = document.createElement("div");
  dv_tiempo.setAttribute("class", "dv_tiempo");

  const valor_tiempo = document.createElement("p");
  valor_tiempo.setAttribute("class", "valor_tiempo");

  dv_tiempo.appendChild(valor_tiempo);
  dv_values.appendChild(dv_tiempo);

  valor_tiempo.innerHTML = "0" + minutos + ":" + "0" + segundos;

  // Atrasar el inicio del tiempo a que inicie cuando se volteen las cartas (2 segundos)
  setTimeout(() => {
    interval = setInterval(funcionTiempo, 1000);
  }, 1000);
}

function funcionTiempo() {
  const valor_tiempo = document.querySelector(".valor_tiempo");
  segundos++;
    
    if (segundos === 60) {
      minutos++;
      segundos = 0;
    }

    if (segundos < 10) {
      segs = "0" + segundos;
    } else { segs = segundos; }
    if (minutos < 10) {
      mins = "0" + minutos;
    } else { mins = minutos; }

    valor_tiempo.innerHTML = mins + ":" + segs;
    
    // Evitar trampas (no seleccionar las cartas)
    document.querySelectorAll(".tarjeta").forEach(tarjeta => {
      tarjeta.style.userSelect = "none";
    });

    // Analizar si alcanzó el limite de tiempo
    if (segundos == 10) {
      //console.log("Perder");
      can_play = false;
      is_pause = true;
      clearInterval(interval);

      funcionPerder();
    }
}
//#endregion


//#region Crear contador de cartas encontradas
function crearContadorCartasEncontradas() {
  const dv_cartas_encontradas = document.createElement("div");
  dv_cartas_encontradas.setAttribute("class", "dv_cartas_encontradas");

  const cantidad_cartas_encontradas = document.createElement("p");
  cantidad_cartas_encontradas.setAttribute("class", "cantidad_cartas_encontradas");

  dv_cartas_encontradas.appendChild(cantidad_cartas_encontradas);
  dv_values.appendChild(dv_cartas_encontradas);

  actualizarCartasEncontradas();
}


// Calcular cartas encontradas
function actualizarCartasEncontradas() {
  const todas_tarjetas = document.querySelectorAll(".tarjeta");
  //console.log("Cartas a encontrar: " + todas_tarjetas.length / 2);

  const correctas = document.querySelectorAll(".correcta");
  cartas_encontradas = correctas.length / 2;
  //console.log("Cartas encontradas: " + cartas_encontradas);

  const cantidad_cartas_encontradas = document.querySelector(".cantidad_cartas_encontradas");
  cantidad_cartas_encontradas.innerHTML = correctas.length / 2 + "/" + todas_tarjetas.length / 2;

  if (correctas.length / 2 === todas_tarjetas.length / 2) {
    //alert("Ganaste"); // Prueba
    clearInterval(interval);
    crearPantallaGanar();
    mostrarResultados();
  }
}
//#endregion


//#region Crear botón pausar
function crearBtnPausarReiniciar() {
  const dv_btn_pausar_reiniciar = document.createElement("div");
  dv_btn_pausar_reiniciar.setAttribute("class", "dv_btn_pausar_reiniciar");

  const btn_pausar = document.createElement("button");
  btn_pausar.setAttribute("class", "btn_pausar");
  btn_pausar.textContent = "Pausar";

  const btn_reiniciar = document.createElement("button");
  btn_reiniciar.setAttribute("class", "btn_reiniciar");
  btn_reiniciar.textContent = "Reiniciar";

  dv_btn_pausar_reiniciar.appendChild(btn_pausar);
  dv_btn_pausar_reiniciar.appendChild(btn_reiniciar);
  dv_values.appendChild(dv_btn_pausar_reiniciar);
  
  btn_pausar.addEventListener("click", pausar);
  btn_reiniciar.addEventListener("click", reiniciar);
}


function pausar() {
  const btn_pausar = document.querySelector(".btn_pausar");
  if (!is_pause) {
    is_pause = true;
    btn_pausar.textContent = "Continuar";
    clearInterval(interval);
  }
  else {
    is_pause = false;
    btn_pausar.textContent = "Pausar";
    interval = setInterval(funcionTiempo, 1000);
  }
  can_play = !is_pause;
  //alert("Estado: " + is_pause); // Prueba
}

function reiniciar() {
  document.querySelectorAll(".fila_tarjetas").forEach(div_fila => {
    div_fila.remove();
  });

  clicks = 0;
  minutos = 0;
  segundos = 0;
  movimientos = -1;
  
  const valor_tiempo = document.querySelector(".valor_tiempo");
  valor_tiempo.innerHTML = "00" + ":" + "00";
  
  actualizarMovimientos();
  switch (lvl_played) {
    case "fácil":
      modoFacil();
      break;
    case "medio":
      modoMedio();
      break;
  
      default:
      modoDificil();
      break;
  }
  actualizarCartasEncontradas();
  sec_win.style.display = "none";
  if (is_pause) { pausar(); }

  clearInterval(interval);
  interval = setInterval(funcionTiempo, 1000);
}
//#endregion


//#region Virar las ultimas automaticamented
function virarUltimas() {
  const correctas = document.querySelectorAll(".correcta");
  const todas_tarjetas = document.querySelectorAll(".tarjeta");
  //console.log("Hay " + correctas.length + " cartas correctas."); // Prueba
  
  if (correctas.length == todas_tarjetas.length - 2) {
    console.log("Virar la última")
    document.querySelectorAll(".desactiva").forEach(tarjeta => {
      tarjeta.classList.remove("desactiva");
      tarjeta.classList.add("correcta");
      actualizarCartasEncontradas();
    });
  }
  //console.log("Funcionando");
}
//#endregion


//#region Pantalla para cuando se gana
const sec_win = document.querySelector(".sec_win");

function crearPantallaGanar() {
  if (lvl_played == "fácil") { next_lvl = "medio"; }
  else if (lvl_played == "medio") { next_lvl = "dificil"; } // Else abajo (si es dificil)
  const dv_win = `<div class="dv_win">
                    <h2>Has ganado!!</h2>
                    <p>Felicitaciones has superado el nivel ${lvl_played}</p>
                    <div class="dv_results"></div>
                    <div class="dv_btns">
                      <button class="btn_play_again">Volver a jugar</button>
                      <button class="btn_play_next">Jugar nivel ${next_lvl}</button>
                    </div>
                  </div>`;
  sec_win.innerHTML = dv_win;
  sec_win.style.display = "flex";

  document.querySelector(".btn_play_again").addEventListener("click", reiniciar);
  document.querySelector(".btn_play_next").addEventListener("click", () => {
    lvl_played = next_lvl;
    reiniciar();
  });
  
  // Si está en el nivel dificil no hay próximo nivel, por eso se elimina dicho botón
  if (lvl_played == "dificil") {
    document.querySelector(".btn_play_next").remove();
  }
}

function mostrarResultados() {
  const dv_results = document.querySelector(".dv_results");
  const p_result = `<h2>Resultados</h2>
                    <p>Nivel superado: ${lvl_played}<br/>Movimientos realizados: ${movimientos}<br/>Tiempo de juego: ${mins + ":" + segs}`;
  dv_results.innerHTML = p_result;
}
//#endregion


// Para cuando ya esta en una partida y quiere cambiar nivel
//#region Cambiar nivel
const sec_change_lvl = document.querySelector(".sec_change_lvl");
function cambiarNivel() {
  if (lvl_played === lvl_toChange) {
    //alert("Ya estas jugando este nivel");
    const dv_change_lvl = `<div class="dv_change_lvl">
                    <h2>No puedes cambiar a un nivel que ya estás jugando</h2>
                    <div class="dv_btns">
                      <button class="btn_cancel">Aceptar</button>
                    </div>
                  </div>`;
    clearInterval(interval);
    sec_change_lvl.innerHTML = dv_change_lvl;
  } else {
    const dv_change_lvl = `<div class="dv_change_lvl">
                    <h2>Seguro desea cambiar del nivel ${lvl_played} al nivel ${lvl_toChange}?</h2>
                    <div class="dv_btns">
                      <button class="btn_confirm">Confirmar</button>
                      <button class="btn_cancel">Cancelar</button>
                    </div>
                  </div>`;
    clearInterval(interval);
    sec_change_lvl.innerHTML = dv_change_lvl;
    
    document.querySelector(".btn_confirm").addEventListener("click", () => {
      //alert("Confirmar"); // Prueba
  
      sec_change_lvl.style.display = "none";
      console.log("Ir al nivel: " + lvl_toChange);
      if (lvl_toChange === lvl_played) { /*alert("Ya estas en este nivel.");*/ }
      else{ reiniciar(); }
      console.warn("lvl_toChange = " + lvl_toChange + " - " + "lvl_played = " + lvl_played);

      lvl_played = lvl_toChange;
      reiniciar();
    });
  }
  sec_change_lvl.style.display = "flex";


  document.querySelectorAll(".btn_cancel").forEach(btn_cancel => {
    btn_cancel.addEventListener("click", () => {
      //alert("Cancelar");
      sec_change_lvl.style.display = "none";
      if (!is_pause) { interval = setInterval(funcionTiempo, 1000); }
    });
  });
}

//#endregion


//#region Señal en btn juego para que sepa que puede retirarse de la partida
function senalRetirarPartida() {
  const active = document.querySelector(".active");
  active.setAttribute("title", "No jugar ningún nivel")
  active.classList.add("msg");
  setTimeout(() => {
    active.classList.remove("msg");
  }, 3000);
}
//#endregion


//#region Funcion para cuando se pierde
function funcionPerder() {
  const dv_win = `<div class="dv_win">
                    <h2>Se acbó el tiempo</h2>
                    <h2>😥</h2>
                    <br/>
                    <div class="dv_btns">
                      <button class="btn_play_again">Volver a jugar</button>
                    </div>
                  </div>`;
  sec_win.innerHTML = dv_win;
  sec_win.style.display = "flex";

  document.querySelector(".btn_play_again").addEventListener("click", reiniciar);
}
//#endregion