export async function sendWhatsAppNotification(text: string) {
  const phone = process.env.WHATSAPP_CALLMEBOT_PHONE;
  const apiKey = process.env.WHATSAPP_CALLMEBOT_APIKEY;

  if (!phone || !apiKey) {
    console.error("WhatsApp env vars missing - skipping notification");
    return;
  }

  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(text)}&apikey=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error("WhatsApp notification failed:", await response.text());
    }
  } catch (error) {
    console.error("WhatsApp notification error:", error);
  }
}