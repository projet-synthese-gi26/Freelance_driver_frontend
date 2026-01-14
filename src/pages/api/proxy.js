// Ce fichier proxy permet de relayer les requêtes API du frontend Vercel vers ton backend HTTP
// Place ce fichier dans frontend_web/src/pages/api/proxy.js

export default async function handler(req, res) {
  // Reconstruit l'URL cible en supprimant le préfixe /api/proxy
  const backendUrl = 'http://192.168.43.204:8080' + req.url.replace(/^\/api\/proxy/, '');
  const method = req.method;
  const headers = { ...req.headers };
  delete headers.host;

  // Prépare le body si ce n'est pas GET/HEAD
  let body = undefined;
  if (!['GET', 'HEAD'].includes(method)) {
    body = req.body;
  }

  // Fait la requête vers le backend
  const response = await fetch(backendUrl, {
    method,
    headers,
    body,
  });

  // Transfère les headers et le status
  res.status(response.status);
  response.headers.forEach((value, key) => res.setHeader(key, value));
  const data = await response.arrayBuffer();
  res.send(Buffer.from(data));
}
