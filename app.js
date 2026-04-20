const tg = window.Telegram.WebApp;
tg.expand(); // Разворачиваем на весь экран

// Настройки графика
const chartOptions = {
    layout: {
        backgroundColor: '#050a12',
        textColor: '#d1d4dc',
    },
    grid: {
        vertLines: { color: '#1a2a40' },
        horzLines: { color: '#1a2a40' },
    },
    crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
    },
    rightPriceScale: {
        borderColor: '#1a2a40',
    },
    timeScale: {
        borderColor: '#1a2a40',
    },
};

const container = document.getElementById('chart-container');
const chart = LightweightCharts.createChart(container, chartOptions);
const areaSeries = chart.addAreaSeries({
    lineColor: '#ffcc00', // По умолчанию желтый NGR
    topColor: 'rgba(255, 204, 0, 0.4)',
    bottomColor: 'rgba(255, 204, 0, 0.0)',
    lineWidth: 2,
});

// Тестовые данные (имитация биржи)
let data = [
    { time: '2026-04-15', value: 100 },
    { time: '2026-04-16', value: 105 },
    { time: '2026-04-17', value: 98 },
    { time: '2026-04-18', value: 110 },
    { time: '2026-04-19', value: 115 },
    { time: '2026-04-20', value: 112 },
];

areaSeries.setData(data);

// Функция обновления цвета графика
function updateChartColor(currentPrice, prevPrice) {
    const priceElement = document.getElementById('current-price');
    priceElement.innerText = currentPrice.toFixed(2);

    if (currentPrice >= prevPrice) {
        // Рост - Зеленый
        areaSeries.applyOptions({
            lineColor: '#00ff88',
            topColor: 'rgba(0, 255, 136, 0.4)',
        });
        priceElement.className = 'price-up';
    } else {
        // Падение - Красный
        areaSeries.applyOptions({
            lineColor: '#ff3344',
            topColor: 'rgba(255, 51, 68, 0.4)',
        });
        priceElement.className = 'price-down';
    }
}

// Проверяем цвет последнего изменения
const last = data[data.length - 1];
const prev = data[data.length - 2];
updateChartColor(last.value, prev.value);

// Логика кнопок
document.getElementById('buy-stars').addEventListener('click', () => {
    tg.showAlert("Оплата через Telegram Stars пока в разработке");
});

document.getElementById('buy-coins').addEventListener('click', () => {
    tg.sendData("buy_dst_coins"); // Отправляем команду боту
});
