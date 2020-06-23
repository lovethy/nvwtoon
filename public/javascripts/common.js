function ajax(url, cb, ttl){
    var xhttp;
    if(window.XMLHttpRequest){
        xhttp = new XMLHttpRequest();
    }else{// IE5, IE6 일때
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    var params = "rurl="+ escape(url);
    var page = ["","/list","/detail"];
    xhttp.open('POST', page[cb], true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            switch(cb){
                case 1 : 
                    document.getElementById('exampleModalLgLabel').innerText = ttl;
                    popList(this.response);
                    break;
                case 2 :
                    getDetail(this.response);
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

function viewDetail(url, pdf){
    setVal(url);
    document.frm.rurl.value = url;
    document.frm.pdf.value = pdf;
    var win = document.frm.submit();
    win.focus();
}

function setVal(url){
    var urlArr = url.split("?")[1].split("&");
    console.log(urlArr.length);
    for(i=0;i < urlArr.length;i++){
        var el = urlArr[i].split("=");
        if(document.getElementById(el[0])) document.getElementById(el[0]).value = el[1];
    }
}