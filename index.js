const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const router = express.Router();
router.use(fileUpload());

const chars = "0123456789qwertyuiopasdfghjklzxcvbnm";
function c() { return chars[Math.floor(Math.random() * chars.length)] }
function name() {
  let o = '';
  for (let i = 0; i < 32; i ++) {
    o += c();
  }
  return o;
}

if (!fs.existsSync('tracks')) {
  fs.writeFileSync('tracks', '[]');
}

let tracks = JSON.parse(fs.readFileSync('tracks'));
router.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')) );
router.get('/s', (req, res) =>  {
  res.set('Content-Type', 'Application/JSON');
  res.send('{"t":'+JSON.stringify(tracks)+'}');
});
router.use('/audio', express.static(path.join(__dirname, 'audio')));
router.post('/', (req, res) =>  {
  if (req.files) {
    const filename = 'audio/' + name() + '.mp3';
    req.files.f.mv(path.join(__dirname, filename), (e) => {
      console.log('moved to ' + path.join(__dirname, filename));
      if (e) {
        console.error(e);
      } else {
        tracks = [filename].concat(tracks.slice(0, 9));
        fs.writeFileSync('tracks', JSON.stringify(tracks));
      }
      console.log(tracks);
      res.sendFile(path.join(__dirname, 'index.html'));
    });
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});


module.exports = router;