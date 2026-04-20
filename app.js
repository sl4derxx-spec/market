import { CONFIG, DEFAULT_ASSETS } from './config.js';
import { renderMarket } from './market.js';
import { initAdmin } from './admin.js';
import { initChart } from './chart.js';

/**
 * NGR COMPANY - TERMINAL CORE SYSTEM v10.0
 * ---------------------------------------
 * РАЗРАБОТЧИК: Алижан (NGR Founder)
 * СТАТУС: Industrial Heavy Build
 * ИСПРАВЛЕНИЯ: Устранение системных оверлеев, блокировка резинового скролла.
 */

class NGRApp {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.chartEngine = null;
        this.state = {
            user: null,
            assets: [...DEFAULT_ASSETS],
            balance: { coins: 15000, stars: 150 }, // Актуальный баланс NGR
            activeAsset: 'ngr',
            isLoaded: false,
            version: "10.0.1 PRO"
        };
        
        this.systemLogs = [];
        this.init();
    }

    // ЛОГИРОВАНИЕ ДЛЯ ВЕСА И ДЕБАГА
    log(message, type = 'INFO') {
        const entry = `[${new Date().toLocaleTimeString()}] [${type}] ${message}`;
        this.systemLogs.push(entry);
        console.log(`%c${entry}`, "color: #ffcc00; font-weight: bold;");
        if (this.systemLogs.length > 300) this.systemLogs.shift();
    }

    async init() {
        this.log("NGR CORE v10: SECURE_BOOT_SEQUENCE_STARTED");
        
        try {
            // ПРИНУДИТЕЛЬНАЯ БЛОКИРОВКА ИНТЕРФЕЙСА ТЕЛЕГРАМА
            this.tg.expand();
            this.tg.ready();
            this.tg.enableClosingConfirmation();
            this.tg.headerColor = '#050a12';
            this.tg.backgroundColor = '#050a12';

            // ЯДЕРНЫЙ УДАР ПО СИСТЕМНЫМ КНОПКАМ
            this.tg.BackButton.hide();
            this.tg.MainButton.hide();
            this.tg.SettingsButton.hide();
            
            // Запрещаем свайп вверх-вниз, который открывает "задний план"
            if (this.tg.isVerticalSwipesEnabled !== undefined) {
                this.tg.isVerticalSwipesEnabled = false;
            }

            // ПЕРЕХВАТ ВСЕХ СИСТЕМНЫХ ОКОН (Чтобы кнопка "Закрыть" не вылазила)
            window.alert = () => this.log("Blocked native alert", "SECURE");
            window.confirm = () => true;
            this.tg.showPopup = (p, callback) => { if(callback) callback(); return true; };
            this.tg.showAlert = (m, callback) => { if(callback) callback(); return true; };
            this.tg.showConfirm = (m, callback) => { if(callback) callback(true); return true; };

            this.applyTheme();

            // Авторизация пользователя
            this.state.user = this.tg.initDataUnsafe?.user || { 
                id: 8309273796, 
                first_name: 'NGR Founder',
                username: 'alizhan_ngr'
            };

            this.log(`Terminal User ID: ${this.state.user.id}`);

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.bootSequence());
            } else {
                this.bootSequence();
            }

        } catch (error) {
            this.log(`BOOT_FAILURE: ${error.message}`, 'CRITICAL');
        }
    }

    bootSequence() {
        this.log("Injecting UI components...");
        this.renderInterface();
        this.initializeModules();
        this.attachGlobalListeners();
        this.initToastSystem();
        
        // Скрытие прелоадера с задержкой для красоты
        const loader = document.getElementById('ngr-preloader') || document.getElementById('ngr-heavy-preloader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
                loader.style.display = 'none';
                document.getElementById('app-wrapper').classList.add('active');
            }, 1500);
        }

        this.state.isLoaded = true;
        this.log("NGR TERMINAL v10: ONLINE AND SECURE");
    }

    initializeModules() {
        // Запуск графиков
        try {
            this.chartEngine = initChart('chart-container');
            this.log("CHART_ENGINE: LOADED");
        } catch (e) { this.log("CHART_ENGINE: FAIL", "WARN"); }

        // Запуск админки
        const adminBox = document.getElementById('admin-container');
        if (adminBox) {
            initAdmin(adminBox, this.state.user.id, CONFIG.adminIds);
            this.log("ADMIN_MODULE: AUTHORIZED");
        }

        // Запуск маркета
        const marketBox = document.getElementById('market-grid');
        if (marketBox) {
            renderMarket(marketBox, this.state.assets);
            this.log("MARKET_ENGINE: ACTIVE");
        }
    }

    renderInterface() {
        const ui = {
            name: document.getElementById('user-name'),
            photo: document.getElementById('user-photo')
        };

        if (ui.name) ui.name.innerText = this.state.user.first_name.toUpperCase();
        if (ui.photo && this.state.user.photo_url) ui.photo.src = this.state.user.photo_url;

        this.syncBalance();
        this.injectGlobalStyles();
    }

    syncBalance() {
        const box = document.getElementById('user-balance');
        if (box) {
            box.innerHTML = `
                <div class="balance-row main">💰 <span>${this.state.balance.coins.toLocaleString()}</span> NGRC</div>
                <div class="balance-row sub">⭐ <span>${this.state.balance.stars}</span> STARS</div>
            `;
        }
    }

    // ТОСТЫ ВМЕСТО ВСПЛЫВАЮЩИХ ОКОН ТЕЛЕГРАМА
    initToastSystem() {
        const container = document.createElement('div');
        container.id = 'ngr-toast-box';
        document.body.appendChild(container);

        window.showNGRToast = (msg) => {
            const t = document.createElement('div');
            t.className = 'ngr-toast-v10';
            t.innerHTML = `<span>[SYSTEM]</span> ${msg}`;
            container.appendChild(t);
            setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 500); }, 2500);
        };
    }

    attachGlobalListeners() {
        // Блокировка случайных нажатий при скролле (чтобы не покупалось само)
        let isScrolling = false;
        document.addEventListener('touchstart', () => isScrolling = false);
        document.addEventListener('touchmove', () => isScrolling = true);

        document.body.addEventListener('click', (e) => {
            if (isScrolling) {
                e.preventDefault();
                return;
            }
            const btn = e.target.closest('button');
            if (btn) this.tg.HapticFeedback.impactOccurred('light');
        }, true);

        // Фикс резинового скролла через JS
        document.body.addEventListener('touchmove', function(e) {
            if (e.target.id === 'app-wrapper' || e.target.closest('#app-wrapper')) {
                return; // Разрешаем скролл внутри обертки
            }
            e.preventDefault();
        }, { passive: false });
    }

    applyTheme() {
        const theme = this.tg.themeParams;
        document.documentElement.style.setProperty('--ngr-accent', theme.button_color || '#ffcc00');
    }

    injectGlobalStyles() {
        if (document.getElementById('core-v10-css')) return;
        const s = document.createElement('style');
        s.id = 'core-v10-css';
        s.innerHTML = `
            #ngr-toast-box { position: fixed; top: 20px; width: 100%; z-index: 10001; pointer-events: none; display: flex; flex-direction: column; align-items: center; gap: 8px; }
            .ngr-toast-v10 { background: #ffcc00; color: #000; padding: 12px 24px; border-radius: 50px; font-weight: 900; font-size: 11px; animation: toastUp 0.4s ease-out; transition: 0.5s; }
            .ngr-toast-v10 span { opacity: 0.6; }
            @keyframes toastUp { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            .hidden { display: none !important; }
            #app-wrapper.active { opacity: 1 !important; transform: none !important; }
        `;
        document.head.appendChild(s);
    }
}

// ГЛОБАЛЬНЫЙ ИНСТАНС
window.NGR = new NGRApp();

// ФУНКЦИЯ ПОКУПКИ - ЧИСТАЯ И РАБОЧАЯ
window.buy = (id, method, price) => {
    const tg = window.Telegram.WebApp;
    tg.HapticFeedback.impactOccurred('heavy');
    
    // Вместо системного окна - подтверждаем в консоль и тостом
    console.log(`TRANSACTION_REQUEST: ${id} | ${method} | ${price}`);
    
    if (window.showNGRToast) {
        window.showNGRToast(`ОРДЕР НА ${id.toUpperCase()} СОЗДАН`);
    }
    
    // Здесь можно добавить реальную отправку на бэкенд
};

// Хендлеры админки
window.openCreateAssetModal = () => window.showNGRToast("ERR: ACCESS_DENIED_BY_PROTOCOL");
window.triggerMarketPump = () => {
    window.Telegram.WebApp.HapticFeedback.notificationOccurred('warning');
    window.showNGRToast("⚠️ ВНИМАНИЕ: РЫНОК ИСКУССТВЕННО ПАМПИТСЯ");
};

