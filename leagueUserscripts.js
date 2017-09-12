(function (tagpro) {
    $(document).ready(function () {
        GM_getValue = function (key, def) {
            Cookies.get(key) || def;
        };
        GM_setValue = function (key, value) {
            return Cookies.set(key, value);
        };
        GM_deleteValue = function (key) {
            return Cookies.remove(key);
        };
		
		// ==UserScript==
// @name          TagPro Live Player Position
// @version       0.5
// @include       http://*.koalabeast.com:*
// @include       http://tagpro-*.koalabeast.com:*
// @include       http://*.jukejuice.com:*
// @include       http://*.newcompte.fr:*
// @grant         none
// ==/UserScript==

if ((window.sessionStorage.toggles && JSON.parse(window.sessionStorage.toggles).liveplayerposition)){
(function init(initTime) {
    if (typeof tagpro === "undefined" || !tagpro.playerId) {
        if (Date.now() - initTime > 10000) return;
        return setTimeout(init, 100, initTime);
    }
    setTimeout(startFunction, 3000);
})(Date.now());

function startFunction() {
    var tr = tagpro.renderer;
    var upsp = tr.updatePlayerSpritePosition;

    tr.render = function() {
        requestAnimationFrame(tr.render);
        tagpro.world.update();
        tr.updateGraphics();
        tagpro.ui.update();
        tr.renderer.render(tr.stage);
        tr.measurePerformance();
        tr.lastFrameTime=performance.now();
    };

    Box2D.Dynamics.b2Body.prototype.GetPosition = function() {
        if (!this.player || !this.player.id) {
            return this.m_xf.position;
        }
        if (!tagpro.players[this.player.id].pos) {
            tagpro.players[this.player.id].pos = this.m_xf.position;
        }
        return this.m_xf.position;
    };

    tr.updatePlayerSpritePosition = function(player) {
        upsp.apply(this, arguments);
        var position = player.pos || {x: player.x / 100, y: player.y / 100};
        player.sprite.x = position.x * 100;
        player.sprite.y = position.y * 100;
    };

    tr.centerContainerToPoint = function(x, y) {
        var r = tr.options.disableViewportScaling ? 1 : (this.vpHeight / tr.canvas_height).toFixed(2);
        if (tagpro.viewport.followPlayer) {
            var self = tagpro.players[tagpro.playerId];
            var position = self.pos || {x: self.x / 100, y: self.y / 100};
            x = position.x * 100 + 20;
            y = position.y * 100 + 20;
        }
        if (x <= -980 && y <= -980) {
            return;
        }
        tr.gameContainer.x = this.vpWidth / 2 - x / tagpro.zoom * r;
        tr.gameContainer.y = this.vpHeight / 2 - y / tagpro.zoom * r;
    };

    tr.updateCameraPosition = function() {
        tr.centerContainerToPoint();
    };
}
}


	// ==UserScript==
// @name           TagPro Milliseconds
// @version        2.2.3
// @description    Display tenths of seconds on the tagpro clock and add outlines to the score
// @include        http://tagpro-*.koalabeast.com:*
// @include        http://tangent.jukejuice.com:*
// @include        http://*.newcompte.fr:*
// @author         Some Ball -1
// @grant          none
// ==/UserScript==

if ((window.sessionStorage.toggles && JSON.parse(window.sessionStorage.toggles).milli)){
tagpro.ready(function() {
    
    var startTime = 15; //time in seconds to begin showing fractional seconds, set to 0 to turn off
    var scoreStroke = true; //true or false, whether or not to show score outline
    //////////////////////////////////////////////////////////////////////////

    var end = false;
    function outlineScore()
    {
        if(tagpro.renderer.layers.ui.children.length>1) //timer put in first so >1
        {
            tagpro.renderer.layers.ui.removeChild(tagpro.ui.sprites.redScore)
            tagpro.renderer.layers.ui.removeChild(tagpro.ui.sprites.blueScore)
        }
        tagpro.ui.sprites.redScore = new PIXI.Text(tagpro.score.r ? tagpro.score.r.toString() : "0", {
            fill: "#FF0000",
            stroke: "black",
            strokeThickness: scoreStroke*3,
            font: "bold 40pt Arial"
        }), tagpro.ui.sprites.blueScore = new PIXI.Text(tagpro.score.b ? tagpro.score.b.toString() : "0", {
            fill: "#0000FF",
            stroke: "black",
            strokeThickness: scoreStroke*3,
            font: "bold 40pt Arial"
        });
        tagpro.ui.sprites.redScore.alpha = .5, tagpro.ui.sprites.blueScore.alpha = .5, tagpro.ui.sprites.redScore.anchor.x = 1, tagpro.ui.sprites.blueScore.anchor.x = 0, tagpro.renderer.layers.ui.addChild(tagpro.ui.sprites.redScore), tagpro.renderer.layers.ui.addChild(tagpro.ui.sprites.blueScore);
    }
    if(!tagpro.renderer.layers.ui)
    {
        var lay = tagpro.renderer.createLayers;
        tagpro.renderer.createLayers = function() {
            lay();
            outlineScore();
        }
    }
    else
    {
        outlineScore();
    }
    tagpro.socket.on('end',function() {
        end = (new Date).getTime();
    })
    tagpro.ui.timer = function(e, t, n, r) { //replace r with custom time
        var i = tagpro.ui.sprites.timer;
        if(!i)
        {
            i = tagpro.ui.sprites.timer = new PIXI.Text("", {
                fill: "#FFFFFF",
                strokeThickness: 4,
                stroke: "#000000",
                font: "bold 30pt Arial"
            }), i.alpha = .5, i.anchor.x = .5, e.addChild(tagpro.ui.sprites.timer);
        }
        
        var time = tagpro.gameEndsAt - (end || (new Date).getTime()), //use current time or whenever game ended
            hour = time/6e4 > 60 ? Math.floor(time / 6e4 / 60) + ":" : "", //if more than 60 min, add hour
            min = "0" + Math.floor((time / 6e4) % 60),
            sec = "0" + Math.floor(time % 6e4 / 1e3); //needs to be Math.ceil on newcompte's server for pre-game (tagpro.state===3), idk why
        if(min < 0) min = "00"; if(sec < 0) sec = "00";
        
        var clock = hour + min.substr(-2) + ":" + sec.substr(-2); //should match r argument except if >60 min
        if(time/1000<startTime) //not <= incase set to 0
        {
            sec = "0" + Math.floor(time % 6e4 / 1e2)/10 + ".0"; //add .0 in case it's whole number;
            clock = hour + min.substr(-2) + ":" + sec.substr(Math.ceil((sec.length-7)/2)*-2-6,4); //quick formula to handle either (0X.0 || 0XX.0) or (0X.X.0 || 0XX.X.0)
            if(time<=0)
                clock = '00:00.0'; //because the clock keeps running sometimes
        }
        if (i.text != clock)
            i.setText(clock);
    }
});
}

	// ==UserScript==
// @name          TagPro Team Stats
// @namespace     http://www.reddit.com/user/thevdude/
// @description   Adds team stats to score boards
// @include       http://tagpro-*.koalabeast.com:*
// @include       http://tangent.jukejuice.com:*
// @include       http://maptest.newcompte.fr:*
// @include       http://justletme.be:*
// @copyright     2014+ thevdude
// @author        thevdude, chalksy (edited to include new stats)
// @version       1.1
// ==/UserScript==

if ((window.sessionStorage.toggles && JSON.parse(window.sessionStorage.toggles).teamstats)){
function updateTeamStats() {
  tagpro.redStats = {
    "s-captures": 0,
    "s-drops": 0,
    "s-grabs": 0,
    "s-hold": 0,
    "s-pops": 0,
    "s-powerups": 0,
    "s-prevent": 0,
    "s-returns": 0,
    "s-support": 0,
    "s-tags": 0,
    "score": 0,
    "points": 0
  }
  
  tagpro.blueStats = {
    "s-captures": 0,
    "s-drops": 0,
    "s-grabs": 0,
    "s-hold": 0,
    "s-pops": 0,
    "s-powerups": 0,
    "s-prevent": 0,
    "s-returns": 0,
    "s-support": 0,
    "s-tags": 0,
    "score": 0,
    "points": 0
  }
  
  rS = tagpro.redStats;
  bS = tagpro.blueStats;
  
  for (x in tagpro.players) {
    tpP = tagpro.players[x];
  
    if ( tpP.team == 1 ) {
      rS["s-captures"] += tpP["s-captures"]
      rS["s-drops"] += tpP["s-drops"]
      rS["s-grabs"] += tpP["s-grabs"]
      rS["s-hold"] += tpP["s-hold"]
      rS["s-pops"] += tpP["s-pops"]
      rS["s-powerups"] += tpP["s-powerups"]
      rS["s-prevent"] += tpP["s-prevent"]
      rS["s-returns"] += tpP["s-returns"]
      rS["s-support"] += tpP["s-support"]
      rS["s-tags"] += tpP["s-tags"]
      rS["score"] += tpP["score"]
      if(tpP["points"]) rS["points"] += tpP["points"]
    } else if (tpP.team == 2 ) {
      bS["s-captures"] += tpP["s-captures"]
      bS["s-drops"] += tpP["s-drops"]
      bS["s-grabs"] += tpP["s-grabs"]
      bS["s-hold"] += tpP["s-hold"]
      bS["s-pops"] += tpP["s-pops"]
      bS["s-powerups"] += tpP["s-powerups"]
      bS["s-prevent"] += tpP["s-prevent"]
      bS["s-returns"] += tpP["s-returns"]
      bS["s-support"] += tpP["s-support"]
      bS["s-tags"] += tpP["s-tags"]
      bS["score"] += tpP["score"]
      if(tpP["points"]) bS["points"] += tpP["points"]
    }
  }
  var rStable = $('.redStats').find("td");
  var bStable = $('.blueStats').find("td");
  rStable.eq(1).text(rS.score), 
  rStable.eq(2).text(rS["s-tags"]), 
  rStable.eq(3).text(rS["s-pops"]), 
  rStable.eq(4).text(rS["s-grabs"]), 
  rStable.eq(5).text(rS["s-drops"]), 
  rStable.eq(6).text(tagpro.helpers.timeFromSeconds(rS["s-hold"], !0)), 
  rStable.eq(7).text(rS["s-captures"]), 
  rStable.eq(8).text(tagpro.helpers.timeFromSeconds(rS["s-prevent"], !0)), 
  rStable.eq(9).text(rS["s-returns"]), 
  rStable.eq(10).text(rS["s-support"]), 
  rStable.eq(11).text(rS["points"] == 0 ? "-" : rS.points),
  rStable.eq(12).text(rS["s-powerups"]);

  bStable.eq(1).text(bS.score), 
  bStable.eq(2).text(bS["s-tags"]), 
  bStable.eq(3).text(bS["s-pops"]), 
  bStable.eq(4).text(bS["s-grabs"]), 
  bStable.eq(5).text(bS["s-drops"]), 
  bStable.eq(6).text(tagpro.helpers.timeFromSeconds(bS["s-hold"], !0)), 
  bStable.eq(7).text(bS["s-captures"]), 
  bStable.eq(8).text(tagpro.helpers.timeFromSeconds(bS["s-prevent"], !0)), 
  bStable.eq(9).text(bS["s-returns"]), 
  bStable.eq(10).text(bS["s-support"]), 
  bStable.eq(11).text(bS["points"] == 0 ? "-" : bS.points),
  bStable.eq(12).text(bS["s-powerups"]);
}

var teamStatsTable = '<table><tbody><tr><th>Team</th><th>Score</th><th>Tags</th><th>Popped</th><th>Grabs</th><th>Drops</th><th>Hold</th><th>Captures</th><th>Prevent</th><th>Returns</th><th>Support</th><th>Rank Pts</th><th>Powerups</th></tr></tbody><tbody class="teamStats"><tr class="redStats"><td><span class="scoreName" style="color: #FFB5BD;">RED</span></td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>00:00</td><td>0</td><td>00:00</td><td>0</td><td>0</td><td>-</td><td>0</td></tr><tr class="blueStats"><td><span class="scoreName" style="color: #CFCFFF;">BLUE</span></td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>00:00</td><td>0</td><td>00:00</td><td>0</td><td>0</td><td>-</td><td>0</td></tr></tbody></table>'

$('#options').find('table').after(teamStatsTable);
$('.redStats').css('background-color', 'rgba(180, 85, 85, .5)');
$('.blueStats').css('background-color', 'rgba(85, 85, 180, .5)');

setInterval(updateTeamStats, 1000);
}

	// ==UserScript==
// @name          tagpro macros competitive server
// @namespace     http://www.reddit.com/user/contact_lens_linux/
// @description   Help your team with quick chat macros.
// @include       http://*.koalabeast.com:*
// @include       http://tangent.jukejuice.com:*
// @include       http://*.newcompte.fr:*
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @author        steppin, Watball
// @version       0.4
// ==/UserScript==

if ((window.sessionStorage.toggles && JSON.parse(window.sessionStorage.toggles).macros)){
(function() {
  function contentEval(source) {
    // Check for function input.
    if ('function' == typeof source) {
      // Execute this function with no arguments, by adding parentheses.
      // One set around the function, required for valid syntax, and a
      // second empty set calls the surrounded function.
      source = '(' + source + ')();';
    }
 
    // Create a script node holding this  source code.
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = source;
 
    // Insert the script node into the page, so it will run, and immediately
    // remove it to clean up.
    document.body.appendChild(script);
    document.body.removeChild(script);
  }
 
  function actualScript() {
    var macros = {};
    if (window.sessionStorage.macros) {
        macros = JSON.parse(window.sessionStorage.macros);
    }
 
    // Game bindings overriding adapted from JohnnyPopcorn's NeoMacro https://gist.github.com/JohnnyPopcorn/8150909
    var handlerbtn = $('#macrohandlerbutton');
    handlerbtn.keydown(keydownHandler)
              .keyup(keyupHandler);
    handlerbtn.focus();
 
    $(document).keydown(documentKeydown);
    function documentKeydown(event) {
      if (!tagpro.disableControls) {
        handlerbtn.focus(); // The handler button should be always focused
      }
    }
 
    function keydownHandler(event) {
      var code = event.keyCode || event.which;
      if (code in macros && !tagpro.disableControls) {
        chat(macros[code]);
        event.preventDefault();
        event.stopPropagation();
        //console.log(macros[code]);
      }
    }
 
    function keyupHandler(event) {
      if (event.keyCode in macros && !tagpro.disableControls) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
 
    var lastMessage = 0;
    var active = false;
    function chat(chatMessage) {
      var limit = 500 + 10;
      var now = new Date();
      var timeDiff = now - lastMessage;
      if (timeDiff > limit) {
          tagpro.socket.emit("chat", chatMessage);
          lastMessage = new Date();
      } else if (timeDiff >= 0 && !active) {
          active = true;
          setTimeout(function(chatMessage) { chat(chatMessage); active = false; }, limit - timeDiff, chatMessage);
      }
    }
  }
 
  // This dummy input will handle macro keypresses
  var btn = document.createElement("input");
  btn.style.opacity = 0;
  btn.style.position = "absolute";
  btn.style.top = "-100px";
  btn.style.left = "-100px";
  btn.id = "macrohandlerbutton";
  document.body.appendChild(btn);
 
  contentEval(actualScript);
})();
}

	// ==UserScript==
// @name       		TagPro Marble Spin
// @version    		0.1
// @description  	Adds a marble overlay texture to the balls to show spin
// @include		    http://tagpro-*.koalabeast.com:*
// @include		    http://tangent.jukejuice.com:*
// @include		    http://*.newcompte.fr:*
// @author		    Some Ball -1 (Cflakes for the marble texture)
// ==/UserScript==

if ((window.sessionStorage.toggles && JSON.parse(window.sessionStorage.toggles).marble)){
tagpro.ready(function() {
    tr = tagpro.renderer;
    tr.createSpin = function(player) {
        var marble = new PIXI.Sprite(PIXI.Texture.fromImage("http://i.imgur.com/yT42PHy.png"));
        player.sprites.marble = marble;
        player.sprites.ball.addChild(player.sprites.marble);
        player.sprites.marble.anchor.x = .5;
        player.sprites.marble.anchor.y = .5;
        player.sprites.marble.x = 20;
        player.sprites.marble.y = 20;
    }
    var old2 = tr.updatePlayerSpritePosition;
    tr.updatePlayerSpritePosition = function (player) {
        if(!player.sprites.marble)
        {
            tr.createSpin(player);
        }
        player.sprites.marble.rotation = player.angle;
        old2(player);
    };
});
}

	// ==UserScript==
// @name          keymapper competitive
// @include       http://*.koalabeast.com:*
// @include       http://*.newcompte.fr:*
// @include       http://tangent.jukejuice.com:*
// ==/UserScript==

/*
The competitive server partition sends this script to each user. It is identical for each user.
*/

if ((window.sessionStorage.toggles && JSON.parse(window.sessionStorage.toggles).remap)){
tagpro.ready(function(){
    if (window.sessionStorage.keymap) {
        var keymap = JSON.parse(window.sessionStorage.keymap);
        tagpro.keys.cancelChat = keymap.cancelChat;
        tagpro.keys.chatToAll = keymap.chatAll;
        tagpro.keys.chatToTeam = keymap.chatTeam;
        tagpro.keys.chatToGroup = keymap.chatGroup;
        tagpro.keys.sendChat = keymap.chatSend;
        tagpro.keys.showOptions = keymap.showOptions;

        tagpro.keys.up = keymap.up;
        tagpro.keys.left = keymap.left;
        tagpro.keys.down = keymap.down;
        tagpro.keys.right = keymap.right;
    }
});
}

	// ==UserScript==
// @name         Tagpro Transparent Canvas 3.0
// @namespace    http://www.reddit.com/user/newcompte/
// @author       NewCompte
// @include      http://tagpro-*.koalabeast.com:*
// @include      http://tangent.jukejuice.com:*
// ==/UserScript==

if ((window.sessionStorage.toggles && JSON.parse(window.sessionStorage.toggles).transparent)){
tagpro.ready(function () {
   var oldCanvas = $(tagpro.renderer.canvas);
   var newCanvas = $('<canvas id="viewport" width="1280" height="800"></canvas>');
   oldCanvas.after(newCanvas);
   oldCanvas.remove();
   tagpro.renderer.canvas = newCanvas.get(0);
   tagpro.renderer.options.transparent = true;
   tagpro.renderer.renderer = tagpro.renderer.createRenderer();
   tagpro.renderer.resizeAndCenterView();
   newCanvas.show();
});   
}

	// ==UserScript== 
// @name          TagPro Tile Pattern
// @namespace     http://www.reddit.com/u/snaps_/
// @description   Tints every other floor tile a slightly different shade.
// @include       http://tagpro-*.koalabeast.com:* 
// @include       http://tangent.jukejuice.com:* 
// @include       http://*.newcompte.fr:* 
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html 
// @author        snaps
// @version       0.1.0
// ==/UserScript==

if ((window.sessionStorage.toggles && JSON.parse(window.sessionStorage.toggles).tiletint)){
/* User-Defined Variables */

// The color to tint the floor tiles.
var TINT_COLOR = "#FF6600";

// How much to tint the floor tiles. Should be a number from 0 to 1.
// In practice try values from 0.05 to 1 in increments of .2 to start,
// then smaller amounts to hone in on what you like.
var OPACITY = 0.15;

/* End of User-Defined Variables */


/**
 * Executes `fn` when the relevant parts of the `tagpro` object have
 * been initialized.
 * @param {Function} fn - The function to execute.
 */
function waitForInitialized(fn) {
  if (!tagpro || !tagpro.tiles || !tagpro.tiles.draw || !tagpro.renderer) {
    setTimeout(function() {
      waitForInitialized(fn);
    }, 10);
  } else {
    // Only override if we load early enough.
    if (!tagpro.renderer.layers.backgroundDrawn) {
      fn();
    }
  }
}

waitForInitialized(function() {
  var stdDraw = tagpro.tiles.draw;
  // ids of the tiles we're interested in changing.
  var floorTiles = [2, 11, 12, 17, 18];
  var prefix = "__tinted__";

  /**
   * Set tint of a given canvas element.
   * @param {HTMLElement} image - Canvas element holding the image to tint.
   * @param {string} [color="#000000"] - Color string to tint the tiles, like "#FF0000".
   * @param {number} [opacity="0.01"] - How much to preserve the original image.
   */
  var setTint = function(image, color, opacity) {
    // Adapted from: http://stackoverflow.com/a/4231508/1698058
    var tint = document.createElement("canvas");
    tint.width = image.width;
    tint.height = image.height;

    var tintCtx = tint.getContext("2d");
    tintCtx.fillStyle = color || "#000000";
    tintCtx.fillRect(0, 0, tint.width, tint.height);
    tintCtx.globalCompositeOperation = "destination-atop";
    tintCtx.drawImage(image, 0, 0);

    var imageCtx = image.getContext("2d");
    imageCtx.globalAlpha = opacity || 0.01;
    imageCtx.drawImage(tint, 0, 0);
  }

  /**
   * Creates the tinted texture for the tile of the given id and sets
   * the relevant values such that the returned value will function in
   * the original `tagpro.tiles.draw` function.
   * @param {(number|string)} tileId - The original id of the tile to set information for.
   * @return {string} - The new id to use for the tile.
   */
  var setTintedTexture = function(tileId) {
    var originalTileId = tileId;
    tileId = prefix + originalTileId;
    if (!tagpro.tiles[tileId] || !PIXI.TextureCache[tileId]) {
      var tile = tagpro.tiles[originalTileId];
      tagpro.tiles[tileId] = tile;

      var spread = tile.spread || 0;
      var elt = document.createElement("canvas");
      elt.width = tile.size || 40;
      elt.height = tile.size || 40;

      var ctx = elt.getContext("2d");
      var sx = tile.x * 40 - spread;
      var sy = tile.y * 40 - spread;
      var size = (tile.size || 40) + spread * 2;
      ctx.drawImage(tagpro.tiles.image, sx, sy, size, size, 0, 0, size, size);
      setTint(elt, TINT_COLOR, OPACITY);
      PIXI.TextureCache[tileId] = PIXI.Texture.fromCanvas(elt);
    }
    return tileId;
  }

  // Override `tagpro.tiles.draw`.
  tagpro.tiles.draw = function() {
    // Only make changes when drawing background tiles.
    if (tagpro.tiles.draw.caller === tagpro.tiles.drawLayers) {
      var loc = arguments[2];
      
      var floorTile = floorTiles.indexOf(arguments[1]) !== -1;
      if (loc && !(typeof arguments[1] == "object") && floorTile) {
        var arrayLoc = {
          x: Math.floor(loc.x / 40),
          y: Math.floor(loc.y / 40)
        };
        if ((arrayLoc.x % 2 == 0 && arrayLoc.y % 2 == 0) ||
            (arrayLoc.x % 2 == 1 && arrayLoc.y % 2 == 1)) {
          arguments[1] = setTintedTexture(arguments[1]);
        }
      }
    }
    return stdDraw.apply(null, arguments);
  }
});
}
	// ==UserScript==
// @name          TagPro Poker Chip Spin
// @description   Spin overlay and pixel perfect tagpro.
// @version       1
// @grant         none
// @include       http://tagpro-*.koalabeast.com:*
// @include       http://tangent.jukejuice.com:*
// @include       http://*.newcompte.fr:*
// @license       2014
// @author        CFlakes, SomeBall -1
// ==/UserScript==

if ((window.sessionStorage.toggles && JSON.parse(window.sessionStorage.toggles).pokerchip)){ 
tagpro.ready(function () {
    var texture = PIXI.Texture.fromImage('http://i.imgur.com/o3XXY73.png'),
        redTexture = new PIXI.Texture(texture, new PIXI.Rectangle(0, 0, 40, 40)),
        blueTexture = new PIXI.Texture(texture, new PIXI.Rectangle(40, 0, 40, 40)),
        tagproTexture = new PIXI.Texture(texture, new PIXI.Rectangle(80, 0, 40, 40));
    
    tagpro.renderer.createSpin = function(player) {
        var teamTexture = player.team === 1 ? redTexture : blueTexture;
        if (!player.sprites.spin) {
            player.sprites.spin = new PIXI.Sprite(teamTexture);
            player.sprites.spin.anchor.x = 0.5;
            player.sprites.spin.anchor.y = 0.5;
            player.sprites.spin.x = 20;
            player.sprites.spin.y = 20;
            player.sprites.spin.tileId = player.sprites.actualBall.tileId;
            player.sprites.ball.addChild(player.sprites.spin);
        } else {
            player.sprites.spin.setTexture(teamTexture);
            player.sprites.spin.tileId = player.sprites.actualBall.tileId;
        }
    };
    
    var upsp = tagpro.renderer.updatePlayerSpritePosition;
    tagpro.renderer.updatePlayerSpritePosition = function(player) {
        if (!player.sprites.spin || player.sprites.actualBall.tileId !== player.sprites.spin.tileId) tagpro.renderer.createSpin(player);
        player.sprites.spin.rotation = player.angle;
        upsp(player);
    };
    
    tagpro.renderer.createBallSprite = function(player) {
        var texture = player.team === 1 ? "redball" : "blueball";
        player.sprites.actualBall = tagpro.tiles.draw(player.sprites.ball, texture, {x: 0, y: 0});
        player.sprites.actualBall.tileId = texture;
    };
    
    tagpro.renderer.updateTagpro = function(player) {
        if (player.tagpro) {
            if (!tagpro.renderer.options.disableParticles && !player.sprites.tagproSparks) {
                player.sprites.tagproSparks = new cloudkid.Emitter(
                    player.sprites.ball,
                    [tagpro.renderer.particleFireTexture],
                    tagpro.particleDefinitions.tagproSparks);
                tagpro.renderer.emitters.push(player.sprites.tagproSparks);
            }
            if (player.bomb) {
                if (player.sprites.tagproTint) {
                    player.sprites.ball.removeChild(player.sprites.tagproTint);
                    player.sprites.tagproTint = null;
                }
            } else {
                if (!player.sprites.tagproTint) {
                    player.sprites.tagproTint = new PIXI.Graphics();
                    player.sprites.tagproTint.beginFill(0x00FF00, 0.25).drawCircle(20, 20, 19);
                    player.sprites.ball.addChild(player.sprites.tagproTint);
                }
            }
            if (!player.sprites.tagproTexture) {
                player.sprites.tagproTexture = new PIXI.Sprite(tagproTexture);
                player.sprites.ball.addChild(player.sprites.tagproTexture);
                player.sprites.tagproTexture.anchor.x = 0.5;
                player.sprites.tagproTexture.anchor.y = 0.5;
                player.sprites.tagproTexture.x = 20;
                player.sprites.tagproTexture.y = 20;
            }
            player.sprites.tagproTexture.rotation = player.angle;
        } else {
            if (player.sprites.tagproTint || player.sprites.tagproTexture) {
                player.sprites.ball.removeChild(player.sprites.tagproTint);
                player.sprites.ball.removeChild(player.sprites.tagproTexture);
                player.sprites.tagproTint = null;
                player.sprites.tagproTexture = null;
            }
            if (player.sprites.tagproSparks) {
                player.sprites.tagproSparks.emit = false;
                var sparksIndex = tagpro.renderer.emitters.indexOf(player.sprites.tagproSparks);
                tagpro.renderer.emitters.splice(sparksIndex, 1);
                player.sprites.tagproSparks.destroy();
                player.sprites.tagproSparks = null;
            }
        }
    };
    
    tagpro.renderer.updateRollingBomb = function(player) {
        if (player.bomb) {
            if (!player.sprites.bomb) {
                if (!tagpro.renderer.options.disableParticles) {
                    player.sprites.rollingBomb = new cloudkid.Emitter(
                        player.sprites.ball,
                        [tagpro.renderer.particleTexture],
                        tagpro.particleDefinitions.rollingBomb);
                    tagpro.renderer.emitters.push(player.sprites.rollingBomb);
                }
                var bomb = player.sprites.bomb = new PIXI.Graphics();
                bomb.beginFill(0xFFFF00, 0.6).drawCircle(20, 20, 19);
                player.sprites.ball.addChild(bomb);
            } else {
                player.sprites.bomb.alpha = Math.abs(0.6 * Math.sin(performance.now() / 150));
            }
        } else {
            if (player.sprites.bomb) {
                player.sprites.ball.removeChild(player.sprites.bomb);
                player.sprites.bomb = null;
            }
            if (player.sprites.rollingBomb) {
                if (player.sprites.rollingBomb instanceof cloudkid.Emitter) {
                    player.sprites.rollingBomb.emit = false;
                    tagpro.renderer.emitters.splice(tagpro.renderer.emitters.indexOf(player.sprites.rollingBomb), 1);
                    player.sprites.rollingBomb.destroy();
                } else {
                    player.sprites.rollingBomb.visible = false;
                }
                player.sprites.rollingBomb = null;
            }
        }
    };
});
}

	// ==UserScript==
// @name       		TagPro Ball Spin
// @version    		0.1
// @description  	Rotates balls to show the spin
// @include		http://tagpro-*.koalabeast.com:*
// @include		http://tangent.jukejuice.com:*
// @include		http://*.newcompte.fr:*
// @author		Some Ball -1
// ==/UserScript==

if ((window.sessionStorage.toggles && JSON.parse(window.sessionStorage.toggles).wholeball)){
tagpro.ready(function() {
    tr = tagpro.renderer;
	tr.anchorBall = function(player) {
	    player.sprites.actualBall.anchor.x = .5;
	    player.sprites.actualBall.anchor.y = .5;
	    player.sprites.actualBall.x = 20;
	    player.sprites.actualBall.y = 20;
	};
	var old = tr.updatePlayerSpritePosition;
	tr.updatePlayerSpritePosition = function (player) {
	    if(!player.sprites.actualBall.anchor.x)
	    {
	        tr.anchorBall(player);
	    }
	    player.sprites.actualBall.rotation = player.angle;
	    old(player);
	};
});
}

	// ==UserScript==
// @name          TagPro Analytics
// @namespace     http://tagpro.eu
// @description   Advanced gameplay data collector for TagPro (see http://tagpro.eu)
// @include       http://tagpro.eu/
// @include       http://tagpro-*.koalabeast.com:*
// @include       http://tangent.jukejuice.com:*
// @include       http://*.newcompte.fr:*
// @include       http://tagpro-*.koalabeast.com/
// @include       http://tangent.jukejuice.com/
// @include       http://*.newcompte.fr/
// @include       http://tagpro-*.koalabeast.com/*
// @include       http://tangent.jukejuice.com/*
// @include       http://*.newcompte.fr/*
// @grant         GM_getValue
// @grant         GM_setValue
// @author        Ronding
// @version       2.0
// ==/UserScript==

if(!location.port || location.port < 8000)
{
 var li = document.createElement('li');
 var a = document.createElement('a');
 a.href = 'http://tagpro.eu';
 a.textContent = 'Analytics';
 li.appendChild(a);
 document.getElementById('site-nav').getElementsByTagName('ul')[0].appendChild(li);
}

else
 tagpro.ready(function()
 {

  function Event(time, emptySize)
  {
   var that = this;
   var data = '';
   var byte = 0;
   var size = 0;
   this.empty = true;
   this.time = time;
   this.emptySize = emptySize;
   this.write = function(bits, length)
   {
    while(length--)
    {
     byte <<= 1;
     if(bits & 1 << length)
     {
      byte |= 1;
      that.empty = false;
     }
     if(++size == 8)
     {
      data += String.fromCharCode(byte);
      byte = 0;
      size = 0;
     }
    }
   };
   this.tally = function(number)
   {
    while(number--)
     that.write(1, 1);
    that.write(0, 1);
   };
   this.finish = function(last)
   {
    var footer = that.time - last - 1;
    if(footer < 0) footer = 0; // force time difference into positive domain (last resort, shifts rest of timeline)
    var free = 8 - (size + 2 & 7) & 7;
    var minimum = 0;
    for(var maximum = 1 << free; maximum <= footer; maximum += 1 << free)
    {
     minimum = maximum;
     free += 8;
    }
    that.write(free >>> 3, 2);
    that.write(footer - minimum, free);
    return data;
   };
   this.pad = function()
   {
    that.write(0, 8 - (size & 7) & 7);
    return data;
   };
  }

  var group = '';
  var mapInfo = {};
  var mapDimensions = new Uint32Array(2);
  var mapTiles = '';
  var mapGridBits = new Uint8Array(2);
  var mapGridMargin = new Uint32Array(2);
  var mapMarsballs = 0;
  var marsballs = {};
  var unfinalized = true;
  var complete = false;
  var gameNow = new Date();
  var lastTime = 0;
  var lastNow = gameNow.getTime();
  var minTime = 1;
  var gameStart = NaN;
  var timeLimit = 0;
  var teamNames = ['Red', 'Blue'];
  var teamScores = new Uint32Array(2);
  var players = {};
  var lastPlayer = 0;
  var splats = [new Event(0,0), new Event(0,0)];
  var queuedSplats = [[],[]];

  var div = document.createElement('div');
  div.style.margin = '10px 0';
  div.appendChild(document.createTextNode('TagPro Analytics is disabled (you joined later)'));
  document.getElementById('stats').parentNode.insertBefore(div, document.getElementById('stats').nextSibling);
  
  tagpro.socket.on('groupId', function(data)
  {
   group = data || '';
  });
  
  tagpro.socket.on('map', function(data)
  {
   if(mapTiles == '')
   {
    if(data.info)
     mapInfo = data.info;
    if(mapDimensions[0] = data.tiles.length)
     mapDimensions[1] = data.tiles[0].length;
    var last = 0, count = 0;
    function append()
    {
     if(count)
     {
      var event = new Event(count, 0);
      event.write(last, 6);
      mapTiles += event.finish(0);
     }
    }
    for(var y = 0; y < mapDimensions[1]; y++)
     for(var x = 0; x < mapDimensions[0]; x++)
     {
      var tile = data.tiles[x][y] * 10 >>> 0;
      if(tile < 10) tile = 0;
      else if(tile < 20) tile -= 9;
      else if(tile < 90) tile = 4 + (tile / 10 >>> 0);
      else if(tile < 100) tile -= 77;
      else if(tile < 130) tile = 7 + (tile / 10 >>> 0);
      else if(tile < 140) tile -= 110;
      else tile = 8 + (tile / 10 >>> 0);
      if(tile == last) count++;
      else
      {
       append();
       last = tile, count = 1;
      }
     }
    append();
    for(var dimension = 0; dimension < 2; dimension++)
    {
     var size = mapDimensions[dimension] * 40;
     if(size)
     {
      var grid = size - 1;
      mapGridBits[dimension] = 32;
      if(!(grid & 0xFFFF0000)) mapGridBits[dimension] -= 16, grid <<= 16;
      if(!(grid & 0xFF000000)) mapGridBits[dimension] -=  8, grid <<=  8;
      if(!(grid & 0xF0000000)) mapGridBits[dimension] -=  4, grid <<=  4;
      if(!(grid & 0xC0000000)) mapGridBits[dimension] -=  2, grid <<=  2;
      if(!(grid & 0x80000000)) mapGridBits[dimension] -=  1;
     }
     mapGridMargin[dimension] = ((1 << mapGridBits[dimension]) - size >>> 1) + 20; // add 20 px to get ball center
    }
   }
  });

  tagpro.socket.on('teamNames', function(data)
  {
   if(data.redTeamName) teamNames[0] = data.redTeamName;
   if(data.blueTeamName) teamNames[1] = data.blueTeamName;
  });

  tagpro.socket.on('score', function(data)
  {
   if('r' in data) teamScores[0] = data.r;
   if('b' in data) teamScores[1] = data.b;
  });

  tagpro.socket.on('time', function(data)
  {
   var dateNow = new Date();
   var now = dateNow.getTime();
   if(data.state == 3)
   {
    div.removeChild(div.firstChild);
    div.style.fontWeight = 'bold';
    div.appendChild(document.createTextNode('TagPro Analytics is recording'));
    complete = true;
   }
   else if(complete)
   {
    gameNow = dateNow;
    var deadline = ((now - lastNow) * .06 >>> 0) + lastTime + Math.round(data.time * .06);
    timeLimit = Math.round(data.time / 60000);
    gameStart = deadline - timeLimit * 3600;
   }
  });
  
  function finalize(finished)
  {
   var now = Date.now();
   if(unfinalized && complete && gameStart == gameStart)
   {
    unfinalized = false;
    var submit =
    {
     server: location.hostname, port: parseInt(location.port, 10), group: group, date: gameNow.getTime() / 1000 >>> 0,
     timeLimit: timeLimit, duration: Math.max(((now - lastNow) * .06 >>> 0) + lastTime, minTime) - gameStart, finished: finished,
     map: {name: mapInfo.name || 'Untitled', author: mapInfo.author || 'Unknown', marsballs: mapMarsballs, width: mapDimensions[0], tiles: btoa(mapTiles)},
     players: [],
     teams: [{name: teamNames[0], score: teamScores[0], splats: btoa(splats[0].pad())}, {name: teamNames[1], score: teamScores[1], splats: btoa(splats[1].pad())}]
    };
    for(var id = 1; id <= lastPlayer; id++)
     if(id in players)
     {
      var served = [id];
      var player = players[id];
      if(player.timeline.length || player.initialTeam)
      {
       var events = '';
       var last = gameStart;
       var concatenate = function()
       {
        var emptySize = 7;
        for(var i = 0, j = new Uint32Array(3);;)
        {
         var type = 0, time = Infinity;
         if(i < player.timeline.length) type = 1, time = player.timeline[i].time;
         for(var k = 0; k < 3; k++)
          if(j[k] < player.toggles[k].length)
          {
           if(player.toggles[k][j[k]] < time) type = 2 << k, time = player.toggles[k][j[k]];
           else if(player.toggles[k][j[k]] == time) type |= 2 << k;
          }
         if(!type) break;
         var event;
         if(type & 1) event = player.timeline[i];
         else { event = new Event(time, emptySize); event.write(0, emptySize); }
         for(var k = 0; k < 3; k++) event.write(player.toggles[k][j[k]] == time, 1);
         events += event.finish(last);
         last = time;
         if(type & 1) { i++; emptySize = event.emptySize; }
         for(var k = 0; k < 3; k++) if(type & 2 << k) j[k]++;
        }
       };
       concatenate();
       var auth = player.auth, name = player.name, flair = player.flair, initialTeam = player.initialTeam;
       if(player.lastTime && player.lastName) // merge players before and after refreshing
        for(var currentId = id + 1; currentId <= lastPlayer; currentId++)
         if(currentId in players)
         {
          var currentPlayer = players[currentId];
          if(currentPlayer.firstTime > player.lastTime && currentPlayer.firstName == player.lastName && (!player.lastAuth || (currentPlayer.auth && currentPlayer.name == player.name)) && currentPlayer.degree == player.degree)
          {
           player = currentPlayer;
           if(!auth && player.name) name = player.name;
           if(player.auth) auth = true;
           if(player.flair) flair = player.flair;
           concatenate();
           served.push(currentId);
           if(!player.lastTime || !player.lastName) break;
          }
         }
       submit.players.push(
       {
        auth: auth, name: name, flair: flair, degree: player.degree,
        score: player.score, points: player.points,
        team: initialTeam, events: btoa(events)
       });
      }
      for(var i in served) delete players[served[i]];
     }
    
    var json = JSON.stringify(submit);
    console.log(json);
    div.removeChild(div.firstChild);
    var a = document.createElement('a');
    a.href = 'data:application/octet-stream,' + encodeURIComponent(json);
    a.appendChild(document.createTextNode('Save'+(finished?'':' Partial')+' TagPro Analytics file'));
    div.appendChild(a);
    if(finished)
    {
     div.appendChild(document.createTextNode(' | '));
     var u = document.createElement('a');
     u.href = 'http://tagpro.eu/';
     if(group) u.target = '_blank';
     u.style.color = 'silver';
     u.appendChild(document.createTextNode('Uploading match to website...'));
     div.appendChild(u);
    }
    else
    {
     a.style.backgroundColor = 'red'; a.style.color = 'white';
     div.appendChild(document.createTextNode(' (recording interrupted)'));
    }
    
    if(window.tagproAnalytics)
    {
     if(!window.tagproAnalytics.secret)
     {
      var secret = new Uint8Array(8);
      crypto.getRandomValues(secret);
      window.tagproAnalytics.secret = btoa(String.fromCharCode.apply(null, secret));
     }
     if(window.tagproAnalytics.matches)
     {
      window.tagproAnalytics.matches.splice(9);
      window.tagproAnalytics.matches.unshift(submit);
     }
     else
      window.tagproAnalytics.matches = [submit];
     document.body.dataset.tagproAnalytics = JSON.stringify(window.tagproAnalytics);
    }
    if(finished)
    {
     var xhr = new XMLHttpRequest();
     xhr.open('POST', 'http://tagpro.eu/submit/');
     xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
     xhr.onreadystatechange = function()
     {
      if(xhr.readyState == 4)
      {
       u.removeChild(u.firstChild);
       if(xhr.status == 202)
       {
        submit.upload = xhr.responseText;
        if(window.tagproAnalytics)
         document.body.dataset.tagproAnalytics = JSON.stringify(window.tagproAnalytics);
        u.href = 'http://tagpro.eu/' + xhr.responseText;
        u.style.color = '';
        u.appendChild(document.createTextNode('View match on website'));
       }
       else
       {
        u.style.backgroundColor = 'red'; u.style.color = 'white';
        u.appendChild(document.createTextNode(xhr.responseText ? xhr.responseText : 'Unknown error during upload to website'));
       }
      }
     };
     xhr.send('data=' + encodeURIComponent(json) + '&clock=' + (Date.now() / 1000 >>> 0) + '&secret=' + encodeURIComponent(window.tagproAnalytics ? window.tagproAnalytics.secret : 'LeagueOnlyA=') + '&version=8');
    }
   }
  }

  tagpro.socket.on('end', function(data)
  {
   finalize(true);
  });
  function stop()
  {
   finalize(false);
  }
  tagpro.socket.on('disconnect', stop)
  document.getElementById('exit').addEventListener('click', stop);

  tagpro.socket.on('object', function(data)
  {
   if(data.type == 'marsball' && !(data.id in marsballs))
   {
    mapMarsballs++;
    marsballs[data.id] = null;
   }
  });

  tagpro.socket.on('playerLeft', function(id)
  {
   var now = Date.now();
   var player = players[id];
   if(player)
   {
    if(gameStart == gameStart)
    {
     player.lastTime = ((now - lastNow) * .06 >>> 0) + lastTime;
     if(player.timeline.length && player.timeline[player.timeline.length-1].time >= player.lastTime)
      player.lastTime = player.timeline[player.timeline.length-1].time + 1;
     player.team = 0;
     if(player.score > 0) player.score = 0;
     var event = new Event(player.lastTime, 7);
     event.write(3, 2); // quit
     event.write(0, 1); // pop
     event.tally(0); // returns
     event.tally(0); // tags
     if(!player.flag) event.write(0, 1); // grab
     event.tally(0); // captures
     event.tally(0); // powerups
     for(var power = 1; power < 16; power <<= 1)
      if(player.powers & power)
       event.write(0, 1); // power down
     player.timeline.push(event);
    }
    else
     delete players[id];
   }
  });

  tagpro.socket.on('splat', function(data)
  {
   if(gameStart == gameStart) queuedSplats[data.t-1].push(data);
  });

  tagpro.socket.on('p', function(data)
  {
   var now = Date.now();
   var time = data.t || 0;
   if(time)
   {
    lastTime = time;
    lastNow = now;
    if(time <= gameStart) gameStart = time-1;
   }
   else
    time = ((now - lastNow) * .06 >>> 0) + lastTime;
   if(time < minTime)
    time = minTime;
   data = data.u || data;
   var expectedSplats = new Uint32Array(2);
   
   for(var i = 0; i < data.length; i++)
   {
    var newPlayer = data[i];
    var player = players[newPlayer.id];
    if(player) player.message++;
    else
    {
     if(newPlayer.id > lastPlayer) lastPlayer = newPlayer.id;
     player = players[newPlayer.id] =
     {
      firstTime: gameStart == gameStart ? time : 0, lastTime: 0, firstName: '', lastName: '', lastAuth: false,
      auth: false, name: '', flair: 0, degree: 0,
      score: 0, points: 0,
      team: 0, initialTeam: 0, flag: 0, potato: 0, powers: 0,
      's-pops': 0, 's-captures': 0, 's-grabs': 0, 's-returns': 0, 's-tags': 0, 's-powerups': 0, 's-prevent': 0, 's-support': 0,
      timeline: [], toggles: [[],[],[]], message: gameStart == gameStart ? 0 : 1
     };
    }
    if(newPlayer.name)
    {
     if(!player.auth) player.name = newPlayer.name;
     if(!player.firstName) player.firstName = newPlayer.name;
     player.lastName = newPlayer.name;
    }
    if(player.lastAuth = newPlayer.auth) player.auth = true;
    if(newPlayer.flair) player.flair = 1 + (newPlayer.flair.x | newPlayer.flair.y << 4);
    if(newPlayer.degree) player.degree = newPlayer.degree;
    if('score' in newPlayer) player.score = newPlayer.score;
    if('points' in newPlayer) player.points = newPlayer.points;
    
    var save = function(field)
    {
     var difference = 0;
     if(field in newPlayer)
     {
      if(newPlayer[field] > player[field] && player.message > 1) // second message of player may contain score recovery after refresh, so ignore first two messages (unless player joined before start)
       difference = newPlayer[field] - player[field];
      player[field] = newPlayer[field];
     }
     return difference;
    };
    
    var pops = save('s-pops'), captures = save('s-captures'), grabs = save('s-grabs'), returns = save('s-returns'), tags = save('s-tags'), powerups = save('s-powerups'), prevent = save('s-prevent'), support = save('s-support');
    if(gameStart == gameStart)
    {
     if(pops && (player.team || newPlayer.team)) expectedSplats[(player.team || newPlayer.team) - 1]++;
     var survive = !pops && (!player.team || !newPlayer.team || newPlayer.team == player.team);
     var newFlag = 'flag' in newPlayer ? newPlayer.flag ? newPlayer.flag : 0 : player.flag;
     var event = new Event(time, survive && newFlag ? 6 : 7);
     if(newPlayer.team && newPlayer.team != player.team)
     {
      if(player.team) event.write(2, 2); // switch
      else event.write(2 | newPlayer.team - 1, 2); // join
      player.team = newPlayer.team;
     }
     else event.write(0, 1); // stay
     event.write(pops ? 1 : 0, 1);
     event.tally(returns);
     event.tally(tags > returns ? tags - returns : 0);
     if(!player.flag) event.write(grabs ? 1 : 0, 1);
     event.tally(captures);
     if('potatoFlag' in newPlayer) player.potato = newPlayer.potatoFlag ? 1 : 0;
     if(survive)
     {
      if((player.flag || grabs) && captures) event.write(newFlag ? 1 : 0, 1); // keep
      if(!player.flag && grabs && newFlag) event.write((newFlag == 3) << 1 | player.potato, 2); // flag
     }
     player.flag = newFlag;
     event.tally(powerups);
     ['grip','bomb','tagpro','speed'].forEach(function(property, index)
     {
      var bit = 1 << index;
      if(player.powers & bit)
      {
       if(property in newPlayer && !newPlayer[property])
       {
        player.powers ^= bit;
        event.write(1, 1); // power down
       }
       else
       {
        event.write(0, 1); // power remains up
        event.emptySize++;
       }
      }
      else if(newPlayer[property])
      {
       if(powerups-- > 0) // should always be true (ignore powerup collection if false)
       {
        player.powers |= bit;
        event.write(1, 1); // power up
        event.emptySize++;
       }
      }
      else if(powerups > 0) event.write(0, 1); // power remains down
     });
     if(!event.empty)
     {
      player.timeline.push(event);
      minTime = time + 1;
     }
     var periodic = function(period, event)
     {
      var array = player.toggles[event];
      var last = array.length - 1;
      var start = Math.max(time - period, gameStart + 1); // do not start period prior to game start
      if(start <= array[last] + 1) // 1 frame error margin
       array[last] = time;
      else
      {
       array.push(start);
       array.push(time);
      }
     };
     if(prevent == 1) periodic(60, 0);
     switch(support)
     {
      case 1: periodic(300, 1); break;
      case 2: periodic(300, 2); break;
      case 3: periodic(300, 1); periodic(300, 2);
     }
    }
    else if(newPlayer.team)
     player.team = player.initialTeam = newPlayer.team;
   }
   
   for(var team = 0; team < 2; team++)
   {
    if(queuedSplats[team].length > expectedSplats[team])
     queuedSplats[team].splice(0, queuedSplats[team].length - expectedSplats[team]);
    if(expectedSplats[team])
    {
     splats[team].tally(queuedSplats[team].length);
     var splat; while(splat = queuedSplats[team].shift())
     {
      splats[team].write(Math.min(Math.max(splat.x + mapGridMargin[0], 0), (1 << mapGridBits[0]) - 1), mapGridBits[0]);
      splats[team].write(Math.min(Math.max(splat.y + mapGridMargin[1], 0), (1 << mapGridBits[1]) - 1), mapGridBits[1]);
     }
    }
   }
  });

  console.log('TagPro Analytics has been initialized.');
 });


		
		///// PUT SCRIPTS HERE ONE AFTER ANOTHER //////



})(tagpro);