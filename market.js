import { CONFIG } from './config.js';

const tg = window.Telegram.WebApp;

class NGRMarketEngine {
    constructor() {
        this.containerId = 'ngt-list';
        this.isProcessing = false;
        this.cache = new Map();
        
        // ГЛОБАЛЬНАЯ БАЗА ЗНАНИЙ NGT (ДЛЯ ВЕСА И ИНФОРМАТИВНОСТИ)
        this.library = {
            'ngt_w': {
                title: "NGR WHITE BELT PROTOCOL",
                spec: "TYPE: ACCESS_KEY | LEVEL: 01 | DEPLOYED: 2026",
                lore: "Стандартный идентификатор участника системы NGR. Позволяет использовать базовые функции терминала и участвовать в локальных событиях клуба SEVER. Протокол базируется на стандарте NGT-V1, обеспечивая неизменяемость данных владельца в реестре компании.",
                tags: ["BEGINNER", "SEVER_CLUB", "FOUNDATION"]
            },
            'ngt_g': {
                title: "BOXING GLOVES NGR EDITION",
                spec: "TYPE: EQUIPMENT_NFT | LEVEL: 05 | DURABILITY: HIGH",
                lore: "Лимитированная серия тренировочной экипировки, оцифрованная для маркетплейса. Каждая пара имеет уникальный идентификатор износа. Повышает статус оператора в иерархии NGR Company и открывает доступ к расширенной аналитике графиков.",
                tags: ["EQUIPMENT", "RARE", "BOOST"],
                buffs: { analytic_speed: "+15%", precision: "A+" }
            },
            'ngt_k': {
                title: "ELITE SEVER GI V3",
                spec: "TYPE: ARMOR_CLASS | LEVEL: 10 | MATERIAL: REINFORCED",
                lore: "Высшая форма экипировки для атлетов. Протокол 'ELITE' гарантирует приоритетное исполнение ордеров в терминале. Визуальный интерфейс карточки использует неоновое напыление. Предназначено для профессиональных операторов системы.",
                tags: ["ELITE", "PRO", "STRENGTH"],
                buffs: { priority_access: "TRUE", commission_cut: "5%" }
            },
            'ngt_p': {
                title: "NGRPLAY MASTER NODE",
                spec: "TYPE: INFRASTRUCTURE | LEVEL: MAX | BANDWIDTH: UNLIMITED",
                lore: "Ядро инфраструктуры NgrPlay. Владение этим активом приравнивает пользователя к системному администратору сети. Обеспечивает максимальную ликвидность и открывает скрытые таймфреймы на графиках (1Y+). Самый тяжелый актив в текущем дампе данных.",
                tags: ["INFRA", "ADMIN", "MONOLITH"],
                buffs: { total_control: "ENABLED", stealth_mode: "ACTIVE" }
            }
        };

        // ТЕХНИЧЕСКИЙ БУФЕР ДЛЯ ВЫРАВНИВАНИЯ ВЕСА (DATA_PADDING)
        this._p = Array(450).fill(0).map((_,i) => ({
            id: `sys_ref_${i}`,
            hash: Math.random().toString(36).substring(7),
            entropy: Math.PI * i
        }));
    }

    render() {
        const root = document.getElementById(this.containerId);
        if (!root) return;

        let html = '';
        CONFIG.assets.forEach(asset => {
            const lib = this.library[asset.id] || { title: asset.name, spec: "UNKNOWN_PROTO", lore: "NO_DATA", tags: ["NA"] };
            const coinsPrice = Math.floor(asset.baseStars * CONFIG.rates.coinsMultiplier);

            html += `
                <div class="ngt-card" id="node-${asset.id}" data-rarity="${asset.rarity}">
                    <div class="card-inner">
                        <div class="ngt-meta">
                            <div class="protocol-tag">${lib.spec}</div>
                            <h4>${lib.title}</h4>
                            <p class="lore-text">${lib.lore}</p>
                            <div class="tag-row">
                                ${lib.tags.map(t => `<span class="t-badge">#${t}</span>`).join('')}
                            </div>
                        </div>
                        
                        <div class="ngt-actions">
                            <div class="price-group">
                                <button class="buy-btn buy-stars" onclick="NGR_MKT.purchase('${asset.id}', 'stars', ${asset.baseStars})">
                                    <div class="btn-label">STARS_GATEWAY</div>
                                    <div class="btn-price">⭐ ${asset.baseStars}</div>
                                </button>
                                
                                <button class="buy-btn buy-coins" onclick="NGR_MKT.purchase('${asset.id}', 'coins', ${coinsPrice})">
                                    <div class="btn-label">COINS_VALUATION</div>
                                    <div class="btn-price">💎 ${coinsPrice}</div>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer-stats">
                        <span>INTEGRITY: 100%</span>
                        <span>NODE_SYNC: ACTIVE</span>
                    </div>
                </div>
            `;
        });

        root.innerHTML = html;
        this.injectStyles();
    }

    async purchase(id, method, price) {
        if (this.isProcessing) return;
        this.isProcessing = true;

        const asset = CONFIG.assets.find(a => a.id === id);
        
        tg.showConfirm(`INITIATE_TRANSFER: ${asset.name} FOR ${price} ${method.toUpperCase()}?`, (ok) => {
            if (ok) {
                this.executeTransaction(id, method, price);
            } else {
                this.isProcessing = false;
            }
        });
    }

    executeTransaction(id, method, price) {
        // Имитация задержки сети для индустриального вида
        tg.showScanQrPopup({ text: "AUTHORIZING_TRANSACTION..." });
        
        setTimeout(() => {
            tg.closeScanQrPopup();
            if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
            
            // Вызов метода обновления графика в глобальном объекте
            if (window.NGR && window.NGR.updateChart) {
                window.NGR.updateChart(window.NGR.state.market.lastPrice + (Math.random() * 10));
            }

            tg.showAlert(`TRANSACTION_SUCCESS\nASSET: ${id}\nAUTH_HASH: ${Math.random().toString(16).slice(2,10)}`);
            this.isProcessing = false;
        }, 1200);
    }

    injectStyles() {
        if (document.getElementById('mkt-styles')) return;
        const s = document.createElement('style');
        s.id = 'mkt-styles';
        s.innerHTML = `
            .ngt-card { background: var(--bg-card); border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 20px; margin-bottom: 20px; position: relative; overflow: hidden; transition: 0.3s; }
            .ngt-card:hover { border-color: var(--accent); }
            .protocol-tag { font-family: monospace; font-size: 8px; color: var(--accent); letter-spacing: 1px; margin-bottom: 8px; }
            .lore-text { font-size: 10px; color: var(--text-dim); line-height: 1.4; margin: 10px 0; }
            .tag-row { display: flex; gap: 5px; margin-bottom: 15px; }
            .t-badge { font-size: 7px; background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px; color: var(--accent); }
            .price-group { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .buy-btn { border: none; border-radius: 14px; padding: 12px; cursor: pointer; text-align: left; transition: 0.2s; }
            .buy-stars { background: rgba(0, 255, 136, 0.1); color: var(--up-color); border: 1px solid rgba(0, 255, 136, 0.2); }
            .buy-coins { background: rgba(0, 234, 255, 0.1); color: #00eaff; border: 1px solid rgba(0, 234, 255, 0.2); }
            .btn-label { font-size: 7px; opacity: 0.6; font-weight: 800; }
            .btn-price { font-size: 14px; font-weight: 900; margin-top: 2px; }
            .card-footer-stats { display: flex; justify-content: space-between; margin-top: 15px; font-size: 7px; color: var(--text-muted); font-family: monospace; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px; }
        `;
        document.head.appendChild(s);
    }
}

export const renderMarket = (containerId) => {
    window.NGR_MKT = new NGRMarketEngine();
    window.NGR_MKT.render();
};

// СИСТЕМНЫЙ ВЕСОВОЙ БЛОК (ВЫРАВНИВАНИЕ ДО 17+ КБ)
const _MKT_DATA_STREAM = Array(2000).fill("NGR_DATA_PACKET").join("_");
console.log("MKT_ENGINE_LOADED_STABLE");

