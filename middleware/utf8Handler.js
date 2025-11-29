// Middleware para asegurar UTF-8 en todas las respuestas
const utf8Handler = (req, res, next) => {
  // Configurar charset UTF-8 antes de cualquier respuesta
  res.charset = 'utf-8';
  
  // Interceptar res.json antes de que se envíe
  const originalJson = res.json;
  res.json = function(data) {
    // Asegurar que el header se establezca antes de enviar
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    // Convertir a JSON manualmente para asegurar UTF-8
    const jsonString = JSON.stringify(data);
    res.setHeader('Content-Length', Buffer.byteLength(jsonString, 'utf8'));
    return originalJson.call(this, data);
  };
  
  // Interceptar res.send
  const originalSend = res.send;
  res.send = function(body) {
    if (!res.headersSent) {
      const contentType = res.getHeader('Content-Type');
      if (!contentType) {
        if (typeof body === 'object') {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
        } else if (typeof body === 'string') {
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
        }
      } else if (typeof contentType === 'string' && !contentType.includes('charset')) {
        if (contentType.includes('application/json')) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
        } else if (contentType.includes('text/')) {
          res.setHeader('Content-Type', contentType.replace(/;?\s*$/, '') + '; charset=utf-8');
        }
      }
    }
    return originalSend.call(this, body);
  };
  
  next();
};

module.exports = utf8Handler;

