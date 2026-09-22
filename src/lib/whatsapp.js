// Builds a wa.me link. With a phone number it opens that contact's chat directly;
// without one, WhatsApp lets the user pick who to send the message to.
export function buildWhatsAppLink(message, phone) {
  const digitsOnly = (phone ?? '').replace(/\D/g, '')
  const base = digitsOnly ? `https://wa.me/${digitsOnly}` : 'https://wa.me/'
  return `${base}?text=${encodeURIComponent(message)}`
}
