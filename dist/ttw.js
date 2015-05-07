//v test

const SPACEBAR = 32;
const ARROW_LEFT = 37;
const ARROW_UP = 38;
const ARROW_RIGHT = 39;
const ARROW_DOWN = 40;

const KEY_Z = 90;
const KEY_X = 88;
const KEY_R = 82;
const KEY_C = 67;

const REDRAW_INTERVAL = 1;


function Main() {
  	this.initGlobals();
  	this.initSprites();
  	this.initSpis();
  	initEvents(this);
  	this.initGame();
  	
  	
  
	
}

Main.prototype = {
	initGlobals: function(){
		window.win = new R2D_Win(16,20);
  		window.camera = new R2D_Camera(120,160,0);
  		window.camera.setZplane(window.win,0);
  		window.spilist = new R2D_SpiList(0,0,0);
  		window.r2d = new R2D_Renderer(window.win,window.spilist,window.camera);
  
  		//Define now (for delta)
  		this.now = Date.now();
	},
	
	initSprites: function() {
		this.sp = new Ttw_Sprites();
  		this.spArray = [this.sp.skull, this.sp.cherry, this.sp.lemon, this.sp.grape, this.sp.chest,this.sp.title];
  		this.spArray_pos = 0;
	},
	initSpis: function() {
		this.spi = {};
		  
		this.spi.score = window.spilist.addSpi(this.sp.score,0,4,0,1);
  		this.spi.hiscore = window.spilist.addSpi(this.sp.hiscore,0,4,16,1);
  		this.spi.score.setPeg("left","top",window.win);
  		this.spi.hiscore.setPeg("left","top",window.win);
  
  		this.spi.hitbut = window.spilist.addSpi(this.sp.newbut,0,4,-4,0);
  		this.spi.hitbut.setClickable(true);
  		this.spi.hitbut.setEvent("sprite_cursordown", function(e) {
  				this.eventPerform( new Event("hit_pressed") );
  				});
  		this.spi.hitbut.setPeg("left","bottom",window.win);
  				
  		this.spi.staybut = window.spilist.addSpi(this.sp.newbut,0,-4,-4,0);
  		this.spi.staybut.setClickable(true);
  		this.spi.staybut.setEvent("sprite_cursordown", function(e) {
  				this.eventPerform( new Event("stay_pressed") );
  				});
  		this.spi.staybut.setPeg("right","bottom",window.win);
  
  		this.spi.bigicon = window.spilist.addSpi(this.spArray[5],0,120,148,0);
  		this.spi.itxt = window.spilist.addSpi(this.sp.itxt,0,120,228,-1);
  		this.spi.itxt.setFrameSingle(5);
  
  		this.spi.redcross = window.spilist.addSpi(this.sp.redcross_big,0,120,168,-2);
  		this.spi.redcross.setVisible(false);
  
  		this.spi.bg = window.spilist.addSpi(this.sp.skybg,0,120,168,100);
  		this.spi.pips = [];
  		this.spi.pip_x = [];
  		
  		for (var i = 0;i<7;i++) {
  			this.spi.pips[i] = window.spilist.addSpi(this.sp.pips,0,50 + (i * 20),56,-1 - i);
  			this.spi.pips[i].setFrameSingle(0);
  			
  			this.spi.pip_x[i] = window.spilist.addSpi(this.sp.redcross_pip,0,50 + (i * 20),56,-2 - i);
  			this.spi.pip_x[i].setVisible(false);
  			
  			}
  			
  		this.spinner = new IconSpinner(120,168,0.25,window.spilist,this.sp.mblur);
	},
	
	initGame: function() {
		this.start_score = 100;
		this.player_score = {val: 0 };
  		this.player_hiscore = {val: 0};
  		
  		this.newhand();
  		this.hand_pos = 0;
  		this.hand_size = 7;
  
  		this.player_score.drawer = new spNumber(-4,0,1,this.player_score,12,window.win,window.spilist,this.sp.nums);
  		this.player_hiscore.drawer = new spNumber(-4,16,1,this.player_hiscore,12,window.win,window.spilist,this.sp.nums);
		
		
		this.bind(this.spi.hitbut);
  		this.bind(this.spi.staybut);
  		
  		this.icon = 0;
  		this.iconmax = 4;
  		
  		this.state = "gameover";
  		
  		this.setEvent("game_hit", this.game_hit );
  		this.setEvent("game_stay", this.game_stay );
  		this.setEvent("game_roll", this.game_roll );
  		this.setEvent("game_new", this.game_new );
  
  		this.setEvent("hit_pressed", function(e) {
  				switch (this.state) {
  					case "rolling": this.eventPerform( new Event("game_hit") ); break;
  					case "gameover": this.eventPerform( new Event("game_new") ); break;
  					case "hit":
  				    case "stay": this.eventPerform( new Event("game_roll") ); break;
  					}
  				
  				});
  				
   		this.setEvent("stay_pressed", function(e) {
   			
   				switch (this.state) {
  					case "rolling": this.eventPerform( new Event("game_stay") ); break;
  					case "gameover": this.eventPerform( new Event("game_new") ); break;
  					case "hit":
  					case "stay": this.eventPerform( new Event("game_roll") ); break;
  					}
  				});
		
	},
	
	newhand: function() {
		if (this.player_score.val < 0) {
				this.hand = [1,4,2,0,1,0,2];
				}
		else {
			this.hand = [1,3,2,0,1,0,2];
		}
		this.hand.sort(function() {return ( 0.6 - Math.random() ) })
		this.hand_pos = 0;
		
		for (var i = 0;i<7;i++) {
  			this.spi.pips[i].setFrameSingle(0);
  			this.spi.pip_x[i].setVisible(false);
  			}
	},
	
	play_hand: function(hand) {
		switch (hand) {
			case 0: this.state = "gameover"; this.game_over(); break;
			case 1: this.player_score.val +=100; break;
			case 2: this.player_score.val -=100; break;
			case 3: this.player_score.val +=500; break;
			case 4: if (this.player_score.val < 0) {this.player_score.val = 100;} break;
		}
	},
	
	game_new: function() {
		this.player_score.val = 125;
		this.newhand();
		this.game_roll();
	},
	
	game_over: function() {
		if (this.player_score.val > this.player_hiscore.val) {
			this.player_hiscore.val = this.player_score.val;
			this.player_hiscore.drawer.update();
		}
		
		this.spi.hitbut.setSprite(this.sp.newbut);
  		this.spi.staybut.setSprite(this.sp.newbut);
	},
	
	game_roll: function() {
		if (this.hand_pos >= this.hand_size) {
			this.newhand(); 
		}
		
		this.player_score.val-=25;
		this.player_score.drawer.update();
		
		this.spinner.start();
		this.spi.bigicon.setVisible(false);
  		this.spi.itxt.setVisible(false);
  		this.spi.redcross.setVisible(false);
  		
  		this.spi.hitbut.setSprite(this.sp.hitbut);
  		this.spi.staybut.setSprite(this.sp.staybut);
  		
  		this.state = "rolling";
	},
	
	game_stay: function() {
		
		var mycard = this.hand[this.hand_pos];
		
		this.spinner.stop();
		this.spi.bigicon.setSprite(this.spArray[ mycard ]);
		this.spi.bigicon.setVisible(true);
		this.spi.redcross.setVisible(true);
  		this.spi.pips[ this.hand_pos ].setFrameSingle( mycard + 1);
  		this.spi.pip_x[ this.hand_pos ].setVisible(true);
  		
  		this.spi.hitbut.setSprite(this.sp.rollbut);
  		this.spi.staybut.setSprite(this.sp.rollbut);
  		
  		this.state = "stay";
		
		this.hand_pos++;
	},
	
	
	game_hit: function() {
		
		var mycard = this.hand[this.hand_pos]
		
		this.spinner.stop();
		this.spi.bigicon.setSprite(this.spArray[ mycard ]);
		this.spi.bigicon.setVisible(true);
  		this.spi.itxt.setFrameSingle( mycard );
  		this.spi.itxt.setVisible(true);
  		this.spi.pips[ this.hand_pos ].setFrameSingle( mycard + 1);
  		
  		this.spi.hitbut.setSprite(this.sp.rollbut);
  		this.spi.staybut.setSprite(this.sp.rollbut);
  		
  		this.state = "hit";
		
		this.hand_pos++;
		
		
		this.play_hand(mycard);
		this.player_score.drawer.update();
	},
	
	step: function(){
		/////////////////////////////////////////
  	//Get Delta
  	var delta = (Date.now() - this.now) * 0.001;
    this.now = Date.now();
  	/////////////////////////////////////////
  	var loaded = this.sp.getLoaded();
  	//if (loaded < 1)
  	//	{  drawLoadBar(window.win.getContext(),8,128,loaded);  }
  	//else
  	//	{
  			this.spinner.update();
  			
  			var a = window.win.getAspectRatio();
  			var gh = ((a - 0.75) * -5) + 20;
  			if (gh<15) {gh = 15;}
  			if (gh>20) {gh = 20;}
  			window.win.setGridHeight(gh); 
  			window.r2d.render(delta);
  	//	}
  	//exp_sp.draw(window.win.getContext(),2,0,0);
  	//wiz_sp[1].draw(window.win.getContext(),0,0,0);
    
    //This needs to go to renderer somehow
		
	},
};




function drawLoadBar(ctx,x,y,percent) {
	ctx.save();
	ctx.font= "32px sans-serif";
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fillText("loading...",x, y);
	ctx.textBaseline = "bottom";
	ctx.fillRect(x,y + 32,128,8);
	ctx.fillStyle = "rgb(255,255,255)";
	ctx.fillRect(x + 1,y + 33,126,6);
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fillRect(x + 2,y + 34,(124)* percent,4);
	ctx.restore();
	
	$("#stretch").css("width", $(window).width() );
    $("#stretch").css("height", $(window).height() );
}

function spNumber(x,y,z,obj,maxdec,win,spilist,sprite) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.obj = obj;
	this.maxdec = maxdec;
	
	this.alphaval = 0.75;
	
	this.spi = [];
	for (var i = 0; i<this.maxdec; i++) {
		this.spi[i] =  window.spilist.addSpi(sprite,0,x - (10 * i ),y, (i * 0.01) + z);
  		this.spi[i].setPeg("right","top",win);
	}
	this.update();
}

spNumber.prototype = {
	update: function() {
		var n = Math.floor( this.obj.val );
		
		//truncate n value
		var p = Math.pow(10,this.maxdec);
		if (n >  p) {
			n = p-1;
		}
		
		p/=10;
		
		if (n <  -p) {
			n = -p+1;
		}
		
		
		
		var neg = (n < 0);
	
		for (var i = 0; i<this.maxdec; i++) {
			var p1 = Math.pow(10,i);
			var p2 = p1 * 10;
			var v = Math.abs(n)  % p2 / p1;
  			this.spi[i].setFrameSingle(v);
  			if ( (Math.abs(n) < p1 ) & (i>0) ) 
  				{ this.spi[i].setVisible(false); }
  			else { 
  					this.spi[i].setVisible(true);
  				 	if (neg) { this.spi[i].setAlpha(this.alphaval); }
  				 		else { this.spi[i].setAlpha(1); }
  					}
  				
  			if ((n < 0) &  (Math.abs(n) >= p1/10) & (Math.abs(n) < p1) ) {
  				this.spi[i].setVisible(true);
  				this.spi[i].setFrameSingle(10);
  				this.spi[i].setAlpha(this.alphaval);
  			}
  			
		}
		
	},
};

function IconSpinner(x,y,interval,spilist,spanim) {
	this.x = x;
	this.y = y;
	this.interval = interval;
	this.m_interval = this.interval * 333;
	this.spilist = spilist;
	this.spanim = spanim;
	this.stop();
}

IconSpinner.prototype = {
	
	start: function() {
		this.on = true;
		this.time = Date.now();
		this.next = Date.now();
		this.cycle();
	},
	
	stop: function() {
		this.on = false;
	},
	
	cycle: function() {
		var n = Date.now() - this.next;
		this.next = Date.now() + this.m_interval - n;
		
		var f = Math.floor( Math.random() * 4.999 );
		
		var myspi = window.spilist.addSpi(this.spanim,f,this.x,this.y-64,0);
  		myspi.setFrameSingle(f);
  		myspi.setAlpha(0);
  		myspi.startTween(this.interval, "hemi", this.x, this.y + 64, -1, 1);
  		myspi.setEvent("sprite_tweenend", myspi.destroy );
	},
	
	update: function() {
		if (this.on) {
			if (Date.now() >= this.next) {
				this.cycle();
			}
		}
	},
};


$(document).ready(function() {
	var main = new Main();
  
   ///////////////////////////////////////////////////////////////

  window.setInterval(function() {
  	
  	main.step();
  	
  }, REDRAW_INTERVAL);
});
