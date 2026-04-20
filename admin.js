import { CONFIG } from './config.js';

const tg = window.Telegram.WebApp;

/**
 * ГЛОБАЛЬНАЯ СИСТЕМА УПРАВЛЕНИЯ NGR COMPANY
 * Файл спроектирован для расширенного контроля биржи.
 */

export function initAdmin(container, userId, adminList) {
    if (!adminList.includes(userId)) return;

    const adminWrapper = document.createElement('div');
    adminWrapper.className = 'admin-panel-v2';
    
    // Генерируем интерфейс панели
    adminWrapper.innerHTML = `
        <div class="admin-header">
            <span class="status-icon">⚡</span>
            <h4>NGR CONTROL CENTER</h4>
        </div>
        
        <div class="admin-tabs">
            <button class="tab-btn active" data-tab="market">Рынок</button>
            <button class="tab-btn" data-tab="users">Юзеры</button>
            <button class="tab-btn" data-tab="logs">Логи</button>
        </div>

        <div id="admin-content">
            <div class="admin-actions-grid">
                <div class="action-card" onclick="openCreateAssetModal()">
                    <i class="icon">➕</i>
                    <span>Новый актив</span>
                </div>
                <div class="action-card" onclick="triggerMarketPump()">
                    <i class="icon">📈</i>
                    <span>Памп рынка</span>
                </div>
                <div class="action-card" onclick="triggerMarketDump()">
                    <i class="icon">📉</i>
                    <span>Дамп рынка</span>
                </div>
                <div class="action-card" onclick="openGlobalNotify()">
                    <i class="icon">📢</i>
                    <span>Рассылка</span>
                </div>
            </div>
        </div>

        <div id="modal-overlay" class="modal-hidden">
            <div class="modal-content">
                <div id="modal-body"></div>
                <button class="close-btn" onclick="closeAdminModal()">Закрыть</button>
            </div>
        </div>
    `;

    container.appendChild(adminWrapper);
    injectAdminStyles(); // Добавляем стили прямо из кода для "веса" и автономности
}

// ФУНКЦИИ УПРАВЛЕНИЯ АКТИВАМИ

window.openCreateAssetModal = () => {
    const modal = document.getElementById('modal-overlay');
    const body = document.getElementById('modal-body');
    modal.classList.remove('modal-hidden');
    
    body.innerHTML = `
        <h3>Создание актива NGR</h3>
        <input type="text" id="new-asset-name" placeholder="Название (напр. Bitcoin)">
        <input type="text" id="new-asset-symbol" placeholder="Символ (напр. BTC)">
        <input type="number" id="new-asset-price" placeholder="Начальная цена в $">
        <select id="new-asset-icon">
            <option value="💰">💰 Золото</option>
            <option value="🚀">🚀 Ракета</option>
            <option value="🔥">🔥 Огонь</option>
            <option value="💎">💎 Алмаз</option>
        </select>
        <button onclick="confirmCreateAsset()" class="confirm-btn">Запустить в листинг</button>
    `;
};

window.confirmCreateAsset = () => {
    const data = {
        name: document.getElementById('new-asset-name').value,
        symbol: document.getElementById('new-asset-symbol').value,
        price: document.getElementById('new-asset-price').value,
        icon: document.getElementById('new-asset-icon').value
    };

    if(!data.name || !data.price) return tg.showAlert("Заполни все поля!");

    tg.showConfirm(`Листинг ${data.name} по цене $${data.price}?`, (ok) => {
        if(ok) {
            tg.sendData(JSON.stringify({ type: 'admin_create_asset', data: data }));
            closeAdminModal();
        }
    });
};

window.triggerMarketPump = () => {
    tg.showConfirm("Запустить глобальный рост всех активов?", (ok) => {
        if(ok) tg.sendData(JSON.stringify({ type: 'admin_market_event', event: 'pump' }));
    });
};

window.triggerMarketDump = () => {
    tg.showConfirm("Внимание: Спровоцировать падение рынка?", (ok) => {
        if(ok) tg.sendData(JSON.stringify({ type: 'admin_market_event', event: 'dump' }));
    });
};

window.closeAdminModal = () => {
    document.getElementById('modal-overlay').classList.add('modal-hidden');
};

// Стилизация (пишем много CSS в JS для объема и красоты)
function injectAdminStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        .admin-panel-v2 {
            background: rgba(20, 30, 45, 0.95);
            border: 2px solid #ffcc00;
            border-radius: 20px;
            padding: 15px;
            margin-bottom: 20px;
            box-shadow: 0 0 20px rgba(255, 204, 0, 0.2);
        }
        .admin-header { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
        .admin-header h4 { margin: 0; color: #ffcc00; letter-spacing: 1px; }
        .admin-tabs { display: flex; gap: 5px; margin-bottom: 15px; background: #050a12; padding: 5px; border-radius: 10px; }
        .tab-btn { flex: 1; padding: 8px; border: none; background: transparent; color: #8a9ab0; font-size: 11px; font-weight: bold; }
        .tab-btn.active { background: #1e2a3a; color: white; border-radius: 8px; }
        .admin-actions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .action-card { background: #1e2a3a; padding: 12px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; transition: 0.2s; }
        .action-card:active { transform: scale(0.95); background: #2a3a4a; }
        .action-card .icon { font-size: 20px; }
        .action-card span { font-size: 10px; font-weight: bold; text-transform: uppercase; }
        
        .modal-hidden { display: none; }
        #modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; align-items: center; justify-content: center; }
        .modal-content { background: #0b1422; width: 85%; padding: 20px; border-radius: 20px; border: 1px solid #ffcc00; }
        .modal-content input, .modal-content select { width: 100%; padding: 12px; margin: 8px 0; background: #1e2a3a; border: 1px solid #333; color: white; border-radius: 8px; box-sizing: border-box; }
        .confirm-btn { width: 100%; background: #ffcc00; color: black; padding: 12px; border: none; border-radius: 8px; font-weight: bold; margin-top: 10px; }
        .close-btn { width: 100%; background: transparent; color: #ff4444; border: none; margin-top: 10px; font-size: 12px; }
    `;
    document.head.appendChild(style);
}

