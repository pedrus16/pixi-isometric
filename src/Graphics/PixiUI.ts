import { PixiGraphics } from './PixiGraphics';
import { Input } from '../Input';

import '../style.css';

export class PixiUI {

    private _graphics: PixiGraphics;
    private _input: Input;
    private _ui: any;
    private _tool: 'hill' | 'cliff' | 'tree' | 'dirt';
    
    public mouseCursor: any;
    public diamond: any;


    constructor(graphics: PixiGraphics, input: Input) {
        this._graphics = graphics;
        this._input = input;
        this._ui = new PIXI.Container();
        this._tool = 'hill';

        const hillButton = new PIXI.Text('Hill', {
            fontFamily : 'Arial', 
            fontSize: 32, 
            fill : 0xFFFFFF, 
            align : 'left'
        });
        hillButton.interactive = true;
        hillButton.buttonMode = true;
        hillButton.on('click', () => {
            this._tool = 'hill';
            hillButton.style.fontWeight = 'bold';
            cliffButton.style.fontWeight = 'normal';
            treeButton.style.fontWeight = 'normal';
            dirtButton.style.fontWeight = 'normal';
        });
        this._ui.addChild(hillButton);

        const cliffButton = new PIXI.Text('Cliff', {
            fontFamily : 'Arial', 
            fontSize: 32, 
            fill : 0xFFFFFF, 
            align : 'left'
        });
        cliffButton.interactive = true;
        cliffButton.buttonMode = true;
        cliffButton.y = 32;
        cliffButton.on('click', () => {
            this._tool = 'cliff';
            cliffButton.style.fontWeight = 'bold';
            hillButton.style.fontWeight = 'normal';
            treeButton.style.fontWeight = 'normal';
            dirtButton.style.fontWeight = 'normal';
        });
        this._ui.addChild(cliffButton);

        const treeButton = new PIXI.Text('Tree', {
            fontFamily : 'Arial', 
            fontSize: 32, 
            fill : 0xFFFFFF, 
            align : 'left'
        });
        treeButton.interactive = true;
        treeButton.buttonMode = true;
        treeButton.y = 64;
        treeButton.on('click', () => {
            this._tool = 'tree';
            treeButton.style.fontWeight = 'bold';
            hillButton.style.fontWeight = 'normal';
            cliffButton.style.fontWeight = 'normal';
            dirtButton.style.fontWeight = 'normal';
        });
        this._ui.addChild(treeButton);

        const dirtButton = new PIXI.Text('Dirt', {
            fontFamily : 'Arial', 
            fontSize: 32, 
            fill : 0xFFFFFF, 
            align : 'left'
        });
        dirtButton.interactive = true;
        dirtButton.buttonMode = true;
        dirtButton.y = 64+32;
        dirtButton.on('click', () => {
            this._tool = 'dirt';
            dirtButton.style.fontWeight = 'bold';
            hillButton.style.fontWeight = 'normal';
            cliffButton.style.fontWeight = 'normal';
            treeButton.style.fontWeight = 'normal';
        });
        this._ui.addChild(dirtButton);

        hillButton.style.fontWeight = 'bold';
        cliffButton.style.fontWeight = 'normal';
        treeButton.style.fontWeight = 'normal';
        dirtButton.style.fontWeight = 'normal';

        this._graphics.app.stage.addChild(this._ui);

        this.mouseCursor = new PIXI.Graphics();
        this.mouseCursor.lineStyle(2, 0xFFFFFF, 1);
        this.diamond = new PIXI.Polygon([0, 0, 32, 16, 0, 32, -32, 16, 0, 0]);
        this.mouseCursor.drawShape(this.diamond);
        this._ui.addChild(this.mouseCursor);
    }

    update(dt: number) {
    }

    get tool(): string { return this._tool; }

}