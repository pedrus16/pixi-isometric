import { Graphics, Rectangle, Sprite } from './Graphics';


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
    }

    load(file: string, callback?: Function): void {
        PIXI.loader.add(file).load(callback);
    }

    addSprite(sprite: PixiSprite) {
        this.app.stage.addChild(sprite.pixiSprite);
    }

    createSprite(texture: string, rectangle?: Rectangle): PixiSprite {
        return new PixiSprite(texture, rectangle);
    }
}