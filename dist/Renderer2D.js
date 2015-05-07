//Note:  Unit test!


//[x]-load list
	//load each image in list
	//unload each image in list

//[x]-image files (object)
	//load image
	//unload image
	
//[x]-sprite files (object)

//[x]-sprite instance

//Note:  Keep the renderer simple
//Note: spint needs a draw_tiled (x or y), a changeSprite(sp_index) that sets frame_index to current % new.num_frames, a changeSprite(sp_index,frame), and a AnimEnd event

//[x]-renderer, camera, sprite instance, world size (camera constraints)

//Note:  Renderer divs!  Local coordinate sytem, draw all inside
//Note:  Spilists should be able to draw other spilists or spis!!!!!!!!!

//[x]-Perspective positioning
//[x]-Perspective scaling

//[x]-R2D_Window
//	[x]-Create object structure
//	[x]-Create init functions
//	[x]-Clean up other objects, pass r2d_win ref

//[x]-R2D Events
//[x]-Get mouse position and events, scale position relative to view (in grid units, not pixels!!!!)
//[x]-create sprite on mouse click
//[x]-Event binding (animation end)

//[]-Win.gridToPx, and Win.pxToGrid
//[]-Clicktree (w touch events!)
//[]-Clickbinding (set xy position of object, set xy pos of sprite)


//[]-Mipmapping
//	[]-Imgs have resolutions
//	Note: always draw scaled to current res (but pass an error)

//[]-WebGL support

//[]-Renderer Divs (renderlist can draw sprites or other renderlists)


//[]- Fix clipping (?)





//getRes(view_h)  {find (240*(2^n)) that's closest to view_h, (16*(2^n)) is your res, view_h / res is grid_h}

//[]-Tiles 
//Note:  global animation (not per instance).  only stores x,y




//###########################  Math and Data Structures  ######################################################
function getRect(x,y,w,h) {
	var r;
	r = {
		left: x,
		right: x+w,
		top: y,
		bottom: y+h
	};
	return r;
}

function pointRect(x,y,rect) {
  return !( (x > rect.right) | 
            (x < rect.left) | 
            (y > rect.bottom) |
            (y < rect.top) );	
}

function intersectRect(r1, r2) {
  return !( (r2.left > r1.right) | 
            (r2.right < r1.left) | 
            (r2.top > r1.bottom) |
            (r2.bottom < r1.top) );
}

//###########################  The Window  ######################################################
function R2D_Win(res,grid_h) {
	this.context = $("#game-canvas")[0].getContext("2d");
	
	this.grid_w = 0;
	this.grid_h = grid_h;
	this.res = res;
	
	this.bbox = {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		};
	
	this.update();
}

R2D_Win.prototype = {
	
	calcRez: function(h) {
		this.res = Math.floor(h/15);
	},
	
	setGrid: function(w,h) {
		//Check if window size is different before calculating!!!!!!
		this.grid_w = w/this.res;
		this.grid_h = h/this.res;
	},
	
	setGridHeight: function(grid_h) {
		this.grid_h = grid_h;
	},
	
	getWinScale: function() {
		return (this.grid_h * this.res) / this.win_h;
	},
	
	getContext: function() {
		return this.context;
	},
	
	getAspectRatio: function() {
		return (this.win_w / this.win_h);
	},
	
	getWinBox: function() {
		self=this;
		var w = {
			x: 0,
			y: 0,
			w: self.win_w,
			h: self.win_h
		};
		return w;
	},
	
	getView: function(camera) {
		
		//overload this function!
		self=this;
		var v = {
			camera: null,
			x: 0,
			y: 0,
			z: 0,
			w: 0,
			h: self.grid_h * self.res,
			hw: 0,
			hh: 0
		};
		
		v.w = this.wh_ratio * v.h;
		v.hw = v.w/2;
		v.hh = v.h/2;
		
		if (arguments.length == 1)
			{
			v.camera = camera;
			v.x = camera.x - v.hw;
			v.y = camera.y - v.hh;
			v.z = camera.getZplane(this);
			}
		
		return v;
	},
	
	winPosToGridPos: function(x,y,camera) {
		var v = this.getView(camera);
		var ratio = v.h / this.win_h;
		var pos = {
			x: v.x + (x * ratio), 
			y: v.y + (y * ratio)
			};
			
		return pos;
	},
	
	updateBbox: function(view) {
		this.bbox.x = view.x;
		this.bbox.y = view.y;
		this.bbox.width = view.w;
		this.bbox.height = view.h;
		this.bbox.hw = view.w/2;
		this.bbox.hh = view.h/2;
		
		
		//Initialize our user agent string to lower case.
		var uagent = navigator.userAgent.toLowerCase();
		
		if ( (uagent.search("iphone") > -1) | (uagent.search("ipod") > -1) ) {
			var offset = 16;
			this.bbox.y += offset;
			this.bbox.height -= offset;
		}

	},
	
	update: function(camera) {
		this.win_w = $(window).width();
		this.win_h = $(window).height();
		this.wh_ratio = this.win_w / this.win_h;
		this.grid_w = this.grid_h * this.wh_ratio;
		
		if (arguments.length == 1)
			{ var v = this.getView(camera); }
		else
			{ var v = this.getView(); }
			
		this.updateBbox(v);
		
		$("#game-canvas")[0].width = v.w;
		$("#game-canvas")[0].height = v.h;
	},
};


//###########################  Image Wrapper  ######################################################
function R2D_Img(filename)  {
	this.filename = filename;
	this.init(filename);
}

R2D_Img.prototype = {
  imgLoaded: false,

  init: function(filename) {
    var self = this;
    this.img = new Image();
    this.img.onload = function() {
      self.imgLoaded = true;
    }
    this.img.src = filename;
  },

  isLoaded: function() {
    return (this.imgLoaded); 
  },
  
  unLoad:  function() {
  	this.img.src = "r2d_blackdot.gif";
  },
  
  draw:  function(ctx,x,y) {
  	if (this.imgLoaded) {
  		ctx.drawImage(this.img, x, y);
  		}
  	},

};


//###########################  Image List  ######################################################

// Use this to load lists of images
// For example, all the images used in a level/world

function R2D_ImgList() {
	}

R2D_ImgList.prototype = {
  
  imgList : [],
  
  addImg: function(filename) {
  	var isnew;
  	isnew = true;
  	
  	//Check if filename is registered already, return r2d_img if it is
  	for (var i = 0; i < this.imgList.length; i++){
  		if (this.imgList[i].filename == filename) {
  			isnew = false;
  			return this.imgList[i];
  			}
  	}
  	
  	//If filename is not registered, register a new r2d_img and return it
  	if (isnew) {		
  		var newimg;
  		newimg = new R2D_Img(filename);
    	this.imgList.push(newimg);
    	return newimg;
    	}
  	},
  
  //Free all imgs in list from memory
  unLoad: function() {
  	for (var i = 0; i < this.imgList.length; i++) {
  			this.imgList[i].unLoad();
  			}
  },
  
  //Return % of images loaded
  getLoaded: function() {
  		var loaded = 0;
  		size = this.imgList.length;
  		for (var i = 0; i < size; i++) {
  			if ( this.imgList[i].isLoaded() ) {
  				loaded+=1;
  				}
  		}
  			
      	if (size == 0) { loaded=1; }
      		else { loaded/=size; }
      return loaded;
  	  },
};

//////////////////////////////////////////////////////////////////////////////////
//  Sprites and Animation
//////////////////////////////////////////////////////////////////////////////////


//###########################  Anim Frame  ######################################################
function R2D_SpriteAnimFrame(xpos,ypos)  {
	this.xpos = xpos;
	this.ypos = ypos;
}

//###########################  Sprite Animation  ######################################################
function R2D_SpriteAnim(imglist,filename,num_f, f_per_row, f_width, f_height, f_offset, x_px_offset, y_px_offset)  {
	
	
	this.r2d_img = imglist.addImg(filename);
	this.num_frames = num_f;
	this.speed = 10; //default
	
	this.origin_x = 0;
	this.origin_y = 0;
	
	this.bbox = {
		x: 0,
		y: 0,
		width: f_width,
		height: f_height
		};
	this.bbox.hw = f_width/2;
	this.bbox.hh = f_height/2;
	
	this.width = f_width;
	this.height = f_height;
	
	this.frameList = [];
	this.init(f_per_row,f_offset, x_px_offset, y_px_offset);
	};
	
R2D_SpriteAnim.prototype = {
  
  getImg: function() {
  	return this.r2d_img;
  },
  
  setOrigin: function(x,y) {
  	this.origin_x = x;
  	this.origin_y = y;
  },
  
  centerOrigin: function() {
  	this.origin_x = this.width / 2;
  	this.origin_y = this.height / 2;
  },
  
  setBounds: function(x,y,w,h) {
  	this.bbox.x = x;
  	this.bbox.y = y;
  	this.bbox.width = w;
  	this.bbox.height = h;
  },
  
  setSpeed: function(speed) {
  	this.speed = speed;
  },
  
  addFrame: function(xpos,ypos) {
    this.frameList.push( new R2D_SpriteAnimFrame(xpos,ypos) );
  },
  
  init: function(f_per_row,f_offset, x_px_offset, y_px_offset) {
  	
  	//Note:  Image speed - should I include it here???
  	var count = 0;
  	var foff_count = f_offset; //frame offset
  	
  	for (var i=0; i<this.num_frames; i++) {
  		var ax,ay;
  		ax=x_px_offset +  ( ( (i + f_offset) % f_per_row ) * this.width );
  		ay=y_px_offset + ( Math.floor( (i + f_offset) / f_per_row ) * this.height);
  		
  		this.addFrame(ax,ay);
  		}
  },
  
  draw: function(ctx,frame,x,y,scale,alpha) {
  		
  		/* context.drawImage with nine arguments = draw with clipping.  The arguments are, in order:
       * the image; the left side of the region in the source image to start clipping; the top side
       * of the region in the source image to start clipping; the width and height of the rectangle in
       * the source image to clip; the x and y position on the canvas to plot the clipping; and the
       * width and height of the plotted clipping. */
      	var fr = this.frameList[frame];
      	var dw = this.width;
      	var dh = this.height;
      	
      	ctx.save();
		ctx.globalAlpha = alpha;
      	ctx.drawImage(this.r2d_img.img, fr.xpos, fr.ypos, dw, dh, x, y, dw * scale,dh * scale );
      	ctx.restore();
  },
  
 

};
//###########################  Draw Instance (SPI)  ######################################################
function R2D_DrawInstance(x,y,z) {
	this.initDi(x,y,z);
}

R2D_DrawInstance.prototype.initDi = function(x,y,z){
	
	initEvents(this);
	
	this.spilist = null;
	
	this.bbox = {
		x: 0,
		y: 0,
		width: 1,
		height: 1,
		hw: 0.5,
		hh: 0.5
		};
	
	this.x=x;
	this.y=y;
	this.z=z;
	
	this.alpha = 1;
	
	
	
	this.peg = {
		x: null,
		y: null,
		o: null
	};
	
	this.bindPosObj = null;
	
	this.tween = null;
	
	this.visible=true;      //Draw to renderer
	this.clickable=false;   //Add to clicktree
	
	this.drawBbox = false;
	this.drawBbox_color = "rgb(255,255,255)";
	
	this.isometric = true;  //Draw isometric (true) or perspective (false)
	this.pscale = false;    //Scale with perspective (isometric must be false)
	this.parallax = false;
	
	this.drawfunction = null;
};

R2D_DrawInstance.prototype.destroy = function() {
		var self=this;
		this.spilist.delSpi(self);
};

R2D_DrawInstance.prototype.bindPos = function(obj) {
	this.bindPosObj = obj;
};

R2D_DrawInstance.prototype.startTween = function(duration, type, to_x, to_y, to_z, to_alpha) {
		this.tween = {
					  start_time: Date.now(),
					  end_time: Date.now() + (duration * 1000),
					  duration: duration * 1000,
			
					  start_x: this.x,
					  start_y: this.y,
					  start_z: this.z,
					  start_a: this.alpha,
		
					  off_x: to_x - this.x,
					  off_y: to_y - this.y,
					  off_z: to_z - this.z,
					  off_a: to_alpha - this.alpha,
					  type: type,
					};
};
	
R2D_DrawInstance.prototype.updateTween = function() {
		if (this.tween != null)
			{
				var t = this.tween;
				var p = (Date.now() - t.start_time) / t.duration;
				
				if (p>=1)
					{
						var ev = new Event( "sprite_tweenend" );
						this.eventPerform( ev );
						var t = this.tween;
						this.x = t.start_x + t.off_x;
						this.y = t.start_y + t.off_y;
						this.z = t.start_z;
						this.alpha = t.start_a;
						this.tween = null;
					}
				else {
						var cp= (p*2)-1;
						var c=Math.sqrt( 1-(cp * cp) );
						this.x = t.start_x + (p * t.off_x);
						this.y = t.start_y + (p * t.off_y);
						
						this.z = t.start_z + (p * t.off_z);
						this.alpha = t.start_a + (c * t.off_a);
					 }
				
			}
};
	
R2D_DrawInstance.prototype.setSpiList = function(spilist) {
		this.spilist = spilist;
};

R2D_DrawInstance.prototype.setDrawF = function(f) {
		this.drawfunction = f;
};
	
R2D_DrawInstance.prototype.setPeg = function(pegX,pegY,pegObj) {
		this.peg.x = pegX;
		this.peg.y = pegY;
		this.peg.o = pegObj;
};
	
R2D_DrawInstance.prototype.isPegged = function() {
		return (this.peg.o != null);
			
};

R2D_DrawInstance.prototype.setPos = function(x,y,z) {
		this.x=x;
		this.y=y;
		this.z=z;
};

R2D_DrawInstance.prototype.copyPos = function(obj) {
		this.x=obj.x;
		this.y=obj.y;
		this.z=obj.z;
};
	
R2D_DrawInstance.prototype.setVisible = function(visible) {
		this.visible = visible;
};
	
R2D_DrawInstance.prototype.setBounds = function(x,y,w,h) {
  	this.bbox.x = x;
  	this.bbox.y = y;
  	this.bbox.width = w;
  	this.bbox.height = h;
 };
	
R2D_DrawInstance.prototype.setClickable = function(clickable) {
		this.clickable=clickable;
};
	
R2D_DrawInstance.prototype.setAlpha = function(alpha) {
		this.alpha=alpha;
};
	
R2D_DrawInstance.prototype.setDrawBbox = function(color) {
		this.drawBbox = true;
		this.drawBbox_color = color;
		
};
	
R2D_DrawInstance.prototype.setParallax = function(bool) {
		this.parallax = bool;
};
	
R2D_DrawInstance.prototype.setPerspective = function(pscale) {
		this.isometric=false;
		this.pscale = pscale;
};
	
R2D_DrawInstance.prototype.setIsometric = function() {
		this.isometric=true;
		this.pscale = false;
};

R2D_DrawInstance.prototype.get_render_bbox = function(x,y,scale) {
		var bdx = x;
		var bdy = y;
		var bb = this.bbox;
		
		var r = {
				x: bdx + (bb.x * scale),
				y: bdy + (bb.y * scale),
				w: bb.width * scale,
				h: bb.height * scale
			};
		return r;	
};
	
R2D_DrawInstance.prototype.render_bbox = function(ctx,x,y,scale)	{
		
		var r = this.get_render_bbox(x,y,scale);
			
		ctx.save();
		ctx.fillStyle = this.drawBbox_color;
        ctx.fillRect(r.x,r.y,r.w,r.h);
        ctx.restore();
		
};
	
R2D_DrawInstance.prototype.getDrawPos = function(x,y) {
		
		this.updateTween();
		
		
		//vvv Should this be here???//
		if (this.bindPosObj != null) {
			this.copyPos(this.bindPosObj);
		}
		//////////////////////////////
		
		var p = {
			x : x,
			y : y
		};
		
		if ( this.isPegged() ) {
			var b = this.peg.o.bbox;
			switch (this.peg.x) {
				case "left": p.x+= b.x; break;
				case "center": p.x+= b.x + b.hw; break;
				case "right": p.x+= b.x + b.width - this.bbox.width; break;
			}
			switch (this.peg.y) {
				case "top": p.y+= b.y; break;
				case "middle": p.y+=  b.y + b.hh; break;
				case "bottom": p.y+= b.y + b.height - this.bbox.height; break;
			}
		}
		return p;
		
};

R2D_DrawInstance.prototype.render = function(ctx,delta,x,y,scale) {
  		this.drawfunction(ctx,delta,x,y,scale);
};

//###########################  Sprite Instance (SPI)  ######################################################
function R2D_SpriteInstance(r2d_spanim,start_frame,x,y,z) {
	this.initDi(x,y,z);
	this.initSpi(r2d_spanim,start_frame);
}

R2D_SpriteInstance.prototype = new R2D_DrawInstance;

R2D_SpriteInstance.prototype.initSpi = function(r2d_spanim,start_frame) {
	this.sprite_index = r2d_spanim;
	this.bbox = this.sprite_index.bbox;
	this.frame_index = start_frame;
	this.frame_single = null;
	
	this.width = this.sprite_index.width;
	this.height = this.sprite_index.height;
	
	this.tile_x = false;
	this.tile_y = false;
	
	this.setDrawF(this.spi_drawSprite);
};

R2D_SpriteInstance.prototype.destroyOnAnimEnd = function() {
		this.setEvent("sprite_animend", this.destroy)
};
	
R2D_SpriteInstance.prototype.tileXY = function(tilex,tiley) {
		this.tile_x = tilex;
		this.tile_y = tiley;
};
	
R2D_SpriteInstance.prototype.setSprite = function(sprite_index) {
		this.sprite_index = sprite_index;
		this.bbox = sprite_index.bbox;
		this.width = this.sprite_index.width;
		this.height = this.sprite_index.height;
};
	
R2D_SpriteInstance.prototype.setFrame = function(frame_index) {
		this.frame_index = frame_index;
};
	
R2D_SpriteInstance.prototype.setFrameSingle = function(frame_index) {
		this.frame_single = frame_index;
		this.frame_index = frame_index;
};
	
R2D_SpriteInstance.prototype.setFrameAnimate = function() {
		this.frame_single = null;
};
	
	//Note:  draw is internal - change
R2D_SpriteInstance.prototype.spi_drawSprite =  function(ctx,delta,x,y,scale) {
	
		var sp = this.sprite_index;
		var fi = Math.floor(this.frame_index);
	
		//Tells sprite anim to draw itself
		sp.draw(ctx,fi,x,y,scale,this.alpha);

		if (this.frame_single == null) {
			var f_add = this.frame_index + (delta * sp.speed);
			
		
			if (f_add > sp.num_frames) {
				var ev = new Event( "sprite_animend" );
				this.eventPerform( ev );
				}

      		this.frame_index = f_add % sp.num_frames;
      		}
  };


//###########################  Sprite Number (SPI)  ######################################################
//Used for scores and gui stuff

function R2D_SpriteNumber(r2d_spanim,x,y,z,obj,maxdec) {
	this.initDi(x,y,z);
	this.obj = obj;
	this.maxdec = maxdec;
	
	this.sprite_index = r2d_spanim;
	this.num_bbox = this.sprite_index.bbox;
	
	this.digit = [];
	this.updateVal();
	this.setDrawF(this.spi_drawNum);
}

R2D_SpriteNumber.prototype = R2D_DrawInstance;

R2D_SpriteNumber.prototype.updateVal = function() {
	var n = this.obj.val;
	
		for (var i = 0; i<this.maxdec; i++) {
			var v = Math.floor( n  % Math.pow(10,i+1) / Math.pow(10,i) );
  			this.digit[i] = v;
		}
};

R2D_SpriteNumber.prototype.spi_drawNum = function() {
		this.updateVal();
		
		for (var i = 0; i<this.maxdec; i++) {
	
			if (n >= Math.pow(10,i) ) { 
				
					alert('poo');
					//? - WHERE do i draw each digit
					//? - How (draw function) do i draw each digit?
						//Problem - origin - xy - shouldn't spanim handle it?  How is it handled now? <-do that first
					//inherited - draw_sprite/frame from spanim
				
  					//draw this.digit[i] 
  					//this.spi[i] =  window.spilist.addSpi(sprite,0,x - (10 * i ),y, (i * 0.01) + z);
  				}
  			}
	
	};

//###########################  SPI (Sprite Instance) List  ######################################################
function R2D_SpiList(x,y,z) {
	this.x = x;
	this.y = y;
	this.z = z;
	
	this.spiList = [];
}

R2D_SpiList.prototype = {
	
	addSpi: function(r2d_spanim,start_frame,x,y,z) {
		var spi = new R2D_SpriteInstance(r2d_spanim,start_frame,x,y,z);
		this.spiList.push( spi );
		var self = this;
		spi.setSpiList(self);
		return spi;
	},
	
	delSpi: function(spi) {
		size=this.spiList.length;
		//alert('size: ' + size);		
		delspi_loop: for (var i=0; i<size; i++) {
			//alert('spi: '+spi + ', this.spiList[i]: '+ this.spiList[i]);
			if (this.spiList[i] == spi) {
				this.spiList[i].setSpiList(null);
				this.spiList.splice(i,1);	//Splice works			
				break delspi_loop;
			}
		}
		
	},
	
	getListCopy: function() {
		return this.spiList.slice(0);
	},
};


//###########################  Camera  ######################################################
const TANCAM = Math.tan(Math.PI * 0.125);

function R2D_Camera(x,y,z)  {
	this.x = x;
	this.y = y;
	this.z = z;
}

R2D_Camera.prototype = {
	
	setZplane: function(win,zplane) {
		var v = win.getView();
		this.z = -(TANCAM * v.hh) + zplane;
	},
	
	getZplane: function(win) {
		var v = win.getView();
		var zplane = this.z + (TANCAM * v.hh);
		return zplane;
	},
	
};

//###########################  Renderer  ######################################################
function R2D_Renderer(r2d_win,spiList,camera)  {
	this.win = r2d_win; 
	this.ctx = r2d_win.getContext();
	this.spiList = spiList;
	this.camera = camera;
	
	this.showfps = false;
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////
	//  Event Binders
	//////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	initEvents(this);  //init events (event.js)
	
	
	//Init Mouse Position
	this.mouse = {
		active: false,
		wx: 0,
		wy: 0,
		x: 0,
		y: 0,
		tx: 0,
		ty: 0,
		twx: 0,
		twy: 0,
		tdown: false,
		down: false
	};
	
	var self = this;
	
	//Mouse Events
	$(document).mousemove(function(e){
  		self.mouse.x = e.pageX;
  		self.mouse.y = e.pageY;
  		self.mouse.active = true;
   		});
	
	$(document).mousedown(function(e){
  		//Note:  Check for which mouse button later on
		self.mouse.down = true;
		self.mouse.active = true;
   		});
   	//Touch Events
   	document.addEventListener('touchstart', function(e) {
    	e.preventDefault();
    	var touch = e.touches[0];
    	self.mouse.tx = touch.pageX;
    	self.mouse.ty = touch.pageY;
    	self.mouse.tdown = true;
	}, false);
   	
	
	
}

R2D_Renderer.prototype = {
	
	clearMouse: function() {
		this.mouse.down = false;
		this.mouse.tdown = false;
	},
	
////Note:  Pass Camera, Window, and Spi
	inViewIso: function(win,cam,spi) {
		return false;
	},
	
	inViewPerspective: function(win,cam,spi) {
		return false;
	},
	
	clearCtx: function(w,h) {
		/////////////////////////////////////////
  	    //Use this to clear context
		//this.ctx.save();
		this.ctx.setTransform(1,0,0,1,0,0);  	
  		this.ctx.clearRect(0,0,w,h);
  		//this.ctx.restore();
  		/////////////////////////////////////////
	},
	
	showFps: function(bool) {
		this.showfps = bool;
	},
	
	drawFps: function(delta) {
		var r = {
				x: 0,
				y: 0,
				w: 96,
				h: 32
			};
		this.ctx.save();
		this.ctx.fillStyle = "rgb(255,255,255)";
        this.ctx.fillRect(r.x,r.y,r.w,r.h);
        this.ctx.fillStyle = "rgb(0,0,64)";
        this.ctx.fillRect(r.x+1,r.y+1,r.w-2,r.h-2);
        this.ctx.fillStyle = "#5C8CD9";
        this.ctx.fillRect(r.x+2,r.y+2,r.w-4,r.h-4);
        this.ctx.fillStyle = "rgb(0,0,64)";
		this.ctx.font= "18px sans-serif";
		this.ctx.textBaseline = 'middle';
		var txt = 'FPS: '+ Math.floor(1/delta);
        this.ctx.fillText(txt,17, 17);
        this.ctx.fillStyle = "rgb(255,255,255)";
        this.ctx.fillText(txt,16, 16);
        this.ctx.restore();
	},
	
	render: function(delta) {
		
		//////////////////////////////////////////////////////////////
  		// Update window and get view
  		//////////////////////////////////////////////////////////////
		
		//Update Window Vars
		this.win.update(this.camera);
		
		//Get View
		var view = this.win.getView(this.camera);
		this.clearCtx(view.w,view.h);
  		
  		var dscale = this.win.getWinScale();
  		this.mouse.wx = this.mouse.x * dscale;
  		this.mouse.wy = this.mouse.y * dscale;
  		this.mouse.twx = this.mouse.tx * dscale;
  		this.mouse.twy = this.mouse.ty * dscale;
  		
  		
  		//V temp
  		//Makes blue square
  		/*
  		this.ctx.save();
  		this.ctx.translate(-256,-256);
  		this.ctx.fillStyle = "rgb(0,0,255)";
        this.ctx.fillRect(0,0,view.w,view.h);
  		*/
  		////////////////////////////////////
  		
  		//////////////////////////////////////////////////////////////
  		// Get ZList and Sort
  		//////////////////////////////////////////////////////////////
  		
		//get zlist
		var zlist = this.spiList.getListCopy();
		
		//define zsort function
		zsort = function(a,b)  {
			return (b.z - a.z);
		};

		//zsort
		zlist.sort(zsort);
		
		
		
		//////////////////////////////////////////////////////////////
  		// Iterate through ZList
  		//////////////////////////////////////////////////////////////
		var rlist = []; //Create rectlist
		
		//NOTE:  Only checks IMG and SCREEN intersection.
		//If BBOX is larger or outside of the IMG, it won't work!!!
		
		var size = zlist.length;
		
		for (var i=0;i<zlist.length;i++) {
			// should i draw the spi?
			if (zlist[i].visible
				| zlist[i].clickable
				| zlist[i].drawBbox ) {
			
				//is spi in front of the camera?
				if (zlist[i].z > this.camera.z) {
					
							//Get draw x, y, and scale
							var dx = - this.camera.x + zlist[i].x - zlist[i].sprite_index.origin_x;
							var dy = - this.camera.y + zlist[i].y - zlist[i].sprite_index.origin_y;
							var sz = 1;
							
							//if (zlist[i] == window.spiTest)
							//	{alert('render in xy: '+ Math.round(zlist[i].x + this.camera.x) +',' + Math.round(zlist[i].y + this.camera.y) );}
							
							if (!(zlist[i].isometric)) {
								sz = (TANCAM * view.hh) / (- this.camera.z + zlist[i].z);
								dx*= sz;
								dy*= sz;
								}
							
							//Add ctx_center to x and y
							dx+= view.hw;
							dy+= view.hh;
							
							//Check for scaling (perspective drawing only)
							var scale = 1;
							if (zlist[i].pscale & !(zlist[i].isometric) ) {
								scale = sz;
							}
							
							//Parallax (temp)
							if (zlist[i].parallax) {
								dx = zlist[i].x;
								dy = zlist[i].y;
								scale = 1;
							}
							
							//Apply Spi.render changes
							var p = zlist[i].getDrawPos(dx,dy);
							dx = p.x;
							dy = p.y;
							
							//Get rectangles
							var rv = getRect(0,0,view.w,view.h);
							var rs = getRect(dx,dy,zlist[i].width * scale, zlist[i].height * scale);
							
							if (intersectRect(rv,rs)) {
								
								if (zlist[i].visible) {
									zlist[i].render(this.ctx,delta,dx,dy,scale);
									}
									
								if (zlist[i].drawBbox) {
									zlist[i].render_bbox(this.ctx,dx,dy,scale);
									}
									
								if (zlist[i].clickable) {
									var rect = zlist[i].get_render_bbox(dx,dy,scale);
									rect.spi = zlist[i];
									
									rlist.push(rect);
									}
							//if (zlist[i] == window.spiTest)
							//	{alert('render out xy: '+ Math.round(dx) +',' + Math.round(dy) );}
							
							}
						
								
				}
			}
		}
		
		//////////////////////////////////
		//Draw mouse
		//this.ctx.fillStyle = "rgb(0,128,256)";
        //this.ctx.fillRect( this.mouse.wx - 8,this.mouse.wy - 8,16,16);
		//////////////////////////////////////////////
		
		
		//Reverse rlist
		rlist.reverse();
		
		
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//Parse rlist for events
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		var ev_spi = null;  //Spi that mouse events are acting on
		
		
		//point rect intersect function
		var p_r_intersect =  function(x,y,rect) {
  				return !( (x > rect.x + rect.w) | 
            	(x < rect.x) | 
            	(y > rect.y + rect.h) |
            	(y < rect.y) );	
			}
		
		//Iterate through rlist, break at first mousePos / rect intersection, set ev_spi to intersecting spi
		var size = rlist.length;
		//if (this.mouse.active) {
			iloop: for (var i=0;i<size;i++) {
				if ( p_r_intersect(this.mouse.wx,this.mouse.wy,rlist[i]) ) {
					ev_spi = rlist[i].spi;
					break iloop;
				}
				
				if (this.mouse.tdown) {
					if ( p_r_intersect(this.mouse.twx,this.mouse.twy,rlist[i]) ) {
						ev_spi = rlist[i].spi;
						break iloop;
					}
				}
			
			}
		//}
		
		if (ev_spi != null) {
			var ev;
			ev = new Event("sprite_mouseover");
			//Later - set ev.x, ev.y, ect 
			ev_spi.eventPerform( ev );
			
			ev = new Event("sprite_cursorover"); 
			ev_spi.eventPerform( ev );
			
			if (this.mouse.down) {
				var ev;
				ev = new Event("sprite_mousedown");
				//Later - set ev.x, ev.y, ect 
				ev_spi.eventPerform( ev );
				
				ev = new Event("sprite_cursordown"); 
				ev_spi.eventPerform( ev );
				}
			if (this.mouse.tdown) {
				var ev;
				ev = new Event("sprite_touchdown");
				//Later - set ev.x, ev.y, ect 
				ev_spi.eventPerform( ev );
				
				ev = new Event("sprite_cursordown"); 
				ev_spi.eventPerform( ev );
				}
			}
		
		
		
		//Clear Mouse
		this.clearMouse();
		
		
		//this.ctx.restore();
		
		if (this.showfps) {
			this.drawFps(delta);
		}
		
		//Stretch to fit window
		$("#stretch").css("width", $(window).width() );
    	$("#stretch").css("height", $(window).height() );	
		
	 },
	
};
