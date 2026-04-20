import { CONFIG, DEFAULT_ASSETS } from './config.js';
import { renderMarket } from './market.js';
import { initAdmin } from './admin.js';

/**
 * NGR COMPANY - CORE APPLICATION ENGINE v3.0
 * * Данный модуль является центральным узлом управления.
 * Реализована архитектура с использованием единого хранилища состояния.
 */

class NGRApp {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.state = {
            user: null,
            assets: [...DEFAULT_ASSETS],
            balance: { coins: 0, stars: 0 },
            isLoaded: false,
            version: "3.0.1 PRO"
        };
        
        this.init();
    }

    async init() {
        console.log(`[NGR Core] Initializing version ${this.state.version}`);
        
        try {
            this.tg.expand();
            this.tg.ready();
            this.tg.enableClosingConfirmation();

            // Применяем тему Telegram к приложению
            this.applyTheme();

            // Инициализация данных пользователя
            this.state.user = this.tg.initDataUnsafe?.user || { 
                id: 8309273796, // Твой ID для тестов в браузере
                first_name: 'NGR Developer',
                username: 'admin'
            };

            // Ждем полной загрузки DOM
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.boot());
            } else {
                this.boot();
            }

        } catch (error) {
            this.handleError("Core Init Failure", error);
        }
    }

    boot() {
        this.renderUI();
        this.bindEvents();
        this.state.isLoaded = true;
        console.log("[NGR Core] Boot sequence completed.");
    }

    renderUI() {
        // Элементы профиля
        const elements = {
            name: document.getElementById('user-name'),
            photo: document.getElementById('user-photo'),
            balance: document.getElementById('user-balance'),
            admin: document.getElementById('admin-container'),
            market: document.getElementById('market-grid')
        };

        if (elements.name) elements.name.innerText = this.state.user.first_name;
        
        if (elements.photo && this.state.user.photo_url) {
            elements.photo.src = this.state.user.photo_url;
        }

        this.updateBalanceUI();

        // Запуск модулей
        if (elements.admin) {
            initAdmin(elements.admin, this.state.user.id, CONFIG.adminIds);
        }

        if (elements.market) {
            renderMarket(elements.market, this.state.assets);
        }

        this.injectGlobalStyles();
    }

    updateBalanceUI() {
        const balanceElem = document.getElementById('user-balance');
        if (balanceElem) {
            balanceElem.innerHTML = `
                <div class="balance-row main">💰 <span>${this.state.balance.coins.toLocaleString()}</span> NGRC</div>
                <div class="balance-row sub">⭐ <span>${this.state.balance.stars}</span> Stars</div>
            `;
        }
    }

    bindEvents() {
        // Глобальный слушатель кликов для оптимизации
        document.body.addEventListener('click', (e) => {
            const target = e.target.closest('[data-action]');
            if (target) {
                const action = target.getAttribute('data-action');
                this.handleAction(action, target.dataset);
            }
        });

        // Слушатель событий от Telegram (через бота)
        this.tg.onEvent('mainButtonClicked', () => this.handleMainButtonClick());
    }

    handleAction(action, data) {
        console.log(`[NGR Action] ${action}`, data);
        // Здесь будет расширенная логика действий
    }

    applyTheme() {
        document.documentElement.style.setProperty('--tg-theme-bg', this.tg.backgroundColor);
        document.documentElement.style.setProperty('--tg-theme-accent', this.tg.themeParams.button_color || '#ffcc00');
    }

    handleError(context, error) {
        console.error(`[NGR Error] ${context}:`, error);
        this.tg.showAlert(`System Error: ${context}. Check console.`);
    }

    injectGlobalStyles() {
        if (document.getElementById('core-styles')) return;
        const style = document.createElement('style');
        style.id = 'core-styles';
        style.innerHTML = `
            :root {
                --ngr-gold: #ffcc00;
                --ngr-bg: #050a12;
            }
            #user-balance {
                background: rgba(30, 42, 58, 0.5);
                padding: 10px 15px;
                border-radius: 12px;
                border-left: 3px solid var(--ngr-gold);
            }
            .balance-row { font-weight: bold; }
            .balance-row.main { font-size: 16px; color: #fff; margin-bottom: 2px; }
            .balance-row.sub { font-size: 12px; color: var(--ngr-gold); }
            
            /* Скроллбар в стиле Cyberpunk */
            ::-webkit-scrollbar { width: 4px; }
            ::-webkit-scrollbar-track { background: var(--ngr-bg); }
            ::-webkit-scrollbar-thumb { background: #1e2a3a; border-radius: 10px; }
            ::-webkit-scrollbar-thumb:hover { background: var(--ngr-gold); }
        `;
        document.head.appendChild(style);
    }
}

// Инициализация системы
const app = new NGRApp();

// Глобальная функция для старых вызовов (совместимость с кнопками из market.js)
window.buy = (id, method, price) => {
    const tg = window.Telegram.WebApp;
    tg.showConfirm(`Подтвердить транзакцию: ${id} за ${price} ${method}?`, (ok) => {
        if (ok) {
            tg.HapticFeedback.notificationOccurred('success');
            tg.sendData(JSON.stringify({
                action: 'buy',
                asset: id,
                currency: method,
                amount: price,
                timestamp: Date.now()
            }));
            tg.close();
        }
    });
};

