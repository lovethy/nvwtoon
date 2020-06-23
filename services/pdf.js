var fs = require('fs');
var pdf = require('html-pdf');

let mkPdf = async (r, json, tid, no) => {
    var html = '';
    var savepath = `public/pdf/${tid}_${no}.pdf`;
    var options = {
        format: 'Letter',
        align : 'center'
    };

    if(!json) {
        html = fs.readFileSync(`public/${flnm}`, 'utf8');
    } else {
        html += '<div style="width:690px;">';
        for(var i = 0; i < json.length; i++){
            html += `<img src="${json[i]}" />`;
        }
        html += '</div>';
    }
    var res = await pdf.create(html, options).toFile(savepath, function(err, rs) {
        if (err) return console.log(err);
    });
}
module.exports = {
    mkPdf : mkPdf
}