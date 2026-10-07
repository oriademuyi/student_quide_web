export const SUPPORT_WHATSAPP_NUMBER = "2347075987793";

export function whatsappChatUrl(
  message = "Hello, I need help with the Student Guide app."
): string {
  return `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
