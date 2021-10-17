if(window.location.protocol == "file:") {
    var serverHost = "http://localhost:8000"
}
else {
    var serverHost = window.location.protocol + "//" + window.location.host
}

const version = 1

const infoFile = "/autogen/info.min.json?v=" + version

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

        getScriptWithCache(name, serverHost + "/" + r[name].subject + "/" + r[name].path, function(textStatus, code ) {
            console.log("Experiment was loaded with status of: " + textStatus + ". Code: " + code)

            document.querySelector("#experimentOptions").textContent = ""

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