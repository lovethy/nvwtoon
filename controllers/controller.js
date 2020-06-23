var Service = require('../services/service');
var pdfD = require('html-pdf');
var fs = require('fs');

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
        var json = await Service.getDetail(fd);
        if(pdf == '0') {
            return res.render('comicView', { data:json });
        } else if(pdf == '1'){//pdf download
            var savepath = `public/pdf/${tid}_${no}.pdf`;
            if(fs.existsSync(savepath)){
                console.log('exist!');
                return res.download(savepath);
            } else {
                console.log('now exist!');
                var html = '';
                var options = {
                    format: 'Letter',
                    align : 'center',
                    border: "0",
                    
                };
                html += '<div style="width:690px;">';
                for(var i = 0; i < json.length; i++){
                    html += `<img src="${json[i]}" />`;
                }
                html += '</div>';
                pdfD.create(html, options).toFile(savepath, function(err, rs) {
                    if (err) return console.log(err);
                    //return res.json(rs);
                    //return res.redirect(`pdf/${tid}_${no}.pdf`);
                    return res.download(savepath);
                });
            }
            
        }
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

module.exports = {
    getList : getList,
    getIndex : getIndex,
    getJson : getJson,
    getPage : getPage,
    fileSync : fileSync,
    getDetail : getDetail
}