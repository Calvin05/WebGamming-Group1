module scenes
{
    export class End extends objects.Scene
    {
        // PRIVATE INSTANCE MEMBERS
        private _background: objects.Background;
        private endLabel:objects.Label;
        private _backButton:objects.Button;
        private _scoreBoard: managers.ScoreBoard;
        // private  _ocean:objects.Ocean;

        // PUBLIC PROPERTIES

        // CONSTRUCTOR
        constructor()
        {
            super();

            // initialization
            this.endLabel = new objects.Label();
            this._background = new objects.Background();
            this._backButton = new objects.Button();
            this._scoreBoard  = new managers.ScoreBoard;
            // this._ocean = new objects.Ocean();

            this.Start();
        }

        // PUBLIC METHODS

        public Start(): void 
        {
            this._background = new objects.Background(config.Game.ASSETS.getResult("background"));
            if(config.Game.STATUS == true)
            {
                this.endLabel = new objects.Label("SEE YOU AGAIN", "80px","Impact, Charcoal, sans-serif", "#ffffff", 320, 300, true);
            }
            else if(config.Game.ENDSCENE == true)
            {
                this.endLabel = new objects.Label("YOU ARE HERO", "80px","Impact, Charcoal, sans-serif", "#ffffff", 320, 300, true);
                config.Game.ENDSCENE = false;
            }
            else{
                this.endLabel = new objects.Label("GAME OVER", "80px","Impact, Charcoal, sans-serif", "#ffffff", 320, 300, true);
            }
            
            this._backButton = new objects.Button(config.Game.ASSETS.getResult("returnButton"), 320, 500, true);
            managers.Collision._checkHighScore;
            this._scoreBoard = new managers.ScoreBoard();
            this._scoreBoard.HighScore = config.Game.HIGH_SCORE;
           
            this.Main();
        }        
        
        public Update(): void 
        {
            this._background.Update();
        }
        
        public Main(): void {
            // this.addChild(this._ocean);
            this.addChild(this._background);
            this.addChild(this.endLabel);
            this.addChild(this._backButton);
    
            this._backButton.on("click", function() {
                config.Game.SCORE_BOARD.Lives = 3;
                managers.Collision.count = 0;
                config.Game.SCENE_STATE = scenes.State.PLAY;
                config.Game.SCORE_BOARD.Score = 0;
                config.Game.ANTIBOOMITEM = 0;
                //Play.point = 0;
                createjs.Sound.stop();
            });
            this.addChild(this._scoreBoard.HighScoreLabel);
        }

        
    }
}