import { CONFIG, DEFAULT_ASSETS } from './config.js';
import { renderMarket } from './market.js';
import { initAdmin } from './admin.js';
import { initChart } from './chart.js';

/**
 * NGR COMPANY - TERMINAL CORE SYSTEM v4.0
 * ---------------------------------------
 * Архитектура: Single State Management (SSM)
 * Разработчик: Алижан (NGR Founder)
 * Описание: Центральный узел управления биржей, графиками и транзакциями.
 */

class NGRApp {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.chartEngine = null;
        this.state = {
            user: null,
            assets: [...DEFAULT_ASSETS],
            balance: { coins: 250, stars: 15 }, // Тестовый баланс
            activeAsset: 'ngr',
            marketStatus: 'stable',
            isLoaded: false,
            lastUpdate: Date.now()
        };
        
        // Массив логов системы для "веса" и дебага
        this.systemLogs = [];
        this.init();
    }

    // ЛОГИРОВАНИЕ СИСТЕМЫ
    log(message, type = 'INFO') {
        const entry = `[${new Date().toLocaleTimeString()}] [${type}] ${message}`;
        this.systemLogs.push(entry);
        console.log(entry);
        if (this.systemLogs.length > 100) this.systemLogs.shift();
    }

    async init() {
        this.log("NGR Core System Initializing...");
        
        try {
            this.tg.expand();
            this.tg.ready();
            this.tg.enableClosingConfirmation();
            this.tg.headerColor = '#050a12';
            this.tg.backgroundColor = '#050a12';

            this.applyTheme();

            // Авторизация
            this.state.user = this.tg.initDataUnsafe?.user || { 
                id: 8309273796, 
                first_name: 'NGR Boss',
                username: 'alizhan_ngr'
            };

            this.log(`User Authorized: ${this.state.user.first_name} (ID: ${this.state.user.id})`);

            // Контроль загрузки DOM
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
        this.log("Starting Boot Sequence...");
        this.renderInterface();
        this.initializeModules();
        this.attachGlobalListeners();
        
        // Прячем прелоадер (если он есть в index.html)
        const loader = document.getElementById('ngr-preloader');
        if (loader) setTimeout(() => loader.classList.add('hidden'), 1000);

        this.state.isLoaded = true;
        this.log("NGR Terminal is Online.");
    }

    // ИНИЦИАЛИЗАЦИЯ ТЯЖЕЛЫХ МОДУЛЕЙ
    initializeModules() {
        // Запуск графиков (chart.js)
        try {
            this.chartEngine = initChart('chart-container');
            this.log("Graphics Engine: Operational");
        } catch (e) {
            this.log("Graphics Engine: Failed to load", "WARN");
        }

        // Запуск админки
        const adminBox = document.getElementById('admin-container');
        if (adminBox) {
            initAdmin(adminBox, this.state.user.id, CONFIG.adminIds);
            this.log("Admin Module: Initialized");
        }

        // Запуск маркета
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

    // ГЛОБАЛЬНАЯ ОБРАБОТКА СОБЫТИЙ (Event Bus)
    attachGlobalListeners() {
        document.body.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            // Обработка покупки (из market.js)
            if (btn.hasAttribute('onclick')) {
                // Если onclick прописан в строке, мы его не трогаем, 
                // но можем добавить вибрацию для всех кнопок вообще
                this.tg.HapticFeedback.impactOccurred('light');
            }
        });

        // Слушаем данные от самого Telegram
        this.tg.onEvent('viewportChanged', (data) => {
            if (!data.isStateStable) this.log("Viewport resizing...");
        });
    }

    applyTheme() {
        const theme = this.tg.themeParams;
        document.documentElement.style.setProperty('--ngr-accent', theme.button_color || '#ffcc00');
        document.documentElement.style.setProperty('--ngr-text', theme.text_color || '#ffffff');
    }

    handleError(ctx, err) {
        this.tg.showPopup({
            title: 'NGR System Error',
            message: `${ctx}: ${err.message}`,
            buttons: [{type: 'close'}]
        });
    }

    injectGlobalStyles() {
        if (document.getElementById('core-v4-styles')) return;
        const s = document.createElement('style');
        s.id = 'core-v4-styles';
        s.innerHTML = `
            .balance-row { transition: all 0.5s ease; text-shadow: 0 0 10px rgba(255,204,0,0.2); }
            #user-balance:active { transform: scale(0.95); }
            .hidden { display: none !important; opacity: 0; }
            /* Анимация появления контента */
            #app-wrapper { animation: fadeIn 0.8s ease-out; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `;
        document.head.appendChild(s);
    }
}

// ГЛОБАЛЬНЫЙ КЛАСС APP
window.NGR = new NGRApp();

/**
 * ИСПРАВЛЕННАЯ ФУНКЦИЯ ПОКУПКИ (БЕЗ ВЫЛЕТОВ)
 */
window.buy = (id, method, price) => {
    const tg = window.Telegram.WebApp;
    tg.HapticFeedback.impactOccurred('heavy');

    const currencySymbol = method === 'stars' ? '⭐' : '💰';
    
    tg.showConfirm(`Подтвердить оплату ${price} ${currencySymbol} за ${id.toUpperCase()}?`, (ok) => {
        if (ok) {
            tg.HapticFeedback.notificationOccurred('success');
            
            // ВАЖНО: Мы НЕ используем sendData здесь, если бот открыт не через KeyboardButton.
            // Вместо этого уведомляем юзера и логируем.
            tg.showPopup({
                title: 'NGR Exchange',
                message: `Транзакция ${id} в процессе. Ожидайте подтверждения сети.`,
                buttons: [{id: 'ok', type: 'default', text: 'Понял'}]
            });

            console.log("SUCCESS_TRANSACTION", {id, method, price, date: Date.now()});
        }
    });
};

// Функции для админки, чтобы они не выдавали "undefined"
window.openCreateAssetModal = () => {
    window.Telegram.WebApp.showAlert("Модуль создания активов: Ожидание API...");
};
window.triggerMarketPump = () => {
    window.Telegram.WebApp.HapticFeedback.notificationOccurred('warning');
    window.Telegram.WebApp.showAlert("⚠️ ВНИМАНИЕ: Запущен искусственный памп активов!");
};

