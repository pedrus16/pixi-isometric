import { PixiGraphics } from './PixiGraphics';

import './style.css';

export class PixiUI {

    private _graphics: PixiGraphics;
    private _ui: any;

    constructor(graphics: PixiGraphics) {
        this._graphics = graphics;
        this._ui = new PIXI.Container();

        const hillButton = new PIXI.Text('Hill', {
            fontFamily : 'm5x7', 
            fontSize: 16, 
            fill : 0xFFFFFF, 
            align : 'center'
        });
        hillButton.interactive = true;
        hillButton.buttonMode = true;
        hillButton.on('click', () => {
            
        });
        this._ui.addChild(hillButton);

        const cliffButton = new PIXI.Text('Cliff', {
            fontFamily : 'm5x7', 
            fontSize: 16, 
            fill : 0xFFFFFF, 
            align : 'center'
        });
        cliffButton.interactive = true;
        cliffButton.buttonMode = true;
        cliffButton.y = 16;
        this._ui.addChild(cliffButton);

        this._graphics.app.stage.addChild(this._ui);
    }

}