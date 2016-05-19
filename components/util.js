
function $(selector) {
	return new MyQuery(selector);
}

/**
 * 判断arr是否为一个数组，返回一个bool值
 *
 * @param  arr 目标数组
 * @return {boolean}  判断结果
 */
$.isArray = function(arr) {
	return Object.prototype.toString.call(arr) === '[object Array]';
}

/**
 * 判断fn是否为一个函数，返回一个bool值
 *
 * @param  function 目标函数
 * @return {boolean}  判断结果
 */
$.isFunction = function(fn) {
	return Object.prototype.toString.call(fn) === '[object Function]';
 }

/**
 * 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
 * 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。
 * 不会包含函数、正则对象等
 * 
 * @param  src 目标对象
 * @return {boolean}  判断结果
 */
$.cloneObject = function(source) {
	var	result;
	if (!source || typeof source != 'object') {
		result = source;
	} else if (this.isArray(source)) {
		result = [];
		var i, len;
		for (i = 0, len = source.length; i < len; i++) {
			result.push(this.cloneObject(source[i]));
		}
	} else {
		result = {};
		var key;
		for (key in source) {
			if (source.hasOwnProperty(key)) {
				result[key] = this.cloneObject(source[key]);
			}
		}
	}
	return result;
}

/**
 * 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
 *
 * @param arr 需要去重的数组
 * @return {array} 去重后的数组
 */

//方法1 遍历
$.uniqArray = function(arr) {
	var result = arr.slice(0),
		len = result.length,
		i, j;
	for (i = 0; i < len; i++) {
		for ( j = i + 1; j < len; j++) {
			if ( result[i] === result[j]) {
				result.splice(j, 1);
				arr.splice(j, 1);
				len = result.length;
				j--;
			}
		}
	}
	return result;
}

//方法2，利用键值
$.uniqArray1 = function(arr) {
	var obj = {},
		result = [],
		i, len;
	for (i = 0, len = arr.length; i < len; i++) {
		var key = arr[i];
		if (!obj[key]) {
			result.push(key);
			obj[key] = true;
		}
	}
	return result;
}

//方法3，利用键值+ es5中的Obejce.keys(), IE9+兼容
//		 若数组为数组字符串混合时，对象的键值排序会将字母排到数字后面，导致去重后的数组排序不正确
$.uniqArray2 = function(arr) {
	var obj = {},
		i, len;
	for (i = 0, len = arr.length; i < len; i++) {
		var key = arr[i];
		obj[key] = true;
	}
	return Object.keys(obj);
}

/**
 * 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
 * es5有String.prototype.trim()方法，只是IE需要做兼容
 *
 * @param str 需要操作的字符串
 * @return {string} 去头尾空格后的字符串
 */
$.trim = function(str) {
//注意chrome下’\s’可以匹配全角空格，但是考虑兼容的话，需要加上’\uFEFF\xA0’，去掉BOM头和全角空格
//某些软件，在保存一个以UTF-8编码的文件时，会在文件开始的地方插入三个不可见的字符（0xEF 0xBB 0xBF，即BOM），转码后是“\uFEFF”，因此我们在读取时需要自己去掉这些字符。
//“\xA0”其实就是HTML中常见的“&nbsp”
	var reg = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
	return String(str).replace(reg, '');
}


/**
 * 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
 *
 * @param arr 需要操作的数组
 * @param fn  数组中每一个元素执行的函数
 */
$.each = function(arr, fn) {
	var i, len;
	for (i = 0, len = arr.length; i < len; i++) {
		fn.call(arr[i], arr[i], i);
	}
}

/**
 * 获取一个对象里面第一层元素的数量，返回一个整数
 *
 * @param obj 需要操作的对象
 * @return {number}  对象里面第一层元素的数量
 */
$.getObjectLength = function(obj) {
	var	hasDontEnumBug = !({
			toString: null
		}).propertyIsEnumerable('toString'),
		dontEnums = [
			'toString',
			'toLocaleString',
			'valueOf',
			'isPrototypeOf',
			'hasOwnProperty',
			'propertyIsEnumerable',
			'constructor'
		],
		dontEnumsLen = dontEnums.length;

	if (typeof obj !== 'object' && (typeof obj !=='function' || typeof obj === null)) {
		throw new TypeError('getObjectLength called on non-object');
	}

	var result = [],
		prop, i;
	for (prop in obj) {
		// 如果obj里面有重写了hasOwnProperty，obj.hasOwnProperty(prop)则失效，
		// 所以要用Object.prototype.hasOwnProperty.call
		if (Object.prototype.hasOwnProperty.call(obj, prop)) {
			result.push(prop);
		}
	}

	if (hasDontEnumBug) {
		for (i = 0; i < dontEnumsLen; i++) {
			if (Object.prototype.hasOwnProperty.call(obj, dontEnums[i])) {
				result.push(dontEnums[i]);
			}
		}
	}
	return result.length;
}


/*
 * 判断是否为邮箱地址
 * 
 * @param str 需要判断的字符串
 * @return {boolean} 判断结果
 */
$.isEmail = function(str) {
	return /^[\w\-\.\+]+\@([\w\-]+\.)+(\w{2,10})$/.test(str);
}


/*
 * 判断是否为手机号码
 * 
 * @param str 需要判断的字符串
 * @return {boolean} 判断结果
 */
$.isMobileNumber = function(str) {
	return /^1\d{10}$/.test(str);
}


/*
 * 查询是否已存在某个className
 * 
 * @param {object} element 要增加类名的元素
 * @param {string} ClassName 要查询的类名
 * @return {boolean} 判断结果
 */
$.hasClass = function(element, className) {
	if (!element.className) {
		return false;
	}
	var classNames = element.className.split(/\s+/),
		i, len;
	for (i = 0, len = classNames.length; i < len; i++) {
		if (classNames[i] === className) {
			return true;
		}
	}
	return false;
}

/*
 * 添加className
 * 
 * @param {html element} element 要增加类名的元素
 * @param {string} ClassName 要增加的类名
 */
$.addClass = function(element, className) {
	if (className && !this.hasClass(element, className)) {
		element.className = element.className ? [element.className, className].join(' ') : className;
	}
}

/*
 * 删除className
 * 
 * @param {html element} element 要增加类名的元素
 * @param {string} ClassName 要增加的类名
 */
$.removeClass = function(element, className) {
	if (className && $.hasClass(element, className)) {
		var classNames = element.className.split(/\s+/),
			i, len;
		for (i = 0, len = classNames.length; i < len; i++) {
			if (classNames[i] === className) {
				classNames.splice(i, 1);
				break;
			}
		}
		element.className = classNames.join(' ');
		return;
	}
}

/*
 * 判断是否为兄弟元素
 * 
 * @param {html element} element
 * @param {html element} siblingNode 判断的元素
 * 
 * @return {boolean} 是否为兄弟元素
 */
$.isSiblingNode = function(element, siblingNode) {
	return element.parentNode === siblingNode.parentNode;
}

/*
 * 判断是元素在同级元素集合中的下标
 * 
 * @param {html element} element
 *
 * @return {number}  元素在同级元素集合中的下标
 */
$.index = function(element) {
	var siblings = element.parentNode.children;
	var result;
	$.each(siblings, function(item, index) {
		if (element === item) {
			result = index;
		}
	});
	return result;
}

/*
 * 获取元素相对于窗口左上角的位置
 * 
 * @param {html element} element 要获取位置的元素
 * @return {object} 位置对象
 */
$.getPosition = function(element) {
	return element.getBoundingClientRect();
}

/*
 * 获取元素CSS样式值
 * 
 * @param {html element} element 要获取样式的元素
 * @param {attr} element 要获取的样式名称
 *
 * @return {object} 元素CSS样式值
 */

$.getStyle = function(element,attr){
	if(element.currentStyle){
		return element.currentStyle[attr];
	}else{
		return getComputedStyle(element,false)[attr];
	}
}



/*
 * 判断是否为IE浏览器
 *
 * @return -1或者版本号
 */
$.isIE = function() {
	// 大都是用navigator增值匹配得到的版本号。但是在IE8+，可以选择不同版本的浏览区渲染模式，因此在这种情况下，navigator的信息就不准确了
	// 所以需要使用documentMode来判断实际的渲染模式
	// 八进制表示法中X24表示$类似x23表示# 故+ RegExp['x241'] 等同RegExp.$1`,用来捕获第一组括号内匹配的数据。
	// 加号是表示将字符串转换为数字的简便写法
	return /msie (\d+\.\d+)/i.test(navigator.userAgent)
		? (document.documentMode || + RegExp['\x241'])
		: -1;
}

/*
 * 设置，获取，移除cookie
 *
 * @param {string} cookieName
 * @param {string} cookieValue
 * @param {number} expiredays
 */
$.setCookie = function(cookieName, cookieValue, expiredays) {
	var expires;
	if (expiredays != null) {
		expires = new Date();
		expires.setTime(expires.getTime() + expiredays * 24 * 60 * 60 * 1000);
	}

	document.cookie = cookieName + '=' + encodeURIComponent(cookieValue) + (expires ? '; expires=' + expires.toUTCString() : '');
}

$.getCookie = function(cookieName) {
	var reg = new RegExp('(?:^| )' + cookieName + '=([^;]*)(?:;|\x24)');
	var result = reg.exec(document.cookie);
	if (result) {
		return result[1] || null;
	}
	return null;
}

$.removeCookie = function(cookieName) {
	this.setCookie(cookieName, 1, -1);
}


/*
 * Ajax
 *
 * @param {url} url
 * @param {options} options
 */
$.ajax = function(url, options) {
	var options = options || {};
	var data = stringifyData(options.data || {});
	var type = (options.type || 'GET').toUpperCase();
	var xhr;
	var eventHandlers = {
		onsuccess: options.onsuccess,
		onfail: options.onfail
	};

	try {
		url += (url.indexOf('?') >= 0 ? '' : '?') + 't=' + new Date().getTime();
		if (type === 'GET' && data) {
			url += data;
			data = null;
		}

		xhr = getXHR();
		xhr.open(type, url, true);
		xhr.onreadystatechange = stateChangeHandler;

		if (type === 'POST') {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		}
		xhr.send(data);
	} catch (ex) {
		fire('fail');
	}

	return xhr;

	function stringifyData(data) {
		var param = [];
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				param.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
			}
		}
		return param.join('&');
	}

	function getXHR() {
		if (window.ActiveXObject) {
			try {
				return new ActiveXObject('Msxml2.XMLHTTP');
			} catch (e) {
				try {
					return new ActiveXObject('Microsoft.XMLHTTP');
				} catch (e) {}
			}
		}
		if (window.XMLHttpRequest) {
			return new XMLHttpRequest();
		}
	}

	function stateChangeHandler() {
		var state;
		if (xhr.readyState === 4) {
			try {
				state = xhr.status;
			} catch (ex) {
				// 在请求时，如果网络中断，Firefox会无法取得status
				fire('fail');
				return
			}

			// fire(state);

			if (state >= 200 && state < 300  || state === 304) {
				fire('success');
			} else {
				fire('fail');
			}

			window.setTimeout(
				function() {
					xhr.onreadystatechange = new Function();
					xhr = null;
				},
				0
			); 
		}
	}

	function fire(type) {
		type = 'on' + type;
		var handler = eventHandlers[type];
		if (!handler) {
			return;
		}
		if (type !== 'onsuccess') {
			handler(xhr);
		} else {
			//处理获取xhr.responseText导致出错的情况,比如请求图片地址.
			try {
				xhr.responseText;
			} catch(error) {
				return handler(xhr);
			}
			handler(xhr, xhr.responseText);
		}
	}
}


/*
 * mini selector $
 * 不考虑'>' 、`~`等嵌套关系
 * 
 * @param {string} selector 选择器
 * @param {array} 返回相对应的元素组
 */
function MyQuery(selector) {
	this.elements = [];

	if (selector.nodeType === 1) {
		this.elements.push(selector);
		return;
	}

	var idReg  = /^\#([\w\-]+)/,
		classReg = /^\.([\w\-]+)/,
		tagReg = /^\w+$/i,
		attrReg = /(\w+)?\[([^=\]]+)(?:=(["'])?([^\]"']+)\3?)?\]/;

	var context = document;

	function blank() {}

	function direct(part, actions) {
		actions = actions || {
			id: blank,
			className: blank,
			tag: blank,
			attribute: blank
		};
		var fn;
		var params = [].slice.call(arguments, 2);
		//id
		if (result = part.match(idReg)) {
			fn = 'id';
			params.push(result[1]);
		}
		//class
		else if (result = part.match(classReg)) {
			fn = 'className';
			params.push(result[1]);
		}
		//tag
		else if (result = part.match(tagReg)) {
			fn = 'tag';
			params.push(result[0]);
		}
		//attribute
		else if (result = part.match(attrReg)) {
			fn = 'attribute';
			var tag = result[1];
			var key = result[2];
			var value = result[4];
			params.push(tag, key, value);
		}
		return actions[fn].apply(null, params);
	}/*** direct ***/

	function find(parts, context) {
		var part = parts.pop();
		var actions = {
			id: function(id) {
				return [
					document.getElementById(id)
				];
			},
			className: function(className) {
				var result = [];
				if(context.getElementsByClassName) {
					result = context.getElementsByClassName(className);
				} else {
					var temp = context.getElementsByTagName('*'),
						i, len;
					for (i = 0, len = temp.length; i < len; i++) {
						var node = temp[i];
						if ($.hasClass(node, className)) {
							result.push(node);
						}
					}
				}
				return result;
			},
			tag: function(tag) {
				return context.getElementsByTagName(tag);
			},
			attribute: function(tag, key, value) {
				var result = [],
					temp = context.getElementsByTagName(tag || '*'),
					i, len;
				for (i = 0, len = temp.length; i < len; i++) {
					var node = temp[i];
					if (value) {
						var v = node.getAttribute(key);
						(v === value) && result.push(node); 
					} else if (node.hasAttribute(key)) {
						result.push(node);
					}
				}
				return result;
			}
		};

		var ret = direct(part, actions);
		ret = [].slice.call(ret);
		return parts[0] && ret[0] ? filterParents(parts, ret) : ret;
	}/*** find ***/

	function filterParents(parts, ret) {
		var parentPart = parts.pop();
		var result = [],
			i, len;
		for (i = 0, len = ret.length; i < len; i++) {
			var node = ret[i],
				p = node;
			while (p = p.parentNode) {
				var actions = {
					id: function(el, id) {
						return (el.id === id);
					},
					className: function(el, className) {
						return $.hasClass(el, className);
					},
					tag: function(el, tag) {
						return (el.nodeName.toLowerCase() === tag);
					},
					attribute: function(el, tag, key, value) {
						var valid = true;
						if (tag) {
							valid = actions.tag(el, tag);
						}
						valid = valid && el.hasAttribute(key);
						if (value) {
							valid = valid && (el.getAttribute(key) === value);
						}
						return valid;
					}
				};

				var matches = direct(parentPart, actions, p);	
				if (matches) {
					break;
				}
			}

			if(matches) {
				result.push(ret[i]);
			}
		}
		return parts[0] && result[0] ? filterParents(parts, result) : result;
	}/*** filterParents ***/

	var result = find(selector.split(/\s+/), context);
	this.elements = result;
}


// 为了便于查找绑定过的事件，增加了一级命名空间
MyQuery.event = {
	listeners: []
};

/*
 * 事件绑定
 * 
 * @param {html element} element 要绑定事件的元素
 * @param {string} type 要绑定的事件名
 * @param {function} listener事件的响应
 */
MyQuery.event.addEvent = function (element, type, listener) {
	type = type.replace(/^on/i, '').toLowerCase();
	var lis = MyQuery.event.listeners;

	if (element.addEventListener) {
		element.addEventListener(type, listener, false);
	} else if (element.attachEvent) {
		element.attachEvent('on' + type, listener);
	}
	lis[lis.length] = [element, type, listener];
};

/*
 * 移除事件
 * 
 * @param {html element} element 要绑定事件的元素
 * @param {string} type 要绑定的事件名
 * @param {function} listener事件的响应
 */
MyQuery.event.removeEvent = function (element, type, listener) {
	type = type.replace(/^on/i, '').toLowerCase();
	var lis = MyQuery.event.listeners;
	var len = lis.length;
	while (len--) {
		var item = lis[len];
		var isRemoveAll = !listener;
		/*listener存在时，移除element的所有以listener监听的type类型事件
       	  listener不存在时，移除element的所有type类型事件*/
		if (item[1] === type
			&& item[0] === element
			&& (isRemoveAll || item[2] === listener)) {
			var realListener = item[2];
			if (element.removeEventListener) {
				element.removeEventListener(type, realListener, false);
			} else if (element.detachEvent) {
				element.detachEvent('on' + type, realListener);
			}
			lis.splice(len, 1);
		}
	}
};

MyQuery.prototype.on = function(type, listener) {
	var i, len;
	for (i = 0, len = this.elements.length; i < len; i++) {
		MyQuery.event.addEvent(this.elements[i], type, listener);
	} 
}

MyQuery.prototype.off = function(type, listener) {
	var i, len;
	for (i = 0, len = this.elements.length; i < len; i++) {
		 MyQuery.event.removeEvent(this.elements[i], type, listener);
	}
}

MyQuery.prototype.click = function(listener) {
	var i, len;
	for (i = 0, len = this.elements.length; i < len; i++) {
		 MyQuery.event.addEvent(this.elements[i], 'click', listener);
	}
}

MyQuery.prototype.enter = function(listener) {
	var _this = this,
		i, len;
	for (i = 0, len = this.elements.length; i < len; i++) {
		MyQuery.event.addEvent(_this.elements[i], 'keypress', function(e) {
			 var event = e || window.event;
			 var keyCode = event.which || event.keyCode;
			 if (keyCode === 13) {
			 	listener.call(_this.elements[i], event);
			 } 
		});
	}
}

MyQuery.prototype.delegate = function(tag, type, listener) {
	var	i, len;
	for (i = 0, len = this.elements.length; i < len; i++) {
		MyQuery.event.addEvent(this.elements[i], type, function(e) {
			var event = e || window.event;
			var target = event.target || event.srcElement;
			if (target && target.nodeName === tag.toUpperCase()) {
				listener.call(target, event);
			}
		});
	}
}

MyQuery.prototype.attr = function(attr,value) {
	var i, len;
	if (arguments.length == 2) {
		for (i=0, len=this.elements.length; i < len; i++) {
			this.elements[i][attr] = value;
		}
	}else if (arguments.length == 1) {
		return this.elements[0][attr];
	}
};

MyQuery.prototype.html = function(str) {
	var i, len;
	if (typeof str === 'undefined') {
		var result;
		return this.elements[0].innerHTML;
	} else if (typeof str === 'string') {
		$.each(this.elements, function(item, index) {
			item.innerHTML = str;
		});
	} else if ($.isFunction(str)) {
		$.each(this.elements, function(item, index) {
			item.innerHTML = str.call(this, index);
		});
	}	
}

MyQuery.prototype.css = function(attr,value) {
	if(arguments.length == 2) {
		$.each(this.elements, function(item, index) {
			item.style[attr] = value;
		});
	}else if(arguments.length == 1) {
		return $.getStyle(this.elements[0],attr);
	}
};

MyQuery.prototype.first = function() {
	var result = [];
	$.each(this.elements, function(item, index) {
		var firstNode = item.firstChild.nodeType === 1 ? item.firstChild : item.firstChild.nextSibling;
		result.push(firstNode);
	});

	if (result.length) {
		return result.length === 1 ? result[0] : result;
	}

	return null;
};

MyQuery.prototype.children = function() {
	var result = [];
	$.each(this.elements, function(item, index) {
		result.push(item.children);
	});

	if (result.length) {
		return result.length === 1 ? result[0] : result;
	}
	return null;
};


/**
 * 动画类
 *
 * @param {Object} options 配置项 ///////////////// 暂时只支持单项配置 ///////////////////
 * @param {number} duration 动画时间
 * @param {function} fn 动画完成后的执行函数
 */

MyQuery.prototype.animate = function(options, duration, fn) {

	var raf = window.requestAnimationFrame
	    || window.webkitRequestAnimationFrame
	    || window.mozRequestAnimationFrame
	    || window.oRequestAnimationFrame
	    || function (callback) {
	        return setTimeout(callback, 1000 / 60);
	    };

	var caf = window.cancelAnimationFrame
	    || window.webkitCancelAnimationFrame
	    || window.mozCancelAnimationFrame
	    || window.oCancelAnimationFrame
	    || function (id) {
	        clearTimeout(id);
	    };


	$.each(this.elements, function(item, index) {
		var	start,
			end,
			startTime = createTime(),
			_this = this;

		this.timer = raf(tick);
		for (var attr in options) {
			if (attr === 'opacity') {
					start = Math.round($.getStyle(_this,attr) * 100);
					end = options[attr] * 100;

			}else{
				start = parseInt($.getStyle(_this,attr));
				end = options[attr];
			}
		}

		function tick() {
			var isStop = true;

			var remaining = Math.max(0, startTime + duration - createTime()),
				temp = remaining / duration || 0,
				percent = 1- temp,
				now = (end - start) * percent + start;

			if (attr == 'opacity') {
				_this.style.opacity = (now) / 100; 
				_this.style.filter = 'alpha(opacity='+ (now) +')';				
			} else {
				_this.style[attr] = (now) + 'px';
			}
			
			if (now != end && percent !== 1) {
				isStop = false;
				this.timer = raf(tick);
			}	
	
			if (isStop) {
				caf(_this.timer);
				_this.timer = null;	
				
				if (fn) {
					fn.call(_this);
				}
			}
		}
	});


	function createTime() {
		return +new Date();
	}
};
