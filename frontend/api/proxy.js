// api/proxy.js
import fetch from 'node-fetch';

// (ESM-экспорт) или `module.exports = async (req, res) => { ... }` в CommonJS
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Запрашиваем ваш бэкенд (http://185.70.196.104/chat/ask)
      const response = await fetch("http://185.70.196.104/chat/ask", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      });

      const data = await response.json(); // { answer: "..." } или { detail: ... }

      // Возвращаем ответ «как есть»
      return res.status(response.status).json(data);

    } catch (error) {
      console.error('Ошибка в serverless-прокси:', error);
      return res.status(500).json({ error: "Проблема при запросе к бэкенду" });
    }
  }

  // Если не POST, вернём 405
  return res.status(405).json({ error: "Method not allowed" });
}
