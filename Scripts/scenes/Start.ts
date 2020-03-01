module scenes
{
    export class Start extends objects.Scene
    {
        // PRIVATE INSTANCE MEMBERS
        private _startButton:objects.Button;
        private _background: objects.Background;
        private _firstSceen: objects.Image;

        // PUBLIC PROPERTIES

        // CONSTRUCTOR
        constructor()
        {
            super();
            // initialization
            this._startButton = new objects.Button();
            this._background = new objects.Background();
            this._firstSceen = new objects.Image();

            this.Start();
        }

        // PUBLIC METHODS

        public Start(): void 
        {
            

            this._background = new objects.Background();
            this._firstSceen = new objects.Image(config.Game.ASSETS.getResult("firstScreen"), 320, 240, true);
            this._startButton = new objects.Button(config.Game.ASSETS.getResult("startButton"), 320, 400, true);
            createjs.Sound.play("startSound");
            this.Main();
        }        
        
        public Update(): void 
        {
            this._background.Update();
        }
        
        public Main(): void {
            this.addChild(this._background);
            this.addChild(this._firstSceen);
            this.addChild(this._startButton);
    
            this._startButton.on("click", function() {
               config.Game.SCENE_STATE = scenes.State.PLAY;
               createjs.Sound.stop();
            });
        }

        
    }
}