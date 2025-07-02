const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  const noSqlInjectionChars = /[\$\{\}]/g;
  let sanitized = input.replace(noSqlInjectionChars, '');

  const htmlTags = /<[^>]*>/g;
  sanitized = sanitized.replace(htmlTags, '');

  const dangerousChars = /[<>'"&]/g;
  sanitized = sanitized.replace(dangerousChars, (match) => {
    switch (match) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#x27;';
      case '&': return '&amp;';
      default: return match;
    }
  });
  
  return sanitized.trim();
};

const sanitizeBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    }
  }
  next();
};

const sanitizeQuery = (req, res, next) => {
  if (req.query && typeof req.query === 'object') {
    for (const key in req.query) {
      if (req.query.hasOwnProperty(key)) {
        req.query[key] = sanitizeInput(req.query[key]);
      }
    }
  }
  next();
};

const containsDangerousProps = (obj) => {
  if (typeof obj !== 'object' || obj === null) return false;
  
  const dangerousProps = ['$where', '$ne', '$in', '$nin', '$gt', '$gte', '$lt', '$lte', '$regex', '$exists'];
  
  for (const prop in obj) {
    if (dangerousProps.includes(prop)) {
      return true;
    }
    if (typeof obj[prop] === 'object' && containsDangerousProps(obj[prop])) {
      return true;
    }
  }
  return false;
};

const preventNoSQLInjection = (req, res, next) => {
  if (containsDangerousProps(req.body) || containsDangerousProps(req.query)) {
    return res.status(400).json({ 
      error: 'Requisição contém parâmetros não permitidos' 
    });
  }
  next();
};

module.exports = {
  sanitizeInput,
  sanitizeBody,
  sanitizeQuery,
  preventNoSQLInjection
};

