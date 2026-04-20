const tg = window.Telegram.WebApp;

/**
 * Инициализация панели администратора
 * @param {HTMLElement} container - Куда вставить панель
 * @param {number} userId - ID текущего пользователя
 * @param {Array} adminList - Список ID администраторов из config.js
 */
export function initAdmin(container, userId, adminList) {
    // Проверяем, есть ли ID пользователя в списке админов
    if (!adminList.includes(userId)) {
        console.log("Доступ к админ-панели запрещен для ID:", userId);
        return;
    }

    const panel = document.createElement('div');
    panel.className = 'admin-panel';
    panel.innerHTML = `
        <h4>🛠 Панель Создателя NGR</h4>
        <div class="admin-buttons" style="display: flex; gap: 10px;">
            <button onclick="adminAction('create')" style="flex: 1; background: #ffcc00; color: black;">➕ Создать актив</button>
            <button onclick="adminAction('stats')" style="flex: 1;">📊 Статистика</button>
        </div>
    `;
    container.appendChild(panel);
}

// Функция для отправки команд боту
window.adminAction = (action) => {
    tg.showConfirm(`Вы уверены, что хотите выполнить действие: ${action}?`, (ok) => {
        if (ok) {
            tg.sendData(JSON.stringify({ 
                type: 'admin_action', 
                action: action 
            }));
            // Можно не закрывать, чтобы админ мог делать несколько действий
        }
    });
};
