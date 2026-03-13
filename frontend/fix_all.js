const fs = require('fs');
const path = require('path');

const map = {
    'ðŸ“ ': '📍',
    'ðŸ‘‹': '👋',
    'ðŸŽ‰': '🎉',
    'ðŸ’µ': '💵',
    'ðŸ“‹': '📋',
    'âœ…': '✅',
    'ðŸ‘¨â€ ðŸ ³': '👨‍🍳',
    'ðŸ›µ': '🛵',
    'ðŸ ½ï¸ ': '🍽️',
    'ðŸ ª': '🏪',
    'ðŸš€': '🚀',
    'â­ ': '⭐',
    'ðŸ“…': '📅',
    'ðŸŒŠ': '🌊',
    'ðŸŒ¿': '🌿',
    'ðŸ °': '🏰',
    'ðŸ ”ï¸ ': '🏔️',
    'ðŸ“§': '📧',
    'ðŸ“ž': '📞',
    'ðŸ›’': '🛒',
    'ðŸ—‘ï¸ ': '🗑️',
    'ðŸ”’': '🔒',
    'ðŸ“Š': '📊',
    'ðŸ“¦': '📦',
    'ðŸ‘¤': '👤',
    'ðŸ’¬': '💬',
    'â‚¹': '₹',
    'â— ': '●',
    'â Œ': '❌',
    'âˆ’': '−',
    'Ã—': '×',
    'â†’': '→',
    'â† ': '←',
    'â€“': '–',
    'â ±ï¸ ': '⏱️',
    'ðŸ“´': '📫',
    'ðŸ“­': '📬',
    'ðŸ“˜': '📘',
    'ðŸ“¸': '📸',
    'ðŸ ¦': '🐦',
    'ðŸ” ': '🔍'
};

function fixDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const full = path.join(dir, f);
        if (fs.statSync(full).isDirectory()) {
            fixDir(full);
        } else if (full.endsWith('.jsx')) {
            let content = fs.readFileSync(full, 'utf8');
            let originalContent = content;
            for (const [bad, good] of Object.entries(map)) {
                // simple split/join for global replace
                content = content.split(bad).join(good);
            }
            if (content !== originalContent) {
                fs.writeFileSync(full, content, 'utf8');
                console.log('Fixed', full);
            }
        }
    }
}

fixDir(path.join(__dirname, 'src'));
console.log('All done!');
