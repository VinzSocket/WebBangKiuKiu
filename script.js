/* ================================================================
   VINZHOSTING — HUB UNDUH MEDIA
   script.js
   ----------------------------------------------------------------
   Berisi:
   - Seluruh ikon SVG murni (objek ICONS), termasuk logo VinzHosting
     yang beranimasi (panah unduh berdenyut)
   - Interaksi UI: menu mobile, ripple, spotlight kartu, toast
   - TOOLS: satu modal alat unduh dipakai bergantian untuk semua
     platform. Setiap tool memanggil API asli lewat gateway di
     VinzKey.js, dan parsing hasilnya PERSIS mengikuti bentuk respons
     yang sudah dicek satu-satu:
       * Pinterest      -> data: [{url,width,height}, ...]
       * TikTok         -> data.{caption,video,videoWM,audio,music.cover}
       * Instagram      -> data: [{type,url}, ...]  (bisa >1 file/carousel)
       * SnackVideo     -> data.{thumbnail[],author,caption,url}
       * YouTube        -> {title,thumbnail,channel,duration,data.url}
       * Spotify Search -> data: [{thumbnail,title,duration,url}, ...]
       * Spotify Download -> result.data.{thumbnail,title,artist,url}
       * RedNote        -> endpoint ada, tapi contoh respons BELUM
         dikasih — parsing di bawah best-effort + pesan error jelas
         kalau field yang diharapkan ternyata tidak ada.
   - VinzKey.js WAJIB dimuat sebelum file ini (isi window.VinzKey)

   DAFTAR ISI
   01. Ikon SVG (ICONS)
   02. Util Umum
   03. Render Ikon
   04. Toast / Notifikasi
   05. Tahun Footer
   06. Menu Mobile
   07. Ripple Efek Tombol
   08. Spotlight Kartu (ikuti kursor)
   09. Panggilan API (VinzKey.js)
   10. Template Hasil (gallery/media list/kartu hasil)
   11. Definisi TOOLS per Platform
   12. Modal Alat Unduh (buka/tutup/submit)
   13. Aksi di Dalam Hasil (unduh, chain Spotify, audio YouTube)
   14. Tombol Link Biasa (Langganan)
   15. Popover Spotify (Link Download / Search)
   16. Pengecekan Konfigurasi
   17. Inisialisasi
================================================================ */

"use strict";

/* ================================================================
   01. IKON SVG (ICONS)
================================================================ */
const ICONS = {
  /* ---- Utilitas ---- */
  menu: `
    <svg viewBox="0 0 24 24">
      <line x1="4" y1="7" x2="20" y2="7"></line>
      <line x1="4" y1="12" x2="20" y2="12"></line>
      <line x1="4" y1="17" x2="20" y2="17"></line>
    </svg>`,

  close: `
    <svg viewBox="0 0 24 24">
      <line x1="6" y1="6" x2="18" y2="18"></line>
      <line x1="18" y1="6" x2="6" y2="18"></line>
    </svg>`,

  "arrow-right": `
    <svg viewBox="0 0 24 24">
      <line x1="4" y1="12" x2="18" y2="12"></line>
      <polyline points="12 6 18 12 12 18"></polyline>
    </svg>`,

  "external-link": `
    <svg viewBox="0 0 24 24">
      <path d="M9 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"></path>
      <path d="M14 4h6v6"></path>
      <line x1="10" y1="14" x2="20" y2="4"></line>
    </svg>`,

  "chevron-down": `
    <svg viewBox="0 0 24 24">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>`,

  download: `
    <svg viewBox="0 0 24 24">
      <path d="M12 3v12"></path>
      <polyline points="7 11 12 16 17 11"></polyline>
      <line x1="4" y1="20" x2="20" y2="20"></line>
    </svg>`,

  search: `
    <svg viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6.5"></circle>
      <line x1="16" y1="16" x2="21" y2="21"></line>
    </svg>`,

  bolt: `
    <svg viewBox="0 0 24 24">
      <polygon points="12 2 4 14 11 14 10 22 20 9 13 9 12 2"></polygon>
    </svg>`,

  shield: `
    <svg viewBox="0 0 24 24">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"></path>
      <polyline points="9 12 11.5 14.5 15.5 9.5"></polyline>
    </svg>`,

  layers: `
    <svg viewBox="0 0 24 24">
      <polygon points="12 3 21 8 12 13 3 8 12 3"></polygon>
      <polyline points="3 13 12 18 21 13"></polyline>
      <polyline points="3 18 12 22.5 21 18"></polyline>
    </svg>`,

  check: `
    <svg viewBox="0 0 24 24">
      <polyline points="4 12 9.5 17.5 20 6"></polyline>
    </svg>`,

  "alert-circle": `
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9"></circle>
      <line x1="12" y1="7.5" x2="12" y2="13"></line>
      <circle cx="12" cy="16.5" r="0.6" fill="currentColor" stroke="none"></circle>
    </svg>`,

  "graduation-cap": `
    <svg viewBox="0 0 24 24">
      <polygon points="12 4 22 9 12 14 2 9 12 4"></polygon>
      <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"></path>
      <line x1="22" y1="9" x2="22" y2="15"></line>
    </svg>`,

  sparkles: `
    <svg viewBox="0 0 24 24">
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"></path>
      <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z"></path>
    </svg>`,

  /* ---- Logo VinzHosting: panah unduh + tray, bagian panahnya
     berdenyut turun pelan lewat CSS (lihat .mark-arrow di style.css) ---- */
  mark: `
    <svg viewBox="0 0 24 24">
      <g class="mark-arrow">
        <line x1="12" y1="3.2" x2="12" y2="13.8"></line>
        <polyline points="7.6 10 12 14.4 16.4 10"></polyline>
      </g>
      <path d="M4 15.8v1.9A2.3 2.3 0 0 0 6.3 20h11.4a2.3 2.3 0 0 0 2.3-2.3v-1.9"></path>
    </svg>`,

  /* ---- Ikon platform (siluet sederhana untuk identifikasi tujuan link) ---- */
  pinterest: `
    <svg viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.15 2 11.27c0 3.9 2.44 7.23 5.9 8.6-.08-.73-.15-1.85.03-2.65.17-.72 1.1-4.6 1.1-4.6s-.28-.56-.28-1.38c0-1.3.76-2.27 1.7-2.27.8 0 1.19.6 1.19 1.32 0 .8-.52 2-.78 3.11-.22.93.47 1.7 1.4 1.7 1.67 0 2.96-1.76 2.96-4.31 0-2.25-1.62-3.83-3.94-3.83-2.68 0-4.26 2.01-4.26 4.08 0 .81.31 1.68.71 2.15.08.09.09.17.06.27l-.26 1.05c-.04.17-.14.21-.32.13-1.2-.56-1.95-2.3-1.95-3.71 0-3.02 2.2-5.8 6.33-5.8 3.32 0 5.9 2.37 5.9 5.53 0 3.3-2.08 5.96-4.97 5.96-.97 0-1.88-.5-2.19-1.1l-.6 2.27c-.21.83-.8 1.87-1.2 2.5.9.28 1.86.43 2.86.43 5.52 0 10-4.15 10-9.27C22 6.15 17.52 2 12 2z"></path>
    </svg>`,

  tiktok: `
    <svg viewBox="0 0 24 24">
      <path d="M16.5 2h-3v13.2a2.8 2.8 0 1 1-2-2.68V9.4a5.9 5.9 0 1 0 5 5.83V9.1a7.3 7.3 0 0 0 4.5 1.55V7.6a4.3 4.3 0 0 1-4.5-3.9V2z"></path>
    </svg>`,

  instagram: `
    <svg viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="6" fill="none" stroke="currentColor" stroke-width="2"></rect>
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2"></circle>
      <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" stroke="none"></circle>
    </svg>`,

  snackvideo: `
    <svg viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="7" fill="currentColor"></rect>
      <polygon points="10 8 16.5 12 10 16" fill="var(--bg-base)" stroke="none"></polygon>
    </svg>`,

  rednote: `
    <svg viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="6" fill="currentColor"></rect>
      <path d="M9 7v10l3-2.3 3 2.3V7z" fill="var(--bg-base)" stroke="none"></path>
    </svg>`,

  spotify: `
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M7 10.2c3-.9 7-.5 9.5.95" stroke="var(--bg-base)" stroke-width="1.6" fill="none" stroke-linecap="round"></path>
      <path d="M7.3 13.2c2.5-.7 5.7-.4 7.8.85" stroke="var(--bg-base)" stroke-width="1.4" fill="none" stroke-linecap="round"></path>
      <path d="M7.6 16.1c2-.55 4.5-.3 6.2.7" stroke="var(--bg-base)" stroke-width="1.2" fill="none" stroke-linecap="round"></path>
    </svg>`,

  youtube: `
    <svg viewBox="0 0 24 24">
      <rect x="2" y="5.5" width="20" height="13" rx="4"></rect>
      <polygon points="10.5 9 15.5 12 10.5 15" fill="var(--bg-base)" stroke="none"></polygon>
    </svg>`
};

/* ================================================================
   02. UTIL UMUM
================================================================ */
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

/** Ambil nilai dari window.VinzKey dengan aman walau belum lengkap diisi */
function getConfig(path, fallback = "") {
  const parts = path.split(".");
  let value = window.VinzKey || {};
  for (const part of parts) {
    value = value?.[part];
  }
  return value || fallback;
}

/* ================================================================
   03. RENDER IKON
================================================================ */
function renderIcons(root = document) {
  qsa("[data-icon]", root).forEach((el) => {
    const name = el.getAttribute("data-icon");
    if (!name || el.querySelector("svg") || !ICONS[name]) return;
    el.innerHTML = ICONS[name].trim();
  });
}

/* ================================================================
   04. TOAST / NOTIFIKASI
================================================================ */
const toastContainer = () => qs("#toastContainer");

function showToast({ type = "success", title = "", message = "", duration = 4200 } = {}) {
  const container = toastContainer();
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;

  const iconName = type === "error" ? "alert-circle" : "check";
  toast.innerHTML = `
    <span class="toast-icon" data-icon="${iconName}"></span>
    <div class="toast-body">
      ${title ? `<p class="toast-title">${escapeHtml(title)}</p>` : ""}
      ${message ? `<p class="toast-message">${escapeHtml(message)}</p>` : ""}
    </div>
  `;

  container.appendChild(toast);
  renderIcons(toast);

  const remove = () => {
    toast.classList.add("is-leaving");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
  };

  const timer = setTimeout(remove, duration);
  toast.addEventListener("click", () => {
    clearTimeout(timer);
    remove();
  });
}

/* ================================================================
   05. TAHUN FOOTER
================================================================ */
function setFooterYear() {
  const el = qs("#year");
  if (el) el.textContent = new Date().getFullYear();
}

/* ================================================================
   06. MENU MOBILE
================================================================ */
function initMobileMenu() {
  const toggle = qs("#menuToggle");
  const nav = qs(".site-nav");
  if (!toggle || !nav) return;

  const close = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(e.target) || toggle.contains(e.target)) return;
    close();
  });

  qsa(".nav-link", nav).forEach((link) => link.addEventListener("click", close));

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

/* ================================================================
   07. RIPPLE EFEK TOMBOL
================================================================ */
function initRipple() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-glass, .btn-circle, .platform-card");
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    btn.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  });
}

/* ================================================================
   08. SPOTLIGHT KARTU (ikuti kursor)
================================================================ */
function initCardSpotlight() {
  qsa(".platform-card, .pricing-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });
  });
}

/* ================================================================
   09. PANGGILAN API (VinzKey.js)
   ----------------------------------------------------------------
   Satu fungsi dipakai semua tool: susun URL dari gateway + apikey
   di VinzKey.js, fetch, lalu validasi status-nya. neoxr & botcahx
   sama-sama pakai field "status" di level atas untuk menandai
   gagal/berhasil.
================================================================ */
async function callApi(gatewayName, path, params = {}) {
  const gw = window.VinzKey?.gateway?.[gatewayName];
  if (!gw?.base || !gw?.apikey) {
    throw new Error(`Gateway "${gatewayName}" belum dikonfigurasi di VinzKey.js.`);
  }

  const query = new URLSearchParams({ ...params, apikey: gw.apikey });
  const res = await fetch(`${gw.base}${path}?${query.toString()}`);

  if (!res.ok) {
    throw new Error(`Permintaan gagal (${res.status}).`);
  }

  const json = await res.json();

  if (json.status === false || json.result?.status === false) {
    throw new Error(json.msg || json.message || "Permintaan ditolak oleh API.");
  }

  return json;
}

/* ================================================================
   10. TEMPLATE HASIL
   ----------------------------------------------------------------
   Fungsi murni: terima data yang sudah diparsing, kembalikan HTML.
   Semua ikon di dalamnya (data-icon) dirender ulang oleh pemanggil
   lewat renderIcons() setelah HTML ini disisipkan ke DOM.
================================================================ */

/** Satu thumbnail + caption + beberapa tombol unduh (TikTok, SnackVideo,
    RedNote, Spotify Download) */
function renderMediaResult({ thumb = "", caption = "", subtext = "", actions = [] }) {
  const validActions = actions.filter((a) => a && a.url);

  return `
    <div class="result-panel">
      <div class="result-content">
        ${
          thumb
            ? `<div class="result-thumb"><img src="${escapeHtml(thumb)}" alt="" loading="lazy" /></div>`
            : ""
        }
        <div class="result-info">
          ${caption ? `<p class="result-caption">${escapeHtml(caption)}</p>` : ""}
          ${subtext ? `<p class="result-caption">${escapeHtml(subtext)}</p>` : ""}
          <div class="result-actions">
            ${validActions
              .map(
                (a) => `
              <button type="button" class="btn-glass" data-open-url="${escapeHtml(a.url)}">
                <span class="tag-format">${escapeHtml(a.format || "FILE")}</span>
                ${escapeHtml(a.label)}
              </button>`
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

/** Galeri gambar — Pinterest bisa balikin beberapa hasil sekaligus */
function renderGallery(items) {
  return `
    <div class="result-gallery">
      ${items
        .map(
          (item) => `
        <div class="result-gallery-item">
          <img src="${escapeHtml(item.url)}" alt="" loading="lazy" />
          <button type="button" data-open-url="${escapeHtml(item.url)}" aria-label="Unduh gambar">
            <span data-icon="download" aria-hidden="true"></span>
          </button>
        </div>`
        )
        .join("")}
    </div>
  `;
}

/** List media — Instagram bisa lebih dari satu file per postingan (carousel) */
function renderMediaList(items) {
  return `
    <div class="result-media-list">
      ${items
        .map(
          (item, i) => `
        <div class="result-media-item">
          <span class="result-media-item-label">
            <span class="tag-format">${item.type === "mp4" ? "Video" : "Foto"}</span>
            Media ${i + 1}
          </span>
          <button type="button" class="btn-glass" data-open-url="${escapeHtml(item.url)}">Unduh</button>
        </div>`
        )
        .join("")}
    </div>
  `;
}

/** List hasil pencarian Spotify — klik salah satu memicu Spotify Download
    (chain call) lewat handler di bagian 13 */
function renderSpotifySearchList(items) {
  return `
    <div class="result-list">
      ${items
        .map(
          (item) => `
        <div class="result-list-item">
          <img src="${escapeHtml(item.thumbnail || "")}" alt="" loading="lazy" />
          <div class="result-list-item-info">
            <p class="result-list-item-title">${escapeHtml(item.title || "")}</p>
            <p class="result-list-item-artist">
              ${escapeHtml(item.duration || "")}${item.popularity ? ` • ${escapeHtml(item.popularity)}` : ""}
            </p>
          </div>
          <button type="button" class="btn-glass" data-spotify-track="${escapeHtml(item.url || "")}">
            Unduh
          </button>
        </div>`
        )
        .join("")}
    </div>
  `;
}

/** Hasil YouTube — preview + tombol video (link sudah ada) + tombol audio
    (fetch on-demand pas diklik, lihat bagian 13) */
function renderYoutubeResult(json, d, sourceUrl) {
  return `
    <div class="result-panel">
      <div class="result-content">
        <div class="result-thumb result-thumb--square">
          <img src="${escapeHtml(json.thumbnail || "")}" alt="" loading="lazy" />
        </div>
        <div class="result-info">
          <p class="result-title">${escapeHtml(json.title || "")}</p>
          <p class="result-caption">
            ${escapeHtml(json.channel || "")}${json.duration ? ` • ${escapeHtml(json.duration)}` : ""}
          </p>
          <div class="result-actions">
            <button type="button" class="btn-glass" data-open-url="${escapeHtml(d.url || "")}">
              <span class="tag-format">${escapeHtml(d.quality || "MP4")}</span>
              Unduh Video
            </button>
            <button
              type="button"
              class="btn-glass"
              data-yt-audio="true"
              data-yt-source-url="${escapeHtml(sourceUrl || "")}"
            >
              <span class="tag-format">MP3</span>
              Unduh Audio
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ================================================================
   11. DEFINISI TOOLS PER PLATFORM
   ----------------------------------------------------------------
   Field yang dibaca dari tiap respons ini SUDAH dicek langsung dari
   contoh JSON yang dikasih (bukan tebakan), kecuali RedNote yang
   ditandai jelas di bawah.
================================================================ */
const TOOLS = {
  pinterest: {
    title: "Pinterest",
    placeholder: "Tempel link pin Pinterest...",
    submitLabel: "Ambil Gambar",
    hint: "Contoh: https://id.pinterest.com/pin/xxxxxxxxxxxxx/",
    handler: async (url) => {
      // Respons: { status, data: [{ url, width, height }, ...] }
      const json = await callApi("neoxr", "/pin", { url });
      const items = json.data || [];
      if (!items.length) throw new Error("Gambar tidak ditemukan.");
      return renderGallery(items);
    }
  },

  tiktok: {
    title: "TikTok",
    placeholder: "Tempel link video TikTok...",
    submitLabel: "Unduh",
    hint: "Contoh: https://www.tiktok.com/@user/video/xxxxxxxxxxxxxxx",
    handler: async (url) => {
      // Respons: { status, data: { caption, video, videoWM, audio, music:{cover}, author:{avatar_thumb} } }
      const json = await callApi("neoxr", "/tiktok", { url });
      const d = json.data || {};
      const thumb = d.music?.cover || d.author?.avatar_thumb?.url_list?.[0] || "";

      return renderMediaResult({
        thumb,
        caption: d.caption || "",
        actions: [
          { label: "Unduh Video", format: "MP4", url: d.video },
          { label: "Unduh Video (Watermark)", format: "MP4", url: d.videoWM },
          { label: "Unduh Audio", format: "MP3", url: d.audio }
        ]
      });
    }
  },

  instagram: {
    title: "Instagram",
    placeholder: "Tempel link postingan Instagram...",
    submitLabel: "Ambil Media",
    hint: "Contoh: https://www.instagram.com/p/xxxxxxxxxxx — mendukung lebih dari 1 file (carousel).",
    handler: async (url) => {
      // Respons: { status, data: [{ type: "mp4"|..., url }, ...] }
      const json = await callApi("neoxr", "/ig", { url });
      const items = json.data || [];
      if (!items.length) throw new Error("Media tidak ditemukan.");
      return renderMediaList(items);
    }
  },

  snackvideo: {
    title: "SnackVideo",
    placeholder: "Tempel link video SnackVideo...",
    submitLabel: "Unduh",
    hint: "Contoh: https://sck.io/p/xxxxxxxx",
    handler: async (url) => {
      // Respons: { status, data: { thumbnail: [url], author, caption, url } }
      const json = await callApi("neoxr", "/snackvid", { url });
      const d = json.data || {};

      return renderMediaResult({
        thumb: Array.isArray(d.thumbnail) ? d.thumbnail[0] : d.thumbnail || "",
        caption: d.caption || "",
        subtext: d.author ? `oleh ${d.author}` : "",
        actions: [{ label: "Unduh Video", format: "MP4", url: d.url }]
      });
    }
  },

  youtube: {
  title: "YouTube",
  placeholder: "Tempel link video YouTube...",
  submitLabel: "Proses",
  hint: "Pilih resolusi video. Resolusi 1080p+ khusus akun Pro (1440p & 2160p dalam pengujian).",
  
  // Array resolusi untuk ditampilkan pada <select> / Dropdown UI
  qualities: [
    { value: "140p",  label: "140p",                  proOnly: false, disabled: false },
    { value: "240p",  label: "240p",                  proOnly: false, disabled: false },
    { value: "360p",  label: "360p",                  proOnly: false, disabled: false },
    { value: "480p",  label: "480p",                  proOnly: false, disabled: false },
    { value: "720p",  label: "720p (Default)",        proOnly: false, disabled: false },
    { value: "1080p", label: "1080p (Khusus Pro)",     proOnly: true,  disabled: false },
    { value: "1440p", label: "1440p 2K (Dalam Pengujian)", proOnly: true, disabled: true },
    { value: "2160p", label: "2160p 4K (Dalam Pengujian)", proOnly: true, disabled: true }
  ],

  /**
   * Handler untuk memproses download
   * @param {string} url - URL Video Youtube
   * @param {string} quality - Pilihan kualitas (default: '720p')
   * @param {boolean|string} userPlan - Status plan user ('pro' / 'pelajar' atau boolean isPro)
   */
  handler: async (url, quality = "720p", userPlan = "pelajar") => {
    // 1. Cek resolusi yang sedang dalam tahap pengujian (1440p & 2160p)
    const underTesting = ["1440p", "2160p"];
    if (underTesting.includes(quality)) {
      throw new Error(`Resolusi ${quality} saat ini sedang dalam tahap pengujian dan belum bisa digunakan.`);
    }

    // 2. Cek resolusi Khusus Pro (1080p, 1440p, 2160p)
    const proQualities = ["1080p", "1440p", "2160p"];
    const isProUser = userPlan === "pro" || userPlan === true || (typeof isPro !== "undefined" && isPro);

    if (proQualities.includes(quality) && !isProUser) {
      throw new Error(`Resolusi ${quality} khusus untuk member Pro. Silakan tingkatkan paket langgananmu!`);
    }

    // 3. Panggil API dengan parameter kualitas yang dipilih
    // Respons: { title, thumbnail, channel, duration, data: { quality, url } }
    const json = await callApi("neoxr", "/youtube", { 
      url, 
      type: "video", 
      quality: quality 
    });

    const d = json.data || {};
    if (!d.url) throw new Error("Video tidak ditemukan / URL tidak valid.");
    
    return renderYoutubeResult(json, d, url);
  }
},

  rednote: {
    title: "RedNote",
    placeholder: "Tempel link postingan RedNote...",
    submitLabel: "Unduh",
    hint: "Contoh: http://xhslink.com/o/xxxxxxxx — bentuk respons API ini belum ada contohnya, jadi field di bawah ditebak dari pola endpoint sejenis. Cek console kalau hasilnya kosong.",
    handler: async (url) => {
      // Endpoint ada di URL_Apikey.js tapi contoh respons TIDAK dikasih.
      // Coba beberapa kemungkinan bentuk field yang umum dipakai gateway
      // botcahx (mengikuti pola respons Spotify Download di atas).
      const json = await callApi("botcahx", "/download/rednote", { url });
      const d = json.result?.data || json.data || {};
      const mediaUrl = d.url || d.video || d.video_url || "";

      if (!mediaUrl) {
        console.info("[VinzHosting] Respons RedNote:", json);
        throw new Error("Field link unduhan tidak ketemu di respons. Cek console lalu sesuaikan TOOLS.rednote di script.js.");
      }

      return renderMediaResult({
        thumb: d.thumbnail || d.cover || "",
        caption: d.caption || d.title || "",
        actions: [{ label: "Unduh", format: "FILE", url: mediaUrl }]
      });
    }
  },

  spotifyDownload: {
    title: "Spotify — Link Download",
    placeholder: "Tempel link lagu Spotify...",
    submitLabel: "Unduh",
    hint: "Contoh: https://open.spotify.com/track/xxxxxxxxxxxx",
    handler: async (url) => {
      // Respons: { result: { data: { thumbnail, title, artist, duration, url } } }
      const json = await callApi("botcahx", "/download/spotify2", { url });
      const d = json.result?.data || {};
      if (!d.url) throw new Error("Lagu tidak ditemukan.");

      return renderMediaResult({
        thumb: d.thumbnail || "",
        caption: d.title || "",
        subtext: d.artist || "",
        actions: [{ label: "Unduh MP3", format: "MP3", url: d.url }]
      });
    }
  },

  spotifySearch: {
    title: "Spotify — Search",
    placeholder: "Judul lagu atau nama artis...",
    submitLabel: "Cari",
    inputType: "text",
    hint: "Ketik judul lagu, lalu pilih salah satu hasil untuk langsung diunduh.",
    handler: async (query) => {
      // Respons: { data: [{ thumbnail, title, duration, popularity, url }, ...] }
      const json = await callApi("neoxr", "/spotify-search", { q: query });
      const items = json.data || [];
      if (!items.length) throw new Error("Lagu tidak ditemukan.");
      return renderSpotifySearchList(items);
    }
  }
};

/* ================================================================
   12. MODAL ALAT UNDUH (buka/tutup/submit)
   ----------------------------------------------------------------
   Satu shell (#toolModal) dipakai bergantian untuk semua platform —
   isinya diganti total setiap kali dibuka lewat toolKey.
================================================================ */
function openToolModal(toolKey) {
  const tool = TOOLS[toolKey];
  const overlay = qs("#toolModal");
  const body = qs("#toolModalBody");
  if (!tool || !overlay || !body) return;

  qs("#toolModalTitle").textContent = tool.title;

  body.innerHTML = `
    <form class="platform-form" data-tool-form="${toolKey}">
      <label class="sr-only" for="toolInput">${escapeHtml(tool.title)}</label>
      <input
        id="toolInput"
        type="${tool.inputType === "text" ? "text" : "url"}"
        placeholder="${escapeHtml(tool.placeholder)}"
        required
      />
      <button type="submit" class="btn-glass">${escapeHtml(tool.submitLabel)}</button>
    </form>
    ${tool.hint ? `<p class="tool-hint">${escapeHtml(tool.hint)}</p>` : ""}
    <div class="tool-result"></div>
  `;

  qs("[data-tool-form]", body).addEventListener("submit", (e) => handleToolSubmit(e, toolKey));

  overlay.hidden = false;
  overlay.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => overlay.classList.add("is-open"));
  document.body.style.overflow = "hidden";

  qs("#toolInput", body)?.focus({ preventScroll: true });
}

function closeToolModal() {
  const overlay = qs("#toolModal");
  if (!overlay) return;

  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  setTimeout(() => {
    overlay.hidden = true;
    qs("#toolModalBody").innerHTML = "";
  }, 260);
}

async function handleToolSubmit(e, toolKey) {
  e.preventDefault();
  const tool = TOOLS[toolKey];
  const form = e.currentTarget;
  const input = qs("input", form);
  const value = input.value.trim();
  const resultBox = qs(".tool-result", form.parentElement);
  if (!tool || !resultBox) return;

  resultBox.innerHTML = `
    <div class="result-loading">
      <span class="spinner"></span>
      <span>Memproses...</span>
    </div>
  `;

  try {
    const html = await tool.handler(value);
    resultBox.innerHTML = html;
    renderIcons(resultBox);
  } catch (err) {
    resultBox.innerHTML = `<p class="result-error">${escapeHtml(err.message || "Terjadi kesalahan.")}</p>`;
  }
}

function initToolModal() {
  const overlay = qs("#toolModal");
  const closeBtn = qs("#toolModalClose");
  if (!overlay || !closeBtn) return;

  closeBtn.addEventListener("click", closeToolModal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeToolModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) closeToolModal();
  });
}

/** Tombol yang membuka modal: kotak platform + 2 pilihan popover Spotify */
function initToolButtons() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest('[data-action="open-tool"]');
    if (!btn) return;

    const key = btn.dataset.tool;
    if (!TOOLS[key]) return;
    openToolModal(key);
  });
}

/* ================================================================
   13. AKSI DI DALAM HASIL
   ----------------------------------------------------------------
   Delegasi satu listener untuk semua tombol hasil, karena isi modal
   selalu diganti lewat innerHTML (listener langsung akan hilang).
================================================================ */
function initToolResultActions() {
  document.addEventListener("click", async (e) => {
    /* Tombol unduh biasa: langsung buka link filenya */
    const openBtn = e.target.closest("[data-open-url]");
    if (openBtn) {
      const url = openBtn.dataset.openUrl;
      if (!url) {
        showToast({ type: "error", title: "Tidak tersedia", message: "Tautan untuk item ini kosong dari API." });
        return;
      }
      window.open(url, "_blank", "noopener");
      return;
    }

    /* Item hasil pencarian Spotify: chain ke Spotify Download dulu
       sebelum bisa dibuka linknya */
    const trackBtn = e.target.closest("[data-spotify-track]");
    if (trackBtn) {
      const trackUrl = trackBtn.dataset.spotifyTrack;
      const originalLabel = trackBtn.textContent;
      trackBtn.disabled = true;
      trackBtn.textContent = "Memproses...";

      try {
        const json = await callApi("botcahx", "/download/spotify2", { url: trackUrl });
        const d = json.result?.data || {};
        if (!d.url) throw new Error("Link unduhan tidak ditemukan.");
        window.open(d.url, "_blank", "noopener");
        showToast({ type: "success", title: "Siap diunduh", message: d.title || "" });
      } catch (err) {
        showToast({ type: "error", title: "Gagal mengunduh", message: err.message || "Terjadi kesalahan." });
      } finally {
        trackBtn.disabled = false;
        trackBtn.textContent = originalLabel;
      }
      return;
    }

    /* Tombol "Unduh Audio" di hasil YouTube: fetch on-demand dengan
       type=audio, baru dibuka linknya */
    const audioBtn = e.target.closest("[data-yt-audio]");
    if (audioBtn) {
      const sourceUrl = audioBtn.dataset.ytSourceUrl;
      const originalHtml = audioBtn.innerHTML;
      audioBtn.disabled = true;
      audioBtn.innerHTML = `<span class="tag-format">MP3</span> Memproses...`;

      try {
        const json = await callApi("neoxr", "/youtube", { url: sourceUrl, type: "audio", quality: "128kbps" });
        const d = json.data || {};
        if (!d.url) throw new Error("Link audio tidak ditemukan.");
        window.open(d.url, "_blank", "noopener");
      } catch (err) {
        showToast({ type: "error", title: "Gagal mengunduh audio", message: err.message || "Terjadi kesalahan." });
      } finally {
        audioBtn.disabled = false;
        audioBtn.innerHTML = originalHtml;
      }
    }
  });
}

/* ================================================================
   14. TOMBOL LINK BIASA (Langganan)
   ----------------------------------------------------------------
   Cuma dipakai 2 tombol "Pilih Paket" di section Langganan — baca
   dari VinzKey.links (bukan API).
================================================================ */
function initLinkButtons() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest('[data-action="open-link"]');
    if (!btn) return;

    const key = btn.dataset.linkKey;
    const href = getConfig(`links.${key}`);

    if (!href || href === "#") {
      showToast({
        type: "error",
        title: "Link belum diisi",
        message: `Isi VinzKey.links.${key} dulu di VinzKey.js.`
      });
      return;
    }

    window.open(href, "_blank", "noopener");
  });
}

/* ================================================================
   15. POPOVER SPOTIFY (Link Download / Search)
   ----------------------------------------------------------------
   Kotak Spotify tidak langsung buka modal — klik dulu membuka
   popover kecil berisi 2 pilihan. Masing-masing tombolnya sudah
   pakai data-action="open-tool" (ditangani initToolButtons), popover
   ini cuma urus buka/tutup + animasi chevron di pojok kotak.
================================================================ */
function initSpotifyPopover() {
  const trigger = qs("#spotifyTileBtn");
  const popover = qs('[data-popover="spotify"]');
  if (!trigger || !popover) return;

  const close = () => {
    popover.classList.remove("is-open");
    popover.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  };

  const open = () => {
    popover.hidden = false;
    requestAnimationFrame(() => popover.classList.add("is-open"));
    trigger.setAttribute("aria-expanded", "true");
  };

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = trigger.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      close();
    } else {
      open();
    }
  });

  document.addEventListener("click", (e) => {
    if (popover.hidden) return;
    if (popover.contains(e.target) || trigger.contains(e.target)) return;
    close();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  qsa(".spotify-popover-link", popover).forEach((link) => {
    link.addEventListener("click", close);
  });
}

/* ================================================================
   16. PENGECEKAN KONFIGURASI
================================================================ */
function warnUnconfiguredLinks() {
  const links = window.VinzKey?.links || {};
  const missing = Object.entries(links)
    .filter(([, value]) => !value || value === "#")
    .map(([key]) => key);

  if (missing.length) {
    console.info(
      `[VinzHosting] Link belum diisi untuk: ${missing.join(", ")}. ` +
        `Isi VinzKey.links di VinzKey.js.`
    );
  }

  if (!window.VinzKey?.gateway?.neoxr?.apikey || !window.VinzKey?.gateway?.botcahx?.apikey) {
    console.warn("[VinzHosting] Gateway di VinzKey.js belum lengkap — cek window.VinzKey.gateway.");
  }
}

/* ================================================================
   17. INISIALISASI
================================================================ */
function initApp() {
  renderIcons();
  setFooterYear();

  initMobileMenu();
  initRipple();
  initCardSpotlight();

  initToolModal();
  initToolButtons();
  initToolResultActions();

  initLinkButtons();
  initSpotifyPopover();

  warnUnconfiguredLinks();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
