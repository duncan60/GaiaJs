var siteMap={	
	loader:"#loader",
	content:"#content",
	nav:".btn-list li a",
	page:[
		{
			id:"home",
			title:"GaiaJs v1.0:Home",
			path:"{base}home.html #page"
		},
		{
			id:"flash",
			title:"GaiaJs v1.0:flash",
			path:"{base}page1.html #page",
			resource:["js/swfobject.js"]
		},
		{
			id:"youtube",
			title:"GaiaJs v1.0:youtube",
			path:"{base}youtubeBox.html #page",
			resource:["js/plugin/jquery-youtubeBox.js","js/plugin/jquery-groupIndex.js"]
		}
	]
};

(function(){	
	var $loader,$content,$nav;
	//gaiaJs初始化完畢
	var gaiaInitComplete=function(c,n,l){
		$content=$(c);
		$nav=$(n);
		$loader=$(l);
	};
	//內容退場，loading出現，開始載入動作 
	var transitionOut=function(){
		$content.fadeOut('slow',function(){
			$loader.css('width',"0%");
			$loader.fadeIn('slow');
			GaiaJs.loadStart();
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
			case "home":
				enabledNav(0);
			break;
			case "flash":
				flashInit();
				enabledNav(1);
			break;
			case "youtube":
				youtubeInit();
				enabledNav(2);
			break;
		}
	}
	var enabledNav=function(num){
		$nav.each(function(index, element) {
			$(this).removeClass('active');
			if(index==num){
				$(this).addClass('active');
			}
		});
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
  			callBack:function(num,target){alert("第"+(num+1)+"被點擊");}
		});
	}
	/* end */
	//gaiaJs設定

	var configObj={
		base:"page/",
		siteMap:siteMap
	};
	GaiaJs.initComplete=gaiaInitComplete;
	GaiaJs.transitionOut=transitionOut;
	GaiaJs.progress=loadProgress;
	GaiaJs.transitionIn=transitionIn;
	GaiaJs.init(configObj);

})();