// Theme-based icon mapping
const themeIcons = {
    destiny: {
        ktg: '../../public/assets/icons/fave_icon.png',
        light: '../../public/assets/icons/infinity-blk.png',
        dark: '../../public/assets/icons/infinity-wht.png'
    },
    ktgai: {
        ktg: '../../public/assets/icons/ai_brain_logo_icon.png',
        light: '../../public/assets/icons/ai_brain_logo_icon-blk.png',
        dark: '../../public/assets/icons/ai_brain_logo_icon-wht.png'
    },
    music: {
        ktg: '../../public/assets/icons/qr_icon.png',
        light: '../../public/assets/icons/qr_icon-blk.png',
        dark: '../../public/assets/icons/qr_icon-wht.png'
    },
    merch: {
        ktg: '../../public/assets/icons/merch_icon.png',
        light: '../../public/assets/icons/merch_icon-blk.png',
        dark: '../../public/assets/icons/merch_icon-wht.png'
    },
    web3: {
        ktg: '../../public/assets/icons/kgz_white_icon.png',
        light: '../../public/assets/icons/kgz_icon-blk.png',
        dark: '../../public/assets/icons/kgz_icon-wht.png'
    },
    listings: {
        ktg: '../../public/assets/icons/listing_icon.png',
        light: '../../public/assets/icons/listing_icon-blk.png',
        dark: '../../public/assets/icons/listing_icon-wht.png'
    },
    lifestyles: {
        ktg: '../../public/assets/icons/group_icon.png',
        light: '../../public/assets/icons/group_icon-blk.png',
        dark: '../../public/assets/icons/group_icon-wht.png'
    },
    ktgtv: {
        ktg: '../../public/assets/icons/ktgtv_icon.png',
        light: '../../public/assets/icons/ktgtv_icon-blk.png',
        dark: '../../public/assets/icons/ktgtv_icon-wht.png'
    },
    vr: {
        ktg: '../../public/assets/icons/vr_icon.png',
        light: '../../public/assets/icons/vr_icon-blk.png',
        dark: '../../public/assets/icons/vr_icon-wht.png'
    },
    metaphysics: {
        ktg: '../../public/assets/icons/tarot_icon.png',
        light: '../../public/assets/icons/tarot_icon-blk.png',
        dark: '../../public/assets/icons/tarot_icon-wht.png'
    },
    dignbling: {
        ktg: '../../public/assets/icons/diamond_mine_icon.png',
        light: '../../public/assets/icons/diamond_mine_icon-blk.png',
        dark: '../../public/assets/icons/diamond_mine_icon-wht.png'
    },
    instagram: {
        ktg: '../../public/assets/icons/instagram_icon.png',
        light: '../../public/assets/icons/instagram_icon-blk.png',
        dark: '../../public/assets/icons/instagram_icon-wht.png'
    },
    linkedin: {
        ktg: '../../public/assets/icons/linkedin_icon.png',
        light: '../../public/assets/icons/linkedin_icon-blk.png',
        dark: '../../public/assets/icons/linkedin_icon-wht.png'
    },
    tiktok: {
        ktg: '../../public/assets/icons/tiktok_icon.png',
        light: '../../public/assets/icons/tiktok_icon-blk.png',
        dark: '../../public/assets/icons/tiktok_icon-wht.png'
    },
    discord: {
        ktg: '../../public/assets/icons/discord_icon.png',
        light: '../../public/assets/icons/discord_icon-blk.png',
        dark: '../../public/assets/icons/discord_icon-wht.png'
    },
    telegram: {
        ktg: '../../public/assets/icons/telegram_icon.png',
        light: '../../public/assets/icons/telegram_icon-blk.png',
        dark: '../../public/assets/icons/telegram_icon-wht.png'
    },
    threads: {
        ktg: '../../public/assets/icons/threads_icon.png',
        light: '../../public/assets/icons/threads_icon-blk.png',
        dark: '../../public/assets/icons/threads_icon-wht.png'
    },
    dao: {
        ktg: '../../public/assets/icons/dao_icon.png',
        light: '../../public/assets/icons/dao_icon-blk.png',
        dark: '../../public/assets/icons/dao_icon-wht.png'
    },
    map: {
        ktg: '../../public/assets/icons/globe_icon.png',
        light: '../../public/assets/icons/globe_icon-blk.png',
        dark: '../../public/assets/icons/globe_icon-wht.png'
    }
};

function updateThemeIcons(theme) {
    // Update generic theme icons with data attributes
    const genericThemeIcons = document.querySelectorAll('.theme-icon');
    genericThemeIcons.forEach(icon => {
        const iconSrc = icon.getAttribute(`data-${theme}`);
        if (iconSrc) {
            icon.src = iconSrc;
        }
    });

    // Update portal icons
    const destinyIcons = document.querySelectorAll('.destiny-icon');
    destinyIcons.forEach(icon => {
        if (themeIcons.destiny[theme]) {
            icon.src = themeIcons.destiny[theme];
        }
    });

    const ktgaiIcons = document.querySelectorAll('.ktgai-icon');
    ktgaiIcons.forEach(icon => {
        if (themeIcons.ktgai[theme]) {
            icon.src = themeIcons.ktgai[theme];
        }
    });

    const musicIcons = document.querySelectorAll('.music-icon');
    musicIcons.forEach(icon => {
        if (themeIcons.music[theme]) {
            icon.src = themeIcons.music[theme];
        }
    });

    const merchIcons = document.querySelectorAll('.merch-icon');
    merchIcons.forEach(icon => {
        if (themeIcons.merch[theme]) {
            icon.src = themeIcons.merch[theme];
        }
    });

    const web3Icons = document.querySelectorAll('.web3-icon');
    web3Icons.forEach(icon => {
        if (themeIcons.web3[theme]) {
            icon.src = themeIcons.web3[theme];
        }
    });

    const listingsIcons = document.querySelectorAll('.listings-icon');
    listingsIcons.forEach(icon => {
        if (themeIcons.listings[theme]) {
            icon.src = themeIcons.listings[theme];
        }
    });

    const lifestylesIcons = document.querySelectorAll('.lifestyles-icon');
    lifestylesIcons.forEach(icon => {
        if (themeIcons.lifestyles[theme]) {
            icon.src = themeIcons.lifestyles[theme];
        }
    });

    const ktgtvIcons = document.querySelectorAll('.ktgtv-icon');
    ktgtvIcons.forEach(icon => {
        if (themeIcons.ktgtv[theme]) {
            icon.src = themeIcons.ktgtv[theme];
        }
    });

    const vrIcons = document.querySelectorAll('.vr-icon');
    vrIcons.forEach(icon => {
        if (themeIcons.vr[theme]) {
            icon.src = themeIcons.vr[theme];
        }
    });

    const metaphysicsIcons = document.querySelectorAll('.metaphysics-icon');
    metaphysicsIcons.forEach(icon => {
        if (themeIcons.metaphysics[theme]) {
            icon.src = themeIcons.metaphysics[theme];
        }
    });

    const dignblingIcons = document.querySelectorAll('.dignbling-icon');
    dignblingIcons.forEach(icon => {
        if (themeIcons.dignbling[theme]) {
            icon.src = themeIcons.dignbling[theme];
        }
    });

    // Update social media icons
    const instagramIcons = document.querySelectorAll('.instagram-icon');
    instagramIcons.forEach(icon => {
        if (themeIcons.instagram[theme]) {
            icon.src = themeIcons.instagram[theme];
        }
    });

    const linkedinIcons = document.querySelectorAll('.linkedin-icon');
    linkedinIcons.forEach(icon => {
        if (themeIcons.linkedin[theme]) {
            icon.src = themeIcons.linkedin[theme];
        }
    });

    const tiktokIcons = document.querySelectorAll('.tiktok-icon');
    tiktokIcons.forEach(icon => {
        if (themeIcons.tiktok[theme]) {
            icon.src = themeIcons.tiktok[theme];
        }
    });

    const discordIcons = document.querySelectorAll('.discord-icon');
    discordIcons.forEach(icon => {
        if (themeIcons.discord[theme]) {
            icon.src = themeIcons.discord[theme];
        }
    });

    const telegramIcons = document.querySelectorAll('.telegram-icon');
    telegramIcons.forEach(icon => {
        if (themeIcons.telegram[theme]) {
            icon.src = themeIcons.telegram[theme];
        }
    });

    const threadsIcons = document.querySelectorAll('.threads-icon');
    threadsIcons.forEach(icon => {
        if (themeIcons.threads[theme]) {
            icon.src = themeIcons.threads[theme];
        }
    });

    const daoIcons = document.querySelectorAll('.dao-icon');
    daoIcons.forEach(icon => {
        if (themeIcons.dao[theme]) {
            icon.src = themeIcons.dao[theme];
        }
    });

    const mapIcons = document.querySelectorAll('.map-icon');
    mapIcons.forEach(icon => {
        if (themeIcons.map[theme]) {
            icon.src = themeIcons.map[theme];
        }
    });
}

// Function to update music toggle icon based on play state
function updateMusicToggleIcon(theme) {
    const musicToggleImg = document.querySelector('#musicToggle img');
    if (!musicToggleImg) return;
    
    if (theme === 'ktg') {
        // KTG mode uses original play_pause icon
        musicToggleImg.src = '../../public/assets/icons/play_pause.png';
    } else {
        // Light/Dark modes use separate play/pause icons
        const musicPlayer = document.getElementById('musicPlayer');
        const isPlaying = musicPlayer && !musicPlayer.paused;
        const iconKey = isPlaying ? 'pause' : 'play';
        musicToggleImg.src = themeIcons[theme][iconKey];
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { themeIcons, updateThemeIcons };
}