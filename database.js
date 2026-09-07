// =========================================================================
// PILIHAN TAMPILAN LATAR BELAKANG (BOLA KACA + CAHAYA)
// =========================================================================
// Ganti nilai activeBackgroundTheme di bawah buat pindah tampilan:
// "tampilan1" (Biru Ungu) | "tampilan2" (Hitam Merah) | "tampilan3" (Navy Ungu)
// =========================================================================

const backgroundThemes = {
    tampilan1: {
        nama: "Biru Ungu",
        ball1Inner: '96, 165, 250',
        ball1Mid:   '124, 58, 237',
        ball1Outer: '76, 29, 149',
        ball2Inner: '129, 140, 248',
        ball2Mid:   '109, 40, 217',
        ball2Outer: '67, 20, 140'
    },
    tampilan2: {
        nama: "Hitam Merah",
        ball1Inner: '248, 113, 113',
        ball1Mid:   '185, 28, 28',
        ball1Outer: '69, 10, 10',
        ball2Inner: '244, 63, 94',
        ball2Mid:   '127, 29, 29',
        ball2Outer: '40, 10, 10'
    },
    tampilan3: {
        nama: "Navy Ungu",
        ball1Inner: '37, 99, 235',
        ball1Mid:   '30, 58, 138',
        ball1Outer: '23, 37, 84',
        ball2Inner: '167, 139, 250',
        ball2Mid:   '109, 40, 217',
        ball2Outer: '76, 29, 149'
    }
};

const activeBackgroundTheme = "tampilan3"; // <-- ganti ke "tampilan2" atau "tampilan3" buat ganti tampilan latar

// =========================================================================
// PANDUAN 40 TEMA WARNA GRADIEN LIQUID GLASS
// =========================================================================
// 1-10: Warna Dasar Premium      11-20: Gradien Spesial Alam & Kosmos
// 21-37: Cyber & Modern          38: PELANGI (Rainbow Premium)
// 39: CRYSTAL UNGU (Mengkilap)   40: CRYSTAL BIRU (Mengkilap)
// =========================================================================
// PILIHAN IKON SVG YANG TERSEDIA:
// - "whatsapp"  - "music"   - "web"
// - "database"  - "github"  - "drive"
// =========================================================================

const databaseLink = [
    { 
        nama: "Melofy Music Player", 
        url: "melofy.vinzhosting.my.id",  // Otomatis diubah jadi https:// agar tidak 404!
        tema: 40,                         // Crystal Biru Mengkilap
        svg: "music" 
    },
    { 
        nama: "Kawasan Halu Creator", 
        url: "https://chat.whatsapp.com/KQyCJIeMWWmJ9nAuIits4u?s=cl&p=a&mlu=4/", 
        tema: 15,                         // Gradien Hutan
        svg: "whatsapp" 
    },
    { 
        nama: "Repository RTXU", 
        url: "github.com/Vinz-LLG/RTXU", 
        tema: 38,                         // Pelangi (Rainbow)
        svg: "github" 
    },
    { 
        nama: "Server Database Panel", 
        url: "https://render.com/", 
        tema: 39,                         // Crystal Ungu Mengkilap
        svg: "database" 
    },
    { 
        nama: "Website Portfolio Utama", 
        url: "vinzhosting.my.id", 
        tema: 7,                          // Sian Cyber
        svg: "web" 
    },
    { 
        nama: "Google Drive Storage", 
        url: "drive.google.com", 
        tema: 6,                          // Emas Royal
        svg: "drive" 
    }
];
