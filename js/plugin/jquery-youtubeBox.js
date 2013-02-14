/*
type:1,//呈現方式，總共有1~3總，預設1
canvasTarget:"",//type:2跟3時要加入的容器id或class
myHtml:"",//type:3時，自己樣式的html
width:420,//type:1時 youtube的寬度，2或3時會跟隨上層容器的寬度
height:380,//type:1時 youtube的高度，2或3時會跟隨上層容器的高度
autoplay:1,//1:自動播放，0:不會自動播放，預設1
initIndex:-1,//>-1初始化後載入指定的影片
addScuess:function(){}//加入後回呼的方法，會還傳被點擊按鈕的index
close:"",//type:3時，需要關閉按鈕的時候
bgcolor:"#39c9f5",//背景顏色
opacity:0.4,//背景透明度
*/
;(function($){
	$.fn.youtubeBox=function(options){
		var opts=$.extend({},
			$.fn.youtubeBox.defaults,options),
		    $yb,
		    $yp,
			_this,
			_layerBox="<div class=\"y_layerBox\" style=\"position:absolute;width:100%;height:100%;top:0px;left:0px;z-index:999;\"><div class=\"y_layerBg\" style=\"width:100%;height:100%;background-color:{c};opacity:0.4;filter:alpha(opacity={ie_o});-moz-opacity:{o};position:fixed;display:block;\"></div></div>",
			_youtube="<iframe id=\"cfifram\" width={w} height={h} scrolling=\"auto\" src=\"http://www.youtube.com/embed/{id}?rel=0&autoplay={a}\" frameborder=\"0\" allowfullscreen>'",
			_addStr="";
		return this.each(function(){
				_this=$(this);
				_layerBox=_layerBox.replace("{c}",opts.bgcolor);
				_layerBox=_layerBox.replace("{o}",opts.opacity);
				_layerBox=_layerBox.replace("{ie_o}",opts.opacity*100);
				_youtube=_youtube.replace("{a}",opts.autoplay);
				_this.children('li').find('a').each(function(index){
					$(this).bind('click',function(i){
						return function(e){
							e.preventDefault();
							clickhander($(this).attr('href'),i);
						}
						}(index))	
				});	
				if(opts.initIndex>-1){
					clickhander(_this.children('li').eq(opts.initIndex).find('a').attr('href'),opts.initIndex);
				}
		});
		function clickhander(id,i){
			opts.initIndex=i;
			opts.type==2?addCanvas(id):addpopBox(id);
		}
		function addpopBox(id){
			_addStr=_youtube;
			opts.type==1?_addStr=_addStr.replace("{w}",opts.width):_addStr=_addStr.replace("{w}","100%");
			opts.type==1?_addStr=_addStr.replace("{h}",opts.height):_addStr=_addStr.replace("{h}","100%");
			$yb=$(_layerBox);
			$($yb).appendTo($('body'));
			if(opts.type==1){
				$(_addStr.replace("{id}",id)).appendTo($yb);
				$yp=$("#cfifram");
			}else{
				$yp=$(opts.myHtml);
				$($yp).appendTo($yb);
				$(_addStr.replace("{id}",id)).appendTo($(opts.canvasTarget));
				$(opts.close).bind('click',bgClick);
			}
			$yp.css({'position':'fixed','z-index':999});
			$(".y_layerBg").bind('click',bgClick);
			$(window).bind('resize',center);
			center();
			opts.addScuess(opts.initIndex);
		}
		function center(){
			if ($yp!=undefined)
				$yp.css({'top': ($(window).height()/2-$yp.height()/2)+"px",'left': ($(window).width()/2-$yp.width()/2)+"px"});	
		}
		function bgClick(e){
			if ($yb!=undefined){
				$yb.remove();
				$(window).unbind('resize',center);
			}
		}
		function addCanvas(id){
			if ($yp!=undefined)$yp.remove();
			_addStr=_youtube;
			_addStr=_addStr.replace("{w}","100%");
			_addStr=_addStr.replace("{h}","100%");
			$(_addStr.replace("{id}",id)).appendTo($(opts.canvasTarget));
			$yp=$("#cfifram");
			opts.addScuess(opts.initIndex);
		}
	};
	$.fn.youtubeBox.defaults={
		type:1,
		canvasTarget:"",
		myHtml:"",
		width:420,
		height:380,
		autoplay:1,
		initIndex:-1,
		close:"",
		bgcolor:"#000000",
		opacity:0.4,
		addScuess:function(){}
	};
})(jQuery);