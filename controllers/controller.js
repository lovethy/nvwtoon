var Service = require('../services/service');
var pdfD = require('html-pdf');
var fs = require('fs');
const domain = "http://comic.naver.com";

let getIndex = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    var page = req.params.page ? req.params.page : 1;
    var limit = req.params.limit ? req.params.limit : 10;
    try {
        var users = await Service.getIndex({}, page, limit)
        return res.render('index', { data: users, title: "Succesfully Users Retrieved" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

let getJson = async function (req, res, next) {
    try {
        var json = await Service.setJson();
        return res.redirect('/');
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

let getPage = async function (req, res, next) {
    try {
        var json = await Service.setPage();
        return res.redirect('/');
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

let fileSync = async function (req, res, next) {
    try {
        var json = await Service.fileSync();
        return res.redirect('/');
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

let getList = async function (req, res, next){
    try {
        var json = await Service.getList(req.body.rurl);
        return res.status(200).json(json);
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

let getDetail = async function (req, res, next) {
    try {
        var fd = req.body.rurl;
        var tid = req.body.titleId;
        var no = req.body.no;
        var pdf = req.body.pdf;
        var title = req.body.title;
        var json = await Service.getDetail(fd);
        if(pdf == '0') {
            return res.render('comicView', {data:json});
        } else if(pdf == '1'){//pdf download
            var savepath = 'public/pdf/';
            var filename = `${title}_${no}.pdf`;
            if(fs.existsSync(savepath+filename)){
                return res.download(savepath+filename, filename, function(err) {
                    if (err) console.log(err);
                    fs.unlink(savepath+filename, function(){
                        console.log("File was deleted")
                    });
                });
            } else {
                var html = '';
                var options = {
                    format: 'Letter',
                    align : 'center',
                    border: "0"
                };
                html += '<div style="width:690px;">';
                for(var i = 0; i < json.length; i++){
                    html += `<img src="${json[i]}" />`;
                }
                html += '</div>';
                pdfD.create(html, options).toFile(savepath+filename, function(err, rs) {
                    if (err) return console.log(err);
                    //return res.json(rs);
                    //return res.redirect(`pdf/${tid}_${no}.pdf`);
                    //return res.download(savepath);
                    console.log(savepath+filename, filename);
                    return res.download(savepath+filename, filename, function(err) {
                        if (err) console.log(err); // Check error if you want
                        //Run below code when if you want to Delete Created file to save your drive space
                        fs.unlink(savepath+filename, function(){ //Delete Pdf file after download
                            console.log("File is deleted") // Callback
                        });
                    });
                });
            }
            
        }
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

let getZip = async function (req, res, next) {
    var fd = req.body.rurl;
    var tid = req.body.titleId;
    var no = req.body.no;
    var pdf = req.body.pdf;
    var title = req.body.title;
    console.log(domain+fd);
    Service.getDown(domain+fd, tid, no, (img) => {
        //console.log(img);
        Service.getZip(title, tid, no, (savepath) => {
            var fileName = `${title}_${no}.zip`;
            console.log(`public/download/detail/${fileName}`, fileName);
            return res.download(`public/download/detail/${fileName}`, fileName, function(err) {
                if (err) console.log(err); // Check error if you want
                //Run below code when if you want to Delete Created file to save your drive space
                // fs.unlink(savepath+"/"+fileName, function(){ //Delete Pdf file after download
                //     console.log("File is deleted") // Callback
                // });
            });
        });
        
    });
}

module.exports = {
    getList : getList,
    getIndex : getIndex,
    getJson : getJson,
    getPage : getPage,
    fileSync : fileSync,
    getDetail : getDetail,
    getZip : getZip
}