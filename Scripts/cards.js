var system = {
	win: false,
	mac: false,
	xll: false
};
//检测平台
var p = navigator.platform;
system.win = p.indexOf("Win") == 0;
system.mac = p.indexOf("Mac") == 0;
system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
if(/Android (\d+\.\d+)/.test(navigator.userAgent)){
	var version = parseFloat(RegExp.$1);
	if(version>2.3){
		var phoneScale = parseInt(window.screen.width)/640;
		document.write('<meta name="viewport" content="width=640, minimum-scale = '+ phoneScale +', maximum-scale = '+ phoneScale +', target-densitydpi=device-dpi">');
	}else{
		document.write('<meta name="viewport" content="width=640, target-densitydpi=device-dpi">');
	}
}else{
	document.write('<meta name="viewport" content="width=640, user-scalable=no, target-densitydpi=device-dpi">');
}
halo.use('pageinvite', 'pagedrag', 'warn', function(m) {
	m.warn && m.warn.set('#B57989');
    var wrap = document.getElementById('wrap'), pager = m.pageinvite.bind(wrap, false), 
	h_wrap = document.getElementById("h_wrap"), left = document.getElementById("left"), 
	right = document.getElementById("right"),share = document.getElementById("share");
	pager.infinite = false;		
		
	function startInit(){
		$('#music_rotate').addClass('z-show');
		$('#music_1_slip').addClass('z-show');
		$('#music_2_slip').addClass('z-show');
		$('#music_3_slip').addClass('z-show');
		$('#music_4_slip').addClass('z-show');
		$('.info .dfz').addClass('fz');
		$('.info .names').addClass('gd1');
	  	$('.info .sj').addClass('gd2');
		$('#mainswitch').addClass('z-show');
	}
	var music = document.getElementById('music');
	var lotteryid = document.getElementById('lotteryContainer');
	if(lotteryid){
			//lottery start
			var lottery = new Lottery('lotteryContainer', diy.lottery_pic, 'image', window.innerWidth, window.innerHeight, drawPercent);
			lottery.init(diy.font_cover, 'image');
			m.on(lotteryid, 'touchstart',  function() {
	         music.play();
			var tmp = setTimeout(function(){$("#lotteryContainer").animate({opacity:'0'},2000,function(){
						$("#lotteryContainer").hide();
						$("#chair").animate({opacity:'1'},2000)
					}
				);
				startInit()
				
				},3000);
		
		}, false);
	}else{
		
         music.play();
		startInit()
	}

		 
		 //loading images start
	loading_img(loading_arr, document.body, function(loading) {
		loading.parentNode.removeChild(loading);
        wrap.style.cssText = '';
		
        //祝福的流星
		(function(){
					
			var starCount = 30;
			var  meteorCount = 10;
			for (var left, top, styleIndex, delay, duration, html = "", i = 0; i < starCount; i++)
			{ 
				left = (640 * Math.random()).toFixed(2);
				top = (640 * Math.random()).toFixed(2);
				delay = Math.random().toFixed(2);
				duration = (1 + 4 * Math.random()).toFixed();
				styleIndex = Math.round(1 + 3 * Math.random());
				html += '<i class="star style' + styleIndex + '" style="left:' + left + "px; top:" + top + "px; -webkit-animation-delay:" + delay + "s; -webkit-animation: star " + duration + 's linear infinite;"></i>';
				
			}
			$(".m-meteorShower").append(html);
			for (var i = 0; i < meteorCount; i++)
			{
				left = (800 * Math.random()-280).toFixed(2);
				top = (100 * Math.random()-80).toFixed(2);
				delay = (.5 + 2.5 * Math.random()).toFixed();
				duration = (1.2 + 2.8 * Math.random()).toFixed();
				styleIndex = Math.round(1 + 3 * Math.random());
				html += '<i class="meteor style' + styleIndex + '" style="left:' + left + "px; top:" + top + "px; -webkit-animation-delay:" + delay + "s; -webkit-animation: meteor " + duration + 's linear infinite;"></i>';
			}
			$(".m-meteorShower").append(html);
		}());
		
		
    });//loadding end
   //=============================music================== 
	var musicbtn1 = document.getElementById('music_rotate');
	m.on(musicbtn1, 'flick', function() {
		if(music.paused)
		{
			music.play();
			$("#music_1_slip").addClass("z-show");
			$("#music_2_slip").addClass("z-show");
			$("#music_3_slip").addClass("z-show");
			$("#music_4_slip").addClass("z-show");
		
		}
		else
		{
			music.pause();
			$("#music_1_slip").removeClass("z-show");
			$("#music_2_slip").removeClass("z-show");
			$("#music_3_slip").removeClass("z-show");
			$("#music_4_slip").removeClass("z-show");
		}
	}, false);
    
	
	//==========================功能function====================
    var switchs = document.getElementById('switchs');
    bswitchflag = !parseInt(document.getElementById('show_menu').value); 
	var all_func = document.getElementById("all_func");
	var onefunc = all_func.getElementsByClassName("cardsbtn");
        m.on(switchs, 'flick', function() {
			 
            if(!bswitchflag)
            {
                $("ul").addClass('z-show');	
			    $("#4switch").addClass('z-show');	
                $("#line").addClass('z-show');
                $("#switchs").html('关闭');
				onefunc[0].style.opacity="1"; 
				onefunc[1].style.opacity="1";
				onefunc[2].style.opacity="1";
				onefunc[3].style.opacity="1";
				onefunc[4].style.opacity="1";
                bswitchflag = true;
            }
            else
            {
				$("ul").removeClass('z-show');	
				$("#4switch").removeClass('z-show');	
				$("#line").removeClass('z-show');
				$("#switchs").html('目录');
				$("#first").removeClass('z-show1');
				$("#second").removeClass('z-show1');
				$("#none").removeClass('z-show');
				$("#fourth").removeClass('z-show1');
				$("#five").removeClass('z-show1');
                bswitchflag = false;
 		    }
        }, false);
		
		
		var li = all_func.getElementsByTagName('li'); var totalli = li.length;
	
/*		m.on(li[0], 'flick', function() { 
			onefunc[0].style.opacity="0.3"; 
			onefunc[1].style.opacity="1";
			onefunc[2].style.opacity="1";
			onefunc[3].style.opacity="1"; 
			$("#first").addClass('z-show1');
			$("#second").removeClass('z-show1');
			$("#none").removeClass('z-show1');
			$("#fourth").removeClass('z-show1');
			$("#five").removeClass('z-show1');
		
		},false);*/
    
	    var isgoodsclick = false, num = 48; //全局变量
	    var setCommon =  function(){
	    	onefunc[1].style.opacity="1"; 
			onefunc[0].style.opacity="1";
			onefunc[2].style.opacity="1";
			onefunc[3].style.opacity="1"; 
			onefunc[4].style.opacity="1"; 
			$("#second").removeClass('z-show1');
			$("#first").removeClass('z-show1');
			$("#none").removeClass('z-show1');
			$("#fourth").removeClass('z-show1');
			$("#five").removeClass('z-show1');
			if($('#youkuplayer').length){
				window.pauseVideo 
			}
					
	    }
	 	circle_inv =  document.getElementById('circle-inv');

		m.on(circle_inv, 'flick', function() {
			
			setCommon();
		    
			$('.bg-btn-inv').css('opacity','0.3');
			$(".part-inv").addClass('z-show1');
		},false);
		
		circle_thumb = document.getElementById('circle-thumb');
		m.on(circle_thumb, 'flick', function() {
			ClickGood(isgoodsclick,num);
			setCommon();
			$('.bg-btn-thumb').css('opacity','0.3');
			$(".part-thumb").addClass('z-show1');
		}, false);
		circle_comment = document.getElementById('circle-comment');
		m.on(circle_comment, 'flick', function() {
			setCommon();
			$('.bg-btn-comment').css('opacity','0.3');
			$(".part-comment").addClass('z-show1');
		}, false);

		circle_video = document.getElementById('circle-video');
		m.on(circle_video, 'flick', function() {
			setCommon();
			$('.bg-btn-video').css('opacity','0.3');
			$(".part-video").addClass('z-show1');
		}, false);
		circle_map =  document.getElementById('circle-map')
		m.on(circle_map, 'flick', function() {
			setCommon();
			window.location.href = $(circle_map).attr('link');
		}, false);

		
    //=============================关评论按钮==================

    //=============================回馈卡片==================
    
	 var congrats = document.getElementById('heartclick');
     m.on(congrats, 'flick', function() {
      	 setCommon();
         $('.bg-btn-comment').css('opacity','0.3');
			$(".part-comment").addClass('z-show1');    
        }, false);
	





	
	//=============================绘制蝴蝶函数============================= 
	function ClickGood(flag,num)
	{
	
		if(!flag)
		{			
				$.get('/Mob/Index/thumb/id/'+diy.id,{},function(data){
					butterfly(data.thumb);
					if(parseInt(data.need_thumb) > parseInt(data.thumb) ){ 
						htmlStr = "<h1>集全" + data.need_thumb + "个赞有惊喜</h1><h1>目前已集赞</h1><h2>" + data.thumb + "</h2>"; 
					}else{
						htmlStr = "<br><br/><h1>" + data.thumb_msg + "</h2>"; 
					}
						$("#good_text").html(htmlStr);
				},'json')
			
		}
	
	}
	
    function butterfly(num)
    {         
         var starCount = num;
         
         var top = [0,43,45,26,30,38,58,79,64,62,73,81,84,98,83,103,105,108,105,90,105,115,139,123,128,142,140,125,108,117,141,136,120,138,158,175,145,161,160,183,168,154,177,163,180,170,198,140,156,172,206,217,205,200,220,210,200,204];
			var wforleft=window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			var left = [(wforleft / 2).toFixed(0) - 49,
						(wforleft / 2).toFixed(0) - 96,
						(wforleft / 2).toFixed(0) - 27,
						(wforleft / 2).toFixed(0) - 74,
						(wforleft / 2).toFixed(0) - 50,
						(wforleft / 2).toFixed(0) - 60,
						(wforleft / 2).toFixed(0) - 64,
						(wforleft / 2).toFixed(0) - 86,
						(wforleft / 2).toFixed(0) - 86,
						(wforleft / 2).toFixed(0) - 37,
						(wforleft / 2).toFixed(0) - 20,
						(wforleft / 2).toFixed(0) - 55,
						(wforleft / 2).toFixed(0) - 23,
						(wforleft / 2).toFixed(0) - 67,
						(wforleft / 2).toFixed(0) - 117,
						(wforleft / 2).toFixed(0) - 112,
						(wforleft / 2).toFixed(0) - 90,
						(wforleft / 2).toFixed(0) - 40,
						(wforleft / 2).toFixed(0) - 4,
						(wforleft / 2).toFixed(0) - 10,
						(wforleft / 2).toFixed(0) - 140,
						(wforleft / 2).toFixed(0) - 160,
						(wforleft / 2).toFixed(0) - 150,
						(wforleft / 2).toFixed(0) - 120,
						(wforleft / 2).toFixed(0) - 67,
						(wforleft / 2).toFixed(0) - 103,
						(wforleft / 2).toFixed(0) - 55,
						(wforleft / 2).toFixed(0) - 40,
						 20 + wforleft / 2,
						 9 + wforleft / 2,
						 14 + wforleft / 2,
						 27 + wforleft / 2,
						 52 + wforleft / 2,
						 70 + wforleft / 2,
						 32 + wforleft / 2,
						 48 + wforleft / 2,
						(wforleft / 2).toFixed(0) - 14,
						(wforleft / 2).toFixed(0) - 15,
						(wforleft / 2).toFixed(0) - 37,
						(wforleft / 2).toFixed(0) - 30,
						(wforleft / 2).toFixed(0) - 25,
						(wforleft / 2).toFixed(0) - 69,
						(wforleft / 2).toFixed(0) - 76,
						(wforleft / 2).toFixed(0) - 121,
						(wforleft / 2).toFixed(0) - 100,
						(wforleft / 2).toFixed(0) - 130,
						(wforleft / 2).toFixed(0) - 131,
						(wforleft / 2).toFixed(0) - 184,
						(wforleft / 2).toFixed(0) - 150,
						(wforleft / 2).toFixed(0) - 171,
						(wforleft / 2).toFixed(0) - 151,
						(wforleft / 2).toFixed(0) - 120,
						(wforleft / 2).toFixed(0) - 92,
						(wforleft / 2).toFixed(0) - 52,
						(wforleft / 2).toFixed(0) - 32,
						(wforleft / 2).toFixed(0) - 28,
						16 + wforleft / 2,
						39 + wforleft / 2];
                                
				var degree = [-14,-15,10,25,-55,0,45,-60,0,18,-24,45,48,-43,-25,30,20,23,-39,49,5,-18,-30,32,-40,40,10,-20,10,-20,-45,30,70,50,2,-5,38,10,-22,-40,30,-10,-39,10,48,-43,6,-60,26,-26,-36,-16,19,22,-22,66,1,36];
				var scale = [0.13,0.18,0.2,0.11,0.14,0.1,0.22,0.18,0.11,0.21,0.14,0.1,0.19,0.17,0.15,0.2,0.17,0.16,0.18,0.16,0.13,0.22,0.23,0.18,0.13,0.2,0.12,0.11,0.13,0.23,0.19,0.21,0.16,
							 0.17,0.1,0.1,0.16,0.18,0.21,0.22,0.12,0.11,0.18,0.16,0.11,0.13,0.1,0.18,0.1,0.1,0.24,0.2,0.22,0.12,0.16,0.2,0.11,0.26];
				var styleIndex = [1,2,3,4,5,6,1,2,3,4,5,6,1,2,3,4,6,5,1,2,3,4,5,6,1,2,3,4,5,6,1,2,3,4,5,6,1,2,3,4,5,6,1,2,3,4,5,6,1,2,3,4,5,6,1,2,3,4];

			for (var styleIndex, delay, duration, html = "", i = 0; i < starCount; i++)
			{ 
				//left = (100 * Math.random()).toFixed(2);
				//top = (100 * Math.random()).toFixed(2);
				delay = Math.random().toFixed(2);
				duration = (1 + 4 * Math.random()).toFixed(1);
				//styleIndex = Math.round(1 + 5 * Math.random());
				//degree = ((140 * Math.random()) - 70).toFixed();
				//scale = ((0.15 * Math.random()) + 0.1).toFixed(3);
				html += '<i class="butter style' + styleIndex[i] + '" style="left:' + left[i] + "px; top:" + top[i] + "px;-webkit-transform: rotate(" + degree[i] +"deg) scale(" + scale[i] +"); -webkit-animation-delay:" + delay + "s; -webkit-animation: butter " + duration + 's linear infinite;"></i>';
		
			}
			$(".m-like").append(html);
			
    }
	
	//=============================cookie相关函数============================= 
	function getCookie(c_like)
	{
		if (document.cookie.length>0)
		{
			c_start=document.cookie.indexOf(c_like + "=")
			if (c_start!=-1)
			{ 
			c_start=c_start + c_like.length+1 
			c_end=document.cookie.indexOf(";",c_start)
			if (c_end==-1) c_end=document.cookie.length
			return unescape(document.cookie.substring(c_start,c_end))
			} 
		}
		return ""
	}
	
	function setCookie(c_like,value,expiredays)
	{
		var exdate=new Date()
		exdate.setDate(exdate.getDate()+expiredays)
		document.cookie=c_like+ "=" +escape(value)+
		((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
	}
	
	function checkCookie()
	{
		like=getCookie('like')
		if (like!=null && like!="")
		{
            m.msgbox.show('你已经点过赞了哦，可以给新人发送祝福卡片',{text:'知道啦'});
		return false;
		}
		else 
		{
			like = "yes";
		
			if (like!=null && like!="")
			{
				setCookie('like',like,30)
			}
		}
		return true;
	} 
	
	function getQuery(name,url){
		  //参数：变量名，url为空则表从当前页面的url中取
		  var u  = arguments[1] || window.location.search,
		  reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"),
		  r = u.substr(u.indexOf("\?")+1).match(reg);
		  return r!=null?r[2]:"";
	}
	

}); 

