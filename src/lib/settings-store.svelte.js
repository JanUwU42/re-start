let defaultSettings = {
    timeFormat: '24hr',
    latitude: null,
    longitude: null,
    tempUnit: 'celsius',
    linksPerColumn: 4,
    links: [
        { title: 'mail', url: 'https://mail.proton.me/u/0/inbox' },
        { title: 'calendar', url: 'https://calendar.proton.me/u/0/' },
        { title: 'github', url: 'https://github.com' },
        { title: 'protondb', url: 'https://www.protondb.com' },
        { title: 'areweacyet', url: 'https://areweanticheatyet.com/' },
        { title: 'reddit', url: 'https://www.reddit.com/' },
        { title: 'lemmy', url: 'https://discuss.tchncs.de/' },
        { title: 'mastodon', url: 'https://sakurajima.moe/home' },
        { title: 'anilist', url: 'https://anilist.co/' },
        { title: 'crunchyroll', url: 'https://www.crunchyroll.com/' },
        { title: 'twitch', url: 'https://www.twitch.tv/' },
        { title: 'trainex', url: 'https://www.trainex22.de/vwa-ms-trainex/login.cfm' },
    ],
}

function loadSettings() {
    try {
        const stored = localStorage.getItem('settings')
        if (stored) {
            const parsed = JSON.parse(stored)
            return { ...defaultSettings, ...parsed }
        }
    } catch (error) {
        console.error('failed to load settings from localStorage:', error)
    }

    return defaultSettings
}

export function saveSettings(settings) {
    try {
        localStorage.setItem('settings', JSON.stringify(settings))
    } catch (error) {
        console.error('failed to save settings to localStorage:', error)
    }
}

export const settings = $state(loadSettings())
