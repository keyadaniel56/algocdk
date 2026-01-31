({
  name: "AI Trade Signals",
  window: 1,
  color: "#00ff00",
  defaultParams: { 
    sensitivity: 70,
    rsiPeriod: 14,
    maPeriod: 20,
    volumeThreshold: 1.5
  },
  
  calculate: function(data, params) {
    const rsiPeriod = params.rsiPeriod || 14;
    const maPeriod = params.maPeriod || 20;
    const sensitivity = params.sensitivity || 70;
    
    // Calculate RSI
    const changes = data.slice(1).map((c, i) => c.close - data[i].close);
    const gains = changes.map(c => c > 0 ? c : 0);
    const losses = changes.map(c => c < 0 ? -c : 0);
    
    let avgGain = gains.slice(0, rsiPeriod).reduce((a, b) => a + b, 0) / rsiPeriod;
    let avgLoss = losses.slice(0, rsiPeriod).reduce((a, b) => a + b, 0) / rsiPeriod;
    
    const rsi = [];
    for (let i = 0; i < rsiPeriod + 1; i++) rsi.push(null);
    
    for (let i = rsiPeriod; i < changes.length; i++) {
      avgGain = (avgGain * (rsiPeriod - 1) + gains[i]) / rsiPeriod;
      avgLoss = (avgLoss * (rsiPeriod - 1) + losses[i]) / rsiPeriod;
      const rs = avgGain / (avgLoss || 0.001);
      rsi.push(100 - (100 / (1 + rs)));
    }
    
    // Calculate Moving Average
    const ma = data.map((_, i) => {
      if (i < maPeriod - 1) return null;
      const sum = data.slice(i - maPeriod + 1, i + 1).reduce((a, b) => a + b.close, 0);
      return sum / maPeriod;
    });
    
    // AI Signal Logic
    return data.map((candle, i) => {
      if (i < maPeriod || !rsi[i] || !ma[i]) return null;
      
      const priceAboveMA = candle.close > ma[i];
      const priceBelowMA = candle.close < ma[i];
      const rsiOversold = rsi[i] < (100 - sensitivity);
      const rsiOverbought = rsi[i] > sensitivity;
      const bullishCandle = candle.close > candle.open;
      const bearishCandle = candle.close < candle.open;
      
      // Momentum calculation
      const momentum = i > 5 ? (candle.close - data[i-5].close) / data[i-5].close * 100 : 0;
      const strongMomentum = Math.abs(momentum) > 1;
      
      // AI Score calculation
      let buyScore = 0;
      let sellScore = 0;
      
      // Buy signals
      if (rsiOversold && priceAboveMA) buyScore += 30;
      if (bullishCandle && priceAboveMA) buyScore += 20;
      if (momentum > 0 && strongMomentum) buyScore += 25;
      if (candle.close > candle.high * 0.8) buyScore += 15;
      if (i > 0 && candle.low < data[i-1].low && candle.close > data[i-1].close) buyScore += 10;
      
      // Sell signals  
      if (rsiOverbought && priceBelowMA) sellScore += 30;
      if (bearishCandle && priceBelowMA) sellScore += 20;
      if (momentum < 0 && strongMomentum) sellScore += 25;
      if (candle.close < candle.low * 1.2) sellScore += 15;
      if (i > 0 && candle.high > data[i-1].high && candle.close < data[i-1].close) sellScore += 10;
      
      // Return signal type
      if (buyScore > 60) return { type: 'BUY', strength: buyScore, price: candle.high };
      if (sellScore > 60) return { type: 'SELL', strength: sellScore, price: candle.low };
      
      return null;
    });
  },
  
  draw: function(ctx, values, pad, spacing, yFunc, params) {
    values.forEach((signal, i) => {
      if (signal) {
        const x = pad + i * spacing + spacing / 2;
        const y = yFunc(signal.price);
        
        // Draw signal arrow
        ctx.fillStyle = signal.type === 'BUY' ? '#00ff00' : '#ff0000';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        
        if (signal.type === 'BUY') {
          // Up arrow for buy
          ctx.fillText('▲', x, y - 10);
          ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
          ctx.fillRect(x - spacing/2, y - 20, spacing, 40);
        } else {
          // Down arrow for sell  
          ctx.fillText('▼', x, y + 20);
          ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
          ctx.fillRect(x - spacing/2, y - 20, spacing, 40);
        }
        
        // Draw strength indicator
        ctx.fillStyle = signal.type === 'BUY' ? '#00ff00' : '#ff0000';
        ctx.font = '10px Arial';
        ctx.fillText(Math.round(signal.strength), x, signal.type === 'BUY' ? y - 25 : y + 35);
      }
    });
  }
})