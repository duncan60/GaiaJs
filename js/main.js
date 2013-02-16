var gaiaJs_main=(function(){	
	var gaia,$loader,$content;
	//gaiaJs初始化完畢
	var gaiaInitComplete=function(c,l){
		$content=$(c);
		$loader=$(l);
	};
	//內容退場，loading出現，開始載入動作 
	var transitionOut=function(){
		$content.fadeOut('slow',function(){
			$loader.css('width',"0%");
			$loader.fadeIn('slow');
			gaia.loadStart();
		})
	};
	//載入進度
	var loadProgress=function(p){
		$loader.css('width',p+"%");
		$loader.find('p').text("Loading:"+p+"%");
	};
	//loading消失，內容進場，頁面初始化
	var transitionIn=function(id){
		$loader.fadeOut('slow',function(){
			$content.fadeIn('slow');
			pageInit(id);
		});
		
	};
	/*  page init  */
	var pageInit=function(id){
		switch(id){
			case "flash":
				flashInit();
			break;
			case "youtube":
				youtubeInit();
			break;
		}
	}
	var flashInit=function(){
		var flashvars = {};
		var paramsAd = {quality: "high",wmode:"transparent",allowscriptaccess: "always",bgcolor: "#FFFFFF"};
		var swfId = {id: "mainSwf",name: "mainSwf"};
		swfobject.embedSWF("page/test.swf", "flashcontent", "1000", "500", "10.0.0", null, flashvars, paramsAd, swfId);
	}
    var youtubeInit=function(){
		$("#demo1").youtubeBox({
		  width:720,
		  height:400
		 });
		$("#demo2").groupIndex({
  			bindType:'click',
  			callBack:function(num,target){alert("第"+num+"被點擊");}
		});
	}
	/* end */
	//配置參數
	var configObj={
		base:"page/",
		initComplete:gaiaInitComplete,
		transitionIn:transitionIn,
		transitionOut:transitionOut,
		progress:loadProgress
	};
	gaia=GaiaJs();
	gaia.init(configObj);
})();