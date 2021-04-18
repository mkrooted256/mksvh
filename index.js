const Express = require("express")
const fs = require('fs')
const csv_parse = require('csv-parse/lib/sync')
const csv_stringify = require('csv-stringify/lib/sync')

const apiVideo = require('@api.video/nodejs-sdk');
let client;
if (process.env.APIVIDEO_SANDBOX)
    client = new apiVideo.ClientSandbox({ apiKey: process.env.APIVIDEO_KEY });
else
    client = new apiVideo.Client({ apiKey: process.env.APIVIDEO_KEY });

const port = process.env.PORT || 9000


app = Express()

app.set('view engine', 'ejs')

app.get('/', function(req, res) {
    res.render('index.ejs')
})

app.get('/access', function(req, res) {
    let codes =  csv_parse(fs.readFileSync('db/access.csv'), { columns: true });
    let videos = csv_parse(fs.readFileSync('db/videos.csv'), { columns: true });


    let accesscode = req.query.accesscode;

    console.log("param:", accesscode);

    let code = codes.find((code) => {
        let a =  code.code === accesscode;
        // console.log(code, a);
        return a;
    })
    
    if (typeof code == 'undefined' || !code) {
        res.render('notfound.ejs');
        console.log('notfound1');
        return;
    } else if (code.t_end > 0 && code.t_end < Date.now()) {
        // Too late. Access code expired
        res.render('expired.ejs');
        console.log('expired');
        return;
    } else {
        let vid = videos.find((v) => {
            let a = v.local_video_id === code.video_id;
            // console.log(v, a);
            return a;
        })
    
        if (typeof vid == 'undefined') {
            res.render('notfound.ejs');
            console.log('notfound2');
            return;
        } else
            client.videos.get(vid.remote_video_id).then(function(video) {
                res.render('player.ejs', {player: video.assets.iframe});
        
                // Add time limits for this access code
                if (code.type > 0 && code.t_start == 0) {
                    code.t_start = Date.now();
                    code.t_end = code.t_start + code.type * 1000;
                    fs.writeFileSync(
                        'db/access.csv', 
                        csv_stringify(codes, {
                            header: true,
                            columns: ['code', 'type', 'video_id', 't_start', 't_end', 'who']
                        })
                    );
                }
            });
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
