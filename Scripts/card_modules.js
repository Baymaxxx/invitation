/*
	@author:leeenx
	@功能：邀请函式翻页
*/
halo.use(function(m) {
    var addClass = m.addClass, removeClass = m.removeClass, webkit = m.webkit;
    //添加滚动效果
    m.stylesheet('.TOUCH_INVITE_KEEP{' + webkit + 'transition:' + webkit + 'transform .3s ease-in-out;}'); //竖屏
    m.stylesheet('.TOUCH_INVITE_RESTORE{' + webkit + 'transition:' + webkit + 'transform .1s linear;}'); //弹性
    //m.stylesheet('');//android - hack
    halo.add('pageinvite', function() {
        //邀请函只需要考虑y轴位置
        var y = 0, start_y = 0, ch = document.documentElement.clientHeight, min_offset_y = 50,
        bind = function(elem, need_scale) {
            need_scale = typeof(need_scale) == 'undefined' ? true : need_scale; //默认背景缩放
            var sections = elem.getElementsByClassName('page'), cur_page = 0, previous =- 1, next = 1, lock = false, motion = 'none', _motion = 'none', p_sec = null, n_sec = sections[1], cur_sec = sections[0], sec;
            //motion手势方向，_motion上一次手势方向
            for (var i = 0, len = sections.length; i < len; ++i) {
                sections[i].style.cssText = 'display:' + (0 == i ? 'block' : 'none') + '; position:absolute; z-index:0; left:0; top:0;';
            }
            var _touchstart = function(e) {
                e.preventDefault();
                if (lock)
                    return ;
                var touchers = e.changedTouches || e.targetTouches;
                start_y = touchers[0].pageY; //手指初始位置
            }
            m.on(elem, 'touchstart', _touchstart, false);
            var _touchmove = function(e) {
                if (lock)
                    return ;
                var touchers = e.targetTouches || e.changedTouches, cur_y = touchers[0].pageY, offset_y = cur_y - start_y;
                if (offset_y < 0) {
                    //向上
                    motion = 'up';
                } else if (offset_y > 0) {
                    //向下
                    motion = 'down';
                } else {
                    //无方向
                    motion = 'none';
                }
                drag(offset_y);
            };
            m.on(elem, 'touchmove', _touchmove, false);
            var release = function(e) {
                if (!sec) {
                    //到底或顶弹性效果
                    addClass(cur_sec, 'TOUCH_INVITE_RESTORE');
                    cur_sec.style[webkit + 'transform'] = 'translate3d(0,0,0)';
                    setTimeout(function() {
                        removeClass(cur_sec, 'TOUCH_INVITE_RESTORE');
                        //motion='none',_motion='none';//使两次手势一致
                    }, 100);
                }
                if (!sec || lock)
                    return ;
                lock = true; //锁住
                var touchers = e.changedTouches || e.targetTouches, cur_y = touchers[0].pageY, offset_y = cur_y - start_y;
                if (Math.abs(offset_y) >= min_offset_y) {
                    move();
                } else if (offset_y != 0) {
                    addClass(sec, 'TOUCH_INVITE_RESTORE');
                    sec.style[webkit + 'transform'] = 'translate3d(0,' + (motion == 'up' ? ch : -1 * ch) + 'px,0)';
                    cur_sec.style[webkit + 'transform'] = 'scale(1,1)';
                    setTimeout(function() {
                        removeClass(sec, 'TOUCH_INVITE_RESTORE');
                        sec.style.display = 'none';
                        motion = 'none', _motion = 'none'; //使两次手势一致
                        lock = false; //解锁
                    }, 100);
                }
            };
            m.on(elem, 'release', release, false), m.on(elem, 'forcerelease', release, false), m.on(elem, 'flick', function() {
                lock = false; /*解锁*/
            }, false);
            var fix_page = function(num) {
                //使页码正确
                //if(num==len)return num;//临界值
                if (num >= 0) {
                    return num%len;
                } else {
                    return (len + num%len);
                }
            }
            var drag = function() {
                return function(offset_y) {
                    if (_motion != motion) {
                        //变向
                        if ('up' == motion) {
                            !p_sec || (p_sec.style.display = 'none');
                            !n_sec || (n_sec.style.cssText = webkit + 'transform:translate3d(0,' + ch + 'px,0);z-index:1;display:block; position:absolute;opacity:0.83;')
                            sec = n_sec;
                        } else if ('down' == motion) {
                            !n_sec || (n_sec.style.display = 'none');
                            !p_sec || (p_sec.style.cssText = webkit + 'transform:translate3d(0,-' + ch + 'px,0); z-index:1; display:block; position:absolute;opacity:0.83;')
                            sec = p_sec;
                        } else {
                            if ('up' == _motion) {
                                !n_sec || (n_sec.style.display = 'none');
                            } else if ('down' == motion) {
                                !p_sec || (p_sec.style.display = 'none');
                            }
                        }
                        _motion = motion;
                    }
                    var _ch = 'up' == motion ? ch: - ch; //console.log(sec)
                    sec ? (sec.style[webkit + 'transform'] = 'translate3d(0,' + (_ch + offset_y) + 'px,0)') : (cur_sec.style[webkit + 'transform'] = 'translate3d(0,' + offset_y + 'px,0)');
                    if (need_scale && sec) {
                        'up' == motion ? (cur_sec.style[webkit + 'transform-origin'] = 'top') : (cur_sec.style[webkit + 'transform-origin'] = 'bottom');
                        var _scale = 1 - .2 * Math.abs(offset_y) / ch;
                        cur_sec.style[webkit + 'transform'] = 'scale(' + _scale + ',' + _scale + ')';
                    }
                }
            }();
            var move = function(cur) {
                addClass(sec, 'TOUCH_INVITE_KEEP');
                sec.style[webkit + 'transform'] = 'translate3d(0,0,0)';
                if (need_scale) {
                    addClass(cur_sec, 'TOUCH_INVITE_KEEP');
                    cur_sec.style[webkit + 'transform'] = 'scale(.8,.8)';
                }
                setTimeout(function() {
                    removeClass(sec, 'TOUCH_INVITE_KEEP'), cur_sec.style.display = 'none';
                    if (need_scale) {
                        removeClass(cur_sec, 'TOUCH_INVITE_KEEP');
                    }
                    //p_sec,n_sec,sec三者指向改变
                    if (typeof(o.page_change) == 'function') {
                        o.page_change(cur_page, ('up' == motion ? next : previous));
                    }
                    if ('up' == motion) {
                        typeof(cur) == 'undefined'?++cur_page:
                        cur_page = cur;
                    } else {
                        typeof(cur) == 'undefined'?--cur_page:
                        cur_page = cur;
                    }
                    next = cur_page + 1, previous = cur_page-1;
                    if (typeof(o.infinite) == 'undefined' || (typeof(o.infinite) != 'undefined' && o.infinite)) {
                        //默认是无限循环模式
                        cur_page = fix_page(cur_page), next = fix_page(next), previous = fix_page(previous);
                    }
                    cur_sec = sections[cur_page], n_sec = sections[next], p_sec = sections[previous];
                    cur_sec.style.cssText = 'z-index:0;position:absolute; left:0; top:0;' /*,!p_sec||(p_sec.style.cssText='display:none'),!n_sec||(n_sec.style.cssText='display:none')*/
                    ;
                    sec = 'up' == motion ? n_sec : p_sec;
                    motion = 'none', _motion = 'none'; //使两次手势一致
                    lock = false; //解锁
                }, 300);
            }
            var moveto = function(index) {
                //页面滑动至指定页面
                if (index >= 0 && index < len && index != cur_page) {
                    sec = sections[index];
                    if (cur_page > index) {
                        motion = 'down';
                        sec.style.cssText = webkit + 'transform:translate3d(0,-' + ch + 'px,0);z-index:1;display:block; position:absolute;'
                    } else {
                        motion = 'up';
                        sec.style.cssText = webkit + 'transform:translate3d(0,' + ch + 'px,0);z-index:1;display:block; position:absolute;'
                    }
                    'up' == motion ? (cur_sec.style[webkit + 'transform-origin'] = 'top') : (cur_sec.style[webkit + 'transform-origin'] = 'bottom');
                    setTimeout(function() {
                        move(index)
                    }, 0); //chrome 滑动hack
                }
            }
            var unbind = function() {
                m.off(elem, 'touchstart', _touchstart), m.off(elem, 'touchmove', _touchmove), m.off(elem, 'release', release, false), m.off(elem, 'forcerelease', release, false);
            }
            //监听a元素
            m.on(elem, 'flick', function(e) {
                if (e.target.tagName == 'A') {
                    e.target.click();
                }
            });
            var o = {
                move: moveto,
                unbind: unbind
            };
            return o;
        }
        window.addEventListener('resize', function() {
            ch = document.documentElement.clientHeight;
        })
        return {
            bind: bind
        }
    }())
}); /*
	@author:leeenx
	@简单的页面滑动
	@原来四向页面的精简版本 - 只能绑定x轴或y轴中的一个
*/
halo.use(function(m) {
    var webkit = m.webkit, addClass = m.addClass, removeClass = m.removeClass, get_transform_value = m.get_transform_value;
    //添加滚动效果
    m.stylesheet('.PAGE_DRAG_KEEP{' + webkit + 'transition:' + webkit + 'transform .3s linear;}'); //竖屏
    m.stylesheet('.PAGE_DRAG_H_KEEP{' + webkit + 'transition:' + webkit + 'transform .2s linear;}'); //横屏
    m.stylesheet('.PAGE_DRAG_RESTORE{' + webkit + 'transition:' + webkit + 'transform .1s linear;}'); //弹性
    halo.add('pagedrag', function() {
        var ch = document.documentElement.clientHeight, cw = document.documentElement.clientWidth;
        window.addEventListener('resize', function() {
            ch = document.documentElement.clientHeight, cw = document.documentElement.clientWidth;
        }, false);
        var bind = function(elem, direction, just_motion) {
            //direction - 表示坐标轴， just_motion - 表示当手势与direction相匹配时页面才会滚动 默认为false
            //启用just_motion可以与父元素复合完成四向滑动
            !just_motion || (just_motion = 'Y');
            direction = 'X' == direction.toUpperCase() ? "X" : "Y"; //默认绑定Y轴
            var keep = 'X' == direction ? 'PAGE_DRAG_H_KEEP': 'PAGE_DRAG_KEEP', restore = 'PAGE_DRAG_RESTORE', sh = elem.scrollHeight, sw = elem.scrollWidth, total = 'X' == direction ? (Math.ceil(sw / cw)): (Math.ceil(sh / ch)), cur = 0, previous =- 1, next = 1, start_x = 0, start_y = 0, x = 0, y = 0, offset = 0, motion = 'none', lock = false;
            var drag_start = function(e) {
                if (lock)
                    return ;
                var toucher = e.targetTouches || e.changedTouches, transform = elem.style[webkit + 'transform'] || '';
                start_x = toucher[0].pageX, x = parseInt(get_transform_value(transform, 'translate3d', 0)) || 0, start_y = toucher[0].pageY, y = parseInt(get_transform_value(transform, 'translate3d', 1)) || 0, offset = 0;
                if (!sw&&!sh) {
                    //需要重新取值
                    sh = elem.scrollHeight, sw = elem.scrollWidth, total = 'X' == direction ? (Math.ceil(sw / cw)) : (Math.ceil(sh / ch)), next = fix_page(cur + 1), previous = fix_page(cur-1);
                }
                motion = 'none'; //手势为none
                //e.stopPropagation();
                //e.preventDefault();
            }, drag = function(e) {
                if (lock)
                    return ;
                var toucher = e.targetTouches || e.changedTouches, _x = toucher[0].pageX, _y = toucher[0].pageY;
                if (just_motion && 'none' == motion) {
                    //需要与手势方向一致的判断
                    var offset_x = _x - start_x, offset_y = _y - start_y;
                    if (Math.abs(offset_x) == Math.abs(offset_y)) {
                        e.preventDefault(), e.stopPropagation();
                        return ; //分不出方向，等待分清方向
                    } else if (Math.abs(offset_x) > Math.abs(offset_y)) {
                        motion = 'X';
                    } else {
                        motion = "Y";
                    }
                    if (motion != direction) {
                        //方向不一致，解绑事件
                        //elem.removeEventListener(touchmove,drag,false);
                        //elem.removeEventListener(touchend,release,false);
                        m.off(elem, 'touchmove', drag, false);
                        m.off(elem, 'release', release, false);
                        //手指离开后，重新绑定原来的事件
                        //elem.addEventListener(touchend,rebind,false);
                        m.on(elem, 'release', rebind, false);
                        return ;
                    }
                }
                if ('X' == direction) {
                    offset = _x - start_x;
                    this.style[webkit + 'transform'] = 'translate3d(' + (x + offset) + 'px,0,0)';
                } else {
                    offset = _y - start_y;
                    this.style[webkit + 'transform'] = 'translate3d(0,' + (x + offset) + 'px,0)'
                }
                e.preventDefault(), e.stopPropagation();
            }, release = function(e) {
                lock = true; //上锁
                if (just_motion) {
                    e.stopPropagation(); //阻止冒泡
                }
                var toucher = e.targetTouches || e.changedTouches, min_offset = o.offset || 50; /*默认位移超50px即可翻页*/
                if (Math.abs(offset) < min_offset || (offset < 0 && cur == total-1) || (offset > 0 && cur == 0)) {
                    turnback();
                } else {
                    if (offset < 0) {
                        move(next);
                    } else {
                        move(previous);
                    }
                }
            }, rebind = function() {
                //this.removeEventListener(touchend,rebind,false),this.addEventListener(touchmove,drag,false),this.addEventListener(touchend,release,false);
                m.off(this, 'release', rebind, false), m.on(elem, 'touchmove', drag, false), m.on(elem, 'release', release, false);
            }, unbind = function(e) {
                elem.removeEventListener(touchstart, drag_start, false);
                elem.removeEventListener(touchmove, drag, false);
                elem.removeEventListener(touchend, release, false)
            }, move = function(index) {
                addClass(elem, keep);
                if ("X" == direction) {
                    elem.style[webkit + 'transform'] = 'translate3d(-' + (index * cw) + 'px,0,0)';
                } else {
                    elem.style[webkit + 'transform'] = 'translate3d(0,-' + (index * ch) + 'px,0)';
                }
                setTimeout(function() {
                    removeClass(elem, keep);
                    if (typeof(o.page_change) == "function")
                        o.page_change(cur, index);
                    cur = index, next = cur + 1, previous = cur-1;
                    cur = fix_page(cur), next = fix_page(next), previous = fix_page(previous);
                    lock = false; //解锁
                }, 300)
            }, turnback = function() {
                //回退到原来位置
                addClass(elem, restore);
                if ('X' == direction) {
                    elem.style[webkit + 'transform'] = 'translate3d(-' + cur * cw + 'px,0,0)';
                } else {
                    elem.style[webkit + 'transform'] = 'translate3d(0,-' + cur * ch + 'px,0)';
                }
                setTimeout(function() {
                    removeClass(elem, restore);
                    lock = false; //解锁
                }, 100)
            }, fix_page = function(num) {
                if (!total)
                    return num;
                //使页码正确
                if (num >= 0) {
                    return num%total;
                } else {
                    return (total + num%total);
                }
            }
            //elem.addEventListener(touchstart,drag_start,false),elem.addEventListener(touchmove,drag,false),elem.addEventListener(touchend,release,false);
            m.on(elem, 'touchstart', drag_start, false), m.on(elem, 'touchmove', drag, false), m.on(elem, 'release', release, false), m.on(elem, 'forcerelease', release, false);
            var o = {
                unbind: unbind,
                move: move
            };
            return o;
        }
        return {
            bind: bind
        }
    }())
});
var loading_img = function(images, parent, cb) {
    //加载图片
    images = images || [], parent = parent || document.body;
    //生成loading对象
    var loading = document.createElement('div'), loading_text = document.createElement("b"), loading_wrp = document.createElement("div");
    loading.className = "loading_bg", 
    loading_text.className = "loading_text", loading_wrp.className = 'loading_wrp', 
    loading.appendChild(loading_wrp),
    loading_wrp.innerHTML = '<div class="loading"><div class="loading_bar"></div></div>', 
    loading_wrp.appendChild(loading_text), parent.appendChild(loading), loading_text.innerHTML = '0%';
    var img_total = images.length, loaded_count = 0;
    var do_load = function(url) {
        var img = new Image();
        img.onload = function() {
            ++loaded_count;
            loading_text.innerHTML = parseInt((loaded_count / img_total) * 100) + "%";
        };
        img.onerror = function() {
            //出错算加载成功
            ++loaded_count;
        }
        img.onabort = function() {
            //出错算加载成功
            ++loaded_count;
        }
        img.src = url;
    };
    for (var i = 0; i < img_total; ++i) {
        do_load(images[i]);
    }
    var check_time = 60 /*总检查时长为1分钟，超时就直接显示*/
    , check = function() {
        //定时检查加载
        if (0 >= check_time) {
            //检查超时
            if (loaded_count / img_total > .5) {
                //加载超过50%直接输出
                plush_page(loading);
            } else {
                alert('加载图片失败，请返回刷新尝试!');
            }
        } else {
            check_time -= .5;
            if (loaded_count == img_total) {
                plush_page(loading);
            } else {
                setTimeout(check, 500);
            }
        }
    }
    var plush_page = typeof(cb) == 'function' ? cb: function() {};
    check();
};
/*
	@author:leeenx
	@常用弹出提示框
*/
halo.use(function(m) {
    var webkit = m.webkit;
    //动态loading层
    var LOADING = function() {
        m.stylesheet('@' + webkit + 'keyframes loading{0%{' + webkit + 'transform:rotate(0deg);}100%{' + webkit + 'transform:rotate(360deg);}}');
        var _wrp = document.createElement("div"), box = document.createElement("div"), circle = document.createElement("div"), loading_bar = document.createElement("div"), p = document.createElement("p");
        _wrp.style.cssText = 'position:absolute; left:0; top:0; right:0; bottom:0; background-color:transparent; z-index:6;', box.style.cssText = 'position:fixed; width:100px; height:100px; border-radius:2px; background-color:rgba(0,0,0,.5); color:rgba(255,255,255,.8); margin:-50px 0 0 -50px; left:50%; top:50%;', circle.style.cssText = 'position:absolute; width:46px; height:46px; left:50%; top:50%; margin:-23px 0 0 -23px; ' + webkit + 'animation:loading 1.2s linear infinite;', loading_bar.style.cssText = 'width:40px; height:40px; border:3px solid rgba(255,255,255,.8); border-radius:23px; clip:rect(0px,23px,46px,0); position:absolute; left:0; top:0; ' + webkit + 'transform-origin:center; -webkit-background-origin:border-box; -webkit-background-clip:border-box; -webkit-mask:-webkit-gradient(linear,0 0,0 100%,from(rgba(255,255,255,1)),to(rgba(255,255,255,0))); ', p.style.cssText = 'margin:0; padding:0; text-align:center; width:80px; position:absolute; bottom:10px; left:50%; margin:0 0 0 -40px; line-height:18px; white-space:nowrap';
        var show = function() {
            var opacity = .5;
            if (typeof(arguments[0]) == 'string') {
                var text = arguments[0];
                opacity = (typeof(arguments[1]) != 'undefined'&&!arguments[1]) ? 0 : opacity;
            } else {
                opacity = (typeof(arguments[0]) != 'undefined'&&!arguments[0]) ? 0 : opacity;
            }
            var text = typeof(arguments[0]) == 'string' ? arguments[0]: '';
            if (text) {
                circle.style.marginTop = '-35px', p.innerHTML = text;
            }
            box.style.backgroundColor = 'rgba(0,0,0,' + opacity + ')';
            //box.style.top='';
            box.appendChild(circle), box.appendChild(p), _wrp.appendChild(box), document.body.appendChild(_wrp);
            setTimeout(function() {
                circle.appendChild(loading_bar)
            }, 17);
        }, hide = function() {
            if (_wrp.parentNode)
                _wrp.parentNode.removeChild(_wrp);
        }
        _o = {
            show: show,
            hide: hide
        };
        return _o;
    }();
    //弹出层
    var msgBox = function() {
        var show = function() {
            var text = arguments[0], btn_1 = arguments[1], btn_2 = arguments[2], needClose = true;
            if (typeof(text) != 'string') {
                return ;
            }
            if (arguments.length == 1) {
                needClose = false; //没有按钮
            } else if (arguments.length == 2 || arguments.length == 3) {
                var i = arguments.length-1;
                if (typeof(arguments[i]) != 'undefined' && typeof(arguments[i]) != 'object')
                    needClose=!!arguments[i];
            } else if (arguments.length > 3) {
                needClose=!!arguments[4];
            }
            var _wrp = document.createElement("div"), box = document.createElement("div"), bd = document.createElement("div"), ft = document.createElement("div"), p = document.createElement('p'), closer = document.createElement("div"), i = 'display:block; position:absolute; width:0; height:0; overflow:hidden; border:5px solid transparent;', left_btn = document.createElement("div"), right_btn = document.createElement("div"), center_btn = document.createElement("div");
            _wrp.style.cssText = 'position:absolute; left:0; top:0; right:0; bottom:0; background-color:rgba(0,0,0,.8); z-index:97;', box.style.cssText = 'position:absolute; left:30px; right:30px; top:50%; height:auto; ' + webkit + 'transform:translate3d(0,-50%,0); background-color:#fff; color:rgba(0,0,0,.8); font-size:14px;', bd.style.cssText = 'position:relative; padding:8px; line-height:18px; text-align:center; font-size:12px; border-bottom:1px solid rgba(0,0,0,.2); height:80px;', p.style.cssText = 'padding:8px; margin:0; position:relative; top:50%; ' + webkit + 'transform:translate3d(0,-50%,0);', ft.style.cssText = 'position:relative; height:48px;', closer.style.cssText = 'position:absolute; width:10px;height:10px; overflow:hidden; background-color:#A19A9A; top:8px; right:8px; overflow:hidden', left_btn.style.cssText = 'position:absolute; height:48px; left:0; right:50%; top:0; bottom:0; text-align:center; line-height:48px;', right_btn.style.cssText = 'position:absolute; height:48px; top:0; bottom:0; left:50%; right:0; border-left:1px solid rgba(0,0,0,.2); text-align:center; line-height:48px;', center_btn.style.cssText = 'position:absolute; height:48px; top:0; bottom:0; left:0; right:0; text-align:center; line-height:48px;';
            _wrp.appendChild(box), box.appendChild(bd), box.appendChild(ft), bd.appendChild(p);
            if (needClose) {
                box.appendChild(closer)
                closer.innerHTML = '<i style="' + i + ' border-top-color:#fff; left:0; top:-1px;"></i>' + '<i style="' + i + ' border-right-color:#fff; right:-1px; top:0;"></i>' + '<i style="' + i + ' border-bottom-color:#fff; left:0; bottom:-1px;"></i>' + '<i style="' + i + ' border-left-color:#fff; left:-1px; top:0;"></i>';
                m.on(closer, 'touchend', function() {
                    hide(_wrp);
                })
            }
            // p.innerHTML='暂时无法登录，请稍候再试',left_btn.innerHTML='取消',right_btn.innerHTML='确认';
            // ft.appendChild(right_btn),ft.appendChild(left_btn);
            // document.body.appendChild(_wrp);
            p.innerHTML = text;
            if (typeof(btn_1) != 'object') {
                // center_btn.innerHTML='确定',center_btn.addEventListener(touchend,function(){hide(_wrp);},false);
                //ft.appendChild(center_btn);
                box.removeChild(ft); //没有按钮
            } else if (typeof(btn_2) != 'object') {
                center_btn.innerHTML = btn_1.text || '确定',
                m.on(center_btn, 'touchend', function() {
                    if (typeof(btn_1.cb) == 'function')
                        btn_1.cb();
                        if (typeof(btn_1.close) == 'undefined' || btn_1.close)
                            hide(_wrp);
                }), !btn_1.color || (center_btn.style.color = btn_1.color);
                ft.appendChild(center_btn);
            } else {
                left_btn.innerHTML = btn_1.text || '取消',
                m.on(left_btn, 'touchend', function() {
                    if (typeof(btn_1.cb) == 'function')
                        btn_1.cb();
                        if (typeof(btn_1.close) == 'undefined' || btn_1.close)
                            hide(_wrp);
                }), !btn_1.color || (left_btn.style.color = btn_1.color);;
                right_btn.innerHTML = btn_2.text || '确定',
                m.on(right_btn, 'touchend', function() {
                    if (typeof(btn_2.cb) == 'function')
                        btn_2.cb();
                        if (typeof(btn_2.close) == 'undefined' || btn_2.close)
                            hide(_wrp);
                }), !btn_2.color || (right_btn.style.color = btn_2.color);;
                ft.appendChild(right_btn), ft.appendChild(left_btn);
            }
            document.body.appendChild(_wrp);
        }, hide = function(_wrp, closer) {
            _wrp.parentNode.removeChild(_wrp);
        }, _o = {
            show: show,
            hide: hide,
            loading: LOADING
        };
        return _o;
    }();
    halo.add('msgbox', msgBox);
});
halo.use(function(m) {
    var webkit = m.webkit;
    //横屏警告
    var warn = function() {
        var _warn = document.createElement("div"), _warn_icon = document.createElement('i'), _warn_wrp = document.createElement('div');
        _warn_wrp.style.cssText = 'position:absolute; width:100%; height:100%; overflow:hidden; left:0; top:0; z-index:9999; background-color:#bd1f26; display:none;', 
        _warn.style.cssText = 'position:absolute; left:50%; top:50%; width:250px; height:150px; margin:-75px 0 0 -125px; text-align:center; color:#ffffff;', 
        _warn_icon.style.cssText = 'position:relative; display:block; width:74px; height:110px; background:url(iphone.png) 0 0 no-repeat; background-size:100%; margin:0 auto; ' + webkit + 'transform:rotate(-90deg); ' + webkit + 'animation:TOUCH_DRAG_IPHONE 1.6s ease-in infinite;';
        m.stylesheet('@' + webkit + 'keyframes TOUCH_DRAG_IPHONE{0%{' + webkit + 'transform:rotate(-90deg);}25%{' + webkit + 'transform:rotate(0deg);}50%{' + webkit + 'transform:rotate(0deg);}75%{' + webkit + 'transform:rotate(-90deg);}100%{' + webkit + 'transform:rotate(-90deg);}}'); //
        document.body.appendChild(_warn_wrp), _warn_wrp.appendChild(_warn), _warn.appendChild(_warn_icon);
        var _warn_text = document.createTextNode('为了更好的体验，请使用竖屏浏览');
        _warn.appendChild(document.createElement('br')), _warn.appendChild(_warn_text);
        var set = function(bg, icon, text) {
            //设置warn的样式
            if (typeof(bg) == 'string')
                _warn_wrp.style.backgroundColor = bg;
            if (typeof(icon) == 'string')
                _warn_icon.style.backgroundImage = icon;
            if (typeof(text) == 'string')
                _warn_text.nodeValue = text;
        }
        var show = function() {
            _warn_wrp.style.display = 'block';
        }
        var hide = function() {
            _warn_wrp.style.display = 'none';
        }
        return {
            show: show,
            hide: hide,
            set: set
        };
    }();
    var need_watch = 'onorientationchange' in window;
    var clientHeight = document.documentElement.clientHeight, clientWidth = document.documentElement.clientWidth;
    if (need_watch) {
        if (window.orientation != '0')
            warn.show();
        window.addEventListener('orientationchange', function() {
            if (window.orientation != '0') {
                warn.show();
            } else {
                warn.hide();
            }
        }, false);
    } else {
        if (clientHeight < clientWidth)
            warn.show();
    }
    //监听窗口变化
    window.addEventListener('resize', function() {
        clientHeight = document.documentElement.clientHeight, clientWidth = document.documentElement.clientWidth;
        if (!need_watch) {
            //没办监听orientationchange，用resize代替
            if (clientHeight < clientWidth) {
                warn.show();
            } else {
                warn.hide();
            }
        }
    }, false);
    halo.add('warn', warn);
}) /*  |xGv00|ce39f5fe10a398178e5203f1228d51fd */
