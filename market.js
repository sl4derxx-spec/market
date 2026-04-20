import { CONFIG } from './config.js';

export function renderMarket(container, assets) {
    container.innerHTML = '';
    assets.forEach(asset => {
        const card = document.createElement('div');
        card.className = 'asset-card';
        card.setAttribute('data-id', asset.id);
        
        const priceCoins = (asset.price * CONFIG.coinsMultiplier).toFixed(0);
        
        // Логика кнопок
        const buttons = asset.is_currency 
            ? `<button onclick="buy('${asset.id}', 'stars', ${asset.price})">Пополнить ⭐</button>`
            : `<button onclick="buy('${asset.id}', 'stars', ${asset.price})">⭐ ${asset.price}</button>
               <button onclick="buy('${asset.id}', 'coins', ${priceCoins})">💰 ${priceCoins}</button>`;

        card.innerHTML = `
            <div class="asset-head">
                <span class="asset-icon">${asset.icon}</span>
                <span class="asset-name">${asset.name}</span>
            </div>
            <div class="buy-buttons">
                ${buttons}
            </div>
        `;
        container.appendChild(card);
    });
}
