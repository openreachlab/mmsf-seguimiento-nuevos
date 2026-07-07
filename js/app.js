const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbz2-fiYjJ_M9_2tS-Q3YvyP5SLdQ6Uh1SnOKJ74kbb8Vp7pfKP0GYsMIAnjl29obCyUEA/exec";
 //https://script.google.com/macros/s/AKfycbz2-fiYjJ_M9_2tS-Q3YvyP5SLdQ6Uh1SnOKJ74kbb8Vp7pfKP0GYsMIAnjl29obCyUEA/exec

const SESSION_DURATION =
  1000 * 60 * 60 * 12;

const buscarPersona =
  document.getElementById(
    "buscarPersona"
  );

const loginView =
  document.getElementById(
    "loginView"
  );

const listadoView =
  document.getElementById(
    "listadoView"
  );

const loginBtn =
  document.getElementById(
    "loginBtn"
  );

const loginError =
  document.getElementById(
    "loginError"
  );

const codigoAcceso =
  document.getElementById(
    "codigoAcceso"
  );

const usuarioActual =
  document.getElementById(
    "usuarioActual"
  );

const contenedorPersonas =
  document.getElementById(
    "contenedorPersonas"
  );

const detalleView =
  document.getElementById(
    "detalleView"
  );

const volverListadoBtn =
  document.getElementById(
    "volverListadoBtn"
  );

const historialSeguimientos =
  document.getElementById(
    "historialSeguimientos"
  );

const nuevoSeguimientoBtn =
  document.getElementById(
    "nuevoSeguimientoBtn"
  );

const seguimientoView =
  document.getElementById(
    "seguimientoView"
  );

const volverDetalleBtn =
  document.getElementById(
    "volverDetalleBtn"
  );

const seguimientoForm =
  document.getElementById(
    "seguimientoForm"
  );

const guardarSeguimientoBtn =
  document.getElementById(
    "guardarSeguimientoBtn"
  );

const responsableSelect =
  document.getElementById(
    "responsable"
  );

const estadoSelect =
  document.getElementById(
    "estado"
  );

const fechaSeguimientoInput =
  document.getElementById(
    "fechaSeguimiento"
  );

const tipoSeguimientoSelect =
  document.getElementById(
    "tipoSeguimiento"
  );

const resultadoSelect =
  document.getElementById(
    "resultado"
  );

const proximaAccionTextarea =
  document.getElementById(
    "proximaAccion"
  );

const filtroCampo =
  document.getElementById(
    "filtroCampo"
  );

const filtroValor =
  document.getElementById(
    "filtroValor"
  );

const ordenarPor =
  document.getElementById(
    "ordenarPor"
  );

const contadorPersonas =
  document.getElementById(
    "contadorPersonas"
  );

const filtroSede =
  document.getElementById(
    "filtroSede"
  );

const detalleNombre =
  document.getElementById(
    "detalleNombre"
  );

const detalleTelefono =
  document.getElementById(
    "detalleTelefono"
  );

const detalleCorreo =
  document.getElementById(
    "detalleCorreo"
  );

const detallePeticion =
  document.getElementById(
    "detallePeticion"
  );

const detalleEstado =
  document.getElementById(
    "detalleEstado"
  );

const filaDetalleEstado =
  document.getElementById(
    "filaDetalleEstado"
  );

const detalleEvangelizador =
  document.getElementById(
    "detalleEvangelizador"
  );

const detalleResponsable =
  document.getElementById(
    "detalleResponsable"
  );

const detalleTotalSeguimientos =
  document.getElementById(
    "detalleTotalSeguimientos"
  );

const tituloListado =
  document.getElementById(
    "tituloListado"
  );

const detalleFechaRegistro =
  document.getElementById(
    "detalleFechaRegistro"
  );

const detalleUltimoSeguimiento =
  document.getElementById(
    "detalleUltimoSeguimiento"
  );

let personaActual = null;

let personasActuales = [];

async function iniciarSesion() {

  loginError.classList.add(
    "hidden"
  );
  
  const codigo =
    codigoAcceso.value.trim();

  if (!codigo) {

    return;

  }

  try {

    const response =
      await fetch(
        `${WEB_APP_URL}?action=loginApp&codigo=${encodeURIComponent(codigo)}`
      );

    const result =
      await response.json();

    if (!result.success) {

      if (result.error === "SIN_ACCESO") {

        loginError.textContent =
          "Tu usuario pertenece al equipo de Red de cuidado y no tiene acceso a esta plataforma.";

      } else {

        loginError.textContent =
          "Código inválido o inactivo.";

      }

      loginError.classList.remove(
        "hidden"
      );

      return;

    }

    localStorage.setItem(
      "codigoMMSF",
      result.usuario.codigo
    );

    localStorage.setItem(
      "nombreMMSF",
      result.usuario.nombre
    );

    localStorage.setItem(
      "equipoMMSF",
      result.usuario.equipo
    );

    localStorage.setItem(
      "sedeMMSF",
      result.usuario.sede
    );

    localStorage.setItem(
      "fechaLoginMMSF",
      Date.now()
    );

    mostrarListado();

  } catch(error) {

    console.error(error);

  }

}

async function mostrarListado() {

  const codigo =
    localStorage.getItem(
      "codigoMMSF"
    );

  try {

    const response =
      await fetch(
        `${WEB_APP_URL}?action=listarPersonas&codigo=${encodeURIComponent(codigo)}`
      );

    const result =
      await response.json();

    if (!result.success) {

      return;

    }

    loginView.classList.add(
      "hidden"
    );

    listadoView.classList.remove(
      "hidden"
    );

    usuarioActual.textContent =
      `${localStorage.getItem("nombreMMSF")} | ${localStorage.getItem("equipoMMSF")} | ${localStorage.getItem("sedeMMSF")}`;

    if (
      localStorage.getItem("equipoMMSF") ===
      "Admin"
    ) {

      filtroSede.style.display =
        "";

    } else {

      filtroSede.style.display =
        "none";

    }

    const equipo =
      localStorage.getItem(
        "equipoMMSF"
      );

    if (equipo === "Evangelismo") {

      tituloListado.textContent =
        "Personas en Evangelismo";

    } else if (equipo === "Conexión") {

      tituloListado.textContent =
        "Personas en Conexión";

    } else {

      tituloListado.textContent =
        "Todas las personas";

    }
    
    personasActuales =
      result.personas;

    buscarPersona.value = "";

    cargarFiltroSedes();

    actualizarOpcionesFiltro();
    
    aplicarFiltros();

  } catch(error) {

    console.error(error);

  }

}

function renderizarPersonas(personas) {

  contenedorPersonas.innerHTML =
    "";

  personas.forEach(persona => {

    const card =
      document.createElement(
        "div"
      );

    const total =
      Number(
        persona.totalSeguimientos || 0
      );

    const estado =
      persona.estado || "";

    let claseEstado = "";

    if (
      estado === "Discipulado" ||
      estado === "No continúa"
    ) {

      claseEstado =
        "proceso-finalizado";

    } else if (
      total === 0
    ) {

      claseEstado =
        "pendiente-contacto";

    } else {

      claseEstado =
        "en-seguimiento";

    }

    card.className =
      `person-card ${claseEstado}`;

    card.addEventListener(
      "click",
      () => abrirDetalle(
        persona.idRegistro
      )
    );

    card.innerHTML = `

        <div class="person-name">
            ${persona.nombre}
        </div>

        <div class="person-info">
            <strong>Fecha de registro:</strong>
            ${persona.fechaRegistro || "-"}
        </div>

        <div class="person-info">
            <strong>Registrado por:</strong>
            ${persona.evangelizador || "-"}
        </div>

        <div class="person-info">
            <strong>Seguimientos realizados:</strong>
            ${persona.totalSeguimientos || 0}
        </div>

        <div class="person-info">
            <strong>Último seguimiento:</strong>
            ${persona.ultimoSeguimiento || "-"}
        </div>

        <div class="person-info">
            <strong>Último responsable:</strong>
            ${persona.ultimoResponsable || "-"}
        </div>

        ${
            localStorage.getItem("equipoMMSF") === "Admin"
            ? `
            <div class="person-info">
                <strong>Estado:</strong>
                ${persona.estado || "-"}
            </div>
            `
            : ""
        }

    `;

    contenedorPersonas.appendChild(
      card
    );

  });
  actualizarContador(
    personas.length
  );
}

function actualizarContador(
  total
) {

  contadorPersonas.textContent =
    `${total} persona${total === 1 ? "" : "s"}`;

}

function aplicarFiltros() {

  let resultado =
    [...personasActuales];

  // Buscar por nombre

  const texto =
    buscarPersona.value
      .toLowerCase()
      .trim();

  if (texto) {

    resultado =
      resultado.filter(
        persona =>
          (persona.nombre || "")
            .toLowerCase()
            .includes(texto)
      );

  }

  // Filtrar por sede (solo Admin)

  if (
    filtroSede &&
    filtroSede.value
  ) {

    resultado =
      resultado.filter(
        persona =>
          persona.sede ===
          filtroSede.value
      );

  }

  // Filtrar por campo

  if (
    filtroCampo.value &&
    filtroValor.value
  ) {

    if (
      filtroCampo.value ===
      "seguimientos"
    ) {

      switch (filtroValor.value) {

        case "0":

          resultado =
            resultado.filter(
              persona =>
                Number(
                  persona.totalSeguimientos || 0
                ) === 0
            );

          break;

        case "1-3":

          resultado =
            resultado.filter(
              persona => {

                const total =
                  Number(
                    persona.totalSeguimientos || 0
                  );

                return (
                  total >= 1 &&
                  total <= 3
                );

              }
            );

          break;

        case "4+":

          resultado =
            resultado.filter(
              persona =>
                Number(
                  persona.totalSeguimientos || 0
                ) >= 4
            );

          break;

      }

    } else {

      resultado =
        resultado.filter(
          persona =>
            persona[
              filtroCampo.value
            ] ===
            filtroValor.value
        );

    }

  }

  // Ordenamiento

  switch (
    ordenarPor.value
  ) {

    case "nombreAsc":

      resultado.sort(
        (a, b) =>
          a.nombre.localeCompare(
            b.nombre
          )
      );

      break;

    case "nombreDesc":

      resultado.sort(
        (a, b) =>
          b.nombre.localeCompare(
            a.nombre
          )
      );

      break;

    case "seguimientos":

      resultado.sort(
        (a, b) =>
          b.totalSeguimientos -
          a.totalSeguimientos
      );

      break;

    case "recientes":

      resultado.sort(
        (a, b) =>
          new Date(
            b.ultimoSeguimiento || 0
          ) -
          new Date(
            a.ultimoSeguimiento || 0
          )
      );

      break;

  }

  renderizarPersonas(
    resultado
  );

}

function actualizarOpcionesFiltro() {

  filtroValor.innerHTML =
    '<option value="">Todos</option>';

  switch (filtroCampo.value) {

    case "evangelizador":

      [...new Set(
        personasActuales
          .map(p => p.evangelizador)
          .filter(Boolean)
      )]
      .sort()
      .forEach(nombre => {

        filtroValor.innerHTML += `
          <option value="${nombre}">
            ${nombre}
          </option>
        `;

      });

      break;

    case "ultimoResponsable":

      [...new Set(
        personasActuales
          .map(p => p.ultimoResponsable)
          .filter(Boolean)
      )]
      .sort()
      .forEach(nombre => {

        filtroValor.innerHTML += `
          <option value="${nombre}">
            ${nombre}
          </option>
        `;

      });

      break;

    case "seguimientos":

      filtroValor.innerHTML += `
        <option value="0">
          Sin seguimientos
        </option>

        <option value="1-3">
          1 a 3 seguimientos
        </option>

        <option value="4+">
          4 o más seguimientos
        </option>
      `;

      break;

  }

}

function verificarSesion() {

  const codigo =
    localStorage.getItem(
      "codigoMMSF"
    );

  const fecha =
    localStorage.getItem(
      "fechaLoginMMSF"
    );

  if (!codigo || !fecha) {

    return;

  }

  const tiempoTranscurrido =
    Date.now() -
    Number(fecha);

  if (
    tiempoTranscurrido >
    SESSION_DURATION
  ) {

    localStorage.clear();

    return;

  }

  mostrarListado();

}

async function abrirDetalle(
    idRegistro
) {

    try {

        const codigo =
            localStorage.getItem(
                "codigoMMSF"
            );

        const personaResponse =
            await fetch(
                `${WEB_APP_URL}?action=obtenerPersona&codigo=${codigo}&idRegistro=${idRegistro}`
            );

        const personaData =
            await personaResponse.json();

        if (
            !personaData.success
        ) {

            return;

        }

        personaActual =
            personaData.persona;

        mostrarPersona(
            personaActual
        );

        const segResponse =
            await fetch(
                `${WEB_APP_URL}?action=obtenerSeguimientos&codigo=${codigo}&idRegistro=${idRegistro}`
            );

        const segData =
            await segResponse.json();

        mostrarSeguimientos(
            segData.seguimientos || []
        );

        listadoView.classList.add(
          "hidden"
        );

        detalleView.classList.remove(
          "hidden"
        );

    } catch(error) {

        console.error(error);

    }

}

function mostrarPersona(
  persona
) {

  detalleNombre.textContent =
    persona.nombre || "";

  detalleTelefono.textContent =
    persona.telefono || "";

  detalleCorreo.textContent =
    persona.correo || "";

  detallePeticion.textContent =
    persona.peticion || "";

  detalleFechaRegistro.textContent =
    persona.fechaRegistro || "";

  detalleEvangelizador.textContent =
    persona.evangelizador || "";

  detalleTotalSeguimientos.textContent =
    persona.totalSeguimientos || 0;

  detalleUltimoSeguimiento.textContent =
    persona.ultimoSeguimiento || "-";

  detalleEstado.textContent =
    persona.estado || "";

  if (
    localStorage.getItem("equipoMMSF") === "Admin"
  ) {

    filaDetalleEstado.classList.remove(
      "hidden"
    );

  } else {

    filaDetalleEstado.classList.add(
      "hidden"
    );

  }

  detalleResponsable.textContent =
    persona.ultimoResponsable || "-";

  if (
    persona.estado === "Discipulado" ||
    persona.estado === "No continúa"
  ) {

    nuevoSeguimientoBtn.classList.add(
      "hidden"
    );

  } else {

    nuevoSeguimientoBtn.classList.remove(
      "hidden"
    );
  }
}

function mostrarSeguimientos(
    seguimientos
) {

    historialSeguimientos.innerHTML =
        "";

    if (
        seguimientos.length === 0
    ) {

        historialSeguimientos.innerHTML =
            "<p>No hay seguimientos registrados.</p>";

        return;

    }

    seguimientos.forEach(
        seguimiento => {

            historialSeguimientos.innerHTML += `

                <div class="card">

                    <p>
                        <strong>Fecha:</strong>
                        ${
                          seguimiento.fecha
                            ? seguimiento.fecha
                                .toString()
                                .substring(0, 10)
                            : ""
                        }
                    </p>

                    <p>
                        <strong>Responsable:</strong>
                        ${seguimiento.responsable || ""}
                    </p>

                    <p>
                        <strong>Tipo:</strong>
                        ${seguimiento.tipo || ""}
                    </p>

                    <p>
                        <strong>Resultado:</strong>
                        ${seguimiento.resultado || ""}
                    </p>

                    <p>
                        <strong>Estado:</strong>
                        ${seguimiento.estado || ""}
                    </p>

                    <p>
                        <strong>Próxima acción:</strong>
                        ${seguimiento.proximaAccion || ""}
                    </p>

                </div>

            `;

        }
    );

}

async function guardarSeguimiento(
  e
) {

  e.preventDefault();

  if (!personaActual) {

    return;

  }

  guardarSeguimientoBtn.disabled =
    true;

  guardarSeguimientoBtn.textContent =
    "Guardando...";

  try {

    const data = {

      action:
        "registrarSeguimiento",

      codigo:
        localStorage.getItem(
          "codigoMMSF"
        ),

      idRegistro:
        personaActual.idRegistro,

      fechaSeguimiento:
        fechaSeguimientoInput.value,

      responsable:
        responsableSelect.value,

      tipoSeguimiento:
        tipoSeguimientoSelect.value,

      resultado:
        resultadoSelect.value,

      estado:
        estadoSelect.value,

      proximaAccion:
        proximaAccionTextarea.value.trim()

    };

    const response =
      await fetch(
        WEB_APP_URL,
        {
          method: "POST",
          body: JSON.stringify(
            data
          )
        }
      );

    const result =
      await response.json();

    if (!result.success) {

      alert(
        "No fue posible guardar el seguimiento."
      );

      return;

    }

    alert(
      "Seguimiento registrado correctamente."
    );

    seguimientoForm.reset();

    await abrirDetalle(
        personaActual.idRegistro
    );

  } catch(error) {

    console.error(error);

    alert(
      "Ocurrió un error al guardar."
    );

  } finally {

    guardarSeguimientoBtn.disabled =
      false;

    guardarSeguimientoBtn.textContent =
      "Guardar Seguimiento";

  }

}

async function cargarResponsables() {

  const codigo =
    localStorage.getItem(
      "codigoMMSF"
    );

  try {

    const response =
      await fetch(
        `${WEB_APP_URL}?action=obtenerResponsables&codigo=${encodeURIComponent(codigo)}`
      );

    const result =
      await response.json();

    if (!result.success) {

      return;

    }

    responsableSelect.innerHTML =
      '<option value="">Seleccione...</option>';

    result.responsables.forEach(
      responsable => {

        responsableSelect.innerHTML += `

          <option value="${responsable.nombre}">
            ${responsable.nombre}
          </option>

        `;

      }
    );

  } catch(error) {

    console.error(error);

  }

}

function cargarEstadosProceso() {

  estadoSelect.innerHTML =
    '<option value="">Seleccione...</option>';

  if (!personaActual) {

    return;

  }

  let estados = [];

  switch (personaActual.estado) {

    case "Sigue en Evangelismo":

      estados = [
        "Sigue en Evangelismo",
        "Sigue en Conexión",
        "Comenzó discipulado",
        "No continúa"
      ];

      break;

    case "Sigue en Conexión":

      estados = [
        "Sigue en Conexión",
        "Comenzó discipulado",
        "No continúa"
      ];

      break;

    default:

      estados = [
        personaActual.estado
      ];

  }

  estados.forEach(
    estado => {

      estadoSelect.innerHTML += `

        <option value="${estado}">
          ${estado}
        </option>

      `;

    }
  );

}

function cargarFiltroSedes() {

  if (
    localStorage.getItem(
      "equipoMMSF"
    ) !== "Admin"
  ) {

    return;

  }

  filtroSede.innerHTML =
    '<option value="">Todas las sedes</option>';

  const sedes =
    [...new Set(
      personasActuales.map(
        p => p.sede
      )
    )]
    .filter(Boolean)
    .sort();

  sedes.forEach(
    sede => {

      filtroSede.innerHTML += `

        <option value="${sede}">
          ${sede}
        </option>

      `;

    }
  );

}

filtroValor.addEventListener(
  "change",
  aplicarFiltros
);

nuevoSeguimientoBtn.addEventListener(
  "click",
  async () => {

    await cargarResponsables();

    cargarEstadosProceso();

    if (personaActual) {
      estadoSelect.value =
        personaActual.estado;
    }

    const hoy = new Date();

    hoy.setMinutes(
      hoy.getMinutes() - hoy.getTimezoneOffset()
    );

    seguimientoForm.reset();

    fechaSeguimientoInput.value =
      hoy.toISOString().split("T")[0];

    if (personaActual) {
      estadoSelect.value =
        personaActual.estado;
    }

    detalleView.classList.add(
      "hidden"
    );

    seguimientoView.classList.remove(
      "hidden"
    );

  }
);

seguimientoForm.addEventListener(
  "submit",
  guardarSeguimiento
);

volverDetalleBtn.addEventListener(
  "click",
  () => {

    seguimientoView.classList.add(
      "hidden"
    );

    detalleView.classList.remove(
      "hidden"
    );

  }
);

const logoutBtn =
  document.getElementById(
    "logoutBtn"
  );

logoutBtn.addEventListener(
  "click",
  cerrarSesion
);

function cerrarSesion() {

  localStorage.clear();

  location.reload();

}

loginBtn.addEventListener(
  "click",
  iniciarSesion
);

volverListadoBtn.addEventListener(
    "click",
    () => {

        detalleView.classList.add(
          "hidden"
        );

        listadoView.classList.remove(
          "hidden"
        );

    }
);

buscarPersona.addEventListener(
  "input",
  aplicarFiltros
);

if (filtroSede) {

  filtroSede.addEventListener(
    "change",
    aplicarFiltros
  );

}

filtroCampo.addEventListener(
  "change",
  () => {

    actualizarOpcionesFiltro();

    aplicarFiltros();

  }
);

ordenarPor.addEventListener(
  "change",
  aplicarFiltros
);

verificarSesion();