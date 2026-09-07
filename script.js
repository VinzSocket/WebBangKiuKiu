// =========================================================================
// TERAPKAN TEMA LATAR BELAKANG (BOLA + CAHAYA) SESUAI PILIHAN DI database.js
// =========================================================================
(function applyBackgroundTheme() {
    if (typeof backgroundThemes === 'undefined' || typeof activeBackgroundTheme === 'undefined') return;

    const theme = backgroundThemes[activeBackgroundTheme] || backgroundThemes.tampilan1;
    if (!theme) return;

    const root = document.documentElement.style;
    root.setProperty('--ball1-inner', theme.ball1Inner);
    root.setProperty('--ball1-mid', theme.ball1Mid);
    root.setProperty('--ball1-outer', theme.ball1Outer);
    root.setProperty('--ball2-inner', theme.ball2Inner);
    root.setProperty('--ball2-mid', theme.ball2Mid);
    root.setProperty('--ball2-outer', theme.ball2Outer);
})();

// =========================================================================
// 0. LOGIKA PENGATURAN PERFORMA (POPUP PERTAMA KALI + BISA DIBUKA/GANTI LAGI)
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const renderModal = document.getElementById('renderModal');
    const modalStatus = document.getElementById('renderModalStatus');
    const btnRenderYes = document.getElementById('btnRenderYes');
    const btnRenderNo = document.getElementById('btnRenderNo');
    const btnRenderClose = document.getElementById('btnRenderClose');
    const perfFab = document.getElementById('perfFab');

    // Terapkan mode (high/low) ke body. Semua styling low-perf diatur lewat CSS body.low-perf
    function applyRenderMode(mode) {
        document.body.classList.toggle('low-perf', mode === 'low');
    }

    // Buka modal. Kalau user sudah pernah pilih sebelumnya, tampilkan status
    // mode saat ini + tombol close (biar bisa dicek/diganti tanpa dipaksa milih ulang)
    function openRenderModal() {
        const currentMode = localStorage.getItem('renderPerformanceMode');

        if (modalStatus) {
            if (currentMode === 'low') {
                modalStatus.textContent = 'Mode saat ini: Ringan 🔋';
            } else if (currentMode === 'high') {
                modalStatus.textContent = 'Mode saat ini: Render Penuh ⚡';
            } else {
                modalStatus.textContent = '';
            }
        }

        renderModal.classList.toggle('has-close', !!currentMode);
        renderModal.classList.add('show');
    }

    function closeRenderModal() {
        renderModal.classList.remove('show');
    }

    function chooseRenderMode(mode) {
        localStorage.setItem('renderPerformanceMode', mode);
        applyRenderMode(mode);
        closeRenderModal();
    }

    // Cek pilihan tersimpan: terapkan langsung, atau tampilkan popup kalau kunjungan pertama
    const savedRenderMode = localStorage.getItem('renderPerformanceMode');
    if (savedRenderMode === 'low' || savedRenderMode === 'high') {
        applyRenderMode(savedRenderMode);
    } else {
        openRenderModal();
    }

    btnRenderYes.addEventListener('click', () => chooseRenderMode('high'));
    btnRenderNo.addEventListener('click', () => chooseRenderMode('low'));
    if (btnRenderClose) btnRenderClose.addEventListener('click', closeRenderModal);

    // Tombol Performa mengambang: buka lagi popupnya kapan saja buat ganti mode
    if (perfFab) perfFab.addEventListener('click', () => openRenderModal());

    // Jaga-jaga kalau halaman dibuka lagi dari BFCache (tombol back), state tetap konsisten
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            const mode = localStorage.getItem('renderPerformanceMode');
            if (mode === 'low' || mode === 'high') {
                applyRenderMode(mode);
                closeRenderModal();
            }
        }
    });
});

// =========================================================================
// 1. DICTIONARY 40 TEMA WARNA GRADIEN LIQUID GLASS
// =========================================================================
const liquidThemes = {
    1:  { c1: '255, 0, 76',   c2: '255, 50, 100' },  // Merah Crimson
    2:  { c1: '0, 76, 255',   c2: '50, 100, 255' },  // Biru Samudra
    3:  { c1: '0, 255, 76',   c2: '50, 255, 100' },  // Hijau Zamrud
    4:  { c1: '150, 0, 255',  c2: '200, 50, 255' },  // Ungu Neon
    5:  { c1: '255, 100, 0',  c2: '255, 150, 50' },  // Oranye Senja
    6:  { c1: '255, 215, 0',  c2: '255, 255, 100' }, // Emas Royal
    7:  { c1: '0, 255, 255',  c2: '50, 255, 255' },  // Sian Cyber
    8:  { c1: '255, 20, 147', c2: '255, 100, 180' }, // Pink Sakura
    9:  { c1: '80, 80, 80',   c2: '120, 120, 120' }, // Hitam Obsidian
    10: { c1: '255, 255, 255',c2: '200, 200, 200' }, // Putih Mutiara
    11: { c1: '255, 0, 0',    c2: '255, 200, 0' },   // Gradien Api
    12: { c1: '128, 0, 255',  c2: '255, 0, 128' },   // Gradien Galaxy
    13: { c1: '0, 255, 128',  c2: '0, 128, 255' },   // Gradien Aurora
    14: { c1: '255, 0, 128',  c2: '255, 128, 0' },   // Gradien Senja
    15: { c1: '0, 200, 0',    c2: '100, 255, 0' },   // Gradien Hutan
    16: { c1: '0, 255, 255',  c2: '255, 255, 255' }, // Gradien Es
    17: { c1: '20, 30, 80',   c2: '0, 0, 0' },       // Gradien Malam
    18: { c1: '255, 150, 150',c2: '255, 200, 150' }, // Gradien Peach
    19: { c1: '150, 255, 0',  c2: '0, 255, 150' },   // Gradien Toksik
    20: { c1: '255, 0, 76',   c2: '0, 76, 255' },    // Merah Biru
    21: { c1: '255, 0, 255',  c2: '180, 0, 255' },   // Magenta Pulse
    22: { c1: '0, 255, 0',    c2: '200, 255, 0' },   // Electric Lime
    23: { c1: '75, 0, 130',   c2: '138, 43, 226' },  // Deep Indigo
    24: { c1: '255, 127, 80', c2: '255, 69, 0' },    // Sunset Coral
    25: { c1: '127, 255, 212',c2: '0, 206, 209' },   // Aqua Marine
    26: { c1: '220, 20, 60',  c2: '139, 0, 0' },     // Ruby Red
    27: { c1: '15, 82, 186',  c2: '65, 105, 225' },  // Sapphire Glow
    28: { c1: '80, 200, 120', c2: '0, 168, 107' },   // Emerald Shine
    29: { c1: '153, 102, 204',c2: '148, 0, 211' },   // Amethyst Purple
    30: { c1: '255, 200, 122',c2: '218, 165, 32' },  // Topaz Gold
    31: { c1: '255, 0, 153',  c2: '0, 255, 255' },   // Cyberpunk Neon
    32: { c1: '255, 110, 199',c2: '120, 80, 255' },  // Synthwave Pink
    33: { c1: '255, 190, 0',  c2: '255, 80, 0' },    // Tropical Mango
    34: { c1: '180, 190, 210',c2: '100, 110, 130' }, // Mystic Fog
    35: { c1: '255, 30, 0',   c2: '255, 180, 0' },   // Lava Lamp
    36: { c1: '0, 40, 100',   c2: '0, 150, 200' },   // Deep Sea
    37: { c1: '210, 220, 230',c2: '140, 150, 160' }, // Titanium Silver
    38: { c1: '255, 0, 128',  c2: '0, 255, 255' },   // PELANGI (Rainbow Premium)
    39: { c1: '180, 80, 255', c2: '220, 140, 255' }, // CRYSTAL UNGU (Mengkilap)
    40: { c1: '0, 180, 255',  c2: '120, 240, 255' }  // CRYSTAL BIRU (Mengkilap)
};

// 2. LIBRARY IKON SVG KHUSUS (WHATSAPP, MUSIC, WEB, DATABASE, GITHUB, DRIVE)
const iconLibrary = {
    whatsapp: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-svg"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`,
    music: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-svg"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`,
    web: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-svg"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
    database: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-svg"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`,
    github: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-svg"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`,
    drive: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-svg"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
    default: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-svg"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`
};

// 3. FUNGSI PEMBENAR URL OTOMATIS (ANTI 404 & BUKA DI BROWSER BARU)
function formatUrl(url) {
    if (!url) return '#';
    const trimmed = url.trim();
    if (!trimmed.match(/^(https?:\/\/|mailto:|tel:)/i)) {
        return 'https://' + trimmed;
    }
    return trimmed;
}

// 4. GENERATOR LINK & INJECT TEMA WARNA SERTA SVG
const container = document.getElementById('linksContainer');

if (typeof databaseLink !== 'undefined') {
    databaseLink.forEach(link => {
        const newBtn = document.createElement('a');
        
        newBtn.href = formatUrl(link.url);
        newBtn.target = '_blank';
        newBtn.rel = 'noopener noreferrer';
        newBtn.className = 'glass-btn';
        
        const svgKey = link.svg && iconLibrary[link.svg.toLowerCase()] ? link.svg.toLowerCase() : 'default';
        const svgIcon = iconLibrary[svgKey];

        newBtn.innerHTML = `
            <span class="btn-inner">
                <span class="btn-icon-wrapper">${svgIcon}</span>
                <span class="btn-text">${link.nama}</span>
            </span>
        `;
        
        if (link.tema && liquidThemes[link.tema]) {
            const themeColors = liquidThemes[link.tema];
            newBtn.style.setProperty('--c1', themeColors.c1);
            newBtn.style.setProperty('--c2', themeColors.c2);

            if (link.tema === 38) {
                newBtn.classList.add('rainbow-gloss');
            } else if (link.tema === 39 || link.tema === 40) {
                newBtn.classList.add('crystal-gloss');
            }
        }

        container.appendChild(newBtn);
    });
} else {
    container.innerHTML = "<p style='color:red;'>Gagal memuat database.js!</p>";
}
