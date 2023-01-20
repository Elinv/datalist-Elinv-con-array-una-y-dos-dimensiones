/**
 *  * Clase Datalist Elinv
 *  * Parametros:
 *  * ------------------------------------------------------------
 * 	inputSearch :   id del Input de busqueda
 * 
 *  listDiv:        id del Datalist que es visible o invisible 
 *                  dependiendo si hay o no resultados. 
 *          		Se muestra con los resultados de la busqueda.
 * 
 *  ClsDLElinv:     Clase contenedora del datalist
 * 
 *  options:        Clase que permite ver u ocultar las filas
 * 
 *  lblinnerHTML:   id del input label que muestra un solo resultado 
 *                  de la fila seleccionada sea con el mouse 
 *                  o con el teclado.
 *  
 *  lblHallados:    id del input label que muestra la cantidad 
 *                  de resultados alcanzados
 * 
 *  arrDatalistElv: Parametro array para llenar el datalist
 * 
 *  titColumn:      Título de las columnas para el caso de un array bidimensional.
 * 
 *  Posdata: Se podría haber realizado con mucho menos código
 *  pero la idea es que sea de la mas fácil comprensión.
 *  * ------------------------------------------------------------ 
 */



// falta control de errores de la 
// cantidad de columnas del array bidimensional 
// y de los titulos de las columnas

// y en base a esa cantidad crear el datalist



class datalistElinv {

    constructor(inputSearch, listDiv, ClsDLElinv, options, lblinnerHTML, lblHallados, arrDatalistElv, titColumn = []) {

        // Para recorrer mediante el teclado las filas visibles 
        // resultantes de la búsqueda.
        this.arrVisiblesKeyNavU = [];
        this.arrVisiblesKeyNavB = [];
        // Control mediante teclas de las filas
        this.s, this.pU = -1, this.pB = -1;
        // label muestra el resultado de la linea resaltada.
        this.lblinnerHTML = lblinnerHTML;
        // label contador resultados hallados
        this.lblHallados = lblHallados;
        // datalist donde ingresaremos los listados
        this.listDiv = listDiv;
        // clase contenedora del datalist
        this.ClsDLElinv = ClsDLElinv;
        // Clase que permite ver u ocultar las filas
        this.options = options;
        // doble click en casilla de busqueda
        this.inputSearch = inputSearch;
        // array para llenar el Datalist
        this.arrDatalistElv = arrDatalistElv;
        // titulos de columnas para los array bidimensionales.
        this.titColumn = titColumn;
        // ['Orden', 'Column 0', 'Column 1', 'Column 2', 'Column 3'];
        // Tipos de array
        this.arrTUni = 0;
        this.arrTBid = 0;
        // para la insensibilidad en acentos.
        this.accent_map = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'Á': 'a', 'É': 'e', 'è': 'e', 'Í': 'i', 'Ó': 'o', 'Ú': 'u' };

    }

    // Para poder buscar a pesar de los acentos
    obviarAcentos(s) {
        if (!s) { return ''; }
        var ret = '';
        for (var i = 0; i < s.length; i++) {
            ret += this.accent_map[s.charAt(i)] || s.charAt(i);
        }
        return ret;
    };

    // devuelve las coincidencias respecto de lo buscado
    visibles(tagOptions) {

        //Recorrer con el teclado pero solo por sobre los elementos visibles.
        let options = document.getElementsByClassName(tagOptions);
        let tantos = options.length;
        let arrVisibles = [];

        if (this.arrTUni === 1) {
            for (let i = 0; i < tantos; i++) {
                if (options[i].style.display == 'block') {
                    arrVisibles.push(options[i].id);
                }
            }
        }

        // Si el array es de dos dimensiones
        if (this.arrTBid === 2) {
            for (let i = 0; i < tantos; i++) {
                if (options[i].style.visibility == "visible") {
                    arrVisibles.push(options[i].id);
                }
            }
        }

        return arrVisibles;
    }

    // función para determinar 
    // la instancia de array y sus dimensiones
    dimensiones(arr) {
        // instanceof prueba si la propiedad de un constructor 
        // aparece en cualquier parte 
        // de la cadena de prototipos de un objeto
        // Pueden probar la función de esta forma
        // --------------------------------------
        let res = [];
        if (arr instanceof Array) {
            res[0] = arr.length;
            if (arr[0] instanceof Array) {
                res = res.concat(arr[0].length);
                if (arr[0][0] instanceof Array) {
                    res = res.concat(arr[0].length);
                }
            }
        }
        return res;

        // O de esta otra forma también funcional,
        // pero apelando a sortear el análisis con
        // try and catch 😅
        // --------------------------------------
        // let res = [];
        // try {				
        // 	if (arr instanceof Array){res[0] = arr.length;}
        // 	if (arr[0] instanceof Array){res = res.concat(arr[0].length);}
        // 	if (arr[0][0] instanceof Array){res = res.concat(arr[0].length);}			
        // 	return res;
        // } catch (error) {
        // 	return res;
        // }
    }


    init(nameDL) {
        var s = document.getElementById(this.inputSearch);
        let gralRes = document.getElementById(this.listDiv);

        // input search si se presiona cualquier tecla
        s.addEventListener('keyup', function (event) {
            //Se ejecuta si no es espacio
            if (event.key !== " ") {
                // Separamos las palabras buscadas por espacio
                let pal = this.value.split(' ');
                //Creamos la expresión regular para buscar 
                // hasta por cuatro argumentos.
                let regexp;
                if (pal.length == 1) regexp = `(?=.*${pal[0]})`
                if (pal.length == 2) regexp = `(?=.*${pal[0]})(?=.*${pal[1]})`
                if (pal.length == 3) regexp = `(?=.*${pal[0]})(?=.*${pal[1]})(?=.*${pal[2]})`
                if (pal.length == 4) regexp = `(?=.*${pal[0]})(?=.*${pal[1]})(?=.*${pal[2]})(?=.*${pal[3]})`
                // Convertimos para comparación 'insensitive'
                regexp = regexp.toLowerCase();
                // obviamos acentos
                regexp = nameDL.obviarAcentos(regexp);
                // analizamos cada option
                let options = document.getElementsByClassName(nameDL.options);
                let tantos = options.length;
                let hallados = 0;
                let res;
                let contHallados = document.getElementById(nameDL.lblHallados);
                for (let i = 0; i < tantos; i++) {
                    let this_element = options[i];
                    let this_elementStr = '';

                    if (nameDL.arrTUni === 1) {
                        this_elementStr = this_element.innerHTML.toLowerCase();
                    }

                    if (nameDL.arrTBid === 2) {
                        this_elementStr = this_element.textContent.toLowerCase();
                    }

                    // obviamos acentos
                    this_elementStr = nameDL.obviarAcentos(this_elementStr);

                    // Si el array es de una dimensión
                    if (nameDL.arrTUni === 1) {
                        // Comparamos y mostramos u ocultamos conforme el resultado
                        if (this_elementStr.match(regexp)) {
                            this_element.style.display = "block";
                            // incrementamos
                            hallados++;
                            // informamos cantidad
                            res = (hallados == 1) ? ' resultado.' : ' resultados.';
                            contHallados.value = hallados + res;
                        } else {
                            this_element.style.display = "none";
                            this_element.classList.replace("in", "out");
                            setTimeout(function () {
                                this_element.style.display = "none";
                            }, 700);
                            contHallados.value = "Sin resultado!";
                        }
                    }

                    // Si el array es de dos dimensiones
                    if (nameDL.arrTBid === 2) {
                        // Comparamos y mostramos u ocultamos conforme el resultado
                        if (this_elementStr.match(regexp)) {
                            // ocultamos el datalist
                            document.getElementById(nameDL.listDiv).style.display = 'block';
                            this_element.style.visibility = "visible";
                            // incrementamos
                            hallados++;
                            // informamos cantidad
                            res = (hallados == 1) ? ' resultado.' : ' resultados.';
                            contHallados.value = hallados + res;
                        } else {
                            this_element.style.visibility = "collapse";
                            this_element.classList.replace("in", "out");
                            setTimeout(function () {
                                this_element.style.visibility = "collapse";
                            }, 700);
                            contHallados.value = "Sin resultado!";
                        }
                    }
                }

                // si no se halla ninguno ocultamos
                if (hallados == 0 || this.value == '') {

                    // Si el array es de una dimensión
                    if (nameDL.arrTUni === 1) {
                        gralRes.classList.replace("in", "out");
                        setTimeout(function () {
                            gralRes.style.display = "none";
                        }, 400);
                    }

                    // Si el array es de dos dimensiones
                    if (nameDL.arrTBid === 2) {
                        gralRes.classList.replace("in", "out");
                        setTimeout(function () {
                            gralRes.style.visibility = "collapse";
                        }, 400);
                    }

                    contHallados.value = "Sin resultado!";
                    // o mostramos.
                } else {

                    // Si el array es de una dimensión
                    if (nameDL.arrTUni === 1) {
                        gralRes.classList.replace("out", "in");
                        setTimeout(function () {
                            gralRes.style.display = "block";
                        }, 400);
                        // obtenemos los id en array de elem visibles
                        console.log(nameDL);
                        nameDL.arrVisiblesKeyNavU = nameDL.visibles(nameDL.options);                        
                        contHallados.value = hallados + res;                        
                    }

                    // Si el array es de dos dimensiones
                    if (nameDL.arrTBid === 2) {
                        gralRes.classList.replace("out", "in");
                        setTimeout(function () {
                            gralRes.style.visibility = "visible";
                        }, 400);
                        // obtenemos los id en array de elem visibles
                        nameDL.arrVisiblesKeyNavB = nameDL.visibles(nameDL.options);
                        contHallados.value = hallados + res;
                    }

                }

            }
        });

        //input search si se hace doble click con el boton izquierdo del mouse
        s.addEventListener('dblclick', (e) => {
            // limpiamos el text input buscador de palabras
            s.value = '';

            // Si el array es de una dimensión
            if (nameDL.arrTUni === 1) {
                // ocultamos el datalist
                document.getElementById(nameDL.listDiv).style.display = 'none';

            }

            // Si el array es de dos dimensiones
            if (nameDL.arrTBid === 2) {
                // ocultamos el datalist
                document.getElementById(nameDL.listDiv).style.visibility = "collapse";
            }

            // limpiamos el contador de hallados.
            let contHallados = document.getElementById(nameDL.lblHallados);
            contHallados.value = '';
            // El resultado individual resaltado lo ocultamos.
            let verLbl = document.getElementById(nameDL.lblinnerHTML);
            verLbl.style.display = 'none';
        });

        // llenamos el datalist
        // -------------------------------------
        // Comprobamos las dimensiones del array
        let dimen = this.dimensiones(this.arrDatalistElv);
        // Establecemos a nivel de la clase el tipo de array en sus dimensiones
        if (dimen.length === 1) {
            this.arrTUni = dimen.length;
        } else if (dimen.length === 2) {
            this.arrTBid = dimen.length;
        }


        // si el array es de una dimensión.
        let iArrUni = 0;
        if (dimen.length === 1) {
            this.arrDatalistElv.forEach(element => {
                // Para poder enfocar un div 
                // contenteditable="true" es una forma
                // o la otra agregando atributo tabindex
                let divStr = `<div id="aU${iArrUni}" tabindex="aU${iArrUni++}" class="${this.options}">${element}</div>`
                let nodo = divStr.toDOM();
                gralRes.appendChild(nodo);
            });
            // ocultamos el datalist
            document.getElementById(this.listDiv).style.display = 'none';
        }

        // si el array es de dos dimensiones.
        let iArrBid = 0;
        if (dimen.length === 2) {
            // string encabezado de la tabla
            let tableCont = `<div class="divTable">
            <div class="divTableBody">
            <div class="divTableRow">
            <div class="divTableTit">${this.titColumn[0]}</div>
            <div class="divTableTit">${this.titColumn[1]}</div>
            <div class="divTableTit">${this.titColumn[2]}</div>
            <div class="divTableTit">${this.titColumn[3]}</div>
            <div class="divTableTit">${this.titColumn[4]}</div>
            </div>`;

            this.arrDatalistElv.forEach(element => {

                tableCont += `
            <div class="divTableRow ${this.options}" id="aB${iArrBid}" tabindex="aB${iArrBid++}">
                <div class="divTableCell">${element[0]}</div>
                <div class="divTableCell">${element[1]}</div>
                <div class="divTableCell">${element[2]}</div>
                <div class="divTableCell">${element[3]}</div>
                <div class="divTableCell">${element[4]}</div>
            </div>`;
            });

            tableCont += `
                </div>
            </div>`;

            let nodoCont = tableCont.toDOM();
            gralRes.appendChild(nodoCont);
            
            // ocultamos el datalist
            document.getElementById(this.listDiv).style.display = 'none';
        }

        // detect click dentro de los divs
        document.addEventListener("click", function (event) {

            // Si el click es dentro del listado
            let verLbl = document.getElementById(nameDL.lblinnerHTML);

            // Si el array es de una dimensión
            if (nameDL.arrTUni === 1) {

                if (event.target.closest(`.${nameDL.options}`)) {
                    // lo mostramos individualmente
                    verLbl.value = event.target.innerHTML;
                    // solo si el tag visualizador esta oculto
                    if (verLbl.style.display !== 'block') {
                        verLbl.style.display = "block";
                    }
                }

                //actualizamos la posición para la selección por teclas arriba|abajo
                nameDL.arrVisiblesKeyNavU.forEach((element, index) => {
                    if (document.getElementById(element).innerHTML === event.target.innerHTML) {
                        nameDL.pU = index;
                    }
                });

            }


            // Si el array es de dos dimensiones
            if (nameDL.arrTBid === 2) {
                let idAncestro = '';

                if (event.target.closest(`.${nameDL.ClsDLElinv}`)) {
                    // Solo si tiene un elemento anterior con la clase 'options'

                    if (event.target.closest(`.${nameDL.options}`)) {
                        // obtenemos datos de ese elemento
                        idAncestro = event.target.closest(`.${nameDL.options}`);
                        // lo mostramos individualmente utilizando su id
                        verLbl.value = document.getElementById(idAncestro.id).textContent;
                        // solo si el tag visualizador esta oculto
                        if (verLbl.style.display !== 'block') {
                            verLbl.style.display = "block";
                        }
                        // actualizamos el indice desde donde iniciará el movimiento
                        // las teclas ArrowUp | ArrowDown
                        nameDL.pB = idAncestro.id;
                    }
                }

            }
        })

    }
}

// Para crear fragment de document => nodes
String.prototype.toDOM = function () {
    var d = document
        , i
        , a = d.createElement("div")
        , b = d.createDocumentFragment();
    a.innerHTML = this;
    while (i = a.firstChild) b.appendChild(i);
    return b;
};
