exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: { message: "Méthode non autorisée." } }) };
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: { message: "Clé API manquante. Ajoute ANTHROPIC_API_KEY dans Netlify." } }) };
  }
  try {
    const payload = JSON.parse(event.body || "{}");
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: payload.model || "claude-sonnet-4-6",
        max_tokens: payload.max_tokens || 2000,
        messages: payload.messages || [],
      }),
    });
    const data = await res.json();
    return { statusCode: res.status, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: { message: "Erreur serveur : " + (err.message || err) } }) };
  }
};
