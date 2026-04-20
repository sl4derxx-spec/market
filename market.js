import { CONFIG } from './config.js';

/**
 * NGR CORE MARKET ENGINE v2.0
 * Мощный модуль управления отображением активов и торговых операций.
 */

// Локальное хранилище для отслеживания изменений (нужно для анимаций)
let previousPrices = {};

export function renderMarket(container, assets) {
    if (!container) return;

    // Генерируем скелет маркета
    container.innerHTML = `
        <div class="market-controls">
            <input type="text" id="asset-search" placeholder="Поиск токена..." oninput="filterAssets()">
            <div class="filter-chips">
                <span class="chip active" onclick="sortMarket('all')">Все</span>
                <span class="chip" onclick="sortMarket('gainers')">Лидеры роста</span>
                <span class="chip" onclick="sortMarket('new')">Новые</span>
            </div>
        </div>
        <div id="assets-wrapper" class="assets-grid"></div>
    `;

    const wrapper = document.getElementById('assets-wrapper');
    buildAssetCards(wrapper, assets);
}

function buildAssetCards(wrapper, assets) {
    wrapper.innerHTML = '';

    assets.forEach(asset => {
        const card = document.createElement('div');
        card.className = `asset-card-v2 ${asset.is_currency ? 'currency-special' : ''}`;
        card.id = `card-${asset.id}`;
        
        // Расчет цены
        const priceUSD = asset.price;
        const priceCoins = (priceUSD * CONFIG.coinsMultiplier).toFixed(0);
        
        // Логика изменения (фейковая для эстетики, пока нет данных с бэкенда)
        const change = (Math.random() * 5 - 2).toFixed(2);
        const changeClass = change >= 0 ? 'up' : 'down';

        card.innerHTML = `
            <div class="card-glow"></div>
            <div class="asset-main-info" onclick="toggleDetails('${asset.id}')">
                <div class="asset-logo-wrap">
                    <span class="asset-icon-large">${asset.icon}</span>
                </div>
                <div class="asset-meta">
                    <span class="asset-full-name">${asset.name}</span>
                    <span class="asset-ticker">${asset.id.toUpperCase()}</span>
                </div>
                <div class="asset-price-block">
                    <span class="price-usd">$${priceUSD.toLocaleString()}</span>
                    <span class="price-change ${changeClass}">${change >= 0 ? '+' : ''}${change}%</span>
                </div>
            </div>

            <div id="details-${asset.id}" class="asset-details hidden">
                <div class="stats-mini-grid">
                    <div class="stat-item"><span>Vol 24h:</span> <strong>$${(Math.random()*100).toFixed(1)}k</strong></div>
                    <div class="stat-item"><span>Cap:</span> <strong>$${(Math.random()*10).toFixed(1)}M</strong></div>
                </div>
            </div>

            <div class="trade-actions">
                ${generateButtons(asset, priceCoins)}
            </div>
        `;
        wrapper.appendChild(card);
    });

    injectMarketStyles();
}

function generateButtons(asset, priceCoins) {
    if (asset.id === 't_stars') {
        return `<button class="btn-buy-stars" onclick="buy('t_stars', 'stars', ${asset.price})">
                    <span>КУПИТЬ ⭐</span>
                </button>`;
    }
    return `
        <div class="multi-buy">
            <button class="btn-pay star" onclick="buy('${asset.id}', 'stars', ${asset.price})">
                ⭐ ${asset.price}
            </button>
            <button class="btn-pay coin" onclick="buy('${asset.id}', 'coins', ${priceCoins})">
                💰 ${priceCoins}
            </button>
        </div>
    `;
}

// Функции интерактивности
window.toggleDetails = (id) => {
    const el = document.getElementById(`details-${id}`);
    el.classList.toggle('hidden');
};

window.filterAssets = () => {
    const query = document.getElementById('asset-search').value.toLowerCase();
    const cards = document.querySelectorAll('.asset-card-v2');
    cards.forEach(card => {
        const name = card.querySelector('.asset-full-name').innerText.toLowerCase();
        card.style.display = name.includes(query) ? 'flex' : 'none';
    });
};

// ТЯЖЕЛЫЙ CSS ДЛЯ ВИЗУАЛА И ВЕСА ФАЙЛА
function injectMarketStyles() {
    if (document.getElementById('market-styles')) return;
    const style = document.createElement('style');
    style.id = 'market-styles';
    style.innerHTML = `
        .market-controls { margin-bottom: 20px; padding: 0 5px; }
        #asset-search { 
            width: 100%; background: #1e2a3a; border: 1px solid #333; 
            padding: 12px; border-radius: 12px; color: white; margin-bottom: 12px;
            box-sizing: border-box; font-size: 14px;
        }
        .filter-chips { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 5px; }
        .chip { 
            padding: 6px 15px; background: #1e2a3a; border-radius: 20px; 
            font-size: 11px; color: #8a9ab0; white-space: nowrap; 
        }
        .chip.active { background: #ffcc00; color: black; font-weight: bold; }
        
        .assets-grid { display: flex; flex-direction: column; gap: 12px; }
        
        .asset-card-v2 {
            background: linear-gradient(160deg, #0b1422 0%, #050a12 100%);
            border: 1px solid #1e2a3a; border-radius: 18px;
            padding: 15px; position: relative; overflow: hidden;
            display: flex; flex-direction: column; transition: 0.3s;
        }
        .asset-card-v2:active { transform: scale(0.98); border-color: #ffcc00; }
        
        .currency-special { border: 1px solid rgba(255, 204, 0, 0.4); box-shadow: 0 0 15px rgba(255, 204, 0, 0.1); }
        
        .asset-main-info { display: flex; align-items: center; gap: 15px; cursor: pointer; }
        .asset-logo-wrap { 
            width: 48px; height: 48px; background: #1e2a3a; 
            border-radius: 14px; display: flex; align-items: center; justify-content: center;
        }
        .asset-icon-large { font-size: 24px; }
        .asset-meta { flex: 1; display: flex; flex-direction: column; }
        .asset-full-name { font-weight: bold; font-size: 15px; color: #fff; }
        .asset-ticker { font-size: 11px; color: #5c6b7f; font-weight: 800; }
        
        .asset-price-block { text-align: right; display: flex; flex-direction: column; }
        .price-usd { font-weight: bold; font-size: 15px; color: #ffcc00; }
        .price-change { font-size: 11px; font-weight: bold; }
        .price-change.up { color: #00ff88; }
        .price-change.down { color: #ff4444; }
        
        .asset-details { 
            margin-top: 15px; padding-top: 15px; border-top: 1px solid #1e2a3a;
            animation: fadeIn 0.3s ease;
        }
        .stats-mini-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .stat-item { font-size: 11px; color: #8a9ab0; }
        .stat-item strong { color: #fff; }
        
        .trade-actions { margin-top: 15px; }
        .btn-buy-stars { 
            width: 100%; padding: 12px; border-radius: 12px; border: none;
            background: #ffcc00; font-weight: bold; font-size: 13px;
        }
        .multi-buy { display: flex; gap: 8px; }
        .btn-pay { 
            flex: 1; padding: 10px; border-radius: 10px; border: none;
            font-weight: bold; font-size: 12px; color: white;
        }
        .btn-pay.star { background: #2a3a4a; border: 1px solid #3a4a5a; }
        .btn-pay.coin { background: #1a2a1a; border: 1px solid #2a4a2a; color: #00ff88; }
        
        .hidden { display: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    `;
    document.head.appendChild(style);
}

