/*
  author：linx
  version: 1.7
  time: 2020-2-17

   埋点时显示描框方法 ：infoBeat().ini(x,y)--->其中x,y为html元素在页面中的位置
   清除描框方法 ： infoBeat().clearSquare()--->不用传递参数
   获取埋点信息方法：infoBeat().iniBuried(x,y)--->其中x,y为html元素在页面中的位置
   显示历史埋点方法: infoBeat().showSquare() --->传递参数示例'[{"wUnique":"HTML>BODY**0>MAIN.page_main**0>SECTION#j_navBox.nav_box**1>SECTION.map_box**0>NAV.map_nav.clearfix**2>A.map_nav_a**6>SPAN.map_s**0","wName":"span","wFrame":"91,553,68,30,0,414,736","wId":"HTML>BODY**0>MAIN.page_main**0>SECTION#j_navBox.nav_box**1>SECTION.map_box**0>NAV.map_nav.clearfix**2>A.map_nav_a**6>SPAN#infobeathtml2canvas.map_s**091,553,68,30,0,414,736","clickType":"-1","wUrl":null,"wPageUrl":"https://sina.cn/index/nav?vt=4&pos=108","wEvenType":8,"wText":"CBA"}]'
   清除历史埋点方法 ：infoBeat().infoBeatClearHistory() --->不用传递参数
*/

(function(root) {
  var SELECT_DOM_MASK_ATTR_NAME = 'ib_select-dom';  // 圈选Dom遮罩层
  var SELECT_DOM_ATTR_NAME = 'ib_select-buried';    // 圈选Dom标记
  var BURIED_DOM_ATTR_NAME = 'infobeathtml2canvas'; // 选中埋点Dom标记
  var HISTORY_DOM_ATTR_NAME = 'ib_historyBuried';   // 历史埋点Dom标记
  var HISTORY_DOM_CLASS_NAME = 'ib_history-buried'; // 历史埋点Class

  var infoBeat = function() { //构造函数  函数对象
    return new infoBeat.prototype.init();
  }

  // alert('JS加载完成，版本号：0.0.0.1')
  /* 页面自测代码 */
  document.body.addEventListener('mouseout', function(ev){
    var ib = infoBeat();
    var ps = ib.getElementPosition(ev.srcElement);
    var st = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop

    ps.y -= st
    ib.ini(ps.x,ps.y)
    console.info(JSON.stringify(ps))
    return JSON.stringify(ps)
  })

  infoBeat.fn = infoBeat.prototype = { //原型对象
    length: 0,
    infoBeatHistoryArr: [],

    init: function() {
      return this;
    },

    clearSquare: function() {
      var oldDom = document.querySelector('['+ SELECT_DOM_MASK_ATTR_NAME +']');
      if(oldDom) {
        oldDom.parentNode.removeChild(oldDom);
      }
    },

    ini: function(x, y) {
      var oldDom = document.querySelector('['+ SELECT_DOM_MASK_ATTR_NAME +']');
      if(oldDom) {
        oldDom.parentNode.removeChild(oldDom);
      }
      var dom0 = document.elementFromPoint(x, y);
      var targetParentNode = dom0.parentNode;
      var targetParentNodePosition = window.getComputedStyle(targetParentNode).position;

      dom0.setAttribute(SELECT_DOM_ATTR_NAME, SELECT_DOM_ATTR_NAME);

      // 当父节点position样式值不为空或者等于初始值时设置‘relative’值
      if (!targetParentNodePosition
        || targetParentNodePosition == 'initial') {
        this.setDomStyle(targetParentNode, {'position': 'relative'})
      }

      var div = document.createElement('div');
      div.className = ''
      div.setAttribute(
        SELECT_DOM_MASK_ATTR_NAME,
        SELECT_DOM_MASK_ATTR_NAME);
      // div.style.border = "solid 2px rgb(249,64,64)";
      div.style.border = "solid 2px rgb(249,64,64)";
      div.style.position = "absolute";
      div.style.width = dom0.offsetWidth + "px";
      div.style.height = dom0.offsetHeight + "px";
      div.style.left = this.getElementViewLeft(dom0) + "px";
      div.style.top = this.getElementViewTop(dom0) + "px";
      div.style.zIndex = 99999999999999;
      div.style.boxSizing = 'border-box';
      div.style.pointerEvents = 'none'
      // document.body.appendChild(div);
      targetParentNode.appendChild(div);
    },

    datacj: function(dom) {
      var obj = {};
      var dom0 = dom || document.querySelector('['+ BURIED_DOM_ATTR_NAME +']');
      var width = dom0.clientWidth || dom0.offsetWidth;
      var height = dom0.clientHeight || dom0.offsetHeight;
      var position = this.getElementPosition(dom0)
      var left = position.x
      var top = position.y
      var texts = dom0.innerText;
      // var scroll = this.getScrollOffsets().y;
      var scroll = window.pageXoffset || document.body.scrollTop || document.documentElement.scrollTop || 0;
      var widths = window.screen.width;
      var heights = window.screen.height
      var nodeName = dom0.nodeName ? dom0.nodeName.toLowerCase() : "";

      obj.wUnique = this.readXPath(dom0)
      obj.wName = dom0.nodeName ? dom0.nodeName.toLowerCase() : "";
      obj.wFrame = left + "," + top + "," + width + "," + height + "," + scroll + "," + widths + "," + heights;
      obj.wId = obj.wUnique + location.href;
      obj.clickType = '-1';
      obj.wUrl = dom0.getAttribute("href");
      obj.wPageUrl = location.href;

      switch(nodeName) {
        case "button":
          obj.wEvenType = 1;
          break;
        case "input":
          obj.wEvenType = 3;
          break;
        case "a":
          obj.wEvenType = 4;
          break;
        case "img":
          obj.wEvenType = 5;
          break;
        case "audio":
          obj.wEvenType = 6;
          break;
        case "video":
          obj.wEvenType = 7;
          break;
        default:
          obj.wEvenType = 8;
      }
      obj.wText = obj.wEvenType == 3 ? dom0.value.replace(/[\r\n]/g, "") :  obj.wEvenType == 5 ? dom0.getAttribute("src") : texts.replace(/[\r\n]/g, "");
      var str = JSON.stringify(obj);

      if(navigator.userAgent.toLowerCase().indexOf("android") != -1) {
        window.java.getWebInfo(str)
      } else if(navigator.userAgent.toLowerCase().indexOf("iphone") != -1) {
        return str;
      }
    },

    getElementViewLeft: function(element) {　　　　
      var actualLeft = element.offsetLeft;　　　　
      var current = element.offsetParent;
      return actualLeft　　
    },

    getElementPosition(e) {
      var x = 0, y = 0;
      while (e != null) {
        x += e.offsetLeft;
        y += e.offsetTop;
        e = e.offsetParent;
      }
      return { x: x, y: y };
    },

    getScrollOffsets(w) {
      var w = w || window;
      if (w.pageXoffset != null) {
        return { x: w.pageXoffset, y: pageYoffset };
      }

      var d = w.document;
      if (document.compatMode == "CSS1Compat") // 标准兼容模式开启
        return { x: d.documentElement.scrollLeft, y: d.documentElement.scrollTop };
      return { x: d.body.scrollLeft, y: d.body.scrollTop };
    },

    getElementViewTop: function(element) {　　　　
      var actualTop = element.offsetTop;　　　　
      var current = element.offsetParent;
      return actualTop　　
    },

    readXPath: function(element) {
      if (element.id !== "") {
        return "//*[@id='"+ element.id +"']";
      }
      if (element == document.body) {
        return '/html/' + element.tagName.toLowerCase();
      }

      var ix = 1,
        siblings = element.parentNode.childNodes; // 同级的子元素

      for (var i = 0, l = siblings.length; i < l; i++) {
        var sibling = siblings[i];
        //如果这个元素是siblings数组中的元素，则执行递归操作
        if (sibling == element) {
          return arguments.callee(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix) + ']';
          //如果不符合，判断是否是element元素，并且是否是相同元素，如果是相同的就开始累加
        } else if (sibling.nodeType == 1 && sibling.tagName == element.tagName) {
          ix++;
        }
      }
    },

    getDomByXPath: function(xpath) {
      var xresult = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
      var xnodes = [];
      var xres;
      while (xres = xresult.iterateNext()) {
        xnodes.push(xres);
      }

      return xnodes;
    },

    setDomStyle(dom, cssObj) {
      let obj = cssObj || {}
      for (var i in obj) {
        dom.style[i] = obj[i]
      }
      return dom
    },

    showSquare: function(objs) {
      var arr = []
      var _this = this;
      this.infoBeatClearHistory();

      if(objs instanceof Array) {
        arr = objs
      } else if (typeof objs == "string") {
        arr = JSON.parse(objs);
      }

      arr.forEach(function (item) {
        var obj = item;
        var doms = _this.getDomByXPath(obj.wUnique)[0]

        // 保存历史埋点
        _this.infoBeatHistoryArr.push(item);

        if (doms) {
          var targetParentNode = doms.parentNode;
          var div = document.createElement('div');

          if (!targetParentNode.style.position || targetParentNode.style.position != 'initial') {
            _this.setDomStyle(targetParentNode, {'position': 'relative'})
          }

          div.setAttribute(HISTORY_DOM_ATTR_NAME, HISTORY_DOM_ATTR_NAME);
          div.style.border = "solid 2px rgb(17,207,124)";
          div.style.backgroundColor = "rgba(17,207,124,0.2)";
          div.style.position = "absolute";
          div.style.width = doms.offsetWidth + 1 + "px";
          div.style.height = doms.offsetHeight + 1 + "px";
          div.style.left = _this.getElementViewLeft(doms) + "px";
          div.style.top = _this.getElementViewTop(doms) + "px";
          div.style.zIndex = 99999999999999;
          div.style.boxSizing = 'border-box'
          // doms.className = HISTORY_DOM_CLASS_NAME
          _this.addClass(doms, HISTORY_DOM_CLASS_NAME)
          targetParentNode.appendChild(div)

          // _this.addClass(doms, HISTORY_DOM_CLASS_NAME);
        }
      })
    },

    iniBuried: function(x, y) {
      var buriedDom = null
      var oldDom =  document.querySelector('['+ SELECT_DOM_MASK_ATTR_NAME +']');
      if(!!oldDom) {
        oldDom.parentNode.removeChild(oldDom)
      }
      var oldDom2 = document.querySelector('['+ SELECT_DOM_ATTR_NAME +']')
      if(!!oldDom2) {
        oldDom2.removeAttribute(SELECT_DOM_ATTR_NAME);
      }

      if(!document.elementsFromPoint) {
        var paths = false;
        var screenW = window.screen.width;
        var arr = this.infoBeatHistoryArr;
        var length = this.infoBeatHistoryArr.length;

        // 遍历是否存在历史埋点
        if (length) {
          for(var i = 0; i < length; i++) {
            var positionArr = arr[i].wFrame.split(",");
            var wids = positionArr[5];
            var lefs = Number(positionArr[0]);
            var lefs2 = Number(positionArr[2]) + lefs;
            var tops = Number(positionArr[1])
            var tops2 = Number(positionArr[3]) + tops;
            if(x / (screenW / wids) > lefs && x / (screenW / wids) < lefs2 && y > tops && y < tops2) {
              paths = arr[i].wUnique;
            }
          }
        }

        if(!!paths) {
          buriedDom = this.getDomByXPath(paths)[0]
        } else {
          buriedDom = document.elementFromPoint(x, y);
        }
      } else {
        var dom0 = document.elementsFromPoint(x, y);
	      for(var i=0;i<dom0.length;i++){
	      	if(this.hasClass(dom0[i], HISTORY_DOM_CLASS_NAME)){
            buriedDom = dom0[i]
	      		break;
	      	}
	      }
	      // 没有适配到历史埋点时取最接近坐标的dom
	      if (!buriedDom) {
          buriedDom = document.elementFromPoint(x, y);
        }
      }

      if (buriedDom) {
        buriedDom.setAttribute(BURIED_DOM_ATTR_NAME, BURIED_DOM_ATTR_NAME);
      }

      if(navigator.userAgent.toLowerCase().indexOf("android") != -1) {
        this.datacj(buriedDom);
      } else if(navigator.userAgent.toLowerCase().indexOf("iphone") != -1) {
        var strs = this.datacj(buriedDom);
        if(strs) {
          return strs;
        }
      }
    },

    infoBeatClearHistory: function() {
      var doms = document.querySelectorAll('['+ HISTORY_DOM_ATTR_NAME +']');
      for(var i = 0; i < doms.length; i++) {
        doms[i].parentNode.removeChild(doms[i])
      }
      if(doms.length) {
        this.infoBeatClearHistory()
      }
    },

    hasClass: function(ele, cls) {
      return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    },

    addClass: function(ele, cls) {
      if(!this.hasClass(ele, cls)) ele.className += " " + cls;
    },

    removeClass: function(ele, cls) {
      if(hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
      }
    },
  }

  infoBeat.fn.init.prototype = infoBeat.fn;
  root.infoBeat = infoBeat;
})(this);
