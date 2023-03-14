const fs = require('fs')
const path = require('path')

// импорт стандартных библиотек Node.js
const { readFileSync } = require('fs');
const { createServer } = require('http');

// файл для базы данных
const DB_FILE = process.env.DB_FILE || './db.json';
// номер порта, на котором будет запущен сервер
const PORT = process.env.PORT || 3000;
// префикс URI для всех методов приложения
const URI_PREFIX = '/db';

/**
 * Класс ошибки, используется для отправки ответа с определённым кодом и описанием ошибки
 */
class ApiError extends Error {
    constructor(statusCode, data) {
      super();
      this.statusCode = statusCode;
      this.data = data;
    }
}

function drainJson(req) {
    return new Promise((resolve) => {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        resolve(data);
      });
    });
}

module.exports = createServer(async (req, res) => {

  if (req.url === '/db') {
    const [uri, query] = req.url.substr(URI_PREFIX.length).split('?');

    res.setHeader('Content-Type', 'application/json');

    console.log(req.url)

    // CORS заголовки ответа для поддержки кросс-доменных запросов из браузера
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // если URI не начинается с нужного префикса - можем сразу отдать 404
    if (!req.url || !req.url.startsWith(URI_PREFIX)) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'Not Found' }));
      return;
    }

    try {
      // обрабатываем запрос и формируем тело ответа
      const body = await (async () => {
        if (uri === '' || uri === '/') {
          if (req.method === 'POST') {
            const createdItem = await drainJson(req)
            res.statusCode = 201
            fs.writeFileSync(DB_FILE, createdItem), err => {
                if(err) console.log('Error')
            }
          }
        }
        return null
      })();
      res.end(JSON.stringify(body));
    } catch (err) {
      // обрабатываем сгенерированную нами же ошибку
      if (err instanceof ApiError) {
        res.writeHead(err.statusCode);
        res.end(JSON.stringify(err.data));
      } else {
        // если что-то пошло не так - пишем об этом в консоль и возвращаем 500 ошибку сервера
        res.statusCode = 500;
        res.end(JSON.stringify({ message: 'Server Error' }));
        console.error(err);
      }
    }
  }

}).on('listening', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`Адрес http://localhost:${PORT}`);
    console.log('Нажмите CTRL+C, чтобы остановить сервер');
  }
}).listen(PORT)
