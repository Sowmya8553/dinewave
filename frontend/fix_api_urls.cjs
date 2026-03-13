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

    // Replace: 'http://localhost:5000/something' with `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/something`
    // We match single quote, then url, then anything until single quote
    content = content.replace(/'http:\/\/localhost:5000([^']+)'/g, '`${import.meta.env.VITE_API_URL || \\\'http://localhost:5000\\\'}$1`');

    // Replace: `http://localhost:5000/something` with `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/something`
    // We match backtick, then url, then anything until backtick
    // But backticks might have variables inside ${}, so it's safer to just replace http://localhost:5000 inside backticks
    content = content.replace(/`http:\/\/localhost:5000/g, '`${import.meta.env.VITE_API_URL || \\\'http://localhost:5000\\\'}');

    // Also handle Dashboard baseURL
    content = content.replace(/baseURL:\s*'http:\/\/localhost:5000'/g, 'baseURL: import.meta.env.VITE_API_URL || \\\'http://localhost:5000\\\'');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedFiles++;
        console.log('Updated', file);
    }
});

console.log('Total files changed:', changedFiles);
