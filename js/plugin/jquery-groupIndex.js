;(function($){
	$.fn.groupIndex=function(options){
		var opts=$.extend({},$.fn.groupIndex.defaults,options);
		var _index=0,_c,_this;
		return this.each(function(){
				_this=$(this).bind(opts.bindType,thisClick);
				_c=_this.children(); 
				if(opts.initEmabledBol==true&&opts.initIndex!=-1){
					_index=opts.initIndex;
					opts.callBack(_index);
					_c.eq(_index).addClass(opts.emabledClass);
				}
		});
		function thisClick(e){
				e.preventDefault();	
				if(opts.emabledBol==true)_c.eq(_index).removeClass(opts.emabledClass);
				getTarget(e.target);	
		};
		function getTarget(e){
			var t=$(e);
			if(!t.is(_c)){
				getTarget(t.parent());
			}else{
				getIndex(t);
			}
		};
		function getIndex(t){
			var $target =$(t);	
			_index=_c.index( $target );
			opts.callBack(_index,$target);
			if(opts.emabledBol==true)$target.addClass(opts.emabledClass);
		};	
	};
	$.fn.groupIndex.defaults={
		bindType:'click',
		callBack:function(){},
		emabledBol:false,
		emabledClass:'',
		initEmabledBol:false,
		initIndex:-1	
	};
})(jQuery);