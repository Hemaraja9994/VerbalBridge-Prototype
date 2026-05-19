import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Readable } from 'node:stream';

interface GenerateVoiceBody {
  consent_confirmed?: unknown;
  model_id?: unknown;
  output_format?: unknown;
  text?: unknown;
  voice_id?: unknown;
}

const ELEVENLABS_STREAM_BASE = 'https://api.elevenlabs.io/v1/text-to-speech';
const DEFAULT_MODEL_ID = 'eleven_multilingual_v2';
const DEFAULT_OUTPUT_FORMAT = 'mp3_44100_128';
const MAX_TEXT_LENGTH = 600;
const VOICE_ID_PATTERN = /^[A-Za-z0-9_-]{6,128}$/;
const OUTPUT_FORMAT_PATTERN = /^[a-z0-9_]{6,32}$/;

function sendJson(
  response: VercelResponse,
  statusCode: number,
  payload: { error: string }
) {
  response
    .status(statusCode)
    .setHeader('Cache-Control', 'no-store')
    .json(payload);
}

function parseBody(body: unknown): GenerateVoiceBody {
  if (typeof body === 'string') {
    return JSON.parse(body) as GenerateVoiceBody;
  }
  if (body && typeof body === 'object') {
    return body as GenerateVoiceBody;
  }
  return {};
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Cache-Control', 'no-store');

  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return;
  }

  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Method not allowed. Use POST.' });
    return;
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    sendJson(response, 500, {
      error: 'Server is missing ELEVENLABS_API_KEY.',
    });
    return;
  }

  let body: GenerateVoiceBody;
  try {
    body = parseBody(request.body);
  } catch {
    sendJson(response, 400, { error: 'Invalid JSON body.' });
    return;
  }

  if (body.consent_confirmed !== true) {
    sendJson(response, 403, {
      error: 'Documented patient consent is required before generating voice.',
    });
    return;
  }

  const text = typeof body.text === 'string' ? body.text.trim() : '';
  const voiceId = typeof body.voice_id === 'string' ? body.voice_id.trim() : '';
  const modelId =
    typeof body.model_id === 'string' && body.model_id.trim()
      ? body.model_id.trim()
      : DEFAULT_MODEL_ID;
  const outputFormat =
    typeof body.output_format === 'string' && body.output_format.trim()
      ? body.output_format.trim()
      : DEFAULT_OUTPUT_FORMAT;

  if (!text) {
    sendJson(response, 400, { error: 'Text is required.' });
    return;
  }

  if (text.length > MAX_TEXT_LENGTH) {
    sendJson(response, 413, {
      error: `Text must be ${MAX_TEXT_LENGTH} characters or fewer.`,
    });
    return;
  }

  if (!voiceId || !VOICE_ID_PATTERN.test(voiceId)) {
    sendJson(response, 400, { error: 'A valid ElevenLabs voice_id is required.' });
    return;
  }

  if (!OUTPUT_FORMAT_PATTERN.test(outputFormat)) {
    sendJson(response, 400, { error: 'Invalid output_format.' });
    return;
  }

  const elevenLabsUrl = `${ELEVENLABS_STREAM_BASE}/${encodeURIComponent(
    voiceId
  )}/stream?output_format=${encodeURIComponent(outputFormat)}`;

  try {
    const elevenLabsResponse = await fetch(elevenLabsUrl, {
      method: 'POST',
      headers: {
        Accept: 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        model_id: modelId,
        text,
        voice_settings: {
          similarity_boost: 0.86,
          stability: 0.58,
          style: 0.12,
          use_speaker_boost: true,
        },
      }),
    });

    if (!elevenLabsResponse.ok) {
      const upstreamText = await elevenLabsResponse.text();
      sendJson(response, elevenLabsResponse.status, {
        error:
          upstreamText ||
          `ElevenLabs request failed with status ${elevenLabsResponse.status}.`,
      });
      return;
    }

    const contentType =
      elevenLabsResponse.headers.get('content-type') || 'audio/mpeg';
    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type': contentType,
      'X-Content-Type-Options': 'nosniff',
    });

    if (elevenLabsResponse.body) {
      const stream = Readable.fromWeb(
        elevenLabsResponse.body as Parameters<typeof Readable.fromWeb>[0]
      );
      stream.on('error', () => response.end());
      stream.pipe(response);
      return;
    }

    const audioBuffer = Buffer.from(await elevenLabsResponse.arrayBuffer());
    response.end(audioBuffer);
  } catch {
    sendJson(response, 502, {
      error: 'Unable to connect to ElevenLabs voice generation service.',
    });
  }
}
