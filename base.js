const serverHost = "http://localhost:8000"

const version = 1

const infoFile = "/physics/info.min.json?v=" + version

var cache = {}

function getScriptWithCache(name, file, callback) {
    if(!cache[name]) {
        cache[name] = true
        jQuery.getScript(file, function( data, textStatus, jqxhr ) { callback(textStatus, jqxhr.status) })
    }
    else {
        callback("success (already cached)", 304)
    }
}

function getExperiment(name) {
    fetch(serverHost + infoFile)
    .then(r => r.json())
    .then(r => {
        if(!r[name]) {
            error("Invalid experiment. Please see info.json for a list of valid experiments", "Invalid Experiment")
            return
        }

        document.title = r[name].title

        getScriptWithCache(name, serverHost + "/physics/" + r[name].path, function(textStatus, code ) {
            console.log("Experiment was loaded with status of: " + textStatus + ". Code: " + code);

            expClass = eval(r[name].class)

            experiment = new expClass()

            experiment.renderDesc("#desc")

            experiment.renderOptions("#experimentOptions")

            experiment.createScene();

            // run the render loop
            experiment.engine.runRenderLoop(function(){
                setTimeout(() => experiment.scene.render(), experiment.expSpeed)
            });
        })
    })
}

function getExperimentByQueryParam() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries())
    
    if(!params.experiment) {
        error("Please set ?experiment to a valid experiment or click one of the below experiments")
    }
    else {
        getExperiment(params.experiment)
    }
}

function error(string, title) {
    if(title) {
        document.title = title
    }
    else {
        document.title = "Bad Request"
    }
    document.write(`<p id='error'>${string}</p>`)
}

function listExperiments() {
    eList = document.querySelector("#experiment-list")
    console.log(eList)
    fetch(serverHost + infoFile)
    .then(r => r.json())
    .then(r => {
        console.log(r)
        keys = Object.keys(r)
        console.log("Experiment List: " + keys)
        html = "Experiment List:<br><br>"
        keys.forEach((v) => {
            html += `<a href='#' onclick='getExperiment("${v}")'>${r[v].title}</a><br>`
        })
        eList.innerHTML = html
    })
}