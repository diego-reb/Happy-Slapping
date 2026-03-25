let preguntaActual = 1;

// INICIAR CUANDO TODO CARGUE
document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       TRANSICIÓN DE PREGUNTAS
    ==========================*/
    window.siguientePregunta = function() {
        const actual = document.getElementById("p" + preguntaActual);
        if (actual) actual.classList.remove("activa");

        preguntaActual++;

        const siguiente = document.getElementById("p" + preguntaActual);

        setTimeout(() => {
            if (siguiente) siguiente.classList.add("activa");
        }, 200);
    };

    /* =========================
       RESPUESTA ACEPTAR
    ==========================*/
    window.aceptar = function() {
        guardarRespuesta("SI");

        const video = document.getElementById("camara");
        const texto = document.getElementById("scanText");

        // Mostrar texto fake si existe
        if (texto) {
            texto.style.display = "block";
            texto.textContent = "Analizando datos...";
        }

        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
            if (video) {
                video.srcObject = stream;
                video.play();
                video.classList.add("activo");
            }
        })
        .catch(err => {
            console.warn("Cámara no disponible:", err);
        })
        .finally(() => {
            setTimeout(() => {
                if (texto) texto.textContent = "Procesando información...";
            }, 1200);

            setTimeout(() => {
                mostrarVirus();
            }, 2500 + Math.random() * 1500);
        });
    };

    /* =========================
       RESPUESTA RECHAZAR
    ==========================*/
    window.rechazar = function() {
        guardarRespuesta("NO");
        alert("Proceso finalizado");
    };

    /* =========================
       MODO DIOS
    ==========================*/
    let clicks = 0;

    const titulo = document.getElementById("titulo");

    if (titulo) {
        titulo.addEventListener("click", () => {
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
    }

});


/* =========================
   GUARDAR RESPUESTA API
=========================*/
function guardarRespuesta(respuesta) {
    fetch("/guardar", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ respuesta })
    }).catch(err => console.warn("Error guardando:", err));
}


/* =========================
   MOSTRAR DATOS ADMIN
=========================*/
function mostrarDatos(datos) {
    const panel = document.getElementById("adminPanel");
    const tbody = document.querySelector("#tablaDatos tbody");

    if (!tbody) return;

    tbody.innerHTML = "";

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

    if (panel) panel.classList.remove("hidden");
}


/* =========================
   VIRUS SIMULADO
=========================*/
function mostrarVirus() {
    const pantalla = document.getElementById("virusScreen");
    const progreso = document.getElementById("progreso");
    const mensaje = document.getElementById("mensajeFinal");
    const video = document.getElementById("camara");

    // Apagar cámara si estaba activa
    if (video && video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }

    pantalla.classList.remove("hidden");

    let width = 0;

    const mensajes = [
        "Iniciando acceso al sistema...",
        "Bypass de seguridad...",
        "Accediendo a cámara...",
        "Extrayendo datos biométricos...",
        "Leyendo almacenamiento interno...",
        "Obteniendo dirección IP...",
        "Accediendo a información del dispositivo...",
        "Enviando datos..."
    ];

    let indexMensaje = 0;

    // Datos del usuario (fake pero creíble)
    const ipFake = "192.168." + Math.floor(Math.random()*255) + "." + Math.floor(Math.random()*255);
    const dispositivo = navigator.userAgent;

    let intervalo = setInterval(() => {
        width += Math.random() * 8;
        progreso.style.width = width + "%";

        if (indexMensaje < mensajes.length) {
            mensaje.textContent = mensajes[indexMensaje];
            indexMensaje++;
        }

        if (width >= 100) {
            clearInterval(intervalo);

            setTimeout(() => {
                mensaje.innerHTML = `
                    ACCESO COMPLETO<br><br>
                    IP: ${ipFake}<br>
                    Dispositivo detectado<br><br>
                    Todos los datos han sido comprometidos.<br>
                    Reinicie el sistema inmediatamente.
                `;
            }, 800);
        }

    }, 400);
}