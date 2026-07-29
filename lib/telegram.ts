const TELEGRAM_TIMEOUT_MS = 5_000;

export async function sendTelegramMessage(chatId: string | undefined, text: string) {
  if (!chatId) {
    console.warn("Telegram chatId is not defined. Skipping notification.");
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error("TELEGRAM_BOT_TOKEN is not defined.");
    return;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TELEGRAM_TIMEOUT_MS);

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Telegram API error (${response.status}):`, errorData);
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.warn("Telegram notification timed out.");
      return;
    }
    console.error("Failed to send Telegram message:", error);
  }
}
