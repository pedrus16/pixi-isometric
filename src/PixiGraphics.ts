import { Camera, Graphics, Rectangle, Sprite } from './Graphics';

export class PixiCamera extends Camera {

    private _container: any;

    constructor() {
        super();
        this._container = new PIXI.Container();
    }

    get x() { return this.container.x; }
    set x(x: number) { this.container.x = x; }

    get y() { return this.container.y; }
    set y(y: number) { this.container.y = y; }

    get container(): any { return this._container; }

    addSprites(sprites: PixiSprite[]) {
        const pixiSprites = sprites.map((sprite) => sprite.pixiSprite);
        if (!pixiSprites || !pixiSprites.length) { return; }
        this._container.addChild(...pixiSprites);
    }

    get scale(): number { return this._container.scale.x; }
    set scale(scale: number) {
        this._container.scale.x = scale;
        this._container.scale.y = scale;
    }

}

export class PixiSprite extends Sprite {

    private _sprite: any;

    constructor(texture: string, rectangle?: Rectangle) {
        super(texture, rectangle);
        const pixiTexture = PIXI.utils.TextureCache[texture];
        if (rectangle) {
            pixiTexture.frame = new PIXI.Rectangle(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        }
        this._sprite = new PIXI.Sprite(pixiTexture);
    }

    set x(x: number) {
        this._x = x;
        this._sprite.x = x;
    }
    get x(): number { return this._x; }

    set y(y: number) {
        this._y = y;
        this._sprite.y = y;
    }
    get y(): number { return this._y; }

    set texture(texture: string) {
        this._texture = texture;
        this._sprite.texture = PIXI.Texture.fromFrame(texture);
    }

    get height(): number { return this._sprite.height; }
    get width(): number { return this._sprite.width; }

    get pixiSprite(): any { return this._sprite; }

}

export class PixiGraphics implements Graphics {

    private app: any;
    private camera: any;

    private fpsDisplay: any;

    initialize(updateCallback: Function) {
        var type = "WebGL";
        if (!PIXI.utils.isWebGLSupported()) {
            type = "canvas";
        }
        PIXI.utils.sayHello(type);

        this.app = new PIXI.Application();
        document.body.appendChild(this.app.view);
        this.app.ticker.add(() => {
            updateCallback(this.app.ticker.deltaTime);
        });
        this.camera = new PIXI.Container();
        this.app.stage.addChild(this.camera);
    }

    load(file: string, callback?: Function): void {
        PIXI.loader.add(file).load(callback);
    }

    addSprite(sprite: PixiSprite) {
        this.camera.addChild(sprite.pixiSprite);
    }

    createSprite(texture: string, rectangle?: Rectangle): PixiSprite {
        return new PixiSprite(texture, rectangle);
    }

    addCamera(camera: PixiCamera) {
        this.app.stage.addChild(camera.container);
    }

    createCamera(): Camera {
        return new PixiCamera();
    }

    set cameraPos(coord: [number, number]) {
        this.camera.x = coord[0];
        this.camera.y = coord[1];
    }
    get cameraPos(): [number, number] {
        return [this.camera.x, this.camera.y];
    }
}