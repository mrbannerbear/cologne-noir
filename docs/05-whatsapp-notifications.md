# WhatsApp Order Notifications

WhatsApp doesn't have a single "just get a token in 2 minutes" path the way Telegram does.
There are two real options — pick based on how much setup time you want now vs. reliability
later. Both send the alert to **your own WhatsApp**, not the customer's.

## Option A — Quick start: CallMeBot (unofficial, free, minutes to set up)
Good for launching fast and validating the whole flow. Not an official Meta product — it's a
free community service that relays messages through WhatsApp Web. It can occasionally have
downtime; treat it as a bootstrap solution, not a permanent one.

**Setup:**
1. Save this contact on your phone: `+34 644 59 71 65` (CallMeBot's number).
2. Send it this exact message on WhatsApp: `I allow callmebot to send me messages`
3. You'll receive an API key in reply within a minute or two.
4. Add to your env vars:
   ```
   WHATSAPP_CALLMEBOT_PHONE="8801XXXXXXXXX"   # your number, country code, no + or spaces
   WHATSAPP_CALLMEBOT_APIKEY="123456"
   ```

**`lib/whatsapp.ts` (CallMeBot version):**
```ts
export async function sendWhatsAppNotification(text: string) {
  const phone = process.env.WHATSAPP_CALLMEBOT_PHONE;
  const apiKey = process.env.WHATSAPP_CALLMEBOT_APIKEY;

  if (!phone || !apiKey) {
    console.error("WhatsApp env vars missing — skipping notification");
    return;
  }

  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(text)}&apikey=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error("WhatsApp notification failed:", await res.text());
    }
  } catch (err) {
    console.error("WhatsApp notification error:", err);
  }
}
```

## Option B — Recommended long-term: Meta WhatsApp Cloud API (official, free tier, more setup)
Meta's official Cloud API is free for low volumes and reliable, but takes more one-time setup
and (for reliable delivery outside a 24-hour window) requires an approved message **template**.

**Setup:**
1. Create a [Meta for Developers](https://developers.facebook.com) account, create a new App,
   add the **WhatsApp** product to it.
2. In the app's WhatsApp → API Setup page, you get a free **test phone number**, a temporary
   **access token**, and a **Phone Number ID**.
3. Add your own number as a verified recipient (test numbers require this step) — you'll get a
   code via WhatsApp to confirm.
4. For messages sent anytime (not just within 24 hours of you messaging the bot first), create
   a simple message template (e.g. `order_notification`) in Meta Business Manager and submit it
   for approval — simple order-alert templates are typically approved quickly.
5. Env vars:
   ```
   WHATSAPP_ACCESS_TOKEN="EAAG..."
   WHATSAPP_PHONE_NUMBER_ID="123456789012345"
   WHATSAPP_RECIPIENT_NUMBER="8801XXXXXXXXX"
   WHATSAPP_TEMPLATE_NAME="order_notification"
   ```

**`lib/whatsapp.ts` (Cloud API version, template message):**
```ts
export async function sendWhatsAppNotification(orderNumber: string, summary: string) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = process.env.WHATSAPP_RECIPIENT_NUMBER;
  const template = process.env.WHATSAPP_TEMPLATE_NAME;

  if (!token || !phoneNumberId || !to || !template) {
    console.error("WhatsApp Cloud API env vars missing — skipping notification");
    return;
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: template,
          language: { code: "en" },
          components: [
            { type: "body", parameters: [{ type: "text", text: orderNumber }, { type: "text", text: summary }] },
          ],
        },
      }),
    });
    if (!res.ok) {
      console.error("WhatsApp notification failed:", await res.text());
    }
  } catch (err) {
    console.error("WhatsApp notification error:", err);
  }
}
```

**Recommendation:** ship with **Option A** to launch this week, keep `lib/whatsapp.ts`'s
function signature stable (`sendWhatsAppNotification(...)`), and swap the internals to
**Option B** once the site is live and you want something you don't have to worry about
breaking unexpectedly.

## Message content (called from `/api/orders`)
```
🛎️ New Order — CN-482913

👤 Sayed Rahman
📞 017XXXXXXXX
📍 House 12, Road 4, Nasirabad, Chittagong

🧴 22ml Custom Decant — Afnan Rare Reef × 1
💰 Total: ৳2,200

📝 Note: Please call before delivery

Confirm via Prisma Studio once you've contacted the customer.
```

## Important: don't block the order on this
Wrap the WhatsApp call in try/catch and call it *after* the order is safely written to the
database. If the notification fails, the customer's order is still confirmed — check Vercel
logs / Prisma Studio periodically as a backup in that case.
