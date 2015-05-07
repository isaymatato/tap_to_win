function Ttw_Sprites()  {
	this.imglist = new R2D_ImgList();
	this.initImg();
	this.loadSpAnim();
	}

Ttw_Sprites.prototype = {
	initImg: function() {
		  //Define Images
  		this.img_hitbut = "hit.png";
  		this.img_staybut = "stay.png";
  		this.img_rollbut = "roll.png";
  		this.img_newbut = "newgame.png";
  
  		this.img_title = "title_136x148.png";
  		this.img_skull = "skull_128x128.png";
  		this.img_cherry = "cherry_96x128.png";
  		this.img_lemon = "lemon_108x128.png";
  		this.img_grape = "grape_90x136.png";
  		this.img_chest = "chest_120x136.png";
  
  		this.img_mblur = "icons_mblur_128x128.png";
  		this.img_redcross_big = "redcross_144x144.png";
  
  
  		this.img_pips = "pips_20x24.png";
  		this.img_redcross_pip = "redcross_20x20.png";
  
  		this.img_skybg = "skybg.png";
  
  		this.img_score = "score.png";
  		this.img_hiscore = "hiscore.png";
  		this.img_nums = "numbers_16x20.png";
  		this.img_itxt = "icontext_200x64.png";
  
  
  	},
  	
  	loadSpAnim: function() {
  		this.skybg = new R2D_SpriteAnim(this.imglist,this.img_skybg,1,1,640,320, 0, 0, 0);
  		this.skybg.centerOrigin();
  		this.title = new R2D_SpriteAnim(this.imglist,this.img_title,1,1,136,148, 0, 0, 0);
  		this.title.centerOrigin();
  		this.itxt = new R2D_SpriteAnim(this.imglist,this.img_itxt,6,1,200,64, 0, 0, 0);
  		this.itxt.centerOrigin();
  		
  		//Load Sprites
  		//R2D_SpriteAnim(r2d_imglist , filename , # of frames, frames per row,frame width , frame height , frame offset,pixel offset x, pixel offset y)
  		this.score = new R2D_SpriteAnim(this.imglist,this.img_score,1,1,64,20, 0, 0, 0);
  		this.hiscore = new R2D_SpriteAnim(this.imglist,this.img_hiscore,1,1,80,20, 0, 0, 0);
  		this.nums = new R2D_SpriteAnim(this.imglist,this.img_nums,11,11,16,20, 0, 0, 0);
  
  
  
  		this.hitbut = new R2D_SpriteAnim(this.imglist,this.img_hitbut,1,1,96,48, 0, 0, 0);
  		this.staybut = new R2D_SpriteAnim(this.imglist,this.img_staybut,1,1,96,48, 0, 0, 0);
  		this.rollbut = new R2D_SpriteAnim(this.imglist,this.img_rollbut,1,1,96,48, 0, 0, 0);
  		this.newbut = new R2D_SpriteAnim(this.imglist,this.img_newbut,1,1,96,48, 0, 0, 0);
  
  		this.pips = new R2D_SpriteAnim(this.imglist,this.img_pips,6,6,20,24, 0, 0, 0);
  		this.redcross_pip = new R2D_SpriteAnim(this.imglist,this.img_redcross_pip,1,1,20,20, 0, 0, 0);
  		
  		this.skull = new R2D_SpriteAnim(this.imglist,this.img_skull,1,1,128,128, 0, 0, 0);
  		this.skull.centerOrigin();
  		this.cherry = new R2D_SpriteAnim(this.imglist,this.img_cherry,1,1,96,128, 0, 0, 0);
  		this.cherry.centerOrigin();
  		this.lemon = new R2D_SpriteAnim(this.imglist,this.img_lemon,1,1,108,128, 0, 0, 0);
  		this.lemon.centerOrigin();
  		this.grape = new R2D_SpriteAnim(this.imglist,this.img_grape,1,1,90,136, 0, 0, 0);
  		this.grape.centerOrigin();
  		this.chest = new R2D_SpriteAnim(this.imglist,this.img_chest,1,1,120,136, 0, 0, 0);
  		this.chest.centerOrigin();
  		this.mblur = new R2D_SpriteAnim(this.imglist,this.img_mblur,5,5,128,128, 0, 0, 0);
  		this.mblur.centerOrigin();
  
  		this.redcross_big = new R2D_SpriteAnim(this.imglist,this.img_redcross_big,1,1,144,144, 0, 0, 0);
  		this.redcross_big.centerOrigin();
  	},
  	
  	getLoaded: function() {
  		return ( this.imglist.getLoaded() );
  	},
	
};
