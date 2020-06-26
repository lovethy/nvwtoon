const pUrl = ["","/list","/detail","/zip"];
function ajax(url, cb, ttl){
    var xhttp;
    if(window.XMLHttpRequest){
        xhttp = new XMLHttpRequest();
    }else{// IE5, IE6 일때
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    //var params = "rurl="+ escape(url);
    setVal(url);
    document.frm.rurl.value = url;
    var params = serialize(document.frm);
    
    xhttp.open('POST', pUrl[cb], true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    if(ttl != "") { 
        document.getElementById('exampleModalLgLabel').innerText = ttl;
        document.frm.title.value = ttl;
    }
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            switch(cb){
                case 1 :
                    popList(this.response);
                    break;
                case 2 :
                    getDetail(this.response);
                    break;
                case 3 :
                    //getDetail(this.response);
                    break;
            }
        } else {}
    };
    xhttp.send(params);
}

function popList(obj){
    var json = JSON.parse(obj);
    var rHtml = "";
    var pg = "";
    var title = document.getElementById('exampleModalLgLabel').innerText;
    var list = json['data'];
    var page = json['page'];

    //리스트
    for(var key in list) {
        var item = list[key];
        if(item.ttl && item.img){
            rHtml += refTbl(item.ttl, item.lnk, item.img);
        }
    }
    //페이징
    for(i=0; i < page.length;i++) {
        pg += getPagenation(page[i], title);
    }

    document.getElementById("dlist").innerHTML = rHtml;
    document.getElementById("pg").innerHTML = pg;
    document.getElementById("btn").click();
}

function refTbl(ttl, lnk, img){
    var el = '<div class="d-flex text-muted pt-3">';
        el += "<img src='"+img+"' alt='Rounded image' role='button' class='col-sm-1 img-thumbnail mb-2 mr-3' onclick=\"viewDetail('"+lnk+"')\" />";
        el += '<div class="pb-3 mb-0 small lh-sm border-bottom w-100">';
        el += '<div class="d-flex justify-content-between">';
        el += "<strong class='text-gray-dark'><a href=\"javascript:viewDetail('"+lnk+"',0);\">"+ttl+"</a></strong>";
        el += "<a role='button' class='btn btn-info' href=\"javascript:viewDetail('"+lnk+"',1);\">PDF</a>";
        el += "<a role='button' class='btn btn-success' href=\"javascript:viewDetail('"+lnk+"',3);\">ZIP</a>";
        el += '</div></div></div>';
    return el;
}

function getPagenation(item, ttl) {
    if (item.lnk == ""){
        var el = "<li class='nav-item'><strong class='nav-link text-danger'>"+item.name+"</strong></li>";
    } else {
        var el = "<li class='nav-item'><a class='nav-link' href=\"javascript:ajax('http://comic.naver.com"+item.lnk+"',1,'"+ttl+"');\">"+item.name+"</a></li>";
    }
    return el;
}

function getDetail(obj){
    var json = JSON.parse(obj);
    console.log(json);
}

function viewDetail(url, flag){
    setVal(url);
    var fm = document.frm;
    fm.rurl.value = url;
    fm.pdf.value = flag;
    fm.action = (flag == '3') ? '/zip' : '/detail';
    fm.target = flag == 0 ? 'dtlWin' : '_self';
    var win = document.frm.submit();
    win.focus();
}

function setVal(url){
    var urlArr = url.split("?")[1].split("&");
    for(i=0;i < urlArr.length;i++){
        var el = urlArr[i].split("=");
        if(document.getElementById(el[0])) document.getElementById(el[0]).value = el[1];
    }
}


function serialize(form){if(!form||form.nodeName!=="FORM"){return }var i,j,q=[];for(i=form.elements.length-1;i>=0;i=i-1){if(form.elements[i].name===""){continue}switch(form.elements[i].nodeName){case"INPUT":switch(form.elements[i].type){case"text":case"hidden":case"password":case"button":case"reset":case"submit":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break;case"checkbox":case"radio":if(form.elements[i].checked){q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value))}break;case"file":break}break;case"TEXTAREA":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break;case"SELECT":switch(form.elements[i].type){case"select-one":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break;case"select-multiple":for(j=form.elements[i].options.length-1;j>=0;j=j-1){if(form.elements[i].options[j].selected){q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].options[j].value))}}break}break;case"BUTTON":switch(form.elements[i].type){case"reset":case"submit":case"button":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break}break}}return q.join("&")};