//ESTABLECEMOS EL NRO DE VISITAS
var visitas = localStorage.getItem("visitas");
if(!visitas){
    localStorage.setItem("visitas", "1");
}else{
    visitas++;
    localStorage.setItem("visitas", JSON.stringify(visitas));
    let element = document.getElementById("visitas");
    element.innerText = visitas;
}
const estilo = document.getElementsByTagName("link")[0];
const sourceEstilo = localStorage.getItem("estilo");
const logo = document.getElementsByClassName("logo")[0];
const botonTemaDay = document.getElementById("sailorDay"); 
const botonTemaNight = document.getElementById("sailorNight");
const seccion = document.getElementById("seccion");
const botonCrear = document.getElementById("comienzoCrear");
const ventanaCrear = document.getElementById("ventana-crear");
const pestañaCrear = document.getElementsByClassName("pestaña-crear")[0];
const botonCapturar = document.getElementById("capturar");
const botonCamara = document.getElementById("camara");
const botonListo = document.getElementById("listo");
const botonRecording = document.getElementById("recording");
const videoStream = document.getElementById("videoStream");
const videoGrabado = document.getElementById("recordedVideo");
const gifGrabado = document.getElementById("recordedGif");
const repetirCaptura = document.getElementById("repetirCaptura");
const upload = document.getElementById("upload");
const cancelarUpload = document.getElementById("cancelarUpload");
const subiendo = document.getElementById("subiendo");
const COPIAR = document.getElementById("copiarEnlace");
const DESCARGAR = document.getElementById("descargar");
const PORTAPAPELES = document.getElementById("portapapeles");
/*
* PRIMERO DECLARAMOS LAS CONSTANTES DE NUESTRA APLICACION
*/
const GYPHY_UPLOAD_URL = "https://upload.giphy.com/v1/gifs";
const API_KEY = "Z4jAIThPhgNd5CYxKFnlFP40Y669rLeg";
const GYPHY_USERNAME = "sirpromess";

/*
* ARMAMOS LA URL DE GYPHY
*/
const GYPHY_BUILT_URL =
GYPHY_UPLOAD_URL +
"?api_key=" +
API_KEY +
"&username=" +
GYPHY_USERNAME;

// Elementos necesarios
let listaMisGuifos = JSON.parse(localStorage.getItem("misGuifos"));
let stream;
let recorderVideo, recorderGif;
let blobGif, blobVideo;
let recording = false;



//GUARDAMOS NUESTRO TEMA ELEGIDO COMO PREDETERMINDADO
if(sourceEstilo){
    estilo.removeAttribute("href");
    estilo.setAttribute("href", sourceEstilo);
    logo.src = String(localStorage.logo);
}


//FUNCION PARA TOMA VIDEO 
async function mostrarVideo() {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    videoStream.srcObject = stream;
    videoStream.play();
    let caja = document.getElementById("detenido");
    caja.style.visibility = "hidden";
    videoGrabado.style.display = "none";
    let cajaBotones = document.getElementsByClassName("caja-botones")[0];
    cajaBotones.style.display = "none";
    let instrucciones = document.getElementById("instrucciones");
    instrucciones.style.display = "none";
    ventanaCrear.style.width = "860px";
    ventanaCrear.style.height = "548px";
    pestañaCrear.innerText = "Un Chequeo Antes de Empezar";
    botonCapturar.style.display = "block";
    botonCamara.style.display = "block";
    videoStream.style.display = "block";
}



//FUNCION PARA EMPEZAR A GRABAR
async function grabarVideo() {
    recorderVideo = new RecordRTCPromisesHandler(stream, {
        type: "video",
        frameRate: 1,
        quality: 10,
        width: 360,
        height: 240,
    });
    recorderGif = new RecordRTCPromisesHandler(stream, {
        type: "gif",
        frameRate: 1,
        quality: 10,
        width: 360,
        height: 240,
    });
    botonListo.style.display = "block";
    botonRecording.style.display = "block";
    botonCapturar.style.display = "none";
    botonCamara.style.display = "none";
    pestañaCrear.innerText = "Capturando Tu Guifo";
    recorderVideo.startRecording();
    recorderGif.startRecording();
    const sleep = (m) => new Promise((r) => setTimeout(r, m));
    await sleep(8000);
    detenerGrabacion();
}

async function detenerGrabacion() {
    if ((await recorderVideo.getState()) === "recording") {
        await recorderVideo.stopRecording();
        await recorderGif.stopRecording();
        blobVideo = await recorderVideo.getBlob();
        blobGif = await recorderGif.getBlob();
        mostrarGrabacion(blobVideo);
    }
    let caja = document.getElementById("detenido");
    caja.style.visibility = "visible";
    botonListo.style.display = "none";
    botonRecording.style.display = "none";
    cancelarUpload.style.display = "none";
}

function mostrarGrabacion(blob) {
    const gif = URL.createObjectURL(blob);
    videoGrabado.src = gif;
    videoStream.style.display = "none";
    videoGrabado.style.display = "block"
    pestañaCrear.innerText = "Vista Previa";
}


function download(url, filename) {
    fetch(url).then(function(t) {
        return t.blob().then((b)=>{
            DESCARGAR.href = URL.createObjectURL(b);
            DESCARGAR.setAttribute("download", filename);
        }
    );
    });
}

async function subirGif() {
    if (blobGif) {
      let form = new FormData();
      const gifName =
        prompt("Dame un nombre para el gif") || "migif";
      form.append("file", blobGif, gifName + ".gif");
        subiendo.style.visibility = "visible";
        cancelarUpload.style.display = "block";
        pestañaCrear.innerText = "Subiendo Guifo";
        videoGrabado.style.display = "none";
        repetirCaptura.style.display = "none";
        upload.style.display = "none";
        cancelarUpload.style.display = "block";
      try {
        const response = await fetch(GYPHY_BUILT_URL, {
          mode: "cors",
          method: "POST",
          body: form,
        });
        subiendo.style.display = "none";
        let logrado = document.getElementById("logrado");
        logrado.style.display = "block";
        pestañaCrear.innerText = "Guifo Subido Con Éxito";
        let link = document.createElement("a");
        link.href = "mis-guifos.html";
        let cruz = document.createElement("img");
        cruz.src = "assets/button3.svg";
        cruz.id = "cruz1";
        link.appendChild(cruz);
        pestañaCrear.appendChild(link);
        const parsedResponse = await response.json();
        console.log(parsedResponse);
        if(listaMisGuifos === null){
            listaMisGuifos = [];
        }
        let idGif = parsedResponse.data.id;
        let miGif = {};
        let miURL = "https://media.giphy.com/media/" + idGif + "/giphy.gif";
        miGif.imagen = miURL;
        miGif.title = gifName;
        miGif.ancho = 1;
        miGif.alto = 1;
        miGif.hashtags = [];
        ventanaCrear.style.width = "721px";
        ventanaCrear.style.height = "391";
        PORTAPAPELES.value = miURL;
        gifGrabado.setAttribute("src", miURL);
        listaMisGuifos.unshift(miGif);
        localStorage.setItem("misGuifos", JSON.stringify(listaMisGuifos))
        alert("Felicitaciones se subió tu gif 👏 👏");
        cancelarUpload.style.display = "none";
        DESCARGAR.addEventListener("click", download(miURL, (gifName + ".gif")));
      } catch (e) {
        console.log(e);
        alert("Error algo salio mal 😭");
      }
    } else {
      alert("👁 no has grabado nada para subir");
    }
}
function copiar(){
    PORTAPAPELES.select();
    document.execCommand("copy");
    alert("Copiado al Portapapeles");
}

//BOTON PARA EMPEZAR
botonCrear.addEventListener("click", mostrarVideo);
repetirCaptura.addEventListener("click", mostrarVideo);
//BOTON PARA GRABAR
botonCapturar.addEventListener("click", grabarVideo);
botonCamara.addEventListener("click", grabarVideo);
//BOTON PARA DETENER
botonListo.addEventListener("click", detenerGrabacion);
botonRecording.addEventListener("click", detenerGrabacion);
//BOTON PARA SUBIR
upload.addEventListener("click", subirGif);
//BOTON PARA COPIAR
COPIAR.addEventListener("click", copiar);

function pintarMisGuifos(){
    seccion.innerHTML = "";
    //PINTAMOS DE MANERA AUTOMATICA MIS GIFS GUARDADOS
    for (let i = 0; i < listaMisGuifos.length; i++) {
        let element = listaMisGuifos[i];
        
        //CONTENEDOR
        let caja = document.createElement("div");
        caja.id = "caja";

        //BOTON FULLSCREEN
        let fullsc = document.createElement("a");
        fullsc.setAttribute("href", element.imagen);
        fullsc.id = "fullsc";
        let fullIcon = document.createElement("img");
        fullIcon.src = "assets/fullscreen.png"
        fullsc.appendChild(fullIcon);
        caja.appendChild(fullsc);

        //IMAGEN
        let gif = document.createElement("img");
        if(parseInt(element.ancho) > 480){
            caja.style.gridColumn = "span 2";
            gif.style.width = "592px";
        } else {
            gif.style.width = "288px";
        }
        gif.setAttribute("src", element.imagen);
        gif.id = "gif";
        caja.appendChild(gif);

        //INSERT
        seccion.appendChild(caja);

        //BOTON ELIMINAR
        let eliminar = document.createElement("img");
        eliminar.setAttribute("src", "assets/eliminar.png")
        eliminar.id = "guardar";
        caja.appendChild(eliminar);
        //FUNCION DEL BOTON DE ELIMINAR
        eliminar.addEventListener("click", ()=>{
            let respuesta = confirm("Seguro que quieres eliminar este GIF?");
            if(respuesta == true){
                listaMisGuifos.pop(element);
                localStorage.removeItem("misGuifos", listaMisGuifos[i]);
                caja.style.display = "none";
            }
        })
    }
}
pintarMisGuifos();