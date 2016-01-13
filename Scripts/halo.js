/*
	@author: leeenx
	@当前文件为Paipai Mobile Modules的必要代码
	@组件文件存放于modules文件中
	@使用组件前必须载入pm.js文件，否则可能会造必须方法丢失（有部分方法可以独立运行，如果touch_drag）
	@常用方法use用于加入插件，并回调
	@halo.use('msgbox'...,function(m){},false/true);
	@注意的是最后一个boolean表示强制等待组件加载完成，如果为false表示不等待，这个时候m会有一个onready方法，用于监听组件加载情况
	@halo.use('msgbox',function(m){m.onready(function(){.....});},false);与halo.use('msgbox',function(){...},true);等价。当然不写默认为true
*/
var halo=function(){
	var version='20140624';//统一时间缀
	//事件统一
	var TOUCH='stop',BEFORE_TOUCH='',TOUCH_X=0,TOUCH_Y=0,OFFSET_X=0,OFFSET_Y=0,vector_x=0,vector_y=0,sense_x=5,sense_y=5/*手指灵敏度*/,min_vector=50/*手势成立最小位移*/,gesture_time=500/*200毫秒内手指完成手势*/,start_time=0,end_time=0,longpress_time=500;
	if('ontouchstart' in document){
		var touchstart='touchstart',touchend='touchend',touchmove='touchmove';
	}else{
		var touchstart='mousedown',touchend='mouseup',touchmove='mousemove';
	}
	document.body.addEventListener(touchstart,
		function(e){
			TOUCH='start',BEFORE_TOUCH='',OFFSET_X=0,OFFSET_Y=0,start_time=new Date().getTime();
			if('touchstart'==touchstart){
				var touchers=e.changedTouches||e.targetTouches,toucher=touchers[0];
				TOUCH_X=toucher.pageX,TOUCH_Y=toucher.pageY;
			}else{
				TOUCH_X=e.clientX,TOUCH_Y=e.clientY;
			}
		},true);
	document.body.addEventListener(touchmove,
		function(e){
			if('start'!=TOUCH&&'move'!=TOUCH)return ;
			var offset_x=0,offset_y=0;
			if('touchstart'==touchstart){
				var touchers=e.changedTouches||e.targetTouches,toucher=touchers[0];
				vector_x=toucher.pageX-TOUCH_X,vector_y=toucher.pageY-TOUCH_Y;
				offset_x=Math.abs(vector_x),offset_y=Math.abs(vector_y);
			}else{
				offset_x=Math.abs(e.clientX-TOUCH_X),offset_y=Math.abs(e.clientY-TOUCH_Y);
			}
			if(offset_x>sense_x||offset_y>sense_y){
				BEFORE_TOUCH=TOUCH,
				TOUCH='move';//手指移动在sense_x,sense_y内都不算move
			}
			OFFSET_X=offset_x,OFFSET_Y=offset_y;
			end_time=new Date().getTime();
		},true);
	document.body.addEventListener(touchend,function(e){
		BEFORE_TOUCH=TOUCH,TOUCH='stop';
		e=make_touch_event(e);
	},true);
	document.body.addEventListener('touchcancel',function(e){BEFORE_TOUCH=TOUCH,TOUCH='stop';},true);
	var make_touch_event=function(e){//将pc的鼠标事件统一为touch事件
		if('touchstart'!=touchstart)e.touches=e.targetTouches=[{pageX:e.clientX,pageY:e.clientY,target:e.target}];
		return e;
	}
	var modules={length:0};//已经加载的普通组件
	var needWait=true,//强制加载完成组件后才可以执行use回调
		path='/wx/js/halo/',//默认加载路径
		host='http://static.paipaiimg.com',
		comboPath='/c/',
		combo=true//默认合并文件
		;
	//创建modules的副本，便于复制
	var _fun=function(){},_fun_=function(){};
	_fun.prototype=modules,_fun_.prototype=new _fun();
	var _modules=new _fun_();
	//以下是私有方法
	var load_module=function(filename,cb){
		var script=document.createElement("script");
		script.onload=function(){
			if(typeof(cb)=='function')cb('success');
		}
		script.onerror=function(){
			//加载出错
			if(typeof(cb)=='function')cb('error');
		}
		script.onabort=function(){
			//加载被停止
			if(typeof(cb)=='function')cb('abort');
		}
		script.type='text/javascript';
		combo?script.src=host+comboPath+'='+filename+'?v='+version:script.src=host+path+filename+'.js?v='+version;
		document.head.appendChild(script);
		//document.head.removeChild(script);//触发加载即可，节点立马删除
	}
	//以下是事件绑定与解绑
	var on=function(elem,event,cb,type){
		var pm_cb=evcb.set(elem,event,cb);
		event=_event(event);
		elem.addEventListener(event,pm_cb,type);
	},
	off=function(elem,event,cb,type){
		if(typeof(cb)=='undefined'){
			//如果没有回调传入表示将所有事件函数删除
			evcb.del(elem,event);
		}else{
			var pm_cb=evcb.get(elem,event,cb,'remove_cb');
			event=_event(event);
			elem.removeEventListener(event,pm_cb,type);
		}
	},_event=function(event){
		//统一事件
		if('touchstart'==event)event=touchstart;
		else if('touchmove'==event)event=touchmove;
		else if('touchend'==event)event=touchend;
		else if('hold'==event)event=touchstart;
		else if('forcerelease'==event)event='touchcancel';
		else event=touchend;
		return event;
	},evcb=function(){//事件管理数组
		var ev={},set=function(elem,event,cb){
			var tag=elem.getAttribute('haloEV');
			if(!tag){
				tag='pm_'+new Date().getTime(),elem.setAttribute('haloEV',tag);
			}
			ev[tag]=ev[tag]||{},ev[tag][event]=ev[tag][event]||{pm_cb:[],cb:[]},ev[tag][event].cb.push(cb);
			if('touchmove'!=event&&'flick'!=event&&'hold'!=event&&event.indexOf('gesture')=="-1"){
				var pm_cb=function(e){
					cb.call(this,make_touch_event(e));
				}
			}else if('touchmove'==event){//原生事件需要封装的只有touchmove
				var pm_cb=function(e){
					if('move'==TOUCH){
						cb.call(this,make_touch_event(e));
					}
				};
			}else if('flick'==event){
				var pm_cb=function(e){
					if('start'==BEFORE_TOUCH){
						cb.call(this,make_touch_event(e));
					}
				}
			}else if('gesture_left'==event){
				//手势向左
				var pm_cb=function(e){
					if(OFFSET_X>=OFFSET_Y&&vector_x<=-1*min_vector&&(end_time-start_time<=gesture_time)){
						cb.call(this,make_touch_event(e));
					}
				}
			}else if('gesture_right'==event){
				//手势向右
				var pm_cb=function(e){
					if(OFFSET_X>=OFFSET_Y&&vector_x>=min_vector&&(end_time-start_time<=gesture_time)){
						cb.call(this,make_touch_event(e));
					}
				}
			}else if('gesture_up'==event){
				//手势向上
				var pm_cb=function(e){
					if(OFFSET_Y>=OFFSET_X&&vector_y<=-1*min_vector&&(end_time-start_time<=gesture_time)){
						cb.call(this,make_touch_event(e));
					}
				}
			}else if('gesture_down'==event){
				//手势向下
				var pm_cb=function(e){
					if(OFFSET_Y>=OFFSET_X&&vector_y>=min_vector&&(end_time-start_time<=gesture_time)){
						cb.call(this,make_touch_event(e));
					}
				}
			}else if('release'==event||'forcerelease'==event){
				//touchmove后touchend/touchcancel
				var pm_cb=function(e){
					if('start'==BEFORE_TOUCH){
						cb.call(this,make_touch_event(e));
					}
				}
			}else if('hold'==event){
				//长按
				var pm_cb=function(e){
					var _this=this,_start_time=start_time;
					setTimeout(function(){
						if(_start_time==start_time&&'stop'!=TOUCH){
							cb.call(_this,make_touch_event(e));
						}
					},longpress_time)
				}
			}
			ev[tag][event].pm_cb.push(pm_cb);
			return pm_cb;
		},get=function(elem,event,cb,remove){
			var tag=elem.getAttribute('haloEV');
			if(!tag)return ;
			if(ev[tag]&&ev[tag][event]){
				for(var i=0,evs=ev[tag][event],len=evs.cb.length;i<len;++i){
					if(evs.cb[i]==cb){
						var ret=evs.pm_cb[i];
						if(remove){
							delete evs.cb[i],delete evs.pm_cb[i];
						}
						return ret;
					}
				}
				return cb;
			}
		},del=function(elem,event){
			var tag=elem.getAttribute('haloEV'),_event_=_event(event);
			if(!tag)return ;
			if(ev[tag]&&ev[tag][event]){
				for(var i=0,evs=ev[tag][event],len=evs.cb.length;i<len;++i){
					elem.removeEventListener(_event_,evs.pm_cb[i],false);
					elem.removeEventListener(_event_,evs.pm_cb[i],true);
				}
			}
		},_o={set:set,get:get,del:del};
		return _o;
	}();
	//css操作方法
	var webkit=function(){
		//浏览器特有css样式的
		var css3_div=document.createElement("div");
		css3_div.style.cssText='-webkit-transition:all .1s; -moz-transition:all .1s; -o-transition:all .1s; -ms-transition:all .1s; transition:all .1s;';
		if(css3_div.style.webkitTransition){
			return '-webkit-';
		}else if(css3_div.style.MozTransition){
			return '-moz-';
		}else if(css3_div.style.oTransition){
			return '-o-';
		}else if(css3_div.style.msTransition){
			return '-ms-';
		}else{
			return '';
		}
	}();
	var STYLESHEET=function(){
		var styleSheet=function(){
			//创建一个styleSheet,避免跨域问题
			var head = document.getElementsByTagName("head")[0]; 
			var style = document.createElement("style"); 
			style.type="text/css"; 
			head.appendChild(style);
			return document.styleSheets[document.styleSheets.length-1];
		}();
		function addStyleSheet(cssText){/*动态添加css样式*/
			var oCss = styleSheet,cssRules=cssText.split('\r\n');
			var len=!!oCss.cssRules?oCss.cssRules.length:0;//不直接使用oCss.cssRules.length是因为跨域时返回null，所以用len避免错误
			for(var i=0;i<cssRules.length;++i){
				oCss.insertRule(cssRules[i],len++);
			};
			return len;
		}
		return {add:addStyleSheet};
	}();
	var addClass=function(elem,_class){
		var className=elem.className,classReg=new RegExp('(^'+_class+'\\s+)|(\\s+'+_class+'\\s+)|(\\s+'+_class+'$)|(^'+_class+'$)','g');
		if(!className)elem.className=_class;
		else if(classReg.test(className))return;
		else elem.className=className+' '+_class;
	}
	var removeClass=function(elem,_class){
		var className=elem.className,classReg=new RegExp('(^'+_class+'\\s+)|(\\s+'+_class+'\\s+)|(\\s+'+_class+'$)|(^'+_class+'$)','g');
		className=className.replace(classReg,function(k,$1,$2,$3,$4){if($2)return ' ';else return '';});
		elem.className=className;
	}
	var get_transform_value=function(transform,key,index){
		//transform即transform的所有属性,key键名，index_arr按数组索引取value
		key=key.replace(/\-/g,'\\-');
		var index_list=[0];
		if(arguments.length>2){
			for(var i=2;i<arguments.length;++i){
				index_list[i-2]=arguments[i];
			}
		}
		if('none'==transform||''==transform)return null;//没有值，直接中断
		var reg=new RegExp(key+'\\(([^\\)]+)\\)','ig'),key_value=transform.match(reg),value_list=[],ret=[];
		if(key_value&&key_value.length>0){
			key_value=key_value[0];
			value_list=key_value.replace(reg,'$1').split(',');
			for(var i=0;i<index_list.length;++i){
				ret.push(value_list[index_list[i]]);
			}
		}
		if(ret.length==1)ret=ret[0];
		else if(index)ret=ret[index];
		return ret;
	}
	modules.on=on,modules.off=off,modules.removeClass=removeClass,modules.addClass=addClass,modules.stylesheet=STYLESHEET.add,modules.get_transform_value=get_transform_value,modules.webkit=webkit;
	//以下是公用方法
	var config=function(o){
		//配置默认属性
		if(typeof(o.wait)!='undefined'){
			needWait=!!o.wait;
		}
		path=o.path||path;
		o.hasOwnProperty('combo')&&(combo=o.combo);
		o.hasOwnProperty('host')&&(host=o.host);
		o.hasOwnProperty('version')&&(version=o.version);
		return halo;
	}
	var add=function(name,fun){
		//组件添加
		if(modules[name]){
			throw('命名冲突！');
		}else{
			modules[name]=fun;++modules.length;
		}
	}
	var use=function(){//载入用户自己组件方法
		var arg=arguments,need_load_count=0,loaded_count=0,cb=function(){},wait=needWait,names='';
		for(var i=0,len=arg.length;i<len;++i){
			var name=arg[i];
			if(typeof(name)=='string'){
				++need_load_count;
				if(!!modules[name])++loaded_count;//已经加载成功
				else{//需要加载
					combo?(names+=(0!=i?',':'')+path+name+'.js'):(function(name){
						load_module(name,function(ret){
							if('success'){//console.log(name)
								++loaded_count;
							}else{
								throw('public file load fail!');
							}
						});
					}(name));
				}
			}else{
				break;//遇到不是string直接中断
			}
		};
		!!combo&&!!names&&load_module(names,function(){loaded_count=need_load_count;});
		if(typeof(arg[i])=="function"){
			cb=arg[i];
			//在有回调的情况下判断需不需要强制加载完成执行
			if(typeof(arg[i+1])!='undefined')wait=!!arg[i+1];
		};
		if(!wait){
			//不需要等待组件加载，直接执行
			_modules.onready=function(cb){_modules.ready=typeof(cb)=='function'?cb:function(){}};
			cb(_modules);
		}
		//需要等待加载组件加载完成执行回调
		chkLoad();
		function chkLoad(){
			//检查加载情况
			if(loaded_count==need_load_count){
				//加载完成
				if(wait){
					cb(modules);
				}else{
					_modules.ready(modules);
				} 
			}else{
				setTimeout(chkLoad,500)
			}
		}
		//检查组件加载成功，并且成功注册成
		function chkReg(name,cb){
			if(modules[name]){
				if(typeof(cb)=='function')cb();
			}else{
				setTimeout(function(){chkReg(name,cb);},500)
			}
		}
		return halo;
	}
	return {add:add,use:use,config:config,on:on,off:off,stylesheet:STYLESHEET.add,get_transform_value:get_transform_value};
}();

