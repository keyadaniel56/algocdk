({
  name: "AI Trade Signals",
  window: 1,
  color: "#00ff00",
  defaultParams: { 
    sensitivity: 30,
    period: 10
  },
  
  calculate: function(data, params) {
    const period = params.period || 10;
    const sensitivity = params.sensitivity || 30;
    
    return data.map((candle, i) => {
      if (i < period) return null;
      
      // Simple moving average
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b.close, 0);
      const ma = sum / period;
      
      // Price momentum
      const momentum = i > 5 ? (candle.close - data[i-5].close) / data[i-5].close * 100 : 0;
      
      // Candle pattern
      const bullish = candle.close > candle.open;
      const bearish = candle.close < candle.open;
      
      // Simple AI logic
      let score = 0;
      
      // Buy conditions
      if (candle.close > ma && bullish && momentum > 0.5) {
        score = 70;
        return { type: 'BUY', strength: score, price: candle.high };
      }
      
      // Sell conditions  
      if (candle.close < ma && bearish && momentum < -0.5) {
        score = 70;
        return { type: 'SELL', strength: score, price: candle.low };
      }
      
      return null;
    });
  },
  
  draw: function(ctx, values, pad, spacing, yFunc, params) {
    values.forEach((signal, i) => {
      if (signal) {
        const x = pad + i * spacing + spacing / 2;
        const y = yFunc(signal.price);
        
        ctx.fillStyle = signal.type === 'BUY' ? '#00ff00' : '#ff0000';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        
        if (signal.type === 'BUY') {
          ctx.fillText('↑', x, y - 5);
        } else {
          ctx.fillText('↓', x, y + 15);
        }
      }
    });
  }
})