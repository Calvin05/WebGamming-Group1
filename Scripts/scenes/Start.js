"use strict";
var scenes;
(function (scenes) {
    class Start extends objects.Scene {
        // PUBLIC PROPERTIES
        // CONSTRUCTOR
        constructor() {
            super();
            // initialization
            this._startButton = new objects.Button();
            this._background = new objects.Background();
            this._firstSceen = new objects.Image();
            this.Start();
        }
        // PUBLIC METHODS
        Start() {
            this._background = new objects.Background();
            this._firstSceen = new objects.Image(config.Game.ASSETS.getResult("firstScreen"), 320, 400, true);
            this._startButton = new objects.Button(config.Game.ASSETS.getResult("startButton"), 320, 580, true);
            createjs.Sound.play("startSound");
            this.Main();
        }
        Update() {
            this._background.Update();
        }
        Main() {
            this.addChild(this._background);
            this.addChild(this._firstSceen);
            this.addChild(this._startButton);
            this._startButton.on("click", function () {
                config.Game.SCENE_STATE = scenes.State.PLAY;
                createjs.Sound.stop();
            });
        }
    }
    scenes.Start = Start;
})(scenes || (scenes = {}));
//# sourceMappingURL=Start.js.map