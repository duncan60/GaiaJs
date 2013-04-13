/*
 * GaiaJs v1.0.0
 * http://www.checkme.tw/wordpress/
 *
 * Copyright (c) 2012 Duncan Du
 * Date: 2013-04-12
*/

var GaiaJs=(function(){
	var Singleton={
			base:'',
			siteMap:""
		},
		$pageContent,$loader,$nav,that;
	var initialization=function(obj){
		Singleton.base=obj.base||'';
		Singleton.siteMap=obj.siteMap||"js/gaiaJs/site.json";
		typeof Singleton.siteMap==='object'?initComplete():loadJson();
	};
	var loadJson=function(){
		$.getJSON(Singleton.siteMap).success(function(json) { 
			Singleton.siteMap=json;
			initComplete();
		 })
		.complete(function() {  })
		.error(function() { alert("site json error"); });
	}
	var initComplete=function(){
			$pageContent=$(Singleton.siteMap.content);
			$nav=$(Singleton.siteMap.nav);
			that.initComplete(Singleton.siteMap.content,Singleton.siteMap.nav,Singleton.siteMap.loader);
			address.route(Singleton).init();
	}
	var controller=function(a,p){
		switch(a){
			case "loadpage":
				pageLoader.load(Singleton).start(0);
			break;
			case "loadimg":
				imgLoader.load().start($pageContent);
			break;
			case "t_Out":
				that.transitionOut(Singleton.id);
			break;
			case "t_In":
				that.transitionIn(Singleton.id);
			break;
			case "progress":
				that.progress(p);
			break;
		}
	}
	//page Loader
	var pageLoader={
		load:function(_s){
			//找尋對應的ＩＤ，json確保確實有此ＩＤ，沒有的話就去載入首頁
			var findPath=function(num){
				if(num>_s.siteMap.page.length-1){	
					_s.id=_s.siteMap.page[0].id;
					loadPage(_s.siteMap.page[0]);
					return;
				}
				_s.siteMap.page[num].id==_s.id?loadPage(_s.siteMap.page[num]):findPath(num+1);
			}
			var loadPage=function(obj){
				address.route(Singleton).changeTitle(obj.title);
				$.when(getResource(obj.resource))
			　　 .done(function(){ 
					$pageContent.load(obj.path.replace("{base}",_s.base),function(){
						controller('loadimg');
					});
				})
			　　.fail(function(){alert("load resource error"); });
			};
			var getResource=function(pathAry){
				var dtd = $.Deferred(),pa=pathAry||[],pl=pa.length;
		　　　　 	var getStart = function(num){
		　　　　　　	$.ajax(pa[num]).success(function(){
						num+=1;
						(num<pl)?getStart(num):dtd.resolve();
					})　
		　　　　  }; 　
		        getStart(0);
		　　　　 	return dtd.promise();
			}
			return{
				start:function(num){findPath(num);}
			}
		}
	};
	//load img
	var imgLoader={
		load:function(){
			var pa=[],pl,_c=0;
			var patt=/\"|\'|\)|\(|url/g;
			var getpath=function($t){
				$t.find('img').each(function(){
					pa.push($(this).attr('src'));	
				});
				$t.find('*').each(function(){
					var bg=$(this).css("background-image").replace(patt,'');
					if(bg!='none'){pa.push(bg);}
					delete bg;
				})
				pl=pa.length;
				if(pl==0){
					controller("progress",100);
					controller("t_In");	
				}else{
					loadProgress(0);
				}
			};
			var loadProgress=function(n){
				$.each(pa, function(index, value) { 
				  	var img=new Image();
					img.onload=function(){
						loadImgComplete();
					}
					img.onerror=function(){
						loadImgComplete();
					}
					img.src=value;
				});
			}
			var loadImgComplete=function()
			{
				_c+=1;
				controller("progress",parseInt(((_c)/pl)*100));
				if(_c==pa.length){
					controller("t_In");	
					pa=null;
					delete pa;
					delete pl;	
					return;

				}
			}
			return{
				start:function($t){
					getpath($t);	
				}
			}
		}
	};
	//route
	var address={
		route:function(_s){
			var addressChange=function(event){
				_s.id=event.value!=""?event.value.replace('/',""):_s.siteMap.page[0].id;
				controller("t_Out");
			};
			return{
				init:function(){
					_s.address=$.address;
					_s.address.init(function(event) {$nav.address();}).change(addressChange);
					_s.id=_s.address.value()!=""?_s.address.value():_s.siteMap.page[0].id;
				},
				changeTitle:function(title){
					_s.address.title(title);	
				}
			}
		}
	};
	that={
		init:function(obj){
			initialization(obj);
		},
		loadStart:function(){
			controller('loadpage');
		},
		initComplete:null,
		transitionOut:null,
		progress:null,
		transitionIn:null
	}
	return that;
})();