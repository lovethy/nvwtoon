const domain = "http://comic.naver.com";
const url="http://comic.naver.com/webtoon/weekday.nhn";	//now url is naver webtoon site
const request = require('request');
const axios = require('axios');
const requestP= require('request-promise');
const cheerio= require('cheerio');
const zip = new require('node-zip')();

const dataPath = 'data.json';
var fs=require('fs');

let getIndex = async function (query, page, limit) {
    try {
        //var users = await User.find(query)
        var users = { "name":"bb" };
        return users;
    } catch (e) {
        // Log Errors
        throw Error('Error while Paginating Users')
    }
}

let fileSync = async () => {
	var string = await fs.readFileSync(dataPath, 'utf-8');
	var data=JSON.parse(string);
	var _i=-1;	//to check if it's first src
	for(var i=0; i<data.length; i++){
		var item=data[i];
		var src=item.src;
		var day=item.day;
		var num=item.num;
		if(_i!=day){
			console.log("Day "+day+" pipe");
			_i++;
        }
        // 이미지 파일 다운로드
        //console.log(__dirname.replace('services','public') +'/images/'+day+'_'+num+'.jpg');
		request(src).pipe(fs.createWriteStream(__dirname.replace('services','public') +'/download/img/'+day+'_'+num+'.jpg'));
	}
}

let setJson = () => {
	var dataArr=[];
	
	request(url, async (err, res, body) => {
		var $=cheerio.load(body);
		var lastLen=$('.col').eq(6).find('img').length;
		//it means the length of last one, sunday
		
		$('.col').each(async function (day, item){
			var index=0;
			$(item).find('img').each(function(num, item){;
                var src=$(item).attr('src');
                var lnk = $(item).parent().attr('href');
                var ttl = $(item).attr('title');
				if(src.substr(src.length-3, 3)=='jpg'){
					console.log(day+', '+index);
					var data={
						day:day,
						num:getNumberInFormat(index),
						title:ttl,
                        src:src,
                        link:lnk
					};
					index++;
					dataArr.push(data);
				}
				//console.log(day+' , '+num);
				if(day==6 &&num==lastLen-1){
					//this means last, should be modified
					fs.writeFileSync(dataPath, JSON.stringify(dataArr));
                    console.log('wrote json file!');
				}
			});
		});
	});
};

let setPage = async () => {
	fs.readdir(__dirname+'/imgs', async function(err, fileArr){
        var body="";
        var string=await fs.readFileSync(dataPath, 'utf-8');
        var data=JSON.parse(string);
        
        for(var i=0; i < data.length; i++){
            var item = data[i];
            var lnk = item.link;
            var day = item.day;
            var num = item.num;
            var ttl = item.title;

            if(num === '00'){
                if(i > 0) body+='</div>';
                body+='<div class="ct-page-title mt-5"><h1 class="ct-title" id="content">';
                switch(day){
                    case 0:body+='MON'; break;
                    case 1:body+='TUE'; break;
                    case 2:body+='WED'; break;
                    case 3:body+='THU'; break;
                    case 4:body+='FRI'; break;
                    case 5:body+='SAT'; break;
                    case 6:body+='SUN'; break;
                }
                body+='</h1></div>\r\n';
                body+='<div class="row">';
            }
            body+='<div class="col-md-1">\r\n';
            body+=`<a href="javascript:ajax('${domain+lnk}',1,'${ttl}');">\r\n`;
            body+=`<img src="/download/img/${day}_${num}.jpg" alt="Rounded image" /></a>\r\n`;
            body+=`<small class="d-block text-uppercase font-weight-bold mb-1">${ttl}</small>\r\n`;
            body+='</div>\r\n';
        }
        body+='</div>';

		fs.writeFile('views/index.ejs', body, function(){
			//res.redirect('/');
		});
    });
};

let html = "";
let getHtml = async (rf) => {
    try {
        return await axios.get(rf);
    } catch (e) {
        console.error(e);
    }
};

let getList = async (rf) => {
    if(!html) {
        html = await getHtml(rf);
    }
    const $ = cheerio.load(html.data);
    html = "";
    let smp = {};
    let pg = [];
    $("#content .viewList tr").each(function(i,el){
        var lnk = $(this).find("a").attr("href");
        var ttl = rs($(this).find("a").text());
        var img = $(this).find("img").attr("src");
        smp[i] = { lnk, ttl, img };
      //console.log($(this));
    });
    $(".page_wrap").children().each(function (i, el){
        var data = {
            index : i,
            lnk : $(this).attr("href") || '',
            name : $(this).find('em').text() || $(this).find('.cnt_page').text() || ''
        }
        pg.push(data);
    });
    //console.log(pg);
    return { data:smp, page:pg };
}

let getDetail = async (ref) => {
    if(!html) {
        html = await getHtml(domain+ref);
    }
    const $ = cheerio.load(html.data);
    let smp = [];
    $("div.wt_viewer img").each(function(i,el){
      var img = $(this).attr("src");
      smp.push(img);
    });
    //var flag = await downImg(smp);
    //console.log('다운로드결과 : ',flag);
    html = "";
    return smp;
}

let getDown = async (rfUrl, callback) => {
    let j = request.jar();
    // let cookie1 = request.cookie('NID_JKL=fgXskXgLDOPUyf2PBcf8OmYY6d+W2j1Z7ZLl37zGF3k=');
    let cookie2 = request.cookie('NID_AUT=lVl6gzJp7FprV4U9lljBT0OkVGCYmjZpKfDpS0IXExrVr0rC/zShskIsB5QDcF9i');
    let cookie3 = request.cookie('NID_SES=AAABwZTMqX05g7+EPt0cBouaGCjZbTJsspSCUuBYw724TuzmpVzTO3MU5xIEsD7wsDqWNCLSMd6uUam5oAa+k3KjHsiByCm/dqr13RHhVQh2Ti2IdwAnLGbVc/a5T7SSRhy3Muj+1FcOXVnQjsWuohuaekAkxwnWy62hdKxLjEk9wjG34WkXdxBUNmWTrR87/fwWP++n+HBqGLa3mS/yp2fs1yGMlkuYRbCgp6YIGzRWVmTF2tNoGdRyyCChE88zOOzwjc3lGNIPULwuKk2XXyEKacg2XHztACmzE1yKBtsYeXRh7reLmQIObB7y6bCJfez/hdY80ZjvI1lLih7oP87JSTQtR2JDSTgmisGSFcmux453pjQghOZ/9U3wjgrYAYYaZxLmvwuwSvh8nES9d9tvd7nBIMzYs0/I0+P5hpxXT3iSFlCxUbdYXPqEalk4Wq3FOI901pDkKGIsHiy5Gme/un7m+lFwT+LscepIH4kmt+06jKgevvDARrdLZeKd4enfbz+OzbXE9TRXUyhj2HUali7WHEZsUEZS3sADzmiz0jBJ5fAwKO3jxJ3uIW1Kxt4YdWi63OpK/8ZBQpEZoKYzTdEYqIuQFcr7a8Wlc7T9oJl1');

    // j.setCookie(cookie1, cUrl);
    j.setCookie(cookie2, domain);
    j.setCookie(cookie3, domain);
    request({url:rfUrl, jar:j}, async (err, res, body) => {
        const $ = cheerio.load(body);
        var img = [];
        $("div.wt_viewer img").each(function(i,el){
            img.push($(this).attr("src"));
        });
        downImg(rfUrl, img, (sImg) => {
            callback(sImg);
        });
    });
}

let downImg = async (rfUrl, img, callback) => {
    let cnt = 0;
    let sImg = [];
    img.forEach(imgUrl => {
        request({
            url : imgUrl,
            headers : {'referer' : rfUrl},
            encoding : null
        }, (err, res, body) => {
            var spath = __dirname.replace('services','public') + '/download/detail/'+imgUrl.split("_IMAG01_")[1];
            fs.writeFile(spath, body, null, (err) => {
                if(err) throw err;
                sImg.push(spath);
                if(cnt == img.length-1){
                    callback(sImg);
                }
                cnt++;
            });
        });
    });
}

let mkdir = ( dirPath ) => {
    const isExists = fs.existsSync( dirPath );
    if( !isExists ) {
        fs.mkdirSync( dirPath, { recursive: true } );
    }
}

const rs = (el) => {
    return el.replace(/([\t|\n|\s])/gi, "");
}

let getNumberInFormat = (num) => {
	var min=0, max=99;
	if(min<=num && num<=max){
		if(0<=num && num<=9){
			return '0'+num;
		}
		else{
			return num;
		}
	}
}

let getZip = async function(ttl, img){
    
}

module.exports = {
    getIndex : getIndex,
    setJson : setJson,
    setPage : setPage,
    fileSync : fileSync,
    getList : getList,
    getDetail : getDetail,
    getDown : getDown,
    getZip : getZip
}