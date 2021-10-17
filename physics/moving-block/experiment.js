class MovingBlock {
    constructor() {
        this.canvas = document.getElementById("renderCanvas")
        this.engine = new BABYLON.Engine(this.canvas, true, {preserveDrawingBuffer: true, stencil: true})
        this.scene = new BABYLON.Scene(this.engine);
        this.velocity = 0
        this.expSpeed = 0.1
    }

    createScene() {
        this.camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0));
        this.camera.attachControl(this.canvas, true);
    
        this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0));
    
        this.box = BABYLON.MeshBuilder.CreateBox("box", {});
    }

    renderDesc(id) {
        // Renders experiment description
        var text = document.querySelector(id)
        text.innerHTML = "Box at rest. Drag slider to change uniform velocity of the object"
    }

    renderOptions(id) {
        // Renders options/sliders
        jQuery("<p />", {
            html: "Velocity: <span id='velocity-curr'>0</span>"
        })
            .appendTo(id)

        var experimentOptions = jQuery("<div>")
            .attr("id", "slider")
            .appendTo(id)

        experimentOptions.slider({
            max: 10,
            min: -10,
            step: 0.1,
            stop: (event, ui) => {
                jQuery("#velocity-curr").html(ui.value.toString())
                this.velocity = ui.value
                this.updateScene()
            }
        })
    }

    updateScene() {
        // Updates the scene
        if(this.velocity) {
            this.box.position.x = this.box.position.x + this.velocity*0.001;
            if(document.visibilityState == "visible") {
                setTimeout(() => this.updateScene(), this.expSpeed)
            }    
        }
    }
}