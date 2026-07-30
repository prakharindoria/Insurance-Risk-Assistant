export const parseSection = (content: string, heading: string): string | null => {
  if (!content) return null;

  const normalizedContent = content.replace(/\r\n/g, '\n');
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(?:^|\\n)#{1,6}\\s*${escapedHeading}\\s*(?:\\n|:|$)([\\s\\S]*?)(?=\\n#{1,6}\\s|$)`, 'im');
  const match = normalizedContent.match(regex);
  return match ? match[1].trim() : null;
};

export const parseListItems = (section: string | null) =>
  section
    ? section
        .split('\n')
        .map((line) => line.replace(/^[-*+]\s*/, '').trim())
        .filter(Boolean)
    : [];

export const parseRiskScore = (content: string): number | null => {
  if (!content) return null;

  const scoreSection =
    parseSection(content, 'Quantitative Risk Score') ||
    parseSection(content, 'Risk Score') ||
    parseSection(content, 'Overall Risk Score') ||
    content;

  const patterns = [
    /(?:risk score|quantitative risk score|overall risk score)[^\d]*(\d{1,3})(?:\s*(?:\/\s*100|%))?/i,
    /(?:score|rating)\s*[:=]\s*(\d{1,3})(?:\s*(?:\/\s*100|%))?/i,
    /\b(\d{1,3})\s*(?:\/\s*100|%)\b/i,
  ];

  for (const pattern of patterns) {
    const match = scoreSection.match(pattern);
    if (match) {
      const score = Number(match[1]);
      if (!Number.isNaN(score)) {
        return Math.min(100, Math.max(0, score));
      }
    }
  }

  const fallbackMatches = Array.from(scoreSection.matchAll(/\b(\d{1,3})\b/g));
  for (const match of fallbackMatches) {
    const score = Number(match[1]);
    if (!Number.isNaN(score) && score >= 0 && score <= 100) {
      return score;
    }
  }

  return null;
};
