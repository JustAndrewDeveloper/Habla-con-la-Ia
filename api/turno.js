// Esta función corre en el servidor de Vercel, NUNCA en el navegador.
// Por eso la API key está segura aquí (variable de entorno) y nunca
// llega al HTML que ve el estudiante.

const SYSTEM_PROMPT = `Eres el narrador de un juego de supervivencia breve. Tu función es narrar
el resultado de las acciones del jugador y proponer cambios de estado,
SIEMPRE dentro de reglas estrictas.

CONTEXTO DEL JUEGO:
- El jugador tiene 6 turnos para sobrevivir hasta el amanecer, perdido en un bosque de noche.
- Variables de estado: salud (0-100), recursos (0-100).

REGLAS DE RESPUESTA:
1. Responde UNICAMENTE en formato JSON valido, sin texto adicional antes
   o despues, sin backticks de markdown.
2. La narracion debe tener maximo 2 frases cortas (maximo 30 palabras
   en total). Nada de descripciones largas.
3. Los cambios de estado deben ser numeros pequenos y razonables:
   - salud: entre -20 y +15 por turno
   - recursos: entre -15 y +20 por turno
4. Nunca inventes variables nuevas ni cambies el objetivo del juego.
5. Se coherente con el turno actual y el estado recibido (si salud es
   baja, la narracion debe reflejar que el personaje esta debil).
6. Si la accion del jugador es absurda o imposible en el contexto,
   reinterpretala de forma realista y penaliza levemente en vez de
   rechazar la accion.
7. Varia los eventos: no repitas el mismo tipo de resultado dos turnos
   seguidos.

FORMATO DE RESPUESTA (JSON estricto):
{"narracion": "texto breve", "cambio_salud": numero_entero, "cambio_recursos": numero_entero}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { turno, salud, recursos, accion } = req.body;

    if (typeof accion !== 'string' || !accion.trim()) {
      return res.status(400).json({ error: 'Falta la acción del jugador' });
    }

    const userMsg = JSON.stringify({ turno, salud, recursos, accion: accion.slice(0, 200) });

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        max_tokens: 300,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMsg }
        ]
      })
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      return res.status(502).json({ error: `Error de Groq: ${errText.slice(0, 200)}` });
    }

    const data = await groqRes.json();
    let text = data.choices?.[0]?.message?.content || '';
    text = text.replace(/```json|```/g, '').trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) text = jsonMatch[0];

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      return res.status(502).json({ error: `Respuesta no era JSON valido: ${text.slice(0, 150)}` });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Error interno' });
  }
}
