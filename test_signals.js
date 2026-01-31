({
  name: "Test Signals",
  window: 1,
  color: "#ff0000",
  defaultParams: { period: 5 },
  
  calculate: function(data, params) {
    return data.map((candle, i) => {
      if (i % 10 === 0) return { type: 'BUY', price: candle.high };
      if (i % 15 === 0) return { type: 'SELL', price: candle.low };
      return null;
    });
  },
  
  draw: function(ctx, values, pad, spacing, yFunc, params) {
    values.forEach((signal, i) => {
      if (signal) {
        const x = pad + i * spacing + spacing / 2;
        const y = yFunc(signal.price);
        
        ctx.fillStyle = signal.type === 'BUY' ? '#00ff00' : '#ff0000';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        
        ctx.fillText(signal.type === 'BUY' ? 'B' : 'S', x, y);
      }
    });
  }
})