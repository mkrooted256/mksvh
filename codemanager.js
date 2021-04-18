const fs = require('fs')
const csv_parse = require('csv-parse/lib/sync')
const csv_stringify = require('csv-stringify/lib/sync')
const uuid = require('uuid')

const { times } = require('./consts') 
const argv = process.argv
const root_uuid = process.env.ROOT_UUID
const cmd = argv[2]

let codes = csv_parse(fs.readFileSync('db/access.csv'), {
    columns: true
})
let videos = csv_parse(fs.readFileSync('db/videos.csv'), {
    columns: true
})

if (cmd == 'list') {
    console.log("Codes:\n", codes)
    console.log("Videos:\n", videos)
} else if (cmd == 'add') {
    const local_video_id = argv[3]
    let access_type = argv[4];

    let count = 0;
    if (argv[5] == '--'){
        count = argv.length - 6;
    } else {
        count = parseInt(argv[5]);
    }

    let parsed = false;
    
    if (parseInt(access_type) === 0) {
        access_type = 0;
        parsed = true;
    } else {
        let num = parseInt(access_type);
        let time_symbol = access_type.trimEnd().charAt(access_type.length - 1);
        if (!isNaN(num) && time_symbol in times) {
            parsed = true;
            access_type =  num * times[time_symbol];
        }
    }
    if (parsed) {
        for (let i=0; i<count; i++) {
            let newrecord = [
                uuid.v4(),
                access_type,
                local_video_id,
                0, 0, argv[6+i]
            ]
            let csv = String(newrecord);
            fs.appendFileSync('db/access.csv', csv+'\n');
            console.log(csv);
        }
        
    } else {
        console.error("ERROR: invalid access type\n")
    }
} else {
    console.error("Unknown command\n");
}
