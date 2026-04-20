import { CONFIG } from './config.js';

/**
 * NGR ANALYTICS ENGINE - HIGH-PERFORMANCE CHARTING MODULE
 * -------------------------------------------------------
 * Использует библиотеку Lightweight Charts для отрисовки котировок.
 * Файл содержит математические алгоритмы генерации и обработки данных.
 */

class NGRChart {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.chart = null;
        this.lineSeries = null;
        this.resizeHandler = null;
        
        if (this.container) {
            this.init();
        }
    }

    init() {
        console.log("[NGR Chart] Engine starting...");

        // Инициализация объекта графика TradingView
        this.chart = LightweightCharts.createChart(this.container, {
            width: this.container.offsetWidth,
            height: 200,
            layout: {
                backgroundColor: 'transparent',
                textColor: '#8a9ab0',
                fontSize: 10,
            },
            grid: {
                vertLines: { color: CONFIG.charts.gridColor },
                horzLines: { color: CONFIG.charts.gridColor },
            },
            crosshair: {
                mode: LightweightCharts.CrosshairMode.Normal,
            },
            rightPriceScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                timeVisible: true,
                secondsVisible: false,
            },
            handleScroll: true,
            handleScale: true,
        });

        // Создаем линию тренда
        this.lineSeries = this.chart.addLineSeries({
            color: CONFIG.charts.upColor,
            lineWidth: CONFIG.charts.lineWidth,
            lineType: 0, // Solid
            priceFormat: {
                type: 'price',
                precision: 2,
                minMove: 0.01,
            },
        });

        // Добавляем эффект свечения под линией (Area)
        this.lineSeries.applyOptions({
            topColor: 'rgba(0, 255, 136, 0.4)',
            bottomColor: 'rgba(0, 255, 136, 0.0)',
            baseLineColor: '#00ff88',
        });

        this.loadInitialData();
        this.setupAutoResize();
        this.startRealtimeSimulation();
    }

    loadInitialData() {
        // Генерируем исторические данные для солидного вида
        const data = [];
        const now = new Date();
        for (let i = 30; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            data.push({
                time: time.toISOString().split('T')[0],
                value: 5 + Math.random() * 2 // Вокруг цены NGR Coin
            });
        }
        this.lineSeries.setData(data);
    }

    // Симуляция живого рынка (пока бот не присылает реальные данные)
    startRealtimeSimulation() {
        setInterval(() => {
            const lastData = this.lineSeries.data ? this.lineSeries.data[this.lineSeries.data.length - 1] : null;
            if (!lastData) return;

            const newValue = lastData.value + (Math.random() - 0.5) * 0.2;
            const now = new Date();
            
            this.lineSeries.update({
                time: now.toISOString().split('T')[0],
                value: Math.max(0.1, newValue)
            });

            // Если цена растет - линия зеленая, если падает - красная
            const color = newValue >= lastData.value ? CONFIG.charts.upColor : CONFIG.charts.downColor;
            this.lineSeries.applyOptions({ color: color });

        }, CONFIG.charts.refreshInterval);
    }

    setupAutoResize() {
        this.resizeHandler = () => {
            if (this.chart && this.container) {
                this.chart.applyOptions({ width: this.container.offsetWidth });
            }
        };
        window.addEventListener('resize', this.resizeHandler);
    }

    // Метод для внешнего управления графиком (например, из админки)
    setAssetData(assetId, historyData) {
        if (this.lineSeries) {
            this.lineSeries.setData(historyData);
        }
    }
}

// Экспортируем функцию инициализации для app.js
export function initChart(containerId) {
    return new NGRChart(containerId);
}
