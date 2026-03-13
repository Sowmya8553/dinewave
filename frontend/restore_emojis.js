const fs = require('fs');
const path = require('path');

const replacements = {
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
    'â†’': '→',
    'â€”': '—'
};

function processDir(dir) {
    const ObjectKeys = Object.keys(replacements);
    const files = fs.readdirSync(dir);

    for (const f of files) {
        const full = path.join(dir, f);
        if (fs.statSync(full).isDirectory()) {
            processDir(full);
        } else if (full.endsWith('.jsx')) {
            let content = fs.readFileSync(full, 'utf-8');
            let matched = false;

            for (const key of ObjectKeys) {
                if (content.includes(key)) {
                    content = content.split(key).join(replacements[key]);
                    matched = true;
                }
            }

            if (matched) {
                fs.writeFileSync(full, content, 'utf-8');
                console.log(`Fixed emojis in ${full}`);
            }
        }
    }
}

processDir('./src');
console.log('Done restoring emojis!');
