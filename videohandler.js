const apiVideo = require('@api.video/nodejs-sdk');

const client = new apiVideo.ClientSandbox({ apiKey: 'b0ecJBDOo7vsIcgijFzie4HizCGcuVY48WPmifdSjkR' });

// let result = client.videos.get('vi2JnlUTh7OSFZ5uCtDdVcCG');

// result.then(function(video) {
//   console.log(video);
// });

client.videos.update('vi2JnlUTh7OSFZ5uCtDdVcCG', {mp4Support: false});