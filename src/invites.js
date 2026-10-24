function formatDate(isoDate) {
  // Parse as a local date so the day doesn't shift with the timezone.
  return new Date(`${isoDate}T00:00`).toLocaleDateString(undefined, { dateStyle: 'long' });
}

// mailto: link for the giver, telling them who they're buying for along with
// the receiver's wishlist and the exchange details from settings.
export function buildMailto(giver, receiver, settings) {
  const subject = 'Your Secret Santa match 🎁';
  const lines = [
    `Hi ${giver.name || 'there'},`,
    '',
    `You're the Secret Santa for ${receiver.name}!`,
    '',
  ];

  if (settings.budget) lines.push(`Budget: ${settings.budget}`);
  if (settings.exchangeDate) lines.push(`Exchange date: ${formatDate(settings.exchangeDate)}`);
  if (settings.budget || settings.exchangeDate) lines.push('');

  lines.push(`${receiver.name}'s wishlist:`);
  lines.push(receiver.wishlist || "(No wishlist yet, so get creative!)");
  lines.push('');

  if (settings.customMessage) {
    lines.push(settings.customMessage, '');
  }

  lines.push('Happy gifting!');

  const params = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  return `mailto:${encodeURIComponent(giver.email)}?${params}`;
}
