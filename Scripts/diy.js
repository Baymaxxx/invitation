var diy = {
    //封面 -> 刮刮卡外图
    'lottery_pic':'Images/3.jpg',
    //刮刮卡内图
    'font_cover':'Images/1.jpg'
};
var loading_arr  =  [
    'http://pic.rs.meihu99.com/uploads/7988/2015062006005953648.jpg',
    'http://pic.rs.meihu99.com/uploads/7988/2015062006015669547.jpg'
];
/*
  *audio->背景音乐
  *xinlang->新郎名字
  *xinniang->新娘名字
  *data->婚礼日期
  *bgArr-图片
 */
  function init(xinlang,xinniang,data,bgArr){
      if(bgArr.audio){
          $('#music source').attr("src",bgArr.audio);
      }
      var html = "<audio id='music' autoplay='autoplay' loop='loop'>"+
          "<source src='"+
          bgArr.audio+
          "' type='audio/mpeg'>"+
          "</audio>";
      $("body").append(html);
      $('.xl_show').html(xinlang);
      $('.xn_show').html(xinniang);
      $('.show_date').html(data);
      $('.page0 .background').css("backgroundImage",bgArr.bg0);
      $('.page1 .background').css("backgroundImage",bgArr.bg1);
      $('.page2 .background').css("backgroundImage",bgArr.bg2);
      $('.page2 .card .frontbackground').css("backgroundImage",bgArr.bg2Front);
      $('.page3 .background').css("backgroundImage",bgArr.bg3);
      $('.page4 .background').css("backgroundImage",bgArr.bg4);
      $('.page4 .card .frontbackground').css("backgroundImage",bgArr.bg4Front);
      $('.page5 .background').css("backgroundImage",bgArr.bg5);
      $('.page6 .background').css("backgroundImage",bgArr.bg6);
      $('.page6 .card .frontbackground').css("backgroundImage",bgArr.bg6Front);
  }
  var bgArr = {
      audio:"audio/yicijiuhao.mp3",
      bg0:"url(Images/1.jpg)",
      bg1:"url(Images/1.jpg)",
      bg2:"url(Images/1.jpg)",
      bg2Front:"url(Images/1.jpg)",
      bg3:"url(Images/1.jpg)",
      bg4:"url(Images/1.jpg)",
      bg4Front:"url(Images/1.jpg)",
      bg5:"url(Images/1.jpg)",
      bg6:"url(Images/1.jpg)",
      bg6Front:"url(Images/1.jpg)"
  };
  init("朱东旭","未成年","2016年02月30日",bgArr);



















