const apiVideoSdk = require('@api.video/nodejs-sdk');

let apiVideo;
if (process.env.APIVIDEO_SANDBOX)
    apiVideo = new apiVideoSdk.ClientSandbox({ apiKey: process.env.APIVIDEO_KEY })
else
    apiVideo = new apiVideoSdk.Client({ apiKey: process.env.APIVIDEO_KEY })

video_id = process.argv[2]

apiVideo.videos.update(video_id, {
    public: false,
    mp4Support: false
})