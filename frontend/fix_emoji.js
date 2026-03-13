const fs = require('fs');
const path = require('path');

// Reverse of Windows-1252 mapping for the 0x80-0x9F range
const cp1252Inverse = {
    '\u20AC': 0x80, '\u201A': 0x82, '\u0192': 0x83, '\u201E': 0x84, '\u2026': 0x85,
    '\u2020': 0x86, '\u2021': 0x87, '\u02C6': 0x88, '\u2030': 0x89, '\u0160': 0x8A,
    '\u2039': 0x8B, '\u0152': 0x8C, '\u017D': 0x8E, '\u2018': 0x91, '\u2019': 0x92,
    '\u201C': 0x93, '\u201D': 0x94, '\u2022': 0x95, '\u2013': 0x96, '\u2014': 0x97,
    '\u02DC': 0x98, '\u2122': 0x99, '\u0161': 0x9A, '\u203A': 0x9B, '\u0153': 0x9C,
    '\u017E': 0x9E, '\u0178': 0x9F
};

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const full = path.join(dir, f);
        if (fs.statSync(full).isDirectory()) {
            processDir(full);
        } else if (full.endsWith('.jsx')) {
            const content = fs.readFileSync(full, 'utf-8');
            if (content.includes('ðŸ')) { // Strong fingerprint of Mojibake
                console.log(`Fixing ${full}...`);
                const outBuf = Buffer.alloc(content.length);
                let outLen = 0;
                for (let i = 0; i < content.length; i++) {
                    const char = content[i];
                    if (char === '\uFEFF' && i === 0) continue; // Skip BOM if exists

                    const codePoint = char.charCodeAt(0);
                    if (codePoint <= 0xFF && !(codePoint >= 0x80 && codePoint <= 0x9F)) {
                        // Standard latin1 range matches CP1252
                        outBuf[outLen++] = codePoint;
                    } else if (cp1252Inverse[char] !== undefined) {
                        outBuf[outLen++] = cp1252Inverse[char];
                    } else {
                        // Keep mapping 1:1 for things that weren't corrupted by the specific CP1252 hole (though all mojibake should fall into above two)
                        outBuf[outLen++] = codePoint;
                    }
                }
                const finalBuffer = outBuf.slice(0, outLen);
                try {
                    const decoded = finalBuffer.toString('utf-8');
                    fs.writeFileSync(full, decoded, 'utf-8');
                    console.log(`  -> Successfully restored emojis in ${full}`);
                } catch (e) {
                    console.error(`  -> Failed to decode UTF-8 for ${full}: ${e}`);
                }
            }
        }
    }
}

processDir('./src');
