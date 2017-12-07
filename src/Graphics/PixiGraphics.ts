import grassJSON from './tiles/grass/grass.json';
import dirtJSON from './tiles/dirt.json';
import cliffJSON from './cliff.json';
import water_transitionJSON from './tiles/water/water.json';
// import water_transitionJSON from './tiles/grass_water/grass_water.json';
import palmPNG from './palm01.png';
import manPNG from './man.png';


export class PixiGraphics {

    public app: any;
    public camera: any;

    constructor(initCallback: Function, updateCallback: Function) {
        var type = "WebGL";
        if (!PIXI.utils.isWebGLSupported()) {
            type = "canvas";
        }
        PIXI.utils.sayHello(type);

        this.app = new PIXI.Application({
            width: 1024,
            height: 768
        });
        this.app.renderer.autoResize = true;
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        document.getElementById('viewport').appendChild(this.app.view);
        this.app.ticker.speed = 1;

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        PIXI.loader.add([
            grassJSON, 
            dirtJSON, 
            cliffJSON, 
            palmPNG,
            manPNG,
            water_transitionJSON,
        ]).load(() => {
            this.camera = new PIXI.Container();
            this.app.stage.addChild(this.camera);
            initCallback();

            this.app.ticker.add((delta: number) => {
                updateCallback(delta);
            });
            
        });

        // window.addEventListener('resize', (event) => {
        //     this.app.renderer.resize(window.innerWidth, window.innerHeight);
        // });
    }

}