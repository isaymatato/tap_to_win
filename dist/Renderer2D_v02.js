//V 0.2

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
	initEvents(this);
	this.context = $("#game-canvas")[0].getContext("2d");

	this.r2d = new R2D_Renderer(this);
	this.r2d.bind(this);
	
	this.grid_w = 0;
	this.grid_h = grid_h;
	this.res = 16;//res;
	
	this.bbox = {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		};
	
	this.camera = new R2D_Camera(0,0,0,this);
	this.camera.setZplane(0);
	
	this.update();
}

	
R2D_Win.prototype.render = function(delta) {
		this.update();
		this.r2d.render(delta);
};
	
R2D_Win.prototype.setCamera = function(x,y) {
		this.camera.setPos2D(x,y);
};
	
R2D_Win.prototype.getCamera = function() {
		return this.camera;
};
	
R2D_Win.prototype.calcRez = function(h) {
		this.res = Math.floor(h/15);
};
	
R2D_Win.prototype.setGrid = function(w,h) {
		//Check if window size is different before calculating!!!!!!
		this.grid_w = w/this.res;
		this.grid_h = h/this.res;
};
	
R2D_Win.prototype.setGridHeight = function(grid_h) {
		this.grid_h = grid_h;
};
	
R2D_Win.prototype.getWinScale = function() {
		return (this.grid_h * this.res) / this.win_h;
};
	
R2D_Win.prototype.getContext = function() {
		return this.context;
};
	
R2D_Win.prototype.getAspectRatio = function() {
		return (this.win_w / this.win_h);
};
	
R2D_Win.prototype.getWinBox = function() {
		self=this;
		var w = {
			x: 0,
			y: 0,
			w: self.win_w,
			h: self.win_h
		};
		return w;
};
	
R2D_Win.prototype.getView = function() {
		
		var v = {
			camera: this.camera,
			h: this.grid_h * this.res,
		};
		
		v.w = this.wh_ratio * v.h;
		v.hw = v.w/2;
		v.hh = v.h/2;
		v.x = this.camera.x - v.hw;
		v.y = this.camera.y - v.hh;
		v.z = this.camera.getZplane(this);
			
		
		return v;
};
	
R2D_Win.prototype.getViewHalfHeight = function() {
		var h = this.grid_h * this.res;
		return h/2;
};
	
R2D_Win.prototype.winPosToGridPos = function(x,y) {
		var v = this.getView(this.camera);
		var ratio = v.h / this.win_h;
		var pos = {
			x: v.x + (x * ratio), 
			y: v.y + (y * ratio)
			};
			
		return pos;
};
	
R2D_Win.prototype.updateBbox = function(view) {
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

};
	
R2D_Win.prototype.update = function() {
		this.win_w = $(window).width();
		this.win_h = $(window).height();
		this.wh_ratio = this.win_w / this.win_h;
		this.grid_w = this.grid_h * this.wh_ratio;
		
		var v = this.getView(this.camera);

		this.updateBbox(v);
		
		$("#game-canvas")[0].width = v.w;
		$("#game-canvas")[0].height = v.h;
	};


R2D_Win.prototype.getContext = function() {
	return this.context;
};

R2D_Win.prototype.getSpiList = function() {
	return this.r2d.getSpiList();
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
	
	this.origin = { x:0, y:0, w:f_width, h:f_height };
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
  	
  	this.origin.x = x;
  	this.origin.y = y;
  },
  
  setOriginBox: function(x,y,w,h) {
  	this.origin_x = x;
  	this.origin_y = y;
  	
  	this.origin.x = x;
  	this.origin.y = y;
  	this.origin.w = w;
  	this.origin.h = h;
  },
  
  centerOrigin: function() {
  	this.origin.x = this.width / 2;
  	this.origin.y = this.height / 2;
  	
  	this.origin_x = this.width / 2;
  	this.origin_y = this.height / 2;
  	
  	this.origin.w = 0;
  	this.origin.h = 0;
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
      	ctx.drawImage(this.r2d_img.img, fr.xpos, fr.ypos, dw, dh, Math.round(x), Math.round(y), dw * scale,dh * scale );
      	ctx.restore();
  },
  
  draw_ext: function(ctx,frame,x,y,scale,alpha,mirror,flip) {
  		var fr = this.frameList[frame];
      	var dw = this.width;
      	var dh = this.height;
      	var dwS = dw * scale;
      	var dhS = dh * scale;
      	
      	var tx = 0;
      	var ty = 0;
      	var sx = 1;
      	var sy = 1;
      	
      	if (mirror) {tx = dwS; sx = -1;}
      	if (flip) {ty = dhS; sy = -1;}
      	
      	/*
      	 canvas = document.createElement('canvas');
		canvasContext = canvas.getContext('2d');
		
		canvasContext.translate(width, 0);
		canvasContext.scale(-1, 1);
		this.canvasContext.drawImage(image, 0, 0);
      	 */
      	
      	ctx.save();
		ctx.globalAlpha = alpha;
		ctx.translate( Math.round(tx + x),Math.round(ty + y) );
		ctx.scale(sx,sy);
		
      	ctx.drawImage(this.r2d_img.img, fr.xpos, fr.ypos, dw, dh, 0, 0, dw * scale,dh * scale );
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
	this.mouse_over = false;
	
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
	
	this.mirror = false;
	this.flip = false;
	
	this.origin = { x:0, y:0, w:0, h:0 };
	
	this.alpha = 1;
	
	this.fillcolor = "#000000";
	
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
	this.destroy_after_draw = false;
};

R2D_DrawInstance.prototype.getContext = function() {
		return this.spilist.getContext();
};

R2D_DrawInstance.prototype.destroy = function() {
		var self=this;
		this.spilist.delSpi(self);
};

R2D_DrawInstance.prototype.destroyAfterDraw = function() {
		this.destroy_after_draw = true;
};

R2D_DrawInstance.prototype.setMirror = function(bool) {
	this.mirror = bool;
};

R2D_DrawInstance.prototype.setFlip = function(bool) {
	this.flip = bool;
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
		this.bind(spilist.getWin() );
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
 
R2D_DrawInstance.prototype.setOrigin = function(x,y) {
  	this.origin.x = x;
  	this.origin.y = y;
 };
 R2D_DrawInstance.prototype.setOriginBox = function(x,y,w,h) {
  	this.origin.x = x;
  	this.origin.y = y;
  	this.origin.w = w;
  	this.origin.h = h;
 };
	
R2D_DrawInstance.prototype.setClickable = function(clickable) {
		this.clickable=clickable;
};

R2D_DrawInstance.prototype.setColor = function(color) {
		this.fillcolor = color;
};
R2D_DrawInstance.prototype.setFillColor = function(color) {
		this.fillcolor = color;
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

////////////////////////////////////////////////////////////////
//Drawing functions (shapes, text, ect)
////////////////////////////////////////////////////////////////
R2D_DrawInstance.prototype.renderCircle = function(x,y,radius,color,alpha) {
	
		var ctx = this.getContext();
		ctx.save();
		
		var lw = Math.round(radius / 32);
		if (lw < 1) lw = 1;
		ctx.lineWidth = lw;
		
		ctx.fillStyle = color;
		ctx.globalAlpha = alpha;
		
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI*2, true); 
		ctx.closePath();
		ctx.fill();
		
        ctx.restore();
};

R2D_DrawInstance.prototype.renderX = function(x,y,w,h,color,alpha) {
	
		var ctx = this.getContext();
		ctx.save();
		
		ctx.strokeStyle = color;
		ctx.globalAlpha = alpha;
		
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineTo(x+w,y+h);
		ctx.moveTo(x+w,y);
		ctx.lineTo(x,y+h);
		ctx.closePath();
		ctx.stroke();
		
        ctx.restore();
};


R2D_DrawInstance.prototype.renderText = function(x,y,text,size,color,font,alpha) {
	
		var ctx = this.getContext();
		ctx.save();
		
		ctx.fillStyle = color;
		ctx.globalAlpha = alpha;
		
		ctx.font= size + "px " + font;
		ctx.textBaseline = 'top';
        ctx.fillText(text,x,y);
		
        ctx.restore();
};

R2D_DrawInstance.prototype.renderDPad = function(fourdir,x,y,radius,color,alpha) {
	
		var ctx = this.getContext();
		ctx.save();
		
		ctx.strokeStyle = color;
		ctx.globalAlpha = alpha;
		var lw = Math.round(radius / 32);
		if (lw < 1) lw = 1;
		ctx.lineWidth = lw;
		
		var uvToXY = function(u,v,rot) {
			switch (rot % 4) {
				case 0: var p = {x: u, y:v}; break;
				case 1: var p = {x: -v, y:u}; break;
				case 2: var p = {x: -u, y:-v}; break;
				case 3: var p = {x: v, y:-u}; break;
			}
			return p;
		};
		
		var uvMoveTo = function(x,y,u,v,r) {
			var p = uvToXY(u,v,r);
			ctx.moveTo(x + p.x,y + p.y);
		}
		
		var uvLineTo = function(x,y,u,v,r) {
			var p = uvToXY(u,v,r);
			ctx.lineTo(x + p.x,y + p.y);
		}
		
		ctx.beginPath();
		if (fourdir) {
			var br = radius * 0.33;
			var tr = radius * 0.23;
			var wr = radius * 0.59;
			var pr = radius * 0.89;
			
			ctx.arc(x, y, tr, 0, Math.PI*2, true);
			
			for (var i=0;i<4;i++) {
				uvMoveTo(x,y,br,-br,i);
				uvLineTo(x,y,radius,-br,i);
				uvLineTo(x,y,radius,br,i);
				uvLineTo(x,y,br,br,i);
				
				uvMoveTo(x,y,wr,-tr,i);
				uvLineTo(x,y,pr,0,i);
				uvLineTo(x,y,wr,+tr,i);
				uvLineTo(x,y,wr,-tr,i);
				}
		}
		else {
			var br = radius * 0.22;
			var tr = radius * 0.15;
			var rr = radius * 0.92;
			var dr = radius * 0.80;
			
			var pra = radius * 0.42;
			var prb = radius * 0.52;
			var prc = radius * 0.57;
			
			ctx.arc(x, y, tr, 0, Math.PI*2, true);
			ctx.moveTo(x + radius,y);
			ctx.arc(x, y, radius, 0, Math.PI*2, true);
			ctx.moveTo(x + rr,y);
			ctx.arc(x, y, rr, 0, Math.PI*2, true);
			
			
			for (var i=0;i<4;i++) {
				uvMoveTo(x,y,br,-br,i);
				uvLineTo(x,y,dr,-br,i);
				uvLineTo(x,y,dr,br,i);
				uvLineTo(x,y,br,br,i);
				
				
				uvMoveTo(x,y,pra,-prb,i);
				uvLineTo(x,y,prc,-prc,i);
				uvLineTo(x,y,prb,-pra,i);
				uvLineTo(x,y,pra,-prb,i);
				}
				
			ctx.moveTo(x + tr,y);
		} 
		ctx.closePath();
		ctx.stroke();
        ctx.restore();
};

R2D_DrawInstance.prototype.renderAnalogJoy = function(vx,vy,x,y,radius,color,alpha) {
	
		var ctx = this.getContext();
		ctx.save();
		
		ctx.strokeStyle = color;
		ctx.globalAlpha = alpha;
		var lw = Math.round(radius / 32);
		if (lw < 1) lw = 1;
		ctx.lineWidth = lw;
		
		ctx.beginPath();

		var rr = radius * 0.92;
		var br = radius * 0.66;
		var offr = radius * 0.25;
		
		var dr = radius * 0.05;
		var dora = radius * 0.4356;
		var dor = dora - (dr * 2);
			
		var p = {
			x: vx,
			y: vy
		}
		
		var offx = offr * p.x;
		var offy = offr * p.y;
			
		ctx.arc(x, y, radius, 0, Math.PI*2, true);
		ctx.moveTo(x + rr,y);
		ctx.arc(x, y, rr, 0, Math.PI*2, true);
		ctx.moveTo(x + offx + br,y + offy);
		ctx.arc(x + offx, y + offy, br, 0, Math.PI*2, true);
		lw=Math.round(lw/2);
		if (lw<1)
			lw=1;
		ctx.lineWidth = lw;
		
		ctx.moveTo(x + offx + dora,y + offy);
		ctx.arc(x + offx, y + offy, dora, 0, Math.PI*2, true);
		
		ctx.moveTo(x + offx + dor + dr, y + offy);
		ctx.arc(x + offx + dor, y + offy, dr, 0, Math.PI*2, true);
		ctx.moveTo(x + offx - dor + dr, y + offy);
		ctx.arc(x + offx - dor, y + offy, dr, 0, Math.PI*2, true);
		ctx.moveTo(x + offx + dr, y + offy + dor);
		ctx.arc(x + offx, y + offy + dor, dr, 0, Math.PI*2, true);
		ctx.moveTo(x + offx + dr, y + offy - dor);
		ctx.arc(x + offx, y + offy - dor, dr, 0, Math.PI*2, true);
		
		ctx.moveTo(x + radius,y);

		ctx.closePath();
		ctx.stroke();
        ctx.restore();
};

R2D_DrawInstance.prototype.renderButton = function(x,y,radius,color,alpha) {
	
		var ctx = this.getContext();
		ctx.save();
		
		ctx.strokeStyle = color;
		ctx.globalAlpha = alpha;
		
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI*2, true); 
		ctx.closePath();
		ctx.stroke();
		
        ctx.restore();
};

////////////////////////////////////////////////////////////////

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
		//alert('bb: ' + Math.floor(bdx) + ',' + Math.floor(bdy) );
		return r;	
};
	
R2D_DrawInstance.prototype.render_bbox = function(x,y,scale)	{
		
		var r = this.get_render_bbox(x,y,scale);
		var ctx = this.getContext();
			
		ctx.save();
		ctx.fillStyle = this.drawBbox_color;
		//alert('render_bbox: ' + Math.floor(r.x) + ','+ Math.floor(r.y) + ';'+ r.w + ','+ r.h)
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
		
		//This needs to take both origins into account
		var p = {
			x : x,
			y : y
		};
		
		if ( this.isPegged() ) {
			var b = this.peg.o.bbox;
			switch (this.peg.x) {
				case "left": p.x+= b.x - this.origin.x; break;
				case "center": p.x+= b.x + b.hw - this.origin.x; break;
				case "right": p.x+= b.x + b.width - this.origin.w - this.origin.x; break;
			}
			switch (this.peg.y) {
				case "top": p.y+= b.y - this.origin.y; break;
				case "middle": p.y+=  b.y + b.hh - this.origin.y; break;
				case "bottom": p.y+= b.y + b.height - this.origin.h - this.origin.y; break;
			}
		}
		return p;
		
};

R2D_DrawInstance.prototype.render = function(delta,x,y,scale) {
  		this.drawfunction(delta,x,y,scale);
  		
  		if (this.destroy_after_draw) {this.destroy();}
};
//###########################  Shape Instances (SPI)  ######################################################
function R2D_CircleInstance(x,y,z,radius,color) {
	this.initDi(x,y,z);
	this.initCirc(radius,color);
}

R2D_CircleInstance.prototype = new R2D_DrawInstance;

R2D_CircleInstance.prototype.initCirc = function(radius,color) {
	this.radius = radius;
	this.fillcolor = color;
	
	this.bbox = {
		x: - this.radius,
		y: - this.radius,
		width: this.radius * 2,
		height: this.radius * 2,
		hw: this.radius,
		hh: this.radius
		};
	
	this.width = this.radius * 2;
	this.height = this.radius * 2;

	this.setDrawF(this.spi_drawCircle);
};

R2D_CircleInstance.prototype.spi_drawCircle = function(delta,x,y,scale) {
	this.renderCircle(x,y,this.radius * scale,this.fillcolor,this.alpha);
};

R2D_CircleInstance.prototype.setRadius = function(r) {
	this.radius = r;
};

//Button Instance
function R2D_ButtonInstance(x,y,z,radius,color) {
	this.initDi(x,y,z);
	this.initCirc(radius,color);
	this.setDrawF(this.spi_drawButton);
}

R2D_ButtonInstance.prototype = new R2D_CircleInstance;
R2D_ButtonInstance.prototype.constructor=R2D_ButtonInstance;

R2D_ButtonInstance.prototype.spi_drawButton = function(delta,x,y,scale) {
	this.renderButton(x,y,this.radius * scale,this.fillcolor,this.alpha);
};

//////DPad Instance
function R2D_DPadInstance(x,y,z,radius,color) {
	this.initDi(x,y,z);
	this.initDPad(radius,color);
}

R2D_DPadInstance.prototype = new R2D_DrawInstance;

R2D_DPadInstance.prototype.initDPad = function(radius,color) {
	this.radius = radius;
	this.fillcolor = color;
	
	this.bbox = {
		x: - this.radius,
		y: - this.radius,
		width: this.radius * 2,
		height: this.radius * 2,
		hw: this.radius,
		hh: this.radius
		};
	
	this.width = this.radius * 2;
	this.height = this.radius * 2;

	this.setDrawF(this.spi_drawDPad);
};

R2D_DPadInstance.prototype.spi_drawDPad = function(delta,x,y,scale) {
	this.renderDPad(this.fourdir,x,y,this.radius * scale,this.fillcolor,this.alpha);
};

R2D_DPadInstance.prototype.setRadius = function(r) {
	this.radius = r;
};





//////AnalogJoy Instance
function R2D_AnalogJoyInstance(x,y,z,radius,color) {
	this.initDi(x,y,z);
	this.initAJoy(radius,color);
}

R2D_AnalogJoyInstance.prototype = new R2D_DrawInstance;

R2D_AnalogJoyInstance.prototype.initAJoy = function(radius,color) {
	this.radius = radius;
	this.fillcolor = color;
	
	this.bbox = {
		x: - this.radius,
		y: - this.radius,
		width: this.radius * 2,
		height: this.radius * 2,
		hw: this.radius,
		hh: this.radius
		};
	
	this.width = this.radius * 2;
	this.height = this.radius * 2;

	this.setDrawF(this.spi_drawAJoy);
};

R2D_AnalogJoyInstance.prototype.spi_drawAJoy = function(delta,x,y,scale) {
	this.renderAnalogJoy(this.vgaxis.x,this.vgaxis.y,x,y,this.radius * scale,this.fillcolor,this.alpha);
};

R2D_AnalogJoyInstance.prototype.setRadius = function(r) {
	this.radius = r;
};

//////Text Instance
function R2D_TextInstance(x,y,z,text) {
	this.initDi(x,y,z);
	this.initText(text);
}

R2D_TextInstance.prototype = new R2D_DrawInstance;

R2D_TextInstance.prototype.initText = function(text) {
	this.text = text;
	this.fillcolor = "black";
	this.font = "sans-serif";
	this.fontsize = 16;
	
	this.bbox = {
		x: 0,
		y: 0,
		width: 1,
		height: 1,
		hw: 0.5,
		hh: 0.5
		};
	
	this.width = 1;
	this.height = 1;

	this.setDrawF(this.spi_drawText);
};

R2D_TextInstance.prototype.spi_drawText = function(delta,x,y,scale) {
	this.renderText(x,y,this.text,Math.floor(this.fontsize * scale),this.fillcolor,this.font,this.alpha);
};

R2D_TextInstance.prototype.setText = function(txt) {
	this.text = txt;
};
R2D_TextInstance.prototype.setFont = function(font) {
	this.font = font;
};
R2D_TextInstance.prototype.setFontSize = function(pixels) {
	this.fontsize = pixels;
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
	this.origin = this.sprite_index.origin;
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
		this.origin = sprite_index.origin;
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
R2D_SpriteInstance.prototype.spi_drawSprite =  function(delta,x,y,scale) {
	
		var sp = this.sprite_index;
		var fi = Math.floor(this.frame_index);
		var ctx = this.getContext();
	
		//Tells sprite anim to draw itself
		if (this.mirror || this.flip)
			{sp.draw_ext(ctx,fi,x,y,scale,this.alpha,this.mirror,this.flip);}
		else
			{sp.draw(ctx,fi,x,y,scale,this.alpha);}

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
function R2D_SpiList(r2d) {
	this.r2d = r2d;
	this.x = 0;
	this.y = 0;
	this.z = 0;
	
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
	
	addCircle: function(x,y,z,radius,color) {
		var spi = new R2D_CircleInstance(x,y,z,radius,color);
		this.spiList.push( spi );
		var self = this;
		spi.setSpiList(self);
		return spi;
	},
	
	addButton: function(x,y,z,radius,color) {
		var spi = new R2D_ButtonInstance(x,y,z,radius,color);
		this.spiList.push( spi );
		var self = this;
		spi.setSpiList(self);
		return spi;
	},
	
	
	addDPad: function(x,y,z,radius,color) {
		var spi = new R2D_DPadInstance(x,y,z,radius,color);
		this.spiList.push( spi );
		var self = this;
		spi.setSpiList(self);
		return spi;
	},
	
	addAnalogJoy: function(x,y,z,radius,color) {
		var spi = new R2D_AnalogJoyInstance(x,y,z,radius,color);
		this.spiList.push( spi );
		var self = this;
		spi.setSpiList(self);
		return spi;
	},
	
	addText: function(x,y,z,text) {
		var spi = new R2D_TextInstance(x,y,z,text);
		this.spiList.push( spi );
		var self = this;
		spi.setSpiList(self);
		return spi;
	},
	
	delSpi: function(spi) {
		size=this.spiList.length;	
		delspi_loop: for (var i=0; i<size; i++) {
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

R2D_SpiList.prototype.getContext = function() {
		return this.r2d.getContext();
	};
R2D_SpiList.prototype.getWin = function() {
		return this.r2d.getWin();
	};

//###########################  Camera  ######################################################
const TANCAM = Math.tan(Math.PI * 0.125);

function R2D_Camera(x,y,z,r2d_win)  {
	this.x = x;
	this.y = y;
	this.z = z;
	this.win = r2d_win;
}

R2D_Camera.prototype = {
	
	setPos2D: function(x,y) {
		this.x = x;
		this.y = y;
	},
	
	setZplane: function(zplane) {
		var vhh = this.win.getViewHalfHeight();
		this.z = -(TANCAM * vhh) + zplane;
	},
	
	getZplane: function() {
		var vhh = this.win.getViewHalfHeight();
		var zplane = this.z + (TANCAM * vhh);
		return zplane;
	},
	
};

//###########################  Renderer  ######################################################
function R2D_Renderer(r2d_win)  {
	initEvents(this);
	this.win = r2d_win; 
	this.spilist = new R2D_SpiList(this);
	
	this.showfps = false;
	
	this.rList = [];
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////
	//  Event Binders
	//////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	initEvents(this);  //init events (event.js)
	
	//point rect intersect function
	var p_r_intersect =  function(x,y,rect) {
  				return !( (x > rect.x + rect.w) | 
            	(x < rect.x) | 
            	(y > rect.y + rect.h) |
            	(y < rect.y) );	
			}
			
	
	////////////////////////////////////////////////
	//Cursor Click Events
	////////////////////////////////////////////////
	this.setEvent("global_cursordown", this.onCursorDown);
	this.setEvent("global_cursormove", this.onCursorMove);
	this.setEvent("global_cursorup", this.onCursorUp);
	
	
	////////////////////////////////////////////////
	
	
	this.setEvent("global_cursor_event", function(e) {
		
		var ev_spi = null;
			
		var size = this.rList.length;
		iloop: for (var i=0;i<size;i++) {
				if ( p_r_intersect(e.cursor.wx,e.cursor.wy,this.rList[i]) ) {
					//alert('mouse: '+ Math.floor(e.x) + ',' + Math.floor(e.y))
					//alert('rlist[i]: ' + Math.floor(this.rList[i].x) + ','+Math.floor(this.rList[i].y)+','+this.rList[i].w+','+this.rList[i].h);
					if (e.cursor.device == "mouse") {
							if (!this.rList[i].spi.mouse_over) {
								
								this.rList[i].spi.mouse_over = true;
								
								var ev = new Event("sprite_mouseon");
								ev.cursor = e.cursor;
								ev.delta = e.delta;
								this.rList[i].spi.eventPerform(ev);
								}
						}
					ev_spi = this.rList[i].spi;
					break iloop;
					}
				else {
					 if (this.rList[i].spi.mouse_over) {
								
								this.rList[i].spi.mouse_over = false;
								
								var ev = new Event("sprite_mouseoff");
								ev.cursor = e.cursor;
								ev.delta = e.delta;
								this.rList[i].spi.eventPerform(ev);
								}
				}
			}
		
		if (ev_spi != null) {
			var s = e.ev_name;
			var s2 = s.replace("global","sprite");
			
			var ne = new Event(s2);
			
			switch (e.ev_name) {
				
				
				case "global_mw_move":
				case "global_mw_down":
				case "global_mw_up": ne.dw = e.dw; break;
				
				
			}
			ne.cursor = e.cursor;
			ne.delta = e.delta;
			ev_spi.eventPerform(ne);
		}
	
				
		
	});
	
	this.setEvent("game_input", function(e) {
		var size = this.rList.length;
		var evdone = false;
		for (var i=0;i<size;i++) {
				if (this.rList[i].spi.mouse_over) {
					evdone = true;
					var ne = new Event("sprite_mouseover");
					ne.delta = e.delta;
					this.rList[i].spi.eventPerform(ne);
				}
			}
		if (!evdone) {
			var ne = new Event("nosprite_mouseover");
			ne.delta = e.delta;
			this.win.eventPerform(ne);
		}
	});
	
	
}

R2D_Renderer.prototype = {
	
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
		var ctx = this.getContext();
		ctx.setTransform(1,0,0,1,0,0);  	
  		ctx.clearRect(0,0,w,h);
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
		
		//Get View
		var view = this.win.getView();
		var cam = this.getCamera();
		this.clearCtx(view.w,view.h);
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
		var slist = this.getSpiList();
		var zlist = slist.getListCopy();
		
		//define zsort function
		zsort = function(a,b)  {
			return (b.z - a.z);
		};

		//zsort
		zlist.sort(zsort);
		
		
		
		//////////////////////////////////////////////////////////////
  		// Iterate through ZList
  		//////////////////////////////////////////////////////////////
		this.rList = []; //Clear rlist
		
		//NOTE:  Only checks IMG and SCREEN intersection.
		//If BBOX is larger or outside of the IMG, it won't work!!!
		
		var size = zlist.length;
		
		for (var i=0;i<zlist.length;i++) {
			// should i draw the spi?
			if (zlist[i].visible
				| zlist[i].clickable
				| zlist[i].drawBbox ) {
			
				//is spi in front of the camera?
				if (zlist[i].z > cam.z) {
							//Get draw x, y, and scale
							//Note.... does this mess up the bbox???
							//note... bbox calc shouldn't include origin...
							var dx = -cam.x + zlist[i].x - zlist[i].origin.x;
							var dy = -cam.y + zlist[i].y - zlist[i].origin.y;
							var sz = 1;
							
							//if (zlist[i] == window.spiTest)
							//	{alert('render in xy: '+ Math.round(zlist[i].x + this.camera.x) +',' + Math.round(zlist[i].y + this.camera.y) );}
							
							if (!(zlist[i].isometric)) {
								sz = (TANCAM * view.hh) / (- cam.z + zlist[i].z);
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
									zlist[i].render(delta,dx,dy,scale);
									}
									
								if (zlist[i].drawBbox) {
									zlist[i].render_bbox(dx,dy,scale);
									}
									
								if (zlist[i].clickable) {
									var rect = zlist[i].get_render_bbox(dx,dy,scale);
									rect.spi = zlist[i];
									
									this.rList.push(rect);
									}
							}
						
								
				}
			}
		}
		//Reverse rlist
		this.rList.reverse();
		
		
		

		if (this.showfps) {
			this.drawFps(delta);
		}
		
		//Stretch to fit window
		$("#stretch").css("width", $(window).width() );
    	$("#stretch").css("height", $(window).height() );	
		
	 },
};

R2D_Renderer.prototype.getContext = function() {
		return this.win.getContext();
	};
R2D_Renderer.prototype.getCamera = function() {
		return this.win.getCamera();
	};
R2D_Renderer.prototype.getSpiList = function() {
	return this.spilist;
}
R2D_Renderer.prototype.getWin = function() {
	return this.win;
}	

//////////////////////////////////////////
//R2D event handlers
//////////////////////////////////////////

R2D_Renderer.prototype.p_r_intersect =  function(x,y,rect) {
  				return !( (x > rect.x + rect.w) | 
            	(x < rect.x) | 
            	(y > rect.y + rect.h) |
            	(y < rect.y) );	
		};


R2D_Renderer.prototype.onCursorDown = function(e) {
		var size = this.rList.length;
		//if (e.cursor.device == "mouse") {
			//Note: 'clicking is set to true on cursor_down.
			//Note:  just need to set clickobj here...
			
		iloop: for (var i=0;i<size;i++) {
				if ( this.p_r_intersect(e.cursor.wx,e.cursor.wy,this.rList[i]) ) {
					
					var setClickObj = function(button,obj) {
								if (button.down) {
									button.clickobj = obj;
									button.downobj = obj;
								}
							};
					
					
					switch (e.cursor.device) {
						case "mouse":
									setClickObj(e.cursor.lmb, this.rList[i].spi);
									setClickObj(e.cursor.mmb, this.rList[i].spi);
									setClickObj(e.cursor.rmb, this.rList[i].spi); 
									break;
						case "touch":
									setClickObj(e.cursor, this.rList[i].spi);
									break;
						
					}
						
							
							
							
						
					//Note:
					//Click data should be global (held by r2d?)
					//Seperate data for each button (lmb,rmb,mmb, each touch, virtual cursor (joystick) )
					//e.cursor is a pointer
					break iloop;
					}
			}
		
	};
	
R2D_Renderer.prototype.onCursorMove = function(e) {
		var checkNewClickObj = function(button,newobj) {
								
								if (button.clicking) {
									if (button.clickobj != newobj)
										button.clicking = false;
										button.clickobj = null;
								}
							};
		var doDragEvents = function(button,cursor,obj,evobj,delta) {
								
								if ( (button.downobj == obj)
									 && button.press) {
									
									if (obj==null) 
										var spstr = "nosprite";
									else
										var spstr = "sprite";
									
									if (cursor.device == "mouse") {
    								var name = spstr + "_" + button.name + "drag";
    								var ev = new Event(name);
    								ev.dx = delta.x;
    								ev.dy = delta.y;
    								ev.cursor = cursor;
    								evobj.eventPerform(ev);
    								}
    			
    								var ev = new Event(spstr + "_" + cursor.device + "drag");
    								ev.dx = delta.x;
    								ev.dy = delta.y;
    								ev.cursor = cursor;
    								evobj.eventPerform(ev);
    			
    								var ev = new Event(spstr + "_cursordrag");
    								ev.dx = delta.x;
    								ev.dy = delta.y;
    								ev.cursor = cursor;
    								evobj.eventPerform(ev);
    							}
							};
			
		
		var intersect = false;
			
		var d = {
			x: e.dx,
			y: e.dy
		}
		
		var size = this.rList.length;
		iloop: for (var i=0;i<size;i++) {
				switch (e.cursor.device) {
						case "mouse":
									doDragEvents(e.cursor.lmb,e.cursor,this.rList[i].spi,this.rList[i].spi,d);
									doDragEvents(e.cursor.mmb,e.cursor,this.rList[i].spi,this.rList[i].spi,d);
									doDragEvents(e.cursor.rmb,e.cursor,this.rList[i].spi,this.rList[i].spi,d);
									break;
						case "touch":
									doDragEvents(e.cursor,e.cursor,this.rList[i].spi,this.rList[i].spi,d);
									break;
						}
				
			
				if ( this.p_r_intersect(e.cursor.wx,e.cursor.wy,this.rList[i]) ) {
					intersect = true;
					
					
					switch (e.cursor.device) {
						case "mouse":
									checkNewClickObj(e.cursor.lmb, this.rList[i].spi);
									checkNewClickObj(e.cursor.mmb, this.rList[i].spi);
									checkNewClickObj(e.cursor.rmb, this.rList[i].spi);
									break;
						case "touch":
									checkNewClickObj(e.cursor, this.rList[i].spi);
									break;
						}

					}
			}
		if (!intersect) {
			
			var w = this.getWin();
			switch (e.cursor.device) {
						case "mouse":
									doDragEvents(e.cursor.lmb,e.cursor,null,w,d);
									doDragEvents(e.cursor.mmb,e.cursor,null,w,d);
									doDragEvents(e.cursor.rmb,e.cursor,null,w,d);
									checkNewClickObj(e.cursor.lmb, null);
									checkNewClickObj(e.cursor.mmb, null);
									checkNewClickObj(e.cursor.rmb, null);
									break;
						case "touch":
									doDragEvents(e.cursor,e.cursor,null,w,d);
									checkNewClickObj(e.cursor, null);
									break;
					}
		}
		
};
R2D_Renderer.prototype.onCursorUp = function(e) {
		
		var doClickEvent = function(button,obj,evobj,device) {
								if ( button.clicking  
									&& (button.clickobj == obj) ) {
										
									var myobj = evobj;
									if (obj == null) {
										var spstr = "nosprite";
									}
									else {
										var spstr = "sprite";
									}
										
									var ev = new Event(spstr + "_cursorclick");
									ev.cursor = e.cursor;
									myobj.eventPerform(ev);
									
									var ev = new Event(spstr + "_" + device + "click");
									ev.cursor = e.cursor;
									myobj.eventPerform(ev);
									
									if (device == "mouse") {
										var ev = new Event(spstr + "_" + button.name + "_click");
										ev.cursor = e.cursor;
										myobj.eventPerform(ev);
									}
								}
								button.clickobj = null;
								button.clicking = false;
								button.downobj = null;
							};
		
		
		var intersect = false;
		var size = this.rList.length;
			
		iloop: for (var i=0;i<size;i++) {
				if ( this.p_r_intersect(e.cursor.wx,e.cursor.wy,this.rList[i]) ) {
					intersect = true;
					
					var spi = this.rList[i].spi;
					switch (e.cursor.device) {
						case "mouse":
									doClickEvent(e.cursor.lmb,spi,spi,e.cursor.device);
									doClickEvent(e.cursor.mmb,spi,spi,e.cursor.device);
									doClickEvent(e.cursor.rmb,spi,spi,e.cursor.device);
									break;
						case "touch":
									doClickEvent(e.cursor,spi,spi,e.cursor.device);
									break;
						}
					
					break iloop;
					}
			}
		if (!intersect) {
			
			var w = this.getWin();
			switch (e.cursor.device) {
						case "mouse":
									doClickEvent(e.cursor.lmb, null, w, e.cursor.device);
									doClickEvent(e.cursor.mmb, null, w, e.cursor.device);
									doClickEvent(e.cursor.rmb, null, w, e.cursor.device);
									break;
						case "touch":
									doClickEvent(e.cursor, null, w, e.cursor.device);
									break;
						}
		}
		
	};
