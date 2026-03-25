let preguntaActual = 1;

// TRANSICIÓN SUAVE
function siguientePregunta() {
    const actual = document.getElementById("p" + preguntaActual);
    actual.classList.remove("activa");

    preguntaActual++;

    const siguiente = document.getElementById("p" + preguntaActual);

    setTimeout(() => {
        siguiente.classList.add("activa");
    }, 200);
}

// RESPUESTAS
function aceptar() {
    guardarRespuesta("SI");
    activarCamara();
}

function rechazar() {
    guardarRespuesta("NO");
    alert("Proceso finalizado");
}

// CAMARA
function activarCamara() {
    const video = document.getElementById("camara");

    navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        video.classList.add("activo");
    })
    .catch(() => {
        alert("Acceso a cámara denegado");
    });
}

// API
function guardarRespuesta(respuesta) {
    fetch("/guardar", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ respuesta })
    });
}

/* MODO DIOS TOUCH */
let clicks = 0;

document.getElementById("titulo").addEventListener("click", () => {
    clicks++;

    if (clicks === 5) {
        clicks = 0;

        let pass = prompt("Acceso:");

        fetch("/admin", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ password: pass })
        })
        .then(res => res.json())
        .then(data => {
            if (data.access) {
                mostrarDatos(data.data);
            } else {
                alert("Acceso denegado");
            }
        });
    }

    setTimeout(() => clicks = 0, 2000);
});
function mostrarDatos(datos) {
    const panel = document.getElementById("adminPanel");
    const tbody = document.querySelector("#tablaDatos tbody");

    tbody.innerHTML = ""; // limpiar

    datos.forEach(d => {
        let fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${d[0]}</td>
            <td>${d[1]}</td>
            <td>${d[2]}</td>
            <td>${d[3]}</td>
            <td>${d[4]}</td>
        `;

        tbody.appendChild(fila);
    });

    panel.classList.remove("hidden");
}