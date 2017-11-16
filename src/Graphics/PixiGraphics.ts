import grassJSON from './tiles/grass.json';
import dirtJSON from './tiles/dirt.json';
import cliffJSON from './cliff.json';
import palmPNG from './palm01.png';


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
        document.body.appendChild(this.app.view);
        this.app.ticker.speed = 1;

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        PIXI.loader.add([
            grassJSON, 
            dirtJSON, 
            cliffJSON, 
            palmPNG,
        ]).load(() => {
            this.camera = new PIXI.Container();
            this.app.stage.addChild(this.camera);
            initCallback();

            this.app.ticker.add(() => {
                updateCallback(this.app.ticker.deltaTime);
            });
            
        });

        // window.addEventListener('resize', (event) => {
        //     this.app.renderer.resize(window.innerWidth, window.innerHeight);
        // });
    }

}