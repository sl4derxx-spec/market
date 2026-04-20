/**
 * ============================================================================
 * NGR COMPANY - ULTIMATE MARKET ENGINE v12.5.0 (INDUSTRIAL MONOLITH)
 * FOUNDER & LEAD DEVELOPER: ALIZHAN (KOSTANAY)
 * ----------------------------------------------------------------------------
 * WARNING: THIS MODULE CONTAINS THE FULL ASSET KNOWLEDGE BASE.
 * ВЕС ФАЙЛА: 17.4 KB (HEAVYWEIGHT BUILD)
 * STATUS: OPERATIONAL | SECURITY: NEON_SHIELD ACTIVE
 * ============================================================================
 */

import { CONFIG } from './config.js';

/**
 * [GLOBAL_ASSET_KNOWLEDGE_BASE]
 * Максимально детализированные описания для веса и солидности.
 * Каждая строка здесь — это байты в копилку веса твоего проекта.
 */
const ASSET_LIBRARY = {
    't_stars': {
        desc: "Telegram Stars (STARS) — официальная цифровая валюта экосистемы Telegram, предназначенная для бесшовной оплаты цифровых товаров и услуг внутри Mini Apps. Актив полностью интегрирован с архитектурой TON и обеспечивает мгновенные транзакции с минимальной задержкой. В системе NGR используется как основной инструмент ликвидности для операторов терминала. Каждая транзакция проходит через шлюз безопасности Telegram API.",
        specs: "PROTOCOL: TON_STARS_V2 | TYPE: UTILITY_CURRENCY | EMISSION: DYNAMIC_TOTAL | LIQUIDITY: HIGH",
        history: "DEPLOYED_BY_TELEGRAM_CORE_2024"
    },
    'dst': {
        desc: "Digital Service Token (DST) — специализированный технический токен, разработанный инженерами NGR Company для обеспечения доступа к облачным ресурсам. DST является ключом для активации продвинутых алгоритмов в среде Linux и Termux, позволяя выполнять высокопроизводительные вычисления на удаленных серверах компании в автоматическом режиме. Необходим для деплоя новых нейросетевых моделей NGR AI.",
        specs: "PROTOCOL: NGR_CHAIN_INTERNAL | TYPE: SERVICE_FUEL | EMISSION: 1,000,000,000 | TIER: ALPHA",
        history: "GENESIS_BLOCK_NGR_2026"
    },
    'ngr': {
        desc: "NGR Coin (NGRC) — флагманский инвестиционный актив холдинга NGR Company. Обладает фиксированной эмиссией и используется для управления децентрализованными узлами Minecraft-серверов NgrPlay. Владельцы NGRC получают право на участие в закрытых бета-тестах и эксклюзивные дивиденды от оборота цифровых активов компании. Является ядром финансовой независимости экосистемы NGR.",
        specs: "PROTOCOL: NGR_MAINNET_V1 | TYPE: GOVERNANCE_ASSET | EMISSION: 100,000,000 | TIER: PRIME",
        history: "NGR_FINANCE_DEPT_DEPLOYMENT"
    },
    'ngt_pass': {
        desc: "NGT White Belt (🥋) — цифровой паспорт бойца спортивного клуба SEVER (Костанай). Актив фиксирует ранг оператора в системе NGT и предоставляет доступ к тренировочным базам данных. Является базовым элементом коллекции 'Spirit of the Club', подтверждающим принадлежность к атлетическому сообществу NGR. Смарт-контракт хранит историю достижений и поясных аттестаций.",
        specs: "COLLECTION: SEVER_GENESIS | RARITY: COMMON | TYPE: DYNAMIC_NFT | ACCESS_LEVEL: 1",
        history: "SEVER_CLUB_DIGITALIZATION_PHASE"
    },
    'boxing_nrg': {
        desc: "NGR Boxing Gloves (🥊) — редкий боевой актив (Rare). Разработан как символ ударной мощи технического подразделения NGR Tech. Обладание данными перчатками повышает статус оператора в глобальном рейтинге терминала и открывает доступ к специальным ивентам с повышенным пулом наград. Лимитированное издание, доступное только активным участникам экосистемы.",
        specs: "COLLECTION: NGR_WARRIOR | RARITY: RARE | TYPE: COLLECTIBLE_NFT | STRENGTH: +15%",
        history: "NGR_TECH_SPECIAL_EDITION"
    },
    'ngt_cup': {
        desc: "NGT NSA Cup (🏆) — легендарный трофей, высшая награда в реестре NGT. Данный кубок символизирует выдающиеся достижения в области разработки софта или спортивные победы под эгидой NGR Company. Является уникальным активом с неизменяемыми метаданными в блокчейне. Обладание кубком NSA гарантирует вечный статус 'Elite Operator' и доступ ко всем секретным модулям системы.",
        specs: "COLLECTION: CHAMPIONS_LEAGUE | RARITY: LEGENDARY | TYPE: ELITE_NFT | STATUS: IMMUTABLE",
        history: "NSA_TOURNAMENT_REWARD_SYSTEM"
    }
};

/**
 * ИНИЦИАЛИЗАЦИЯ И РЕНДЕРИНГ МАРКЕТА
 */
export function renderMarket(container, assets) {
    if (!container) {
        systemDiagnostic("CRITICAL_ERROR: Market container is null. Check index.html DOM structure.");
        return;
    }

    container.innerHTML = '';
    systemDiagnostic(`Syncing assets... Load factor: ${assets.length} items. Memory allocation: OK.`);

    assets.forEach((asset, i) => {
        const card = createHeavyCard(asset, i);
        container.appendChild(card);
    });

    systemDiagnostic("Market interface deployment successful. All modules ONLINE.");
}

/**
 * СБОРКА ТЯЖЕЛОЙ КАРТОЧКИ (DOM MONOLITH)
 */
function createHeavyCard(asset, index) {
    const card = document.createElement('div');
    card.className = 'asset-card';
    card.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.15}s`;
    card.style.opacity = '0';

    const data = ASSET_LIBRARY[asset.id] || { desc: "Encrypted data stream. Access denied.", specs: "N/A", history: "UNKNOWN" };

    card.innerHTML = `
        <div class="card-info-main">
            <div class="asset-icon-box">
                <span class="main-emoji">${asset.icon || '📦'}</span>
                <div class="rarity-glow ${asset.rarity || 'common'}"></div>
            </div>
            <div class="asset-meta">
                <div class="title-row">
                    <span class="asset-name">${asset.name}</span>
                    <span class="status-tag">CORE_ACTIVE</span>
                </div>
                <span class="asset-symbol">${asset.symbol} // NODE: ${asset.network || 'NGR_INTERNAL_NET'}</span>
            </div>
        </div>
        
        <div class="card-price-action">
            <div class="price-stack">
                <span class="price-val">${asset.price.toFixed(2)} ⭐️</span>
                <span class="price-sub">MARKET VALUE</span>
            </div>
            <button class="buy-btn" onclick="window.triggerNGRPurchase('${asset.id}')">
                ACQUIRE ASSET
            </button>
        </div>

        <div class="industrial-data-layer">
            <div class="description-text">${data.desc}</div>
            <div class="specs-grid">
                <div class="spec-item">
                    <span class="label">SPECS:</span>
                    <span class="val">${data.specs}</span>
                </div>
                <div class="spec-item">
                    <span class="label">HISTORY:</span>
                    <span class="val">${data.history}</span>
                </div>
                <div class="spec-item">
                    <span class="label">SEC_HASH:</span>
                    <span class="val">${generateInternalHash()}</span>
                </div>
            </div>
        </div>
    `;

    return card;
}

/**
 * СИСТЕМА ОБРАБОТКИ ТРАНЗАКЦИЙ (INDUSTRIAL GRADE)
 */
window.triggerNGRPurchase = (id) => {
    const tg = window.Telegram.WebApp;
    
    // Мощный виброотклик
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('heavy');
    }

    console.log(`[NGR_CORE_MARKET] Purchase sequence started for asset_id: ${id}`);
    if (window.showNGRToast) {
        window.showNGRToast(`BOOTING TRANSACTION: ${id.toUpperCase()}`);
    }

    // Имитация глубокой проверки безопасности перед покупкой
    setTimeout(() => {
        if (tg.showPopup) {
            tg.showPopup({
                title: 'NGR Terminal Security',
                message: `ВНИМАНИЕ: Вы инициируете приобретение промышленного актива [${id}]. Транзакция будет записана в реестр NGR. Подтвердить?`,
                buttons: [
                    {id: 'yes', type: 'default', text: 'ПОДТВЕРДИТЬ'},
                    {id: 'no', type: 'destructive', text: 'ОТМЕНА'}
                ]
            }, (btn) => {
                if (btn === 'yes') {
                    finalizeNGRTrade(id);
                }
            });
        }
    }, 450);
};

/**
 * ФИНАЛИЗАЦИЯ СДЕЛКИ (DEEP LOGIC)
 */
function finalizeNGRTrade(id) {
    if (window.showNGRToast) {
        window.showNGRToast(`SUCCESS: ${id} ACQUIRED`);
    }
    if (window.Telegram.WebApp.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }
    console.log(`%c[NGR_LEDGER_UPDATE] Transaction confirmed: ${id} | T-STAMP: ${Date.now()}`, "color: #00ff88; font-weight: bold;");
    
    // Здесь можно добавить вызов API бота
}

/**
 * ВСПОМОГАТЕЛЬНЫЕ СИСТЕМНЫЕ ФУНКЦИИ
 */
function generateInternalHash() {
    const chars = 'ABCDEF0123456789';
    let hash = 'NGR-';
    for (let i = 0; i < 12; i++) {
        hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hash;
}

function systemDiagnostic(msg) {
    const timestamp = new Date().toISOString();
    console.log(`%c[NGR_DIAGNOSTIC][${timestamp}] ${msg}`, "color: #5c6b7f; font-size: 9px; font-family: 'Courier New', monospace;");
}

// ВШИТЫЙ ВИЗУАЛЬНЫЙ ДВИЖОК (УТЯЖЕЛЕННЫЙ CSS)
const industrialStyles = document.createElement("style");
industrialStyles.id = "ngr-market-industrial-v12";
industrialStyles.innerHTML = `
    .asset-icon-box { position: relative; width: 54px; height: 54px; background: #0e1a2b; border: 1px solid rgba(255,204,0,0.2); border-radius: 15px; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
    .rarity-glow { position: absolute; inset: -2px; border-radius: 16px; opacity: 0.15; pointer-events: none; }
    .rarity-glow.rare { background: #00ff88; box-shadow: 0 0 20px #00ff88; }
    .rarity-glow.legendary { background: #ffcc00; box-shadow: 0 0 25px #ffcc00; }
    .status-tag { font-size: 7px; background: rgba(0,255,136,0.1); color: #00ff88; padding: 2px 6px; border-radius: 4px; margin-left: 8px; font-weight: 900; letter-spacing: 0.5px; border: 1px solid rgba(0,255,136,0.2); }
    .price-stack { display: flex; flex-direction: column; align-items: flex-end; }
    .price-sub { font-size: 7px; color: #5c6b7f; font-weight: 800; letter-spacing: 1px; margin-top: 2px; }
    .industrial-data-layer { margin-top: 18px; padding-top: 14px; border-top: 1px dashed rgba(255,255,255,0.08); }
    .description-text { font-size: 10px; color: #8a9ab0; line-height: 1.5; margin-bottom: 12px; text-align: justify; font-family: inherit; }
    .specs-grid { display: flex; flex-direction: column; gap: 4px; }
    .spec-item { display: flex; justify-content: space-between; font-family: 'Courier New', monospace; font-size: 8px; }
    .spec-item .label { color: #3d4a5d; font-weight: bold; }
    .spec-item .val { color: #5c6b7f; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .asset-card:active .asset-icon-box { transform: scale(0.9); border-color: var(--accent); }
`;
document.head.appendChild(industrialStyles);

