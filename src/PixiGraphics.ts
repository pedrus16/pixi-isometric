import { Container, Graphics, Rectangle, Sprite } from './Graphics';


export interface Renderable {
    renderable: any;
}


export class PixiContainer implements Container, Renderable {

    private _container: any;

    constructor(particle?: boolean) {
        if (particle) {
            this._container = new PIXI.particles.ParticleContainer(100000);
        }
        else {
            this._container = new PIXI.Container();
        }
    }

    get x() { return this._container.x; }
    set x(x: number) { this._container.x = x; }

    get y() { return this._container.y; }
    set y(y: number) { this._container.y = y; }

    get scale(): number { return this._container.scale.x; }
    set scale(scale: number) {
        this._container.scale.x = scale;
        this._container.scale.y = scale;
    }

    get renderable(): any { return this._container; }

    add(element: PixiSprite | PixiContainer) {
        this._container.addChild(element.renderable);
    }

    sort(): void {
        this._container.children.sort((a: any, b: any) => {
            if (a.z > b.z) { return 1; }
            if (a.z < b.z) { return -1; }
            if (a.y > b.y) { return 1; }
            if (a.y < b.y) { return -1; }
            if (a.x > b.x) { return 1; }
            if (a.x < b.x) { return -1; }
            return 0;
        });
    }

    remove(child: PixiSprite | PixiContainer) {
        this._container.removeChild(child.renderable);
    }
}


export class PixiSprite implements Sprite, Renderable {

    private _x: number = 0;
    private _y: number = 0;
    private _z: number = 0;
    private _texture: string;
    private _sprite: any;

    constructor(texture: string, rectangle?: Rectangle) {
        const pixiTexture = PIXI.utils.TextureCache[texture];
        if (rectangle) {
            pixiTexture.frame = new PIXI.Rectangle(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        }
        this._sprite = new PIXI.Sprite(pixiTexture);
        this._sprite.interactive = true;
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

    set z(z: number) {
        this._z = z;
        this._sprite.z = z;
    }
    get z(): number { return this._z; }

    set texture(texture: string) {
        this._texture = texture;
        this._sprite.texture = PIXI.utils.TextureCache[texture];
        // this._sprite.texture = PIXI.Texture.fromFrame(texture);
    }

    get height(): number { return this._sprite.height; }
    get width(): number { return this._sprite.width; }

    get renderable(): any { return this._sprite; }

    get render(): boolean { return this._sprite.visible; }
    set render(render: boolean) { this._sprite.visible = render; }

    onClick(callback: Function): void {
        this._sprite.on('pointerdown', callback);
    }

}


export class PixiGraphics implements Graphics {

    private app: any;

    initialize(updateCallback: Function) {
        var type = "WebGL";
        if (!PIXI.utils.isWebGLSupported()) {
            type = "canvas";
        }
        PIXI.utils.sayHello(type);

        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight
        });
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        document.body.appendChild(this.app.view);
        this.app.ticker.speed = 1;
        this.app.ticker.add(() => {
            updateCallback(this.app.ticker.deltaTime);
        });
    }

    load(file: string, callback?: Function): void {
        PIXI.loader.add(file).load(callback);
    }

    add(element: PixiSprite | PixiContainer) {
        this.app.stage.addChild(element.renderable);
    }

    createSprite(texture: string, rectangle?: Rectangle): PixiSprite {
        return new PixiSprite(texture, rectangle);
    }

    createContainer(): PixiContainer {
        return new PixiContainer();
    }

    createParticleContainer(): PixiContainer {
        return new PixiContainer(true);
    }

    get screenWidth(): number { return this.app.screen.width; }
    get screenHeight(): number { return this.app.screen.height; }
}