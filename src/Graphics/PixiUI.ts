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

        document.getElementById('tool-hill').addEventListener('click', (e) => this._tool = 'hill');
        document.getElementById('tool-cliff').addEventListener('click', (e) => this._tool = 'cliff');
        document.getElementById('tool-tree').addEventListener('click', (e) => this._tool = 'tree');
        document.getElementById('tool-dirt').addEventListener('click', (e) => this._tool = 'dirt');

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