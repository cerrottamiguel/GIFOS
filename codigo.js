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
const apiKey = "Z4jAIThPhgNd5CYxKFnlFP40Y669rLeg";
const estilo = document.getElementsByTagName("link")[0];
const sourceRecientes = JSON.parse(sessionStorage.getItem("recientes"));
const sourceEstilo = localStorage.getItem("estilo");
const logo = document.getElementsByClassName("logo")[0];
const botonTemaDay = document.getElementById("sailorDay"); 
const botonTemaNight = document.getElementById("sailorNight");
const buscador = document.getElementById("buscador");
const botonBuscar = document.getElementById("botonBuscar");
const seccion = document.getElementById("seccion");
const seccion2 = document.getElementById("seccion2");
const seccion3 = document.getElementById("seccion3");
const botonReciente = document.getElementById("botonReciente");
var valoresParaAutocompletar = [];
var tendencias = [];
var listaMisGuifos = JSON.parse(localStorage.getItem("misGuifos"));
if(!listaMisGuifos){
    listaMisGuifos = [];
}
var recientes = [];
var listaGifsBuscados = [];
var primerosGifs = [];
var resultado = buscador.value;



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


//ESTE CONDICIONAL REFRESCA LA PAGINA DE BUSQUEDA EN SU ACTUAL VALOR DE BUSQUEDA
if(resultado!= ""){
    peticionDeBusqueda(resultado);
    let titulo = document.getElementsByClassName("barra-titulo")[0];
    titulo.style.display = "none";
    botonBuscar.className = "botonBuscarListo";
    setTimeout(() => {
        pintarResultadosDeBusqueda(listaGifsBuscados);
    }, 1500);
}



 //SEARCH EN LA API - ALMACENA titulo gif y valores de ancho y alto en el array ListaGifsBuscados   
function peticionDeBusqueda(string){
    listaGifsBuscados = [];   //CAMBIAMOS EL VALOR DE listaGifsBuscados a un array vacio para limpiar la busqueda anterior
    fetch('http://api.giphy.com/v1/gifs/search?q=' + string + '&api_key=' + apiKey)
    .then((resolve)=>{
        return resolve.json()
    })
    .then((respuesta)=>{
        let lista = respuesta.data;
        for (let i = 0; i < lista.length; i++) {    
            let element = lista[i];     
            let unidad = {}; //creamos tantos objetos como gif resultantes de la busqueda 
            unidad.titulo = element.title;
            unidad.imagen = element.images.downsized_large.url;
            unidad.ancho = element.images.downsized_large.width;
            unidad.alto = element.images.downsized_large.height;
            //AGREGAMOS LOS HASHTAGS
            unidad.hashtags = [];
            fetch('http://api.giphy.com/v1/tags/related/' + element.title + '?q=&api_key=' + apiKey)
            .then((resolve)=>{
                return resolve.json()
            })
            .then((respuesta)=>{
                for (let i = 0; i < 4; i++) {   
                    let element1 = respuesta.data[i].name; 
                    (unidad.hashtags).push(element1);//PUSH
                }
            })
            .catch((error)=>{
                console.log(error);
            })
            //y los pusheamos a la listaGifsBuscados
            listaGifsBuscados.push(unidad);   
        }
    })
    .catch((error)=>{
        console.log(error)
    })
}

//CREAMOS LA FUNCION PARA PINTAR LOS DOMS DE GIF HACIENDOLOS ENCAJAR EN EL GRID
function pintarResultadosDeBusqueda(array){ 
    for (let i = 0; i < array.length; i++) {
        let element = array[i];

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
       
        //BARRA DE HASHTAGS
        let barraHashtags = document.createElement("div");
        barraHashtags.id = "barra-inferior-hover";

        //HASHTAGS
        let hashtags = element.hashtags;
        if(hashtags<1){
            barraHashtags.style.display = "none";
            barraHashtags.style.visibility = "hidden";
        }else{
            for (let i = 0; i < hashtags.length; i++) {
                let texto = hashtags[i];
                let palabra = document.createElement("a");
                palabra.innerText = "#" + texto;
                //FUNCION DE HASHTAG
                palabra.addEventListener("click", ()=>{
                    seccion.innerHTML = "";
                    let titulos = document.getElementsByClassName("barra-titulo");
                    titulos[0].style.display = "none";
                    titulos[1].style.display = "none";
                    seccion2.style.display = "none";
                    seccion3.style.display = "none";
                    let titulo = document.getElementsByClassName("titulo-busqueda")[0];
                    titulo.style.display = "block";
                    titulo.innerText = texto + "  (resultados)";
                    buscador.value = texto;
                    //ESTE BUCLE FOR REEMPLAZA UN VALOR DE BUSQUEDAS RECIENTES 
                    //EN CASO DE QUE SE BUSQUE NUEVAMENTE
                    for (let i = 0; i < recientes.length; i++) {  
                        let elementor = recientes[i];             
                        if(texto === elementor){
                            recientes.splice(i, 1);   
                        } 
                    }
                    //AGREGAMOS LA BUSQUEDA A RECIENTES
                    recientes.unshift(texto);  
                    //GUARDAMOS EN SESION STORAGE  
                    sessionStorage.setItem("recientes", JSON.stringify(recientes));
                    //LIMPIAMOS LOS RECIENTES
                    let contenedor = document.getElementById("recientes"); 
                    contenedor.innerHTML = "";
                    //PINTAMOS LOS RECIENTES NUEVOS
                    let misRecientes = JSON.parse(sessionStorage.getItem("recientes"));
                    busquedasRecientes(misRecientes);
                    peticionDeBusqueda(texto); 
                    setTimeout(() => {
                        pintarResultadosDeBusqueda(listaGifsBuscados);
                    }, 3000);
                })
                barraHashtags.appendChild(palabra);
            }
            caja.appendChild(barraHashtags);
        }

        //BOTON GUARDAR
        let guardar = document.createElement("img");
        guardar.setAttribute("src", "assets/guardar.png");
        guardar.id = "guardar";
        caja.appendChild(guardar);
       
        //INSERT
        seccion.appendChild(caja);
       
        //FUNCION DEL BOTON DE GUARDAR
        guardar.addEventListener("click", ()=>{ 
            let respuesta = confirm("Guardar este GIF en la carpeta Mis Guifos?");
            if(respuesta == true){
                for (let i = 0; i < listaMisGuifos.length; i++) {
                    let esto = listaMisGuifos[i];
                    if(esto.titulo === element.titulo){
                        alert ("Ya Guardaste este Guifo");
                        listaMisGuifos.splice(i, 1);
                    }
                }
                listaMisGuifos.push(element);
                localStorage.setItem("misGuifos", JSON.stringify(listaMisGuifos));
            } 
        })
    } 
}

//CREAMOS LA FUNCION PARA PINTAR LOS BOTONES DE BUSQUEDA RECIENTE
function busquedasRecientes(array){ 
    let contenedor = document.getElementById("recientes");                           
    for (let i = 0; i < array.length; i++) {
        let element = array[i];
        boton = document.createElement("button");
        boton.id = "botonReciente";
        boton.innerText = "#" + element;
        contenedor.appendChild(boton);
        boton.addEventListener("click", ()=>{
            //BORRAMOS LAS DEMAS SECCIONES
            let titulos = document.getElementsByClassName("barra-titulo");
            titulos[0].style.display = "none";
            titulos[1].style.display = "none";
            seccion2.style.display = "none";
            seccion3.style.display = "none";
            buscador.value = element;
            seccion.innerHTML = "";
            let titulo = document.getElementsByClassName("titulo-busqueda")[0];
            titulo.style.display = "block";
            titulo.innerText = element + "  (resultados)";
            peticionDeBusqueda(element);
            setTimeout(() => {
                pintarResultadosDeBusqueda(listaGifsBuscados);
            }, 2000);
        })
    } 
}

//DICHOS BOTONES de RECIENTES SON GUARDADOS EN SESION STORAGE MAS ADELANTE
//Y CON ESTE CONDICIONAL LOS MOSTRAMOS EN EL INICIO
if(sourceRecientes){
    busquedasRecientes(sourceRecientes);
}

//ACTIVA Y DESACTIVA EL BOTON BUSCAR y HACE REQUEST A LA API 
//DE GIPHY cada ves que el valor del input cambia 
buscador.addEventListener("input", ()=>{
    let resultado = buscador.value;
    if(resultado == ""){ 
        botonBuscar.className = "botonBuscar";
    }else{
        botonBuscar.className = "botonBuscarListo";
    }
    if(resultado.length > 2){
        peticionSugerencias(resultado);
    }
    peticionDeBusqueda(resultado); 
    setTimeout(() => {
        autocompletar(valoresParaAutocompletar);//PINTA EL AUTOCOMPLETADO
    }, 800);
});


//CON EL BOTON BUSCAR PINTAMOS LOS DOMS CORRIENDO NUESTRA 
//FUNCION pintarResultadosDeBusqueda 
botonBuscar.addEventListener("click", ()=>{
    let resultado = buscador.value;
    if(resultado!=""){
        seccion.innerHTML = "";     //BORRAMOS TODO LO QUE HAYA SIDO PINTADO PREVIAMENTE
        //ESTE BUCLE FOR REEMPLAZA UN VALOR DE BUSQUEDAS RECIENTES 
        //EN CASO DE QUE SE BUSQUE NUEVAMENTE
        for (let i = 0; i < recientes.length; i++) {  
            let element = recientes[i];             
            if(resultado === element){
                recientes.splice(i, 1);   
            } 
        }
        let autocompletado = document.getElementsByClassName("autocompletar")[0];
        autocompletado.style.visibility = "hidden"; 
        //AGREGAMOS LA BUSQUEDA A RECIENTES
        recientes.unshift(resultado);  
        //GUARDAMOS EN SESION STORAGE  
        sessionStorage.setItem("recientes", JSON.stringify(recientes)); 

        let titulo = document.getElementsByClassName("titulo-busqueda")[0];
        titulo.style.display = "block";
        titulo.innerText = resultado + "  (resultados)";
        
        //BORRAMOS LAS DEMAS SECCIONES
        let titulos = document.getElementsByClassName("barra-titulo");
        titulos[0].style.display = "none";
        titulos[1].style.display = "none";
        seccion2.style.display = "none";
        seccion3.style.display = "none";
        //LIMPIAMOS LOS RECIENTES
        let contenedor = document.getElementById("recientes"); 
        contenedor.innerHTML = "";
        //PINTAMOS LOS RECIENTES NUEVOS
        let misRecientes = JSON.parse(sessionStorage.getItem("recientes"));
        busquedasRecientes(misRecientes);
        //PINTAMOS LA BUSQUEDA
        peticionDeBusqueda(resultado); 
        setTimeout(() => {
            pintarResultadosDeBusqueda(listaGifsBuscados);//Y ASIGNAMOS LA FUNCION PINTAR AL BOTON BUSCAR (CON EL VALOR ACTUAL DE BUSQUEDA)
        }, 3000);
    }
});



//LE DAMOS A LA TECLA ENTER LA MISMA FUNCIONALIDAD QUE EL BOTON BUSCAR
buscador.addEventListener("keydown", (e)=>{
    if(e.key == "Enter"){
        let resultado = buscador.value;
        if(resultado!=""){
            seccion.innerHTML = "";     //BORRAMOS TODO LO QUE HAYA SIDO PINTADO PREVIAMENTE
            for (let i = 0; i < recientes.length; i++) { //ESTE FOR ELIMINA UN VALOR DE BUSQUEDAS RECIENTES 
                let element = recientes[i];             //EN CASO DE QUE SEA BUSCADO NUEVAMENTE
                if(resultado === element){
                    recientes.splice(i, 1);   
                } 
            }
            let autocompletado = document.getElementsByClassName("autocompletar")[0];
            autocompletado.style.visibility = "hidden";
            recientes.unshift(resultado);              //AGREGAMOS LA BUSQUEDA A RECIENTES
            sessionStorage.setItem("recientes", JSON.stringify(recientes)); //GUARDAMOS EN SESION STORAGE
            let titulo = document.getElementsByClassName("titulo-busqueda")[0];
            titulo.style.display = "block";
            titulo.innerText = resultado + "  (resultados)";
            //BORRAMOS LAS DEMAS SECCIONES
            let titulos = document.getElementsByClassName("barra-titulo");
            titulos[0].style.display = "none";
            titulos[1].style.display = "none";
            seccion2.style.display = "none";
            seccion3.style.display = "none";
            //LIMPIAMOS LOS RECIENTES
            let contenedor = document.getElementById("recientes"); 
            contenedor.innerHTML = "";
            //PINTAMOS LOS RECIENTES NUEVOS
            let misRecientes = JSON.parse(sessionStorage.getItem("recientes"));
            busquedasRecientes(misRecientes);
            //PINTAMOS LA BUSQUEDA
            peticionDeBusqueda(resultado); 
            setTimeout(() => {
                pintarResultadosDeBusqueda(listaGifsBuscados);//Y ASIGNAMOS LA FUNCION PINTAR AL BOTON BUSCAR (CON EL VALOR ACTUAL DE BUSQUEDA)
            }, 3000);
        }
    }
})


//HACEMOS UN REQUEST DE SEARCH TAGS PARA EL AUTOCOMPLETADO
function peticionSugerencias(string){
    valoresParaAutocompletar = [];
    fetch('http://api.giphy.com/v1/gifs/search/tags?q=' + string + '&api_key=' + apiKey)
    .then((resolve)=>{
        return resolve.json()
    })
    .then((respuesta)=>{
        for (let i = 0; i < 2; i++) {
            let lista = respuesta.data;
            let element = lista[i];
            let valor = element.name;
            valoresParaAutocompletar.push(valor); //ALMACENAMOS EN LA VARIABLE CON NUESTRO ARRAY COMO SIEMPRE  
        }
    })
    .catch((error)=>{
        //console.log(error); este salta siempre al parecer
    })
}

//PINTAMOS POR DEBAJO DEL BUSCADOR
function autocompletar(array){
    let arrLength = valoresParaAutocompletar.length;
    if(arrLength > 3){
        valoresParaAutocompletar.splice( 0, arrLength - 3);
    }
    let resultado = buscador.value;
    let contenedor = document.getElementsByClassName("autocompletar")[0];
    contenedor.innerHTML = "";
    if(resultado.length>2){
        for (let i = 0; i < array.length; i++) {
            let element = array[i];
            let boton = document.createElement("button");
            boton.innerText = element;
            contenedor.appendChild(boton);

            //ACCION DEL BOTON AUTOCOMPLETADO PARA AGREGAR 
            //EJECUTAR LA BUSQUEDA Y GUARDAR EN RECIENTES 
            boton.addEventListener("click", ()=>{ 
                contenedor.style.visibility = "hidden";
                buscador.value = element;
                seccion.innerHTML = "";     //BORRAMOS TODO LO QUE HAYA SIDO PINTADO PREVIAMENTE
                for (let i = 0; i < recientes.length; i++) { //ESTE FOR ELIMINA UN VALOR DE BUSQUEDAS RECIENTES 
                    let element1 = recientes[i];             //EN CASO DE QUE SEA BUSCADO NUEVAMENTE
                    if(element === element1){
                        recientes.splice(i, 1);   
                    } 
                }
                recientes.unshift(element);        //AGREGAMOS LA BUSQUEDA A RECIENTES
                sessionStorage.setItem("recientes", JSON.stringify(recientes)); //GUARDAMOS EN SESION STORAGE
                let titulo = document.getElementsByClassName("titulo-busqueda")[0];
                titulo.style.display = "block";
                titulo.innerText = element + "  (resultados)";
                //BORRAMOS LAS DEMAS SECCIONES
                let titulos = document.getElementsByClassName("barra-titulo");
                titulos[0].style.display = "none";
                titulos[1].style.display = "none";
                seccion2.style.display = "none";
                seccion3.style.display = "none";
                //LIMPIAMOS LOS RECIENTES
                let contenedor1 = document.getElementById("recientes"); 
                contenedor1.innerHTML = "";
                //PINTAMOS LOS RECIENTES NUEVOS
                let misRecientes = JSON.parse(sessionStorage.getItem("recientes"));
                busquedasRecientes(misRecientes);
                //PINTAMOS LA BUSQUEDA
                peticionDeBusqueda(element); 
                setTimeout(() => {
                    pintarResultadosDeBusqueda(listaGifsBuscados);//Y ASIGNAMOS LA FUNCION PINTAR AL BOTON BUSCAR (CON EL VALOR ACTUAL DE BUSQUEDA)
                }, 3000);
            })
        }
        if((contenedor.innerHTML)===""){
            contenedor.style.visibility = "hidden";
        }else{
            contenedor.style.visibility = "visible";
        }
    }else{
        contenedor.style.visibility = "hidden";
    }
}


//REQUEST API TRENDING
function peticionTrending(){
    tendencias = []; //LIMPIAMOS NUESTRO ARRAY TENDENCIAS
    fetch('http://api.giphy.com/v1/gifs/trending?q=&api_key=' + apiKey)
    .then((resolve)=>{
        return resolve.json()
    })
    .then((respuesta)=>{
        let lista = respuesta.data;
        for (let i = 0; i < lista.length; i++) {    
            let element = lista[i];     
            let unidad = {}; //creamos tantos objetos como gif resultantes de la peticion 
            unidad.titulo = element.title;
            unidad.imagen = element.images.downsized_large.url;
            unidad.ancho = element.images.downsized_large.width;
            unidad.alto = element.images.downsized_large.height;

            //AGREGAMOS LOS HASHTAGS
            unidad.hashtags = [];
            //REQUEST A LA API RELATED BUSCANDO CON EL VALOR DE TITLE 
            //DEL OBJECTO DE RESPONSE DE TRENDING
            fetch('http://api.giphy.com/v1/tags/related/' + element.title + '?q=&api_key=' + apiKey)
            .then((resolve)=>{
                return resolve.json()
            })
            .then((respuesta)=>{
                let lista1 = respuesta.data;
                for (let i = 0; i < 4; i++) {    
                    let element1 = lista1[i];     
                    (unidad.hashtags).push(element1.name);
                }
            })
            .catch((error)=>{
                console.log(error);
            })
            tendencias.push(unidad);   //y los pusheamos a la listaTendencias
        }
    })
    .catch((error)=>{
        console.log(error);
    })
}



function pintarTendencias(array){
    for (let i = 0; i < array.length; i++) {
        let element = array[i];

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
       
        //BARRA DE HASHTAGS
        let barraHashtags = document.createElement("div");
        barraHashtags.id = "barra-inferior-hover";
        //HASHTAGS
        let hashtags = element.hashtags;
        if(hashtags<1){
            barraHashtags.style.display = "none";
            barraHashtags.style.visibility = "hidden";
        }else{
            for (let i = 0; i < hashtags.length; i++) {
                let texto = hashtags[i];
                let palabra = document.createElement("a");
                palabra.innerText = "#" + texto;
                //FUNCION DE HASHTAG
                palabra.addEventListener("click", ()=>{
                    seccion.innerHTML = "";
                    let titulos = document.getElementsByClassName("barra-titulo");
                    titulos[0].style.display = "none";
                    titulos[1].style.display = "none";
                    seccion2.style.display = "none";
                    seccion3.style.display = "none";
                    let titulo = document.getElementsByClassName("titulo-busqueda")[0];
                    titulo.style.display = "block";
                    titulo.innerText = texto + "  (resultados)";
                    buscador.value = texto;
                    //ESTE BUCLE FOR REEMPLAZA UN VALOR DE BUSQUEDAS RECIENTES 
                    //EN CASO DE QUE SE BUSQUE NUEVAMENTE
                    for (let i = 0; i < recientes.length; i++) {  
                        let elementor = recientes[i];             
                        if(texto === elementor){
                            recientes.splice(i, 1);   
                        } 
                    }
                    //AGREGAMOS LA BUSQUEDA A RECIENTES
                    recientes.unshift(texto);  
                    //GUARDAMOS EN SESION STORAGE  
                    sessionStorage.setItem("recientes", JSON.stringify(recientes));
                    //LIMPIAMOS LOS RECIENTES
                    let contenedor = document.getElementById("recientes"); 
                    contenedor.innerHTML = "";
                    //PINTAMOS LOS RECIENTES NUEVOS
                    let misRecientes = JSON.parse(sessionStorage.getItem("recientes"));
                    busquedasRecientes(misRecientes);
                    peticionDeBusqueda(texto); 
                    setTimeout(() => {
                        pintarResultadosDeBusqueda(listaGifsBuscados);
                    }, 3000);
                })
                barraHashtags.appendChild(palabra);
            }
        }
        caja.appendChild(barraHashtags);      
        //BOTON GUARDAR
        let guardar = document.createElement("img");
        guardar.setAttribute("src", "assets/guardar.png");
        guardar.id = "guardar";
        caja.appendChild(guardar);
       
        //INSERT
        seccion3.appendChild(caja);
       
        //FUNCION DEL BOTON DE GUARDAR
        guardar.addEventListener("click", ()=>{ 
            let respuesta = confirm("Guardar este GIF en la carpeta Mis Guifos?");
            if(respuesta == true){
                for (let i = 0; i < listaMisGuifos.length; i++) {
                    let esto = listaMisGuifos[i];
                    if(esto.titulo === element.titulo){
                        alert ("Ya Guardaste este Guifo");
                        listaMisGuifos.splice(i, 1);
                    }
                }
                listaMisGuifos.push(element);
                localStorage.setItem("misGuifos", JSON.stringify(listaMisGuifos));
            } 
        })
    } 
}

function peticionRelated(string){
    fetch('http://api.giphy.com/v1/tags/related/' + string + '?q=&api_key=' + apiKey)
    .then((resolve)=>{
        return resolve.json()
    })
    .then((respuesta)=>{
        let lista = respuesta.data;
        primerosGifs = [];
        for (let i = 0; i < lista.length; i++) {    
            let element = lista[i];     
            let unidad = {};
            let name = element.name;
            unidad.nombre = name;
            fetch('http://api.giphy.com/v1/gifs/search?q=' + name + '&api_key=' + apiKey)
            .then((resolve)=>{
                return resolve.json()
            })
            .then((respuesta)=>{
                let lista1 = respuesta.data;    
                let element1 = lista1[i];     
                unidad.titulo = element1.title;
                unidad.imagen = element1.images.downsized_large.url;
                unidad.ancho = element1.images.downsized_large.width;
                unidad.alto = element1.images.downsized_large.height; 
            })
            .catch((error)=>{
                console.log(error)
            })
            primerosGifs.push(unidad);
        }
    })
    .catch((error)=>{
        console.log(error);
    })
}


function pintarLosPrimerosGifs(array){
    for (let i = 0; i < array.length; i++) {
        let element = array[i];
        //CONTENEDOR
        let caja = document.createElement("div");
        caja.id = "caja";
        //BARRA SUPERIOR
        let barra = document.createElement("div");
        barra.innerText = '#' + element.nombre;
        barra.className = "barra-superior";
        let cruz = document.createElement("img");
        cruz.src = "assets/button3.svg";
        cruz.id = "cruz";
        barra.appendChild(cruz);
        //BOTON
        let boton = document.createElement("button");
        boton.innerText = "Ver más...";
        //IMAGEN
        let gif = document.createElement("img");
        gif.setAttribute("src", element.imagen);
        gif.id = "gif";
        caja.appendChild(barra);
        caja.appendChild(boton);
        caja.appendChild(gif);
        seccion2.appendChild(caja);


        //FUNCION BOTONES
        cruz.addEventListener("click", ()=>{
            caja.style.display="none";
        })
        gif.addEventListener("click", ()=>{
            seccion.innerHTML = "";
            buscador.value = element.nombre;
            let titulos = document.getElementsByClassName("barra-titulo");
            titulos[0].style.display = "none";
            titulos[1].style.display = "none";
            seccion2.style.display = "none";
            seccion3.style.display = "none";
            let titulo = document.getElementsByClassName("titulo-busqueda")[0];
            titulo.style.display = "block";
            titulo.innerText = element.nombre + "  (resultados)";
            peticionDeBusqueda(element.nombre); 
            setTimeout(() => {
                pintarResultadosDeBusqueda(listaGifsBuscados);
            }, 3000);
        })
        boton.addEventListener("click", ()=>{
            seccion.innerHTML = "";
            let titulos = document.getElementsByClassName("barra-titulo");
            titulos[0].style.display = "none";
            titulos[1].style.display = "none";
            seccion2.style.display = "none";
            seccion3.style.display = "none";
            let titulo = document.getElementsByClassName("titulo-busqueda")[0];
            titulo.style.display = "block";
            titulo.innerText = element.nombre + "  (resultados)";
            peticionDeBusqueda(element.nombre); 
            setTimeout(() => {
                pintarResultadosDeBusqueda(listaGifsBuscados);
            }, 3000);
        })
    }
}

//HOY TE SUGERIMOS
peticionRelated();
setTimeout(() => {
    pintarLosPrimerosGifs(primerosGifs); 
}, 1700);
//TENDENCIAS
peticionTrending();
setTimeout(() => {
    pintarTendencias(tendencias);
}, 1700);



