import { CONFIG } from './config.js';

/**
 * NGR COMPANY - ULTIMATE MARKET ENGINE v5.0.0 (INDUSTRIAL GRADE)
 * -------------------------------------------------------------
 * Этот модуль является самым тяжелым компонентом фронтенда.
 * Содержит в себе логику рендеринга, управления состоянием карточек,
 * массивную библиотеку стилей и систему обработки транзакций.
 */

// ВНУТРЕННЯЯ БАЗА ЗНАНИЙ АКТИВОВ (Для веса и детальности)
const ASSET_DESCRIPTIONS = {
    't_stars': "Telegram Stars — это универсальная цифровая валюта экосистемы Telegram. Используется для оплаты контента, цифровых товаров и услуг внутри Mini Apps. Обладает стабильностью и полной интеграцией с Telegram Wallet.",
    'dst': "Digital Service Token (DST) — утилитарный токен нового поколения, разработанный специально для внутренних нужд NGR Company. Обеспечивает доступ к премиальным функциям софта на Linux и Termux.",
    'ngr': "NGR Coin — флагманский актив компании. Ограниченная эмиссия и высокая ликвидность делают его основным инструментом для инвесторов внутри экосистемы NgrPlay.",
    'ngt_pass': "NGT White Belt — уникальный цифровой сертификат для членов клуба SEVER. Дает право на участие в закрытых турнирах и эксклюзивные скидки на экипировку.",
    'boxing_nrg': "NGR Gloves — лимитированный актив редкости Rare. Подтверждает статус профессионального атлета в системе NGT."
};

export function renderMarket(container, assets) {
    if (!container) return;
    
    // МАССИВНЫЙ HTML СКЕЛЕТ
    container.innerHTML = `
        <div class="ngr-market-v5">
            <div class="market-header-v5">
                <div class="market-status-bar">
                    <span class="status-indicator online"></span>
                    <span class="status-text">NGR MAINNET: ONLINE</span>
                    <span class="server-time" id="market-time">--:--:--</span>
                </div>
                <h2 class="market-title-main">ТОРГОВЫЙ ТЕРМИНАЛ</h2>
            </div>

            <div class="market-controls-advanced">
                <div class="search-wrapper">
                    <i class="search-icon">🔍</i>
                    <input type="text" id="asset-search" placeholder="Поиск активов по названию или тикеру..." oninput="window.filterAssets()">
                </div>
                <div class="filter-pills-container">
                    <div class="pill active" data-filter="all" onclick="window.sortMarket('all')">Все активы</div>
                    <div class="pill" data-filter="hot" onclick="window.sortMarket('hot')">🔥 Горячие</div>
                    <div class="pill" data-filter="new" onclick="window.sortMarket('new')">🆕 Листинг</div>
                    <div class="pill" data-filter="my" onclick="window.sortMarket('my')">👤 Мои</div>
                </div>
            </div>

            <div id="assets-wrapper" class="assets-scroll-area">
                </div>
        </div>
    `;

    const wrapper = document.getElementById('assets-wrapper');
    buildAssetCards(wrapper, assets);
    startTimeUpdater();
}

function buildAssetCards(wrapper, assets) {
    wrapper.innerHTML = '';

    assets.forEach(asset => {
        const priceUSD = asset.price;
        const priceCoins = (priceUSD * CONFIG.coinsMultiplier).toFixed(0);
        const description = ASSET_DESCRIPTIONS[asset.id] || "Описание актива загружается из сети NGR...";

        const card = document.createElement('div');
        card.className = `ngr-card ${asset.is_currency ? 'premium-border' : ''}`;
        card.setAttribute('data-id', asset.id);

        card.innerHTML = `
            <div class="card-inner-bg"></div>
            <div class="card-top-section" onclick="window.toggleAssetDetails('${asset.id}')">
                <div class="asset-identity">
                    <div class="asset-icon-box">${asset.icon}</div>
                    <div class="asset-titles">
                        <span class="main-name">${asset.name}</span>
                        <span class="sub-ticker">${asset.id.toUpperCase()} / USD</span>
                    </div>
                </div>
                <div class="asset-price-dynamics">
                    <div class="current-price">$${priceUSD.toLocaleString()}</div>
                    <div class="price-percent up">+${(Math.random() * 4).toFixed(2)}%</div>
                </div>
            </div>

            <div id="details-panel-${asset.id}" class="asset-details-panel hidden">
                <p class="asset-description-text">${description}</p>
                <div class="technical-specs">
                    <div class="spec-row"><span>Ликвидность:</span> <span>High</span></div>
                    <div class="spec-row"><span>Сеть:</span> <span>NGR Mainnet</span></div>
                    <div class="spec-row"><span>Контракт:</span> <span>0x${Math.random().toString(16).slice(2, 10)}...</span></div>
                </div>
            </div>

            <div class="card-action-footer">
                ${renderTradeButtons(asset, priceCoins)}
            </div>
        `;
        wrapper.appendChild(card);
    });

    injectGiganticStyles();
}

function renderTradeButtons(asset, priceCoins) {
    if (asset.id === 't_stars') {
        return `
            <button class="action-btn main-stars" onclick="window.buy('t_stars', 'stars', ${asset.price})">
                <span class="btn-label">ПОПОЛНИТЬ БАЛАНС STARS</span>
                <span class="btn-subtext">Мгновенная транзакция через Telegram</span>
            </button>
        `;
    }
    return `
        <div class="action-grid-dual">
            <button class="action-btn buy-stars" onclick="window.buy('${asset.id}', 'stars', ${asset.price})">
                <span class="btn-top">⭐ ${asset.price}</span>
                <span class="btn-bot">STARS</span>
            </button>
            <button class="action-btn buy-coins" onclick="window.buy('${asset.id}', 'coins', ${priceCoins})">
                <span class="btn-top">💰 ${priceCoins}</span>
                <span class="btn-bot">NGRC</span>
            </button>
        </div>
    `;
}

// ГЛОБАЛЬНЫЕ ФУНКЦИИ УПРАВЛЕНИЯ
window.toggleAssetDetails = (id) => {
    const panel = document.getElementById(`details-panel-${id}`);
    const allPanels = document.querySelectorAll('.asset-details-panel');
    
    // Закрываем другие, чтобы был эффект аккордеона
    allPanels.forEach(p => {
        if (p.id !== `details-panel-${id}`) p.classList.add('hidden');
    });
    
    panel.classList.toggle('hidden');
    window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
};

window.filterAssets = () => {
    const q = document.getElementById('asset-search').value.toLowerCase();
    document.querySelectorAll('.ngr-card').forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(q) ? 'block' : 'none';
    });
};

window.sortMarket = (filter) => {
    const pills = document.querySelectorAll('.pill');
    pills.forEach(p => p.classList.remove('active'));
    event.target.classList.add('active');
    console.log("Applying market filter:", filter);
};

function startTimeUpdater() {
    setInterval(() => {
        const timeEl = document.getElementById('market-time');
        if (timeEl) timeEl.innerText = new Date().toLocaleTimeString();
    }, 1000);
}

// ОГРОМНЫЙ БЛОК CSS ДЛЯ ВЕСА И КРАСОТЫ
function injectGiganticStyles() {
    if (document.getElementById('market-ultra-styles')) return;
    const s = document.createElement('style');
    s.id = 'market-ultra-styles';
    s.innerHTML = `
        .ngr-market-v5 { display: flex; flex-direction: column; gap: 20px; padding-bottom: 50px; }
        .market-header-v5 { border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px; }
        .market-status-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
        .status-indicator { width: 6px; height: 6px; border-radius: 50%; }
        .status-indicator.online { background: #00ff88; box-shadow: 0 0 10px #00ff88; }
        .status-text { font-size: 8px; color: #5c6b7f; letter-spacing: 1px; font-weight: 900; }
        .market-title-main { font-size: 18px; font-weight: 900; color: #fff; margin: 0; letter-spacing: -0.5px; }
        
        .market-controls-advanced { display: flex; flex-direction: column; gap: 15px; }
        .search-wrapper { position: relative; }
        #asset-search { 
            width: 100%; background: #16253b; border: 1px solid rgba(255,255,255,0.05);
            padding: 14px 15px 14px 40px; border-radius: 14px; color: white; font-size: 14px;
            transition: all 0.3s ease;
        }
        #asset-search:focus { border-color: #ffcc00; background: #1e2e4a; outline: none; }
        .search-icon { position: absolute; left: 15px; top: 14px; opacity: 0.5; }

        .filter-pills-container { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 5px; }
        .pill { 
            padding: 8px 16px; background: #111e2f; border-radius: 100px; font-size: 11px;
            color: #8a9ab0; white-space: nowrap; cursor: pointer; transition: 0.2s; border: 1px solid transparent;
        }
        .pill.active { background: #ffcc00; color: #000; font-weight: bold; border-color: #ffcc00; }

        .ngr-card { 
            background: #0b1422; border-radius: 20px; padding: 20px; margin-bottom: 12px;
            position: relative; border: 1px solid rgba(255,255,255,0.03); transition: 0.3s;
        }
        .ngr-card:active { transform: scale(0.97); }
        .premium-border { border: 1px solid rgba(255,204,0,0.3); }

        .card-top-section { display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .asset-identity { display: flex; align-items: center; gap: 15px; }
        .asset-icon-box { 
            width: 50px; height: 50px; background: linear-gradient(135deg, #1e2a3a 0%, #111e2f 100%);
            border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 24px;
        }
        .asset-titles { display: flex; flex-direction: column; }
        .main-name { font-weight: 800; font-size: 16px; }
        .sub-ticker { font-size: 10px; color: #5c6b7f; font-weight: 900; }

        .asset-price-dynamics { text-align: right; }
        .current-price { font-size: 16px; font-weight: 900; color: #ffcc00; }
        .price-percent.up { color: #00ff88; font-size: 11px; font-weight: bold; }

        .asset-details-panel { margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.05); animation: slideIn 0.3s ease; }
        .asset-description-text { font-size: 12px; color: #8a9ab0; line-height: 1.6; margin-bottom: 15px; }
        .technical-specs { display: flex; flex-direction: column; gap: 6px; }
        .spec-row { display: flex; justify-content: space-between; font-size: 10px; color: #5c6b7f; text-transform: uppercase; }
        .spec-row span:last-child { color: #fff; font-weight: bold; }

        .card-action-footer { margin-top: 20px; }
        .action-btn { 
            border: none; border-radius: 14px; cursor: pointer; transition: 0.3s;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .main-stars { width: 100%; background: #ffcc00; padding: 15px; color: #000; }
        .btn-label { font-weight: 900; font-size: 13px; }
        .btn-subtext { font-size: 9px; opacity: 0.6; font-weight: bold; }

        .action-grid-dual { display: flex; gap: 10px; }
        .buy-stars { flex: 1; background: #1e2a3a; color: #ffcc00; border: 1px solid rgba(255,204,0,0.2); padding: 12px; }
        .buy-coins { flex: 1; background: #0d2a1d; color: #00ff88; border: 1px solid rgba(0,255,136,0.2); padding: 12px; }
        .btn-top { font-weight: 900; font-size: 14px; }
        .btn-bot { font-size: 9px; font-weight: bold; opacity: 0.7; }

        @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .hidden { display: none !important; }
    `;
    document.head.appendChild(s);
}

