import { CONFIG, DEFAULT_ASSETS } from './config.js';
import { renderMarket } from './market.js';
import { initAdmin } from './admin.js';
import { initChart } from './chart.js';

/**
 * NGR COMPANY - CUSTOM MODAL ENGINE v7.0 (NO NATIVE POPUPS)
 * ---------------------------------------------------------
 * Этот код полностью заменяет стандартные окна Telegram на 
 * кастомные дизайнерские решения NGR Company.
 */

class NGRApp {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.chartEngine = null;
        this.state = {
            user: null,
            assets: [...DEFAULT_ASSETS],
            balance: { coins: 5000, stars: 100 },
            isLoaded: false,
            activeModal: null
        };
        
        this.systemLogs = [];
        this.init();
    }

    log(message, type = 'INFO') {
        const entry = `[${new Date().toLocaleTimeString()}] [${type}] ${message}`;
        this.systemLogs.push(entry);
        console.log(entry);
    }

    async init() {
        try {
            this.tg.expand();
            this.tg.ready();
            this.tg.headerColor = '#050a12';

            this.state.user = this.tg.initDataUnsafe?.user || { 
                id: 8309273796, 
                first_name: 'NGR Founder'
            };

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.boot());
            } else {
                this.boot();
            }
        } catch (e) { this.log(e.message, 'ERROR'); }
    }

    boot() {
        this.renderInterface();
        this.initializeModules();
        this.initNGRSystems(); // Инициализация кастомных окон и уведомлений
        this.state.isLoaded = true;
    }

    initializeModules() {
        try { this.chartEngine = initChart('chart-container'); } catch (e) {}
        const adminBox = document.getElementById('admin-container');
        if (adminBox) initAdmin(adminBox, this.state.user.id, CONFIG.adminIds);
        const marketBox = document.getElementById('market-grid');
        if (marketBox) renderMarket(marketBox, this.state.assets);
    }

    renderInterface() {
        const nameElem = document.getElementById('user-name');
        if (nameElem) nameElem.innerText = this.state.user.first_name;
        this.syncBalance();
        this.injectTerminalStyles();
    }

    syncBalance() {
        const box = document.getElementById('user-balance');
        if (box) {
            box.innerHTML = `
                <div class="balance-row main">💰 <span>${this.state.balance.coins.toLocaleString()}</span> NGRC</div>
                <div class="balance-row sub">⭐ <span>${this.state.balance.stars}</span> Stars</div>
            `;
        }
    }

    // =========================================================
    // СИСТЕМА КАСТОМНЫХ ОКНО NGR (ЗАМЕНА TELEGRAM)
    // =========================================================
    initNGRSystems() {
        // Создаем контейнер для тостов (уведомлений)
        const tContainer = document.createElement('div');
        tContainer.id = 'ngr-toast-manager';
        document.body.appendChild(tContainer);

        // Создаем контейнер для модальных окон (подтверждение покупки)
        const mContainer = document.createElement('div');
        mContainer.id = 'ngr-modal-overlay';
        mContainer.className = 'hidden';
        mContainer.innerHTML = `
            <div class="ngr-modal-window">
                <div class="modal-glow"></div>
                <h3 id="modal-title">ПОДТВЕРЖДЕНИЕ</h3>
                <p id="modal-text"></p>
                <div class="modal-actions">
                    <button id="modal-cancel" class="m-btn secondary">ОТМЕНА</button>
                    <button id="modal-confirm" class="m-btn primary">ПОДТВЕРДИТЬ</button>
                </div>
            </div>
        `;
        document.body.appendChild(mContainer);

        // Функции глобального доступа
        window.showNGRToast = (msg) => {
            const t = document.createElement('div');
            t.className = 'ngr-toast-v7';
            t.innerText = msg;
            tContainer.appendChild(t);
            setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 500); }, 2500);
        };

        window.showNGRConfirm = (title, text, onConfirm) => {
            const overlay = document.getElementById('ngr-modal-overlay');
            document.getElementById('modal-title').innerText = title;
            document.getElementById('modal-text').innerText = text;
            overlay.classList.remove('hidden');
            
            const confirmBtn = document.getElementById('modal-confirm');
            const cancelBtn = document.getElementById('modal-cancel');
            
            const close = () => { overlay.classList.add('hidden'); };
            
            confirmBtn.onclick = () => { onConfirm(); close(); };
            cancelBtn.onclick = () => { close(); };
        };
    }

    injectTerminalStyles() {
        if (document.getElementById('v7-core-css')) return;
        const s = document.createElement('style');
        s.id = 'v7-core-css';
        s.innerHTML = `
            .hidden { display: none !important; }
            
            /* ТОСТЫ (ВЕРХНИЕ УВЕДОМЛЕНИЯ) */
            #ngr-toast-manager { position: fixed; top: 15px; width: 100%; display: flex; flex-direction: column; align-items: center; z-index: 10000; pointer-events: none; }
            .ngr-toast-v7 { 
                background: rgba(255, 204, 0, 0.95); color: #000; padding: 10px 20px; border-radius: 50px; 
                font-weight: 900; font-size: 12px; margin-bottom: 8px; animation: toastIn 0.3s ease-out;
            }
            .ngr-toast-v7.out { opacity: 0; transform: translateY(-20px); transition: 0.5s; }
            @keyframes toastIn { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

            /* МОДАЛЬНОЕ ОКНО (ВМЕСТО TELEGRAM) */
            #ngr-modal-overlay { 
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
                display: flex; align-items: center; justify-content: center; z-index: 9999;
            }
            .ngr-modal-window { 
                width: 85%; background: #0b1422; border: 1px solid #ffcc00; border-radius: 24px; 
                padding: 25px; text-align: center; position: relative; overflow: hidden;
                box-shadow: 0 0 30px rgba(255,204,0,0.1);
            }
            #modal-title { color: #ffcc00; font-weight: 900; margin-bottom: 10px; font-size: 18px; }
            #modal-text { color: #8a9ab0; font-size: 14px; line-height: 1.5; margin-bottom: 25px; }
            .modal-actions { display: flex; gap: 10px; }
            .m-btn { flex: 1; padding: 14px; border-radius: 14px; border: none; font-weight: 900; font-size: 13px; cursor: pointer; }
            .m-btn.primary { background: #ffcc00; color: #000; }
            .m-btn.secondary { background: #1e2a3a; color: #fff; }
        `;
        document.head.appendChild(s);
    }
}

window.NGR = new NGRApp();

// ГЛОБАЛЬНАЯ ФУНКЦИЯ ПОКУПКИ - ПОЛНОСТЬЮ КАСТОМНАЯ
window.buy = (id, method, price) => {
    const tg = window.Telegram.WebApp;
    tg.HapticFeedback.impactOccurred('medium');

    const symbol = method === 'stars' ? '⭐' : '💰';
    
    // ВЫЗЫВАЕМ НАШЕ ОКНО ВМЕСТО TG.SHOWCONFIRM
    window.showNGRConfirm(
        "ПОДТВЕРЖДЕНИЕ NGR", 
        `Вы уверены, что хотите приобрести ${id.toUpperCase()} за ${price} ${symbol}?`,
        () => {
            // Если нажали "ПОДТВЕРДИТЬ"
            tg.HapticFeedback.notificationOccurred('success');
            window.showNGRToast("ТРАНЗАКЦИЯ УСПЕШНО ОТПРАВЛЕНА");
            console.log("NGR_FINAL_TRANSACTION", {id, method, price});
        }
    );
};

