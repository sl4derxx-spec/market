/**
 * NGR COMPANY - GLOBAL DATA CORE v4.0.5
 * --------------------------------------------------
 * Данный файл содержит все системные константы, настройки безопасности,
 * параметры отображения графиков и базу данных активов.
 * Вес файла увеличен за счет расширенной структуры метаданных.
 */

export const CONFIG = {
    // Основные настройки системы
    appVersion: "4.0.5 PRO",
    companyName: "NGR Company",
    legalName: "NGR Digital Assets Ecosystem",
    baseCurrency: "USD",
    
    // Настройки экономики
    coinsMultiplier: 3.0,      // Курс Coins к USD
    minBuyAmount: 0.10,        // Минимальная покупка в $
    maxBuyAmount: 5000.00,     // Максимальная покупка за раз
    tradingFee: 0.015,         // Комиссия биржи (1.5%)
    
    // Права доступа (Администраторы)
    adminIds: [8309273796], // Алижан, твой ID
    superAdmins: [8309273796],
    
    // Настройки графиков (TradingView Engine Style)
    charts: {
        theme: "dark",
        upColor: "#00ff88",
        downColor: "#ff4444",
        gridColor: "rgba(30, 42, 58, 0.2)",
        lineWidth: 3,
        refreshInterval: 5000, // Обновление каждые 5 секунд
        timeframes: ["1H", "4H", "1D", "1W", "1M"],
        defaultTimeframe: "1D"
    },

    // Локализация (Localization Dictionary)
    i18n: {
        ru: {
            market_title: "Котировки NGR",
            buy_btn: "Купить",
            sell_btn: "Продать",
            balance_coins: "Coins",
            balance_stars: "Stars",
            admin_panel: "Панель Создателя",
            create_asset: "Создать актив",
            search_placeholder: "Поиск токена...",
            error_connection: "Ошибка синхронизации с NGR Core"
        },
        en: {
            market_title: "NGR Quotes",
            buy_btn: "Buy",
            sell_btn: "Sell",
            balance_coins: "Coins",
            balance_stars: "Stars",
            admin_panel: "Creator Panel",
            create_asset: "Create Asset",
            search_placeholder: "Search token...",
            error_connection: "NGR Core Sync Error"
        }
    }
};

/**
 * РАСШИРЕННАЯ БАЗА ДАННЫХ АКТИВОВ (DEFAULT ASSETS REGISTRY)
 * Каждый актив содержит описание и технические параметры.
 */
export const DEFAULT_ASSETS = [
    { 
        id: 't_stars', 
        name: 'Telegram Stars', 
        symbol: 'STARS',
        price: 1.0, 
        icon: '⭐', 
        is_currency: true,
        description: "Официальная валюта Telegram для оплаты цифровых услуг.",
        network: "TON / Telegram Ecosystem",
        max_supply: "Unlimited"
    },
    { 
        id: 'dst', 
        name: 'DST Token', 
        symbol: 'DST',
        price: 1.5, 
        icon: '📀',
        is_currency: false,
        description: "Digital Service Token для экосистемы NGR Company.",
        network: "NGR Private Chain",
        max_supply: "1,000,000,000"
    },
    { 
        id: 'ngr', 
        name: 'NGR Coin', 
        symbol: 'NGRC',
        price: 5.0, 
        icon: '💎',
        is_currency: false,
        description: "Основной инвестиционный актив и символ компании NGR.",
        network: "NGR Mainnet",
        max_supply: "100,000,000"
    },
    { 
        id: 'ngt_pass', 
        name: 'NGT White Belt', 
        symbol: 'NGTW',
        price: 10.0, 
        icon: '🥋',
        is_currency: false,
        description: "Эксклюзивный доступ для спортсменов клуба SEVER.",
        network: "NGT Asset Registry",
        max_supply: "5000"
    },
    { 
        id: 'boxing_nrg', 
        name: 'NGR Gloves', 
        symbol: 'GLOVES',
        price: 25.0, 
        icon: '🥊',
        is_currency: false,
        description: "Коллекционный предмет редкости Rare.",
        network: "NGT Asset Registry",
        max_supply: "1000"
    }
];

// Функция для получения данных актива по ID (Helper)
export const getAssetById = (id) => DEFAULT_ASSETS.find(a => a.id === id);

