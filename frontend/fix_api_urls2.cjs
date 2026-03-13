const fs = require('fs');
const path = require('path');

const walkSync = function (dir, filelist) {
    const files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(path.join(dir, file), filelist);
        }
        else {
            filelist.push(path.join(dir, file));
        }
    });
    return filelist;
};

const files = walkSync('c:/Users/Admin/Desktop/Restaurant/frontend/src').filter(f => f.endsWith('.jsx'));
let changedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace the escaped single quotes from my previous mistake
    content = content.replace(/\\'http:\/\/localhost:5000\\'/g, "'http://localhost:5000'");

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedFiles++;
        console.log('Fixed', file);
    }
});

console.log('Total files fixed:', changedFiles);
