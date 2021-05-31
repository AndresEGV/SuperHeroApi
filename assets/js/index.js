$(document).ready(function() {
    $("form").submit(function(e) {
        e.preventDefault();
        //Variables de input y validacion con regex
        let valueInput = $("#superHeroInput").val();
        validaEntradaParaIngresarSoloNumeros = /[a-zA-Z]/gim;

        if (valueInput.match(validaEntradaParaIngresarSoloNumeros) || !valueInput) {
            alert("Debes ingresar un numero, por favor inténtalo nuevamente");
            return;
        }
        //Encontrar datos en la api y validar si viene algun error sino seguir con el proceso
        $.ajax({
            url: "https://superheroapi.com/api.php/4386629088014812/" + valueInput,
            success: function(data) {
                if (data.response == "error") {
                    alert("Héroe no encontrado, inténtalo nuevamente");
                    $("#superHeroInput").val("");
                } else {
                    //Destructurar los datos requeridos
                    let {
                        name,
                        image: { url },
                        biography: {
                            publisher,
                            "first-appearance": firstAppearance,
                            aliases,
                        },
                        work: { occupation },
                        appearance: { height, weight },
                        connections: { "group-affiliation": group },
                        powerstats,
                    } = data;
                    //join de datos para mopstrarlos con -
                    let altura = height.join(" - ");
                    let peso = weight.join(" - ");
                    //Template que mostrará los datos en una card
                    $("#heroeInfo").html(`
                    <h4 class="text-center">SuperHero encontrado</h4>
                       <div class="card mb-3">
                    <div class="row no-gutters">
                        <div class="col-md-4">
                            <img src="${url}" class="card-img-top img-fluid">
                        </div>
                        <div class="col-md-7">
                            <div class="card-body">
                                <h5 class="card-title">Nombre: ${name}</h5>
                                <p class="card-text"><i>Conexiones</i>:
                                    ${group}
                                </p>
                                <ul class="list-group list-group-flush">
                                  <li class="list-group-item"><b><i>Publicado por</i>:</b> ${publisher}</li>
                                    <li class="list-group-item"><b><i>Ocupación</i>:</b> ${occupation}</li>
                                    <li class="list-group-item"><b><i>Primera Aparición</i>:</b> ${firstAppearance}</li>
                                    <li class="list-group-item"><b><i>Altura</i>:</b> ${altura}</li>
                                    <li class="list-group-item"><b><i>Peso</i>:</b> ${peso}</li>
                                    <li class="list-group-item"><b><i>Alianzas</i>:</b> ${aliases}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>`);
                    //Arreglo para los valores de estadisticas del canvasJS
                    let estadisticas = [];

                    Object.entries(powerstats).forEach(([a, b]) => {
                        //Operador ternario que muestra un valor 1 para cuando viene null el valor de la estdistica, así se puede visualizar canvas y no queda confuso para el usuario
                        estadisticas.push({ label: a, y: b == "null" ? 1 : +b });
                        console.log(estadisticas);
                    });

                    let config = {
                        theme: "light2",
                        animationEnabled: true,

                        title: {
                            text: "Estadisticas",
                        },
                        axisY: {
                            title: "valor",
                        },
                        axisX: {
                            title: "Estadistica",
                        },

                        data: [{
                            type: "pie",
                            showInLegend: "true",

                            dataPoints: estadisticas,
                            toolTipContent: "<b>{label}</b>: {y}%",
                            legendText: "{label}",
                            indexLabel: "{label} - ({y})",
                        }, ],
                    };
                    //instancia de canvas
                    var chart = new CanvasJS.Chart("heroeStats", config);
                    chart.render();
                }
            },
            //Si ocurre algun error inesperado
            error: function(error) {
                alert("Ha ocurrido un error, porfavor intenta nuevamente");
            },
        });
    });
});