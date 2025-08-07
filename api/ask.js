export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const body = req.body;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://deep-talk.vercel.app",
      "X-Title": "DeepTalk Chatbot",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenRouter API Error:", errorText);
    return res.status(500).json({ error: "Failed to get response from OpenRouter" });
  }

  const data = await response.json();
  res.status(200).json(data);
}
