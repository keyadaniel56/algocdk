({
  name: "My Custom Indicator",
  window: 1,
  color: "#ff0000",
  defaultParams: { period: 14, threshold: 70 },
  
  calculate: function(data, params) {
    const period = params.period || 14;
    return data.map((_, i) => {
      if (i < period - 1) return null;
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b.close, 0);
      return sum / period;
    });
  },
  
  draw: function(ctx, values, pad, spacing, yFunc, params) {
    ctx.beginPath();
    let started = false;
    values.forEach((val, i) => {
      if (val !== null) {
        const x = pad + i * spacing + spacing / 2;
        const y = yFunc(val);
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
    });
    ctx.stroke();
  }
})