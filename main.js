import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import { LineToolManager } from './line-tools/line-tools.js';
import './line-tools/line-tools.css';

// Generate sample candlestick data
function generateCandleData(days = 200) {
    const data = [];
    const basePrice = 100;
    let currentPrice = basePrice;
    const baseTime = new Date(2024, 0, 1).getTime() / 1000;

    for (let i = 0; i < days; i++) {
        const time = baseTime + i * 24 * 60 * 60;
        const change = (Math.random() - 0.5) * 5;
        currentPrice += change;

        const open = currentPrice;
        const high = currentPrice + Math.random() * 3;
        const low = currentPrice - Math.random() * 3;
        const close = low + Math.random() * (high - low);

        data.push({
            time,
            open,
            high,
            low,
            close
        });

        currentPrice = close;
    }

    return data;
}

// Create the chart
const chartContainer = document.getElementById('chart-container');
const chart = createChart(chartContainer, {
    layout: {
        textColor: '#d1d4dc',
        background: { type: ColorType.Solid, color: '#1e222d' },
    },
    grid: {
        vertLines: { color: '#2B2B43' },
        horzLines: { color: '#2B2B43' },
    },
    crosshair: {
        mode: 0, // Normal mode (no magnet to candles)
    },
    timeScale: {
        borderColor: '#2B2B43',
        timeVisible: true,
        secondsVisible: false,
    },
    rightPriceScale: {
        borderColor: '#2B2B43',
    },
});

// Add candlestick series (v5 API: use `addSeries` with series class)
const candlestickSeries = chart.addSeries(CandlestickSeries, {
    upColor: '#26a69a',
    downColor: '#ef5350',
    borderVisible: false,
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350',
});

// Set data
const data = generateCandleData();
candlestickSeries.setData(data);

// Fit content
chart.timeScale().fitContent();

// Initialize Line Tools Manager
const lineToolManager = new LineToolManager();
candlestickSeries.attachPrimitive(lineToolManager);

// Tool buttons
const buttons = {
    'btn-none': 'None',
    'btn-trend-line': 'TrendLine',
    'btn-horizontal-line': 'HorizontalLine',
    'btn-vertical-line': 'VerticalLine',
    'btn-rectangle': 'Rectangle',
    'btn-circle': 'Circle',
    'btn-triangle': 'Triangle',
    'btn-parallel-channel': 'ParallelChannel',
    'btn-fib-retracement': 'FibRetracement',
    'btn-text': 'Text',
    'btn-callout': 'Callout',
    'btn-arrow': 'Arrow',
    'btn-ray': 'Ray',
    'btn-cross-line': 'CrossLine',
    'btn-price-range': 'PriceRange',
    'btn-long-position': 'LongPosition',
    'btn-short-position': 'ShortPosition',
    'btn-brush': 'Brush',
    'btn-highlighter': 'Highlighter',
    'btn-path': 'Path',
    'btn-extended-line': 'ExtendedLine',
    'btn-horizontal-ray': 'HorizontalRay',
    'btn-elliott-impulse': 'ElliottImpulseWave',
    'btn-elliott-correction': 'ElliottCorrectionWave',
    'btn-date-range': 'DateRange',
    'btn-fib-extension': 'FibExtension',
    'btn-user-price-alerts': 'UserPriceAlerts',
};

// Attach button listeners
Object.entries(buttons).forEach(([id, toolType]) => {
    const button = document.getElementById(id);
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        Object.keys(buttons).forEach(btnId => {
            document.getElementById(btnId).classList.remove('active');
        });
        // Add active class to clicked button
        button.classList.add('active');
        // Start the tool
        lineToolManager.startTool(toolType);
    });
});

// Clear all button
document.getElementById('btn-clear').addEventListener('click', () => {
    lineToolManager.clearTools();
});

// Handle window resize
window.addEventListener('resize', () => {
    chart.applyOptions({
        width: chartContainer.clientWidth,
        height: chartContainer.clientHeight
    });
});

// Session Highlighting
document.getElementById('btn-session-highlighting').addEventListener('click', () => {
    // Remove active class from all buttons
    Object.keys(buttons).forEach(btnId => {
        document.getElementById(btnId).classList.remove('active');
    });
    document.getElementById('btn-session-highlighting').classList.add('active');

    // Simple highlighter: Highlight Mondays
    const highlighter = (time) => {
        const date = new Date(time * 1000);
        // Highlight Mondays (Day 1) with a semi-transparent blue
        if (date.getDay() === 1) {
            return 'rgba(41, 98, 255, 0.2)';
        }
        return 'rgba(0, 0, 0, 0)'; // Transparent for other days
    };

    lineToolManager.enableSessionHighlighting(highlighter);
    // Note: Session Highlighting is not a "tool" in the same sense, so we don't set _activeToolType
    // But we might want to set it to 'None' to allow normal chart interaction
    lineToolManager.startTool('None');
});

console.log('✅ Line Tools Demo initialized successfully!');
console.log('LineToolManager:', lineToolManager);
