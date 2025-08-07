export default async function handler(req, res) {
  const body = req.body; // ✅ FIXED

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

  // Handle possible errors
  if (!response.ok) {
    const errorText = await response.text(); // 🔍 log response body
    console.error("OpenRouter API Error:", errorText);
    return res.status(500).json({ error: "Failed to get response from OpenRouter" });
  }

  const data = await response.json();
  res.status(200).json(data);
}
