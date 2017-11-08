export interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Renderable {
    draw: any;
}

export interface Container {
    x: number;
    y: number;
    z: number;
    scale: number;
    sort(): void;
    add(element: Sprite | Container): void;
    remove(element: Sprite | Container): void;
    onClick(callback: Function): void;
}

export interface Sprite {
    x: number;
    y: number;
    z: number;
    texture: string;
    width: number;
    height: number;
    render: boolean;
    onClick(callback: Function): void;
}

export interface Graphics {
    app: any;
    initialize(updateCallback: Function): void;
    load(file: string, callback?: Function): void;
    add(element: Sprite | Container): void;
    createSprite(texture: string, rectangle?: Rectangle): Sprite;
    createContainer(): Container;
    createParticleContainer(): Container;
    createCircle(x: number, y: number, width: number, height: number): Container;
    screenWidth: number;
    screenHeight: number;
}