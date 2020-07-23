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
const listaMisGuifos = JSON.parse(localStorage.getItem("misGuifos"));
const seccion = document.getElementById("seccion");



//GUARDAMOS NUESTRO TEMA ELEGIDO COMO PREDETERMINDADO

if(sourceEstilo){
    estilo.removeAttribute("href");
    estilo.setAttribute("href", sourceEstilo);
    logo.src = String(localStorage.logo);
}


//ASIGNAMOS LOS CAMBIOS DE ESTILO A LOS BOTONES DE TEMA
botonTemaNight.addEventListener("click", ()=>{
    logo.src = "assets/gifOF_logo_dark.png";
    localStorage.setItem("logo", "assets/gifOF_logo_dark.png");
    localStorage.setItem("estilo", "estilos-dark.css");
    estilo.removeAttribute("href");
    estilo.setAttribute("href", "estilos-dark.css");
});
botonTemaDay.addEventListener("click", ()=>{
    logo.src = "assets/gifOF_logo.png";
    localStorage.setItem("logo", "assets/gifOF_logo.png");
    localStorage.setItem("estilo", "estilos.css");
    estilo.removeAttribute("href");
    estilo.setAttribute("href", "estilos.css");
});


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
    if(parseInt(element.ancho) > (parseInt(element.alto)) * 1.5){
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
            localStorage.setItem("misGuifos", JSON.stringify(listaMisGuifos));
            caja.style.display = "none";
        }
    })
}

