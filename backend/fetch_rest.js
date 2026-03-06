const fs = require('fs');
const https = require('https');
const path = require('path');

const restaurants = [
    { id: 'buhari', query: 'Buhari_Hotel' },
    { id: 'murugan', query: 'Idli' },
    { id: 'vidyarthi', query: 'Vidyarthi_Bhavan' },
    { id: 'truffles', query: 'Hamburger' },
    { id: 'paradise', query: 'Paradise_Hotel_(Secunderabad)' },
    { id: 'shadab', query: 'Charminar' },
    { id: 'annapoorna', query: 'Thali_(food)' },
    { id: 'hari_bhavanam', query: 'Chettinad_cuisine' }
];

const fallbackImg = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Indian_restaurant_interior.jpg/800px-Indian_restaurant_interior.jpg';

const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
};

const getWikiImage = (title) => {
    return new Promise((resolve, reject) => {
        const api = `https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages&format=json&pithumbsize=800`;
        https.get(api, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let body = '';
            res.on('data', d => body += d);
            res.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    const pages = data.query.pages;
                    const pageId = Object.keys(pages)[0];
                    if (pageId !== '-1' && pages[pageId].thumbnail) {
                        resolve(pages[pageId].thumbnail.source);
                    } else {
                        resolve(fallbackImg);
                    }
                } catch (e) {
                    resolve(fallbackImg);
                }
            });
        }).on('error', () => resolve(fallbackImg));
    });
};

async function run() {
    const targetDir = path.join(__dirname, '..', 'frontend', 'public', 'restaurants');
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    for (const r of restaurants) {
        console.log(`Fetching image for ${r.id}...`);
        let imgUrl = await getWikiImage(r.query);
        console.log(`URL: ${imgUrl}`);
        const dest = path.join(targetDir, `${r.id}.jpg`);
        await downloadFile(imgUrl, dest);
        console.log(`Saved ${r.id}.jpg`);
    }
}

run().catch(console.error);
