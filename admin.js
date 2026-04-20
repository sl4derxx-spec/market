/**
 * ============================================================================
 * NGR COMPANY - INDUSTRIAL ADMIN CORE v12.0.9
 * FOUNDER: ALIZHAN | LOCATION: KOSTANAY
 * ----------------------------------------------------------------------------
 * ВЕС ФАЙЛА: 7.5+ KB (FULL INDUSTRIAL BUILD)
 * СТАТУС: ИСПРАВЛЕНА БЛОКИРОВКА ИНТЕРФЕЙСА
 * ============================================================================
 */

import { CONFIG } from './config.js';

const tg = window.Telegram.WebApp;

export function initAdmin(container, userId, adminList) {
    // ЖЕСТКАЯ ПРОВЕРКА ДОСТУПА
    if (!adminList.includes(userId)) {
        console.log("[NGR_SECURITY] Access Denied for UID:", userId);
        return;
    }

    const adminWrapper = document.createElement('div');
    adminWrapper.className = 'admin-panel-v2';
    adminWrapper.id = 'ngr-admin-interface';
    
    // РАСШИРЕННЫЙ ИНТЕРФЕЙС УПРАВЛЕНИЯ
    adminWrapper.innerHTML = `
        <div class="admin-header">
            <div class="title-group">
                <span class="blink-dot"></span>
                <h4>NGR_SYSTEM_CONTROL</h4>
            </div>
            <div class="sys-badge">OS v12.0.9</div>
        </div>
        
        <div class="admin-nav">
            <button class="nav-btn active" data-target="mkt">MARKET</button>
            <button class="nav-btn" data-target="usr">USERS</button>
            <button class="nav-btn" data-target="cfg">CONFIG</button>
        </div>

        <div class="admin-grid">
            <div class="adm-card" id="op-new-ngt">
                <div class="card-icon">🚀</div>
                <div class="card-label">CREATE NGT</div>
            </div>
            <div class="adm-card danger" id="op-pump">
                <div class="card-icon">📈</div>
                <div class="card-label">MARKET PUMP</div>
            </div>
            <div class="adm-card danger" id="op-dump">
                <div class="card-icon">📉</div>
                <div class="card-label">MARKET DUMP</div>
            </div>
            <div class="adm-card" id="op-stats">
                <div class="card-icon">📊</div>
                <div class="card-label">STATISTICS</div>
            </div>
        </div>

        <div class="terminal-mini-logs" id="admin-logs">
            [SYS] SESSION_STARTED: AUTH_SUCCESS
        </div>
    `;

    container.appendChild(adminWrapper);

    // ПОДКЛЮЧАЕМ ЛОГИКУ И СТИЛИ
    attachAdminEvents();
    injectAdminStyles();
}

function attachAdminEvents() {
    // Памп рынка
    document.getElementById('op-pump')?.addEventListener('click', (e) => {
        e.stopPropagation();
        tg.HapticFeedback.impactOccurred('heavy');
        addAdminLog("INITIATING MARKET PUMP...");
        if(window.showNGRToast) window.showNGRToast("MARKET PUMPED +15%");
    });

    // Дамп рынка
    document.getElementById('op-dump')?.addEventListener('click', (e) => {
        e.stopPropagation();
        tg.HapticFeedback.impactOccurred('warning');
        addAdminLog("INITIATING MARKET DUMP...");
        if(window.showNGRToast) window.showNGRToast("MARKET DUMPED -10%");
    });

    // Создание актива
    document.getElementById('op-new-ngt')?.addEventListener('click', (e) => {
        e.stopPropagation();
        tg.HapticFeedback.impactOccurred('medium');
        openNGRModal("ASSET_CREATOR_V2");
    });
}

function addAdminLog(msg) {
    const logs = document.getElementById('admin-logs');
    if (logs) {
        const time = new Date().toLocaleTimeString();
        logs.innerHTML = `[${time}] ${msg}<br>` + logs.innerHTML;
    }
}

function openNGRModal(type) {
    // Сначала удаляем старый, если он завис
    const existing = document.getElementById('ngr-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'ngr-overlay';
    
    overlay.innerHTML = `
        <div class="ngr-modal">
            <div class="modal-header">
                <span>[SYSTEM_AUTH]</span>
                <button id="modal-close-x">×</button>
            </div>
            <div class="modal-body">
                <p>ACCESSING MODULE: <b>${type}</b></p>
                <div class="loading-line"></div>
                <p style="font-size: 9px; color: #5c6b7f;">Синхронизация с серверами NGR Company в Костанае...</p>
            </div>
            <button class="modal-confirm" id="modal-confirm-btn">CONFIRM_ENTRY</button>
        </div>
    `;

    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    document.getElementById('modal-close-x').onclick = close;
    document.getElementById('modal-confirm-btn').onclick = close;
    overlay.onclick = (e) => { if(e.target === overlay) close(); };
}

function injectAdminStyles() {
    if (document.getElementById('admin-heavy-styles')) return;
    const s = document.createElement('style');
    s.id = 'admin-heavy-styles';
    s.innerHTML = `
        .admin-panel-v2 { background: #0b1422; border-radius: 20px; padding: 18px; margin-bottom: 20px; border: 1px solid rgba(255,204,0,0.15); }
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .title-group { display: flex; align-items: center; gap: 8px; }
        .title-group h4 { margin: 0; font-size: 13px; color: #ffcc00; letter-spacing: 1px; }
        .blink-dot { width: 6px; height: 6px; background: #00ff88; border-radius: 50%; box-shadow: 0 0 8px #00ff88; animation: blink 1s infinite; }
        .sys-badge { font-size: 8px; color: #5c6b7f; border: 1px solid #1e2a3a; padding: 2px 6px; border-radius: 4px; }
        
        .admin-nav { display: flex; gap: 6px; margin-bottom: 15px; }
        .nav-btn { flex: 1; background: #152233; border: none; color: #8a9ab0; padding: 10px; border-radius: 10px; font-size: 9px; font-weight: 900; }
        .nav-btn.active { background: #ffcc00; color: #000; }

        .admin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .adm-card { background: #111e30; border: 1px solid rgba(255,255,255,0.05); padding: 15px; border-radius: 15px; text-align: center; cursor: pointer; }
        .adm-card:active { transform: scale(0.96); }
        .adm-card.danger { border-bottom: 2px solid #ff4444; }
        .card-icon { font-size: 20px; margin-bottom: 5px; }
        .card-label { font-size: 9px; font-weight: 900; color: #fff; }

        .terminal-mini-logs { margin-top: 15px; background: #050a12; padding: 10px; border-radius: 8px; font-family: monospace; font-size: 8px; color: #00ff88; height: 40px; overflow-y: hidden; border-left: 2px solid #1e2a3a; }

        #ngr-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 99999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
        .ngr-modal { background:

