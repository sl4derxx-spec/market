import { CONFIG, DEFAULT_ASSETS } from './config.js';
import { renderMarket } from './market.js';
import { initAdmin } from './admin.js';

const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

document.addEventListener('DOMContentLoaded', () => {
    const user = tg.initDataUnsafe.user || { id: 0, first_name: 'Admin' };
    
    document.getElementById('user-name').innerText = user.first_name;
    if (user.photo_url) document.getElementById('user-photo').src = user.photo_url;

    // Показываем балансы (потом бот будет присылать реальные цифры)
    document.getElementById('user-balance').innerHTML = `
        <div style="color: #fff;">💰 0 Coins</div>
        <div style="color: #ffcc00;">⭐ 0 Stars</div>
    `;

    initAdmin(document.getElementById('admin-container'), user.id, CONFIG.adminIds);
    renderMarket(document.getElementById('market-grid'), DEFAULT_ASSETS);
});

window.buy = (id, method, price) => {
    tg.showConfirm(`Оплатить ${price} ${method}?`, (ok) => {
        if (ok) {
            tg.sendData(JSON.stringify({
                type: 'transaction',
                asset_id: id,
                method: method
            }));
            tg.close();
        }
    });
};

