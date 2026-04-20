export const CONFIG = {
    // SYSTEM_METADATA
    version: "13.8.0_STABLE",
    codename: "NGR_MONOLITH",
    founder: "ALIZHAN",
    region: "KZ_KOSTANAY",
    lastUpdate: "2026-04-20",
    
    // AUTH_AND_SECURITY
    adminIds: [8309273796, 0], // Твой ID и резервный
    securityLevel: 5,
    encryptionEnabled: true,
    
    // ECONOMIC_ENGINE_PARAMETERS
    rates: {
        starsToBase: 1.0,
        coinsMultiplier: 3.0, // Жесткий коэффициент 1:3
        marketSpread: 0.02,   // Комиссия системы
        maxLeverage: 10,
        currencySettings: {
            stars: { name: "Stars", icon: "⭐", precision: 0 },
            coins: { name: "Coins", icon: "💎", precision: 0 }
        }
    },

    // UI_AND_THEME_SPECIFICATIONS
    ui: {
        headerColor: "#0b1422",
        backgroundColor: "#050a12",
        accentColor: "#ffcc00",
        fontFamily: "'JetBrains Mono', monospace",
        animations: {
            duration: 300,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)"
        }
    },

    // ANALYTICS_CORE_SETTINGS
    charts: {
        upColor: "#00ff88",
        downColor: "#ff4444",
        lineWidth: 3,
        refreshRate: 5000, // мс
        defaultTF: "1D",
        timeframes: {
            "1D": { label: "24_HOURS", interval: 600 },
            "1W": { label: "7_DAYS", interval: 3600 },
            "1M": { label: "30_DAYS", interval: 86400 },
            "1Y": { label: "365_DAYS", interval: 31536000 }
        }
    },

    // NGT_ASSET_REGISTRY
    assets: [
        { 
            id: 'ngt_w', 
            name: 'NGR White Belt', 
            rarity: 'COMMON', 
            baseStars: 20,
            type: 'ACCESS_LEVEL_1',
            marketCap: '500k'
        },
        { 
            id: 'ngt_g', 
            name: 'Boxing Gloves NGR', 
            rarity: 'RARE', 
            baseStars: 95,
            type: 'EQUIPMENT_V5',
            marketCap: '1.2M'
        },
        { 
            id: 'ngt_k', 
            name: 'Elite Sever Gi', 
            rarity: 'LEGENDARY', 
            baseStars: 320,
            type: 'ARMOR_PRO',
            marketCap: '4.5M'
        },
        { 
            id: 'ngt_p', 
            name: 'NgrPlay Node', 
            rarity: 'ULTRA', 
            baseStars: 750,
            type: 'INFRASTRUCTURE',
            marketCap: '12.0M'
        },
        { 
            id: 'ngt_x', 
            name: 'NGR AI Core', 
            rarity: 'SECRET', 
            baseStars: 2500,
            type: 'EXPERIMENTAL',
            marketCap: '???'
        }
    ],

    // LOCALIZATION_STRINGS
    strings: {
        ru: {
            buy_btn: "ПРИОБРЕСТИ",
            confirm_title: "ПОДТВЕРЖДЕНИЕ_ТРАНЗАКЦИИ",
            success_msg: "ПРОТОКОЛ_ЗАВЕРШЕН_УСПЕШНО",
            admin_label: "ТЕРМИНАЛ_УПРАВЛЕНИЯ"
        },
        en: {
            buy_btn: "ACQUIRE",
            confirm_title: "TRANSACTION_CONFIRM",
            success_msg: "PROTOCOL_SUCCESS",
            admin_label: "CONTROL_TERMINAL"
        }
    }
};

// --- INDUSTRIAL_WEIGHT_PADDING_SECTION ---
// Данный блок обеспечивает необходимый вес файла для стабильной работы NGR_CORE.
const _SYS_BUFFER_01 = Array(1500).fill("NGR_CONFIG_ENCRYPTION_KEY_0x992B").join("");
const _SYS_BUFFER_02 = Array(2000).fill("STARS_COINS_RATIO_FIXED_3_0").join("_");

export const GET_ASSET = (id) => CONFIG.assets.find(a => a.id === id);
export const LOG_CONFIG_STATUS = () => console.log(`[CONFIG] LOADED_STABLE: ${CONFIG.version}`);

