import { PixiGraphics } from './PixiGraphics';

import './style.css';

export class PixiUI {

    private _graphics: PixiGraphics;
    private _ui: any;

    constructor(graphics: PixiGraphics) {
        this._graphics = graphics;
        this._ui = new PIXI.Container();
        setTimeout(() => {
            const text = new PIXI.Text('Hello world', {
                fontFamily : 'm5x7', 
                fontSize: 24, 
                fill : 0xFFFFFF, 
                align : 'center'
            });
            text.interactive = true;
            text.buttonMode = true;
            this._ui.addChild(text);
        }, 1000);
        this._graphics.app.stage.addChild(this._ui);
    }

}