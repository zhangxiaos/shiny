var cate, childCate, task;
var cateText = [{"id": 0,"name": "默认分类","child": [0]},{"id": 1,"name": "百度IFE","child": [1, 3]}],
    childCateText = [{"id": 0,"name": "默认子分类","child": [],"father": 0},{"id": 1,"name": "task001","child": [0, 1, 2],"father": 1},{"id": 3,"name": "task002","child": [3],"father": 1}],
    taskText = [{"id": 0,"name": "to-do 1","father": 1,"finish": true,"date": "2010-10-10","content": "开始 task001 的编码任务。"},{"id": 1,"name": "to-do 3","father": 1,"finish": true,"date": "2010-12-10","content": "开始 task002 的编码任务。"},{"id": 2,"name": "to-do 2","father": 1,"finish": false,"date": "2010-12-10","content": "完成 task002 的编码任务。"},{"id": 3,"name": "to-do 4","father": 1,"finish": false,"date": "2015-12-10","content": "完成 task003 的编码任务。"}];

var addTask     = document.querySelector('#add-task'),
    addType     = document.querySelector('#add-type'),
    pop         = document.querySelector('#pop'),
    iconEdit    = document.querySelector('.icon-edit'),
    iconFinish  = document.querySelector('.icon-check');
    ok          = document.querySelector('.ok'),
    no          = document.querySelector('.no'),
    taskType    = document.querySelector('.task-type'),
    save        = document.querySelector('.save'),
    cancel      = document.querySelector('.cancel');
    
addType.onclick     = addTypeShow;//"新增分类"
addTask.onclick     = show;//"新增任务"
window.onresize     = toCenter;
iconEdit.onclick    = editTask;//"编辑任务"
iconFinish.onclick  = taskFinish;//"完成任务"
taskType.onclick    = typeClick;//分类点击
save.onclick        = addTaskShow;//保存任务
cancel.onclick      = cancelAdd;//取消任务
ok.onclick          = addNewType;//添加分类
no.onclick          = close;//取消添加

//显示输入表单
function show() {
    var info = document.querySelectorAll('.task-detail span'),
        set = document.querySelector('.set'),
        input = document.querySelectorAll('.task-detail input'),
        textarea = document.querySelector('.mytext'),
        button = document.querySelectorAll('.task-detail button');

    for (var i = 0; i < info.length; i++) {
        info[i].style.display = 'none';
    }
    set.style.display = 'none';
    input[0].value = '';
    input[1].value = '';
    textarea.value = '';
    input[0].style.display = 'inline-block';
    input[1].style.display = 'inline-block';
    textarea.style.display = 'block';
    button[0].style.display = 'block';
    button[1].style.display = 'block';
}

function addTaskShow() {
    var input = document.querySelectorAll('.task-detail input'),
        textarea = document.querySelector('.mytext'),
        name = input[0].value,
        date = input[1].value,
        content = textarea.value,
        dateSplit = date.split('-');

    if (name.length === 0) {
        document.querySelector('.task-content .error').innerHTML = '标题不能为空';
        return;
    }
    else if (getObjByKey(task, 'name', name)) {
        document.querySelector('.task-content .error').innerHTML = '相同名称的任务已存在';
        return;
    }
    else if (date.length === 0) {
        document.querySelector('.task-content .error').innerHTML = '日期不能为空';
        return;
    }
    else if (!date.match(/^\d{4}-\d{2}-\d{2}$/)){
        document.querySelector('.task-content .error').innerHTML = '任务日期格式应为:2016-01-10';
        return;
    }
    else if (dateSplit[1] < 1 || dateSplit[1] > 12 || dateSplit[2] < 1 || dateSplit[2] > 31) {
        document.querySelector('.task-content .error').innerHTML = '没有这一天,请输入正确日期';
        return;
    }
    else if (content === '') {
        document.querySelector('.task-content .error').innerHTML = '任务内容不能为空';
        return;
    }
    
    var typeChoose = document.querySelector('.task-type .on'),
        eleTag = typeChoose.nodeName.toLowerCase(),
        father;

    switch(eleTag) {
        case 'h2': //选中了所有任务
            father = 0;
            break;
        case 'dt': //选中了分类
            var typeName = typeChoose.querySelector('span').innerHTML;
            var typeObj = getObjByKey(cate, 'name', typeName);
            if (typeObj.child.length > 0) {
                father = typeObj.child[0];
            }
            else {
                father = 0;
            }
            break;
        case 'dd': //选中了子分类
            var childName = typeChoose.querySelector('span').innerHTML;
            father = getObjByKey(childCate, 'name', childName).id;
            break;
    }
    var newTask = {
        "id": task[task.length - 1].id + 1,
        "name": name,
        "father": father,
        "finish": false,
        "date": date,
        "content": content
    };
    task.push(newTask);
    var fatherObj = getObjByKey(childCate, 'id', newTask.father);
    fatherObj.child.push(newTask.id);
    localStorage.task = JSON.stringify(task);
    localStorage.childCate = JSON.stringify(childCate);

    makeType();
    cancelAdd();
}

function cancelAdd() {
    var info = document.querySelectorAll('.task-detail span'),
        set = document.querySelector('.set'),
        input = document.querySelectorAll('.task-detail input'),
        textarea = document.querySelector('.mytext'),
        button = document.querySelectorAll('.task-detail button'),
        error = document.querySelector('.task-detail .error');

    for (var i = 0; i < info.length; i++) {
        info[i].style.display = 'inline-block';
    }
    set.style.display = 'inline-block';
    input[0].style.display = 'none';
    input[1].style.display = 'none';
    textarea.style.display = 'none';
    button[0].style.display = 'none';
    button[1].style.display = 'none';  
    error.innerHTML = '';
}

//点击删除按钮
function del(e, ele) {
    var ele = ele.parentNode,
        tagName = ele.nodeName.toLowerCase(),
        name = ele.querySelector('span').innerHTML,
        res = confirm('此操作不可逆，确定要删除吗？'),
        parent = ele.parentNode,
        index;
        // console.log(parent.className === 'list-item');

    if (!res) { return; }

    if (parent.className === 'list-item') {
        index = getIndexByKey(task, 'name', name);
        var fatherObj = getObjByKey(childCate, 'id', task[index].father);

        fatherObj.child.splice(fatherObj.child.indexOf(task[index].id), 1);
        task.splice(index, 1);
    }
    else {
        switch(tagName) {
            case 'dt': //删除一个分类
                index = getIndexByKey(cate, 'name', name);
                for (var i = 0, len = cate[index].child.length
                    ; i < len; i++) {
                    var childIndex = getIndexByKey(childCate, 'id', cate[index].child [i]);
                    for (var j = 0, len2 = childCate[childIndex].child.length; j < len2; j++) {
                        var taskIndex = getIndexByKey(task, 'id',childCate[childIndex].child[j]);
                        task.splice(taskIndex, 1);
                    }
                    childCate.splice(childIndex, 1);
                }
                cate.splice(index, 1);
                break;
            case 'dd': //删除一个子分类
                index = getIndexByKey(childCate, 'name', name);
                for (var i = 0, len = childCate[index].length; i < len; i++) {
                    var taskIndex = getIndexByKey(task, 'id', childCate[index].child[i]);
                    task.splice(taskIndex, 1);
                }
                //删除父节点中的记录
                var fatherObj = getObjByKey(cate, 'id', childCate[index].father);
                fatherObj.child.splice(fatherObj.child.indexOf(childCate[index].id), 1);
                childCate.splice(index, 1);
                break;
        }
    }
    localStorage.cate = JSON.stringify(cate);
    localStorage.childCate = JSON.stringify(childCate);
    localStorage.task = JSON.stringify(task);
    makeType();
}

function editTask() {
    var editTitle = document.querySelector('.title'),
        editDate = document.querySelector('.date'),
        editCon = document.querySelector('.mytext'),
        info = document.querySelectorAll('.task-detail span');

    show();
    editDate.value = info[1].innerHTML;
    editCon.value = info[2].innerHTML;
    info[0].style.display = 'inline-block';
    editTitle.style.display = 'none';
    save.onclick = taskChange;
    function taskChange() {
        var name = document.querySelector('.task-detail span').innerHTML,
            taskObj = getObjByKey(task, 'name', name),
            date = editDate.value,
            content = editCon.value,
            // list = document.querySelectorAll('.list-item dd'),
            dateSplit = date.split('-');

        taskObj.date = date;
        taskObj.content = content;
        localStorage.task = JSON.stringify(task);

        if (date.length === 0) {
            document.querySelector('.task-content .error').innerHTML = '日期不能为空';
            return;
        }
        else if (!date.match(/^\d{4}-\d{2}-\d{2}$/)){
            document.querySelector('.task-content .error').innerHTML = '任务日期格式应为:2016-01-10';
            return;
        }
        else if (dateSplit[1] < 1 || dateSplit[1] > 12 || dateSplit[2] < 1 || dateSplit[2] > 31) {
            document.querySelector('.task-content .error').innerHTML = '没有这一天,请输入正确日期';
            return;
        }

        makeType();
        cancelAdd();
    }
}

//完成任务
function taskFinish() {
    var name = document.querySelector('.task-detail span').innerHTML,
        taskObj = getObjByKey(task, 'name', name),
        res = confirm("确定设置当前任务为已完成状态吗？");
    if (taskObj.finish) {
        alert('此任务已经完成了哦！*(^_^)*');
        return;
    }
    if (!res) { return; }
    taskObj.finish = true;
    localStorage.task = JSON.stringify(task);
    makeTask();
}

function addTypeShow() {
    var gray = document.querySelector('#gray'),
        pop = document.querySelector('#pop'),
        cates = document.querySelectorAll('.type-item dt'),
        select = document.querySelector('#fpoint'),
        html = '';

    select.innerHTML = '<option value="-1">无</option>';
    gray.style.display = 'block';
    pop.style.display = 'block';
    toCenter();
    for (var i = 0, len = cates.length; i < len; i++) {
        html += '<option value="' + i + '">' + cates[i].querySelector('span').innerHTML + '</option>'
    }
    select.innerHTML += html;
}

function addNewType() {
    var name = document.querySelector('.pop-content input').value,
        fatherName = document.querySelector('#fpoint').value;

    if (name.length === 0) {
        document.querySelector('#pop .error').innerHTML = '分类名称不能为空';
        return;
    }
    else if (name.length >= 12) {
        document.querySelector('#pop .error').innerHTML = '分类名称不能多于12个字符';
        return;
    }
    else if (getObjByKey(cate, 'name', name)) {
        document.querySelector('#pop .error').innerHTML = '相同名称的分类已存在';
        return;
    }
    else if (getObjByKey(childCate, 'name', name)) {
        document.querySelector('#pop .error').innerHTML = '相同名称的子分类已存在';
        return;
    }

    if (fatherName === '-1') {
        var newCate = {
           "id": cate[cate.length - 1].id + 1,
           "name": name,
           "num": 0,
           "child": [] 
        }
        cate.push(newCate);
        localStorage.cate = JSON.stringify(cate);
    }else {
        var newChild = {
           "id": childCate[childCate.length - 1].id + 1,
           "name": name,
           "child": [],
           "father": cate[fatherName].id
        };
        var father = getObjByKey(cate, 'id', newChild.father);
        father.child.push(newChild.id);
        childCate.push(newChild);
        localStorage.cate = JSON.stringify(cate);
        localStorage.childCate = JSON.stringify(childCate);
    }

    makeType();
    close();
    name = '';
    document.querySelector('#pop .error').innerHTML = '';
}

function close() {
    document.querySelector('.pop-content input').value = '';
    document.querySelector('#pop .error').innerHTML = '';
    gray.style.display = 'none';
    pop.style.display = 'none';
}

function toCenter(){
    var w=window.innerWidth || document.documentElement.clientWidth,
        h=window.innerHeight || document.documentElement.clientHeight;
    _left = (w - parseInt(pop.style.width))/2;
    _top = (h - parseInt(pop.style.height))/2;
    pop.style.left = _left + 'px';
    pop.style.top = _top + 'px';
}

//生成任务分类列表
function makeType() {
    var typeWrap = document.querySelector('.task-type');
    var typeItem = typeWrap.querySelector('.type-item');
    var totalNode = typeWrap.querySelector('#total');
    var curEle = typeItem.querySelector('.on') || totalNode;
    var curIndex = curEle.getAttribute('data-index'); 

    typeItem.innerHTML = '<h2>分类列表</h2>';
    var html = '';

    setNum();
    var count = 0;
    totalNode.innerHTML = '<i class="icon-menu"></i><span>所有任务</span>(<span>' + task.length + '</span>)';
    addClass(totalNode, 'on');
    totalNode.setAttribute('data-index', count++);
    for (var i=0, len1 = cate.length; i < len1; i++) {
        html += '<dt data-index="' + (count++) + '"><i class="icon-folder-open-empty"></i><span>' + cate[i].name +'</span>(<span>' + cate[i].num + '</span>)<i class="del icon-minus-circled" onclick="del(event, this)"></i></dt>';
        for (var j =0, len2 = cate[i].child.length; j < len2; j++) {
            var childNode = getObjByKey(childCate, 'id', cate[i].child[j]);
            html += '<dd data-index="' + (count++) + '"><i class="icon-doc-text"></i><span>' + childNode.name + '</span>(<span>' + childNode.child.length + '</span>)<i class="del icon-minus-circled" onclick="del(event, this)"></i></dd>';
        }
    }
    html = html.replace(/<i class="del icon-minus-circled"><\/i>/,'');
    html = html.replace(/<i class="del icon-minus-circled"><\/i>/,'');
    typeItem.innerHTML += html;

    if (curIndex) {
        var targetNode = typeItem.querySelector('[data-index="' + curIndex + '"]');
        removeClass(totalNode, 'on');
        addClass(targetNode, 'on');
    }
    makeTask();
}

//生成任务列表
function makeTask() {
    var typeWrap = document.querySelector('.task-type');
    var ele = typeWrap.querySelector('.on');
    if (!ele) {
         var totalNode = typeWrap.querySelector('#total');
         addClass(totalNode, 'on');
         ele = totalNode;
    }
    var eleTag = ele.nodeName.toLowerCase();
    var name = ele.getElementsByTagName('span')[0].innerHTML;
    var taskIdArr = [];

    
   

    switch (eleTag) {
        case 'h2':
            for (var i = 0, len = task.length; i < len; i++) {
                taskIdArr.push(task[i].id);
            }
            makeTaskById(taskIdArr);
            break;
        case 'dt':
            var cateObj = getObjByKey(cate, 'name', name);
            for (var i = 0, len1 = cateObj.child.length; i < len1; i++) {
                var childObj = getObjByKey(childCate, 'id', cateObj.child[i]);
                for (var j =0, len2 = childObj.child.length; j < len2; j++) {
                    taskIdArr.push(childObj.child[j]);
                }
            }
            makeTaskById(taskIdArr);
            break;
        case 'dd': 
            var childObj = getObjByKey(childCate, 'name', name);
            for (var i = 0, len = childObj.child.length; i < len; i++) {
                taskIdArr.push(childObj.child[i]);
            }
            makeTaskById(taskIdArr);
            break;
    }
    makeDetails();
}

//生成任务详细描述
function makeDetails() {
    var ele = document.querySelector('.list-item .on'),
        info = document.querySelectorAll('.task-detail span');

    if (ele) {
        var name = ele.getElementsByTagName('span')[0].innerHTML,
            taskObj = getObjByKey(task, 'name', name);
        if (taskObj) {
            info[0].innerHTML = taskObj.name;
            info[1].innerHTML = taskObj.date;
            info[2].innerHTML = taskObj.content;
        }else {
            info[0].innerHTML = '';
            info[1].innerHTML = '';
            info[2].innerHTML = '';
        }
    }else {
        info[0].innerHTML = '';
        info[1].innerHTML = '';
        info[2].innerHTML = '';
    }
}

//分类点击效果
function typeClick(e) {

    var e = e || window.event;
    var target = e.target || e.srcElement;
    var oldEle = taskType.querySelector('.on');
    var targetName = target.nodeName.toLowerCase();
    var total = taskType.querySelector('#total');

    if (target === oldEle) {
        return;
    }else if (targetName === 'dd' || targetName === 'dt' || target === total) {
        removeClass(oldEle, 'on');
        addClass(target, 'on');
    }else {
        target = target.parentNode;
        targetName = target.nodeName.toLowerCase();
        if (targetName === 'dd' || targetName === 'dt' || target === total) {
            removeClass(oldEle, 'on');
            addClass(target, 'on');
        }
    }

    makeTask();
}

//任务点击效果
function taskClick(ele) {
    var all = document.querySelectorAll('.list-item dd'), i, len;
    for (i = 0, len = all.length; i < len; i++) {
        if (hasClass(all[i], 'on')) {
            removeClass(all[i], 'on');
            break;
        }
    }
    addClass(ele, 'on');
    makeDetails();
}

//状态点击效果
function statusClick(ele) {
    var status = document.querySelectorAll('.task-list .sta li'), i, len, list;
    for (i = 0, len = status.length; i < len; i++) {
        if (hasClass(status[i], 'active')) {
            removeClass(status[i], 'active');
            break;
        }
    }
    addClass(ele, 'active');
    
    list = document.querySelector('.list-item').children;
    if (ele.innerHTML.indexOf('所有') !== -1) {
        for (var i = 0, len = list.length; i < len; i++) {
            list[i].style.display = 'block';
        }
    }else if (ele.innerHTML.indexOf('未完成') !== -1){
        for (var i = 0, len = list.length; i < len; i++) {
           list[i].style.display = 'none'; 
        }
        for (var i = 0, len = list.length; i < len; i++) {
           if (list[i].className.indexOf('finish') === -1 && list[i].nodeName.toLowerCase() === 'dd') {
                list[i].style.display = 'block';
                
                if (list[i].previousSibling.tagName.toLowerCase() === 'dt') {
                    list[i].previousSibling.style.display = 'block';
                }
            }
        }
    }else if (ele.innerHTML.indexOf('已完成') !== -1) {
        for (var i = 0, len = list.length; i < len; i++) {
           list[i].style.display = 'none'; 
        }
        for (var i = 0, len = list.length; i < len; i++) {
           if (list[i].className.indexOf('finish') !== -1 && list[i].nodeName.toLowerCase() === 'dd') {
                list[i].style.display = 'block';

                if (list[i].previousSibling.tagName.toLowerCase() === 'dt') {
                    list[i].previousSibling.style.display = 'block';
                }
            }
        }
    }
}

//根据传入的ID生成任务列表
function makeTaskById(taskIdArr) {

    var date = [], taskObj, html = '';
    for (var i = 0, len = taskIdArr.length; i < len; i++) {
        taskObj = getObjByKey(task, 'id', taskIdArr[i]);
        date.push(taskObj.date); 
    }
    date = sortDate(uniqArray(date));

    for (var i = 0, len1 = date.length; i < len1; i++) {
        html += '<dt>' + date[i] + '<i class="del icon-minus-circled"></i></dt>';
        for (var j = 0, len2 = taskIdArr.length; j < len2; j++) {
            taskObj = getObjByKey(task, 'id', taskIdArr[j]);
            if (taskObj.date === date[i]) {
                if (taskObj.finish) {
                    html += '<dd class="finish" onclick="taskClick(this)"><i class="icon-check"></i>';
                }else{
                    html += '<dd onclick="taskClick(this)">'; 
                }
                html += '<span>' + taskObj.name + '</span><i class="del icon-minus-circled" onclick="del(event, this)"></i></dd>'
            }
        }
    }
    document.querySelector('.list-item').innerHTML = html;
    addClass(document.querySelector('.list-item dd'), 'on');
}

//判断某个元素是否有某个className
function hasClass(element, className) {
    if (!element) {return}
    var classNames = element.className;
    if (!classNames) {
        return false;
    }
    classNames = classNames.split(/\s+/);
    for (var i = 0, len = classNames.length; i < len; i++) {
        if (classNames[i] === className) {
            return true;
        }
    }
    return false;
}

//添加类名
function addClass(element, className) {
    if (!element) {return}
    if(!hasClass(element, className)) {
        element.className = element.className ?[element.className, className].join(' ') : className;
    }
}

//移除类名
function removeClass(element, className) {
    if (className && hasClass(element, className)) {
        var classNames = element.className.split(/\s+/);
        for (var i = 0, len = classNames.length; i < len; i++) {
            if (classNames[i] === className) {
                classNames.splice(i, 1);
                break;
            }
        }
    }
    element.className = classNames.join(' ');
}

function uniqArray(src){
    var obj = {};
    var res = [];
    var i,len;
    for(i=0,len=src.length; i<len; i++){
        var key = src[i];
        if(!obj[key]){
            res.push(key);
            obj[key] = true;
        }
    }
    return res;
}

function sortDate(date) {
    return date.sort(function(a, b) {
        return a.replace(/-/g, '') - b.replace(/-/g, '');
    })
}

function setNum() {
    var sum;
    for (var i = 0; i < cate.length; i++) {
        sum = 0;
        for (var j = 0; j < cate[i].child.length; j++) {
            var childNum = getObjByKey(childCate, 'id', cate[i].child[j]).child.length;
            sum += childNum;
        }
        cate[i].num = sum;
    }
}

// 根据某对象的某属性得到某对象
function getObjByKey(obj, key, value) {
    for (var i = 0; i < obj.length; i++) {
        if (obj[i][key] === value) {
            return obj[i];
        }
    }
}

// 根据某对象的某属性得到某对象的序号
function getIndexByKey(obj, key, value) {
    for (var i = 0; i < obj.length; i++) {
        if (obj[i][key] === value) {
            return i;
        }
    }
}

// 对任务时间进行排序
function sortDate(date) {
    return date.sort(function (a, b) {
        return a.replace(/-/g, '') - b.replace(/-/g, '');
    });
}

// 保存数据
// function save() {
//     localStorage.childCate = JSON.stringify(childCate);
//     localStorage.cate = JSON.stringify(cate);
//     localStorage.task = JSON.stringify(task);
// }

window.onload = function() {
    if (!localStorage.getItem('cate')) {
        localStorage.setItem('cate', JSON.stringify(cateText));
        localStorage.setItem('childCate', JSON.stringify(childCateText));
        localStorage.setItem('task', JSON.stringify(taskText));
    }

    cate = JSON.parse(localStorage.cate);
    childCate = JSON.parse(localStorage.childCate);
    task = JSON.parse(localStorage.task);
    makeType();
}


