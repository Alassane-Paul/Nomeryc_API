const express = require('express');
const app = express();
const routes = require('./src/routes/index');
app.use('/api', routes);
console.log('router stack length', app._router.stack.length);
app._router.stack.forEach((layer, index) => {
  console.log(index, layer.name, layer.route && layer.route.path, layer.regexp && layer.regexp.toString());
  if (layer.handle && layer.handle.stack) {
    layer.handle.stack.forEach((subLayer, subIndex) => {
      console.log('  ', subIndex, subLayer.name, subLayer.route && subLayer.route.path, subLayer.regexp && subLayer.regexp.toString());
    });
  }
});
