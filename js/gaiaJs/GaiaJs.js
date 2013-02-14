/*
 * GaiaJs v0.1.2
 * http://www.checkme.tw/wordpress/
 *
 * Copyright (c) 2012 Duncan Du
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * Date: 2013-02-13
*/
var GaiaJs=function(){
	var Singleton={
			base:'',
			siteMap:"js/gaiaJs/site.json"
		},
		$pageContent,$loader,_initComplete,_transitionIn,_transitionOut,_progress;
	var initialization=function(obj){
		_transitionIn=obj.transitionIn||function(){};
		_transitionOut=obj.transitionOut||function(){};
		_initComplete=obj.initComplete||function(){};
		_progress=obj.progress||function(){};
		Singleton.base=obj.base||'';
		Singleton.siteMap=obj.siteMap||"js/gaiaJs/site.json";
		$.getJSON(Singleton.siteMap).success(function(json) { 
			Singleton.siteJson=json;
			$pageContent=$(json.content);
			_initComplete(json.content,json.loader);
			address.route(Singleton).init();	
		 })
		.complete(function() {  })
		.error(function() { alert("site json error"); });
	};
	var controller=function(a,p){
		switch(a){
			case "loadpage":
				pageLoader.load(Singleton).start(0);
			break;
			case "loadimg":
				imgLoader.load().start($pageContent);
			break;
			case "t_Out":
				_transitionOut();
			break;
			case "t_In":
				_transitionIn(Singleton.id);
			break;
			case "progress":
				_progress(p);
			break;
		}
	}
	//page Loader
	var pageLoader={
		load:function(_s){
			//找尋對應的ＩＤ，json確保確實有此ＩＤ，沒有的話就去載入首頁
			var findPath=function(num){
				if(num>_s.siteJson.page.length-1){
					loadPage(_s.siteJson.page[0].path);
					return;
				}
				_s.siteJson.page[num].id==_s.id?loadPage(_s.siteJson.page[num]):findPath(num+1);
			}
			var loadPage=function(obj){
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
	}
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
					img.src=value;
					img.onload=function(){
						loadImgComplete();
					}
					img.onerror=function(){
						loadImgComplete();
					}
				});
			}
			var loadImgComplete=function()
			{
				_c+=1;
				if(_c==pa.length){
					controller("t_In");	
					pa=null;
					delete pa;
					delete pl;	
				}
				controller("progress",parseInt(((_c)/pl)*100));
			}
			return{
				start:function($t){
					getpath($t);	
				}
			}
		}
	}
	//route
	var address={
		//(_transitionOut,Singleton)
		route:function(_s){
			var addressChange=function(event){
				_s.id=event.value!=""?event.value:_s.siteJson.page[0].id;
				controller("t_Out");
			};
			return{
				init:function(){
					_s.address=$.address;
					$.address.strict(false).init(function(event) {}).change(addressChange);
					_s.id=_s.address.value()!=""?_s.address.value():_s.siteJson.page[0].id;
					controller("t_Out");
				}
			}
		}
	}
	return{
		init:function(obj){
			initialization(obj);
		},
		changeComplete:function(){
			
		},
		loadStart:function(){
			controller('loadpage');
		}
	}
}
