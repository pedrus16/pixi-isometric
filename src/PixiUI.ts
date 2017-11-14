import { PixiGraphics } from './PixiGraphics';

import './style.css';

export class PixiUI {

    private _graphics: PixiGraphics;
    private _ui: any;
    private _tool: 'hill' | 'cliff';


    constructor(graphics: PixiGraphics) {
        this._graphics = graphics;
        this._ui = new PIXI.Container();
        this._tool = 'hill';

        const hillButton = new PIXI.Text('Hill', {
            fontFamily : 'm5x7', 
            fontSize: 48, 
            fill : 0xFFFFFF, 
            align : 'left'
        });
        hillButton.interactive = true;
        hillButton.buttonMode = true;
        hillButton.on('click', () => {
            this._tool = 'hill';
            hillButton.style.fontWeight = 'bold';
            cliffButton.style.fontWeight = 'normal';
        });
        this._ui.addChild(hillButton);

        const cliffButton = new PIXI.Text('Cliff', {
            fontFamily : 'm5x7', 
            fontSize: 48, 
            fill : 0xFFFFFF, 
            align : 'left'
        });
        cliffButton.interactive = true;
        cliffButton.buttonMode = true;
        cliffButton.y = 48;
        cliffButton.on('click', () => {
            this._tool = 'cliff';
            cliffButton.style.fontWeight = 'bold';
            hillButton.style.fontWeight = 'normal';
        });
        this._ui.addChild(cliffButton);
        hillButton.style.fontWeight = 'bold';
        cliffButton.style.fontWeight = 'normal';

        this._graphics.app.stage.addChild(this._ui);
    }

    get tool(): string { return this._tool; }

}