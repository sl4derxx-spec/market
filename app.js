import { CONFIG, DEFAULT_ASSETS } from './config.js';
import { renderMarket } from './market.js';
import { initAdmin } from './admin.js';
import { initChart } from './chart.js';

/**
 * NGR COMPANY - TERMINAL CORE SYSTEM v6.0 (HEAVY EDITION)
 * -------------------------------------------------------
 * Архитектура: Single State Management (SSM)
 * Разработчик: Алижан (NGR Founder)
 * Описание: Глобальный узел управления. Добавлена система кастомных тостов
 * и расширенный лог транзакций для веса файла и стабильности.
 */

class NGRApp {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.chartEngine = null;
        this.state = {
            user: null,
            assets: [...DEFAULT_ASSETS],
            balance: { coins: 250, stars: 15 },
            activeAsset: 'ngr',
            marketStatus: 'stable',
            isLoaded: false,
            lastUpdate: Date.now(),
            version: "6.0.4 PRO"
        };
        
        this.systemLogs = [];
        this.init();
    }

    log(message, type = 'INFO') {
        const entry = `[${new Date().toLocaleTimeString()}] [${type}] ${message}`;
        this.systemLogs.push(entry);
        console.log(entry);
        if (this.systemLogs.length > 200) this.systemLogs.shift();
    }

    async init() {
        this.log("NGR Core System Initializing Heavy Modules...");
        
        try {
            this.tg.expand();
            this.tg.ready();
            this.tg.enableClosingConfirmation();
            this.tg.headerColor = '#050a12';
            this.tg.backgroundColor = '#050a12';

            this.applyTheme();

            this.state.user = this.tg.initDataUnsafe?.user || { 
                id: 8309273796, 
                first_name: 'NGR Boss',
                username: 'alizhan_ngr'
            };

            this.log(`User Authorized: ${this.state.user.first_name}`);

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.bootSequence());
            } else {
                this.bootSequence();
            }

        } catch (error) {
            this.log(`Critical Core Failure: ${error.message}`, 'ERROR');
            this.handleError("Core Init", error);
        }
    }

    bootSequence() {
        this.log("Starting Boot Sequence... Checking modules.");
        this.renderInterface();
        this.initializeModules();
        this.attachGlobalListeners();
        this.initCustomNotificationSystem(); // Новая мощная фича
        
        const loader = document.getElementById('ngr-preloader');
        if (loader) setTimeout(() => loader.classList.add('hidden'), 1000);

        this.state.isLoaded = true;
        this.log("NGR Terminal Engine 6.0 Online.");
    }

    initializeModules() {
        try {
            this.chartEngine = initChart('chart-container');
            this.log("Graphics Engine: Operational");
        } catch (e) {
            this.log("Graphics Engine: Failed to load", "WARN");
        }

        const adminBox = document.getElementById('admin-container');
        if (adminBox) {
            initAdmin(adminBox, this.state.user.id, CONFIG.adminIds);
            this.log("Admin Module: Initialized");
        }

        const marketBox = document.getElementById('market-grid');
        if (marketBox) {
            renderMarket(marketBox, this.state.assets);
            this.log("Market Engine: Rendered");
        }
    }

    renderInterface() {
        const ui = {
            name: document.getElementById('user-name'),
            photo: document.getElementById('user-photo'),
            balance: document.getElementById('user-balance')
        };

        if (ui.name) ui.name.innerText = this.state.user.first_name;
        if (ui.photo && this.state.user.photo_url) ui.photo.src = this.state.user.photo_url;

        this.syncBalance();
        this.injectGlobalStyles();
        this.injectAdvancedAnimations(); // Доп. КБ и красота
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

    // СИСТЕМА УВЕДОМЛЕНИЙ (ВМЕСТО КНОПКИ ЗАКРЫТЬ)
    initCustomNotificationSystem() {
        const toastContainer = document.createElement('div');
        toastContainer.id = 'ngr-toast-container';
        document.body.appendChild(toastContainer);
        
        window.showNGRToast = (message, type = 'success') => {
            const toast = document.createElement('div');
            toast.className = `ngr-toast ${type}`;
            toast.innerHTML = `
                <div class="toast-content">
                    <span class="toast-icon">${type === 'success' ? '✅' : '⚠️'}</span>
                    <span class="toast-msg">${message}</span>
                </div>
                <div class="toast-progress"></div>
            `;
            toastContainer.appendChild(toast);
            
            setTimeout(() => {
                toast.classList.add('fade-out');
                setTimeout(() => toast.remove(), 500);
            }, 3000);
        };
    }

    attachGlobalListeners() {
        document.body.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            this.tg.HapticFeedback.impactOccurred('light');
        });

        this.tg.onEvent('viewportChanged', (data) => {
            if (!data.isStateStable) this.log("Resizing UI...");
        });
    }

    applyTheme() {
        const theme = this.tg.themeParams;
        document.documentElement.style.setProperty('--ngr-accent', theme.button_color || '#ffcc00');
        document.documentElement.style.setProperty('--ngr-text', theme.text_color || '#ffffff');
    }

    handleError(ctx, err) {
        this.log(`Error in ${ctx}: ${err.message}`, 'ERROR');
        if (window.showNGRToast) window.showNGRToast(`${ctx}: ${err.message}`, 'error');
    }

    injectGlobalStyles() {
        if (document.getElementById('core-v6-styles')) return;
        const s = document.createElement('style');
        s.id = 'core-v6-styles';
        s.innerHTML = `
            .balance-row { transition: all 0.5s ease; text-shadow: 0 0 10px rgba(255,204,0,0.2); }
            #user-balance:active { transform: scale(0.95); }
            .hidden { display: none !important; }
            #app-wrapper { animation: fadeIn 0.8s ease-out; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            
            /* СТИЛИ ТОСТОВ (БЕЗ КНОПКИ ЗАКРЫТЬ) */
            #ngr-toast-container {
                position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                z-index: 9999; display: flex; flex-direction: column; gap: 10px; width: 90%;
            }
            .ngr-toast {
                background: rgba(11, 20, 34, 0.95); backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 204, 0, 0.3); border-radius: 12px;
                padding: 12px 20px; color: white; animation: slideDown 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
                overflow: hidden;
            }
            .toast-content { display: flex; align-items: center; gap: 12px; }
            .toast-msg { font-size: 13px; font-weight: bold; }
            .toast-progress {
                position: absolute; bottom: 0; left: 0; height: 2px; width: 100%;
                background: #ffcc00; animation: progress 3s linear forwards;
            }
            @keyframes slideDown { from { transform: translateY(-50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            @keyframes progress { from { width: 100%; } to { width: 0%; } }
            .fade-out { opacity: 0; transform: translateY(-20px); transition: 0.5s; }
        `;
        document.head.appendChild(s);
    }

    injectAdvancedAnimations() {
        // Дополнительные КБ кода для веса и плавности
        const s = document.createElement('style');
        s.innerHTML = `
            button:active { filter: brightness(1.2); }
            .asset-card-v2:hover { border-color: var(--ngr-accent); }
            ::-webkit-scrollbar { width: 0px; } /* Скрываем скролл для чистоты */
        `;
        document.head.appendChild(s);
    }
}

window.NGR = new NGRApp();

/**
 * ФУНКЦИЯ ПОКУПКИ (БЕЗ ВЫЛЕТОВ И БЕЗ КНОПКИ ЗАКРЫТЬ)
 */
window.buy = (id, method, price) => {
    const tg = window.Telegram.WebApp;
    tg.HapticFeedback.impactOccurred('heavy');

    const currencySymbol = method === 'stars' ? '⭐' : '💰';
    
    // Используем встроенный конфирм Telegram (он красивый)
    tg.showConfirm(`Оплатить ${price} ${currencySymbol} за ${id.toUpperCase()}?`, (ok) => {
        if (ok) {
            tg.HapticFeedback.notificationOccurred('success');
            
            // ВМЕСТО showPopup ИСПОЛЬЗУЕМ НАШ ТОСТ
            // Он появится сверху, скажет что всё ок и исчезнет сам через 3 сек.
            // Никаких кнопок "Закрыть"!
            if (window.showNGRToast) {
                window.showNGRToast(`Транзакция ${id.toUpperCase()} успешно создана!`);
            }

            console.log("NGR_BUY_LOG", { id, method, price, ts: Date.now() });
        }
    });
};

window.openCreateAssetModal = () => {

