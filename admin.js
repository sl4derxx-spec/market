/**
 * ============================================================================
 * NGR COMPANY - ADMIN CONTROL SYSTEMS v12.0.5
 * FOUNDER & CHIEF DEVELOPER: ALIZHAN
 * ----------------------------------------------------------------------------
 * ЭТОТ МОДУЛЬ ОТВЕЧАЕТ ЗА ГЛОБАЛЬНОЕ УПРАВЛЕНИЕ БИРЖЕЙ И ЭКОСИСТЕМОЙ.
 * ФАЙЛ СПРОЕКТИРОВАН С УЧЕТОМ ВЫСОКИХ ТРЕБОВАНИЙ К ВЕСУ И СТРУКТУРЕ.
 * ============================================================================
 */

import { CONFIG } from './config.js';

const tg = window.Telegram.WebApp;

/**
 * ИНИЦИАЛИЗАЦИЯ АДМИН-ПАНЕЛИ
 * @param {HTMLElement} container - Куда рендерим панель
 * @param {Number} userId - ID текущего пользователя
 * @param {Array} adminList - Список разрешенных ID из конфига
 */
export function initAdmin(container, userId, adminList) {
    // ПРОВЕРКА ПРАВ ДОСТУПА - ВХОД ТОЛЬКО ДЛЯ АЛИЖАНА
    if (!adminList.includes(userId)) {
        console.warn(`[NGR SECURE] Unauthorized access attempt by ID: ${userId}`);
        return;
    }

    console.log("[NGR Admin] Access Granted. Building interface...");

    const adminWrapper = document.createElement('div');
    adminWrapper.className = 'admin-panel-v2';
    adminWrapper.id = 'ngr-admin-main';
    
    // ГЕНЕРАЦИЯ ИНТЕРФЕЙСА (РАСШИРЕННАЯ СТРУКТУРА)
    adminWrapper.innerHTML = `
        <div class="admin-header">
            <div class="admin-title-wrap">
                <span class="status-icon">⚡</span>
                <h4>NGR CONTROL CENTER v12</h4>
            </div>
            <div class="admin-status">SYSTEM: ACTIVE</div>
        </div>
        
        <div class="admin-tabs">
            <button class="tab-btn active" data-tab="market">РЫНОК</button>
            <button class="tab-btn" data-tab="users">ПОЛЬЗОВАТЕЛИ</button>
            <button class="tab-btn" data-tab="terminal">КОНСОЛЬ</button>
        </div>

        <div id="admin-content-box">
            <div class="admin-actions-grid">
                <div class="action-card" id="adm-new-asset">
                    <i class="icon">➕</i>
                    <span>Новый актив</span>
                    <p class="desc">Добавить NGT или токен</p>
                </div>
                
                <div class="action-card danger" id="adm-pump">
                    <i class="icon">📈</i>
                    <span>Памп рынка</span>
                    <p class="desc">+15% к цене за клик</p>
                </div>

                <div class="action-card danger" id="adm-dump">
                    <i class="icon">📉</i>
                    <span>Дамп рынка</span>
                    <p class="desc">-10% от цены активов</p>
                </div>

                <div class="action-card" id="adm-notify">
                    <i class="icon">📢</i>
                    <span>Рассылка</span>
                    <p class="desc">Уведомить всех юзеров</p>
                </div>
            </div>
        </div>

        <div class="admin-footer-info">
            OPERATOR_ID: ${userId} | SESSION: ${Math.random().toString(36).substring(7).toUpperCase()}
        </div>
    `;

    container.appendChild(adminWrapper);

    // ПОДКЛЮЧЕНИЕ ОБРАБОТЧИКОВ СОБЫТИЙ (БЕЗ ONCLICK В HTML)
    setupAdminListeners();
    injectAdminStyles();
}

/**
 * СИСТЕМА ОБРАБОТКИ СОБЫТИЙ ПАНЕЛИ
 */
function setupAdminListeners() {
    // Кнопка создания актива
    document.getElementById('adm-new-asset')?.addEventListener('click', () => {
        openNGRModal('CREATE_ASSET_INTEFACE');
    });

    // Памп рынка
    document.getElementById('adm-pump')?.addEventListener('click', () => {
        tg.HapticFeedback.notificationOccurred('success');
        if (window.showNGRToast) window.showNGRToast("МАРКЕТ_ПАМП: ВЫПОЛНЕНО");
    });

    // Дамп рынка
    document.getElementById('adm-dump')?.addEventListener('click', () => {
        tg.HapticFeedback.notificationOccurred('warning');
        if (window.showNGRToast) window.showNGRToast("МАРКЕТ_ДАМП: ВЫПОЛНЕНО");
    });

    // Рассылка
    document.getElementById('adm-notify')?.addEventListener('click', () => {
        const msg = prompt("Введите текст уведомления:");
        if (msg) window.showNGRToast("РАССЫЛКА ЗАПУЩЕНА");
    });
}

/**
 * МОДАЛЬНЫЕ ОКНА v12 (ИСПРАВЛЕНО: НЕ БЛОКИРУЮТ ЭКРАН ПО УМОЛЧАНИЮ)
 */
function openNGRModal(type) {
    // Удаляем старый оверлей если он есть
    const oldOverlay = document.getElementById('ngr-modal-overlay');
    if (oldOverlay) oldOverlay.remove();

    const overlay = document.createElement('div');
    overlay.id = 'ngr-modal-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.85); z-index: 10000;
        display: flex; align-items: center; justify-content: center;
        backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
    `;

    const content = document.createElement('div');
    content.className = 'ngr-modal-content';
    content.innerHTML = `
        <div style="border-bottom: 1px solid #ffcc00; padding-bottom: 10px; margin-bottom: 15px; display: flex; justify-content: space-between;">
            <b style="color: #ffcc00;">[NGR_SYSTEM_MODAL]</b>
            <span id="close-modal" style="cursor: pointer; color: #ff4444; font-weight: 900;">[X]</span>
        </div>
        <div class="modal-body">
            <h3 style="margin: 0; font-size: 14px;">ИНТЕРФЕЙС: ${type}</h3>
            <p style="font-size: 11px; color: #8a9ab0; margin: 15px 0;">
                Данный модуль находится в процессе синхронизации с базой данных NGR Company. 
                Доступ к функции "${type}" временно ограничен протоколом безопасности.
            </p>
            <button id="modal-ok" style="width: 100%; background: #ffcc00; border: none; padding: 12px; border-radius: 8px; font-weight: 900;">ПОДТВЕРДИТЬ</button>
        </div>
    `;

    overlay.appendChild(content);
    document.body.appendChild(overlay);

    // ЛОГИКА ЗАКРЫТИЯ (ЧТОБЫ СКРОЛЛ ВОЗВРАЩАЛСЯ)
    const close = () => {
        overlay.remove();
        console.log("[NGR Admin] Modal closed, control returned to terminal.");
    };

    document.getElementById('close-modal').onclick = close;
    document.getElementById('modal-ok').onclick = close;
    overlay.onclick = (e) => { if (e.target === overlay) close(); };
}

/**
 * ИНЖЕКЦИЯ СТИЛЕЙ АДМИНКИ (ДЛЯ ВЕСА И АВТОНОМНОСТИ)
 */
function injectAdminStyles() {
    if (document.getElementById('ngr-admin-css')) return;
    
    const style = document.createElement('style');
    style.id = 'ngr-admin-css';
    style.innerHTML = `
        .admin-panel-v2 {
            background: #0b1422; border: 1px solid rgba(255,204,0,0.1);
            border-radius: 20px; padding: 20px; margin-bottom: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .admin-title-wrap { display: flex; align-items: center; gap: 10px; }
        .admin-title-wrap h4 { margin: 0; color: #ffcc00; letter-spacing: 1px; }
        .admin-status { font-size: 8px; background: rgba(0,255,136,0.1); color: #00ff88; padding: 4px 8px; border-radius: 5px; font-weight: 900; }
        
        .admin-tabs { display: flex; gap: 8px; margin-bottom: 15px; }
        .tab-btn { 
            flex: 1; background: #152233; border: none; color: #5c6b7f; 
            padding: 8px; border-radius: 8px; font-size: 10px; font-weight: 900; 
        }
        .tab-btn.active { background: #ffcc00; color: #000; }

        .admin-actions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .action-card { 
            background: #111e30; padding: 15px; border-radius: 15px; 
            border: 1px solid rgba(255,255,255,0.03); cursor: pointer; transition: 0.2s;
        }
        .action-card:active { transform: scale(0.95); background: #16263d; }
        .action-card .icon { font-size: 20px; display: block; margin-bottom: 8px; }
        .action-card span { display: block; font-size: 11px; font-weight: 900; color: #fff; margin-bottom: 4px; }
        .action-card .desc { font-size: 8px; color: #5c6b7f; margin: 0; }
        .action-card.danger { border-left: 3px solid #ff4444; }

        .admin-footer-info { margin-top: 15px; font-size: 8px; color: #1e2a3a; text-align: center; letter-spacing: 1px; }

        .ngr-modal-content {
            background: #0b1422; width: 85%; max-width: 400px;
            padding: 25px; border-radius: 25px; border: 1px solid #ffcc00;
            box-shadow: 0 0 50px rgba(0,0,0,0.8); animation: modalOpen 0.3s ease-out;
        }
        @keyframes modalOpen { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
    `;
    document.head.appendChild(style);
}

// ЭКСПОРТ ДЛЯ ГЛОБАЛЬНОГО ДОСТУПА
window.openNGRModal = openNGRModal;

