// functions/_shared/elmo-judge.js
// Elmo-style Judge Engine for Answer Index
// Evaluates AI responses (from Perplexity, ChatGPT Search, Claude, Gemini, Google AIO)
// Extracts: Brand Mentions, Rank Position, Sentiment, Passage Quote, Cited URLs, Competitors, and Share of Voice (SOV)
// Zero external API costs: Uses Cloudflare Workers AI free tier if available (AI binding) or fast deterministic natural language evaluator.

/**
 * Normalizes text for alias and competitor matching
 */
function normalizeText(text) {
  return (text || '').toLowerCase().replace(/['"’`]/g, '');
}

/**
 * Deterministic Natural Language Judge Evaluator
 * Runs instantly at edge with zero external network or token cost
 */
export function evaluateRunLocally({
  rawResponse,
  brandName,
  domain,
  brandAliases = [],
  competitors = [],
  citedUrls = []
}) {
  const normResponse = normalizeText(rawResponse);
  const normBrand = normalizeText(brandName);
  const normDomain = normalizeText(domain).replace(/^https?:\/\//, '').replace(/^www\./, '');

  // Build full alias search list
  const searchAliases = Array.from(new Set([
    normBrand,
    normDomain,
    normDomain.split('.')[0],
    ...brandAliases.map(normalizeText)
  ])).filter(Boolean);

  // 1. Check Brand Mention
  let brandMentioned = false;
  let mentionIndex = -1;

  for (const alias of searchAliases) {
    const idx = normResponse.indexOf(alias);
    if (idx !== -1) {
      brandMentioned = true;
      if (mentionIndex === -1 || idx < mentionIndex) {
        mentionIndex = idx;
      }
    }
  }

  // Check in cited URLs
  const brandDomainRegex = new RegExp(normDomain.replace('.', '\\.'), 'i');
  const domainInCitations = citedUrls.some(u => brandDomainRegex.test(u));
  if (domainInCitations) {
    brandMentioned = true;
  }

  // 2. Identify Competitors Mentioned
  const detectedCompetitors = [];
  const competitorPositions = [];

  for (const comp of competitors) {
    const normComp = normalizeText(comp);
    const cIdx = normResponse.indexOf(normComp);
    if (cIdx !== -1) {
      detectedCompetitors.push(comp);
      competitorPositions.push({ name: comp, index: cIdx });
    }
  }

  // 3. Compute Ranking Position among recommended brands
  // Sort all detected entities by appearance order in response
  let brandPosition = 0;
  if (brandMentioned) {
    const allRankings = [
      { name: brandName, isBrand: true, index: mentionIndex !== -1 ? mentionIndex : 999999 },
      ...competitorPositions.map(c => ({ name: c.name, isBrand: false, index: c.index }))
    ].sort((a, b) => a.index - b.index);

    const rankIdx = allRankings.findIndex(r => r.isBrand);
    brandPosition = rankIdx !== -1 ? rankIdx + 1 : 1;
  }

  // 4. Extract Relevant Passage Quote (Context snippet around the mention)
  let passageQuote = '';
  if (brandMentioned && mentionIndex !== -1) {
    const start = Math.max(0, mentionIndex - 120);
    const end = Math.min(rawResponse.length, mentionIndex + 220);
    let snippet = rawResponse.substring(start, end).trim();
    if (start > 0) snippet = '...' + snippet;
    if (end < rawResponse.length) snippet = snippet + '...';
    passageQuote = snippet.replace(/\s+/g, ' ');
  } else if (rawResponse.length > 0) {
    passageQuote = rawResponse.substring(0, 260).trim() + '...';
  }

  // 5. Sentiment Scoring (Positive, Neutral, Mixed, Negative)
  let sentiment = 'neutral';
  if (brandMentioned) {
    const passageLower = passageQuote.toLowerCase();

    const positiveSignals = [
      'best', 'top', 'recommend', 'recommended', 'leading', 'excellent',
      'powerful', 'great', 'ideal for', 'winner', 'superior', 'effective',
      'standout', 'robust', 'popular', 'first choice', 'high quality'
    ];
    const negativeSignals = [
      'avoid', 'expensive', 'lacks', 'limited', 'buggy', 'slow',
      'inferior', 'drawback', 'downside', 'poor', 'hard to use',
      'unreliable', 'not recommended', 'dated'
    ];

    let posScore = 0;
    let negScore = 0;

    positiveSignals.forEach(w => {
      if (passageLower.includes(w)) posScore++;
    });
    negativeSignals.forEach(w => {
      if (passageLower.includes(w)) negScore++;
    });

    if (posScore > 0 && negScore > 0) {
      sentiment = 'mixed';
    } else if (posScore > 0) {
      sentiment = 'positive';
    } else if (negScore > 0) {
      sentiment = 'negative';
    } else {
      sentiment = 'neutral';
    }
  }

  // 6. Share of Voice (SOV) Score
  // Brand mentions vs total market entity mentions
  let shareOfVoice = 0.0;
  const totalEntitiesMentioned = (brandMentioned ? 1 : 0) + detectedCompetitors.length;
  if (totalEntitiesMentioned > 0) {
    shareOfVoice = brandMentioned ? Math.round((1 / totalEntitiesMentioned) * 100) : 0;
  }

  return {
    brandMentioned: brandMentioned ? 1 : 0,
    brandPosition,
    sentiment,
    passageQuote,
    detectedCompetitors,
    shareOfVoice,
    judgeModel: 'answerindex-elmo-deterministic-v1'
  };
}

/**
 * Main Judge Evaluation Dispatcher
 * Can optionally invoke Cloudflare Workers AI if env.AI is bound, else falls back to local evaluator
 */
export async function evaluateWithJudge({
  env,
  rawResponse,
  brandName,
  domain,
  brandAliases = [],
  competitors = [],
  citedUrls = []
}) {
  // If Cloudflare Workers AI is bound, we can optionally use Llama 3.1 8B for deeper nuance
  if (env && env.AI) {
    try {
      const prompt = `You are Jev, an objective AEO/GEO evaluation judge. Analyze the following AI search response for the brand "${brandName}" (Domain: ${domain}).
Competitors to look for: ${competitors.join(', ') || 'None provided'}.

Response text:
"""
${rawResponse.slice(0, 3000)}
"""

Return a valid JSON object ONLY with:
{
  "brandMentioned": true/false,
  "brandPosition": number (1 for first recommended, 2 for second, 0 if not mentioned),
  "sentiment": "positive" | "neutral" | "mixed" | "negative",
  "passageQuote": "exact 1-2 sentences discussing the brand",
  "detectedCompetitors": ["comp1", "comp2"],
  "shareOfVoice": percentage (0-100)
}`;

      const aiRes = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 350
      });

      if (aiRes && aiRes.response) {
        const jsonMatch = aiRes.response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            brandMentioned: parsed.brandMentioned ? 1 : 0,
            brandPosition: parsed.brandPosition || 0,
            sentiment: parsed.sentiment || 'neutral',
            passageQuote: parsed.passageQuote || '',
            detectedCompetitors: parsed.detectedCompetitors || [],
            shareOfVoice: parsed.shareOfVoice || 0,
            judgeModel: 'cf-llama-3.1-8b'
          };
        }
      }
    } catch (e) {
      console.warn('Workers AI Judge fallback to local deterministic evaluator:', e.message);
    }
  }

  // Always reliable, instant, free fallback
  return evaluateRunLocally({
    rawResponse,
    brandName,
    domain,
    brandAliases,
    competitors,
    citedUrls
  });
}
