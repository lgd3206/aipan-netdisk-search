// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { channels } from '@/lib/channels';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get('q') || '';

  // 只用启用的频道
  const enabledChannels = channels.filter(c => c.enabled);

  // 并发请求所有频道
  const results = await Promise.all(
    enabledChannels.map(async (channel) => {
      try {
        const res = await fetch(`${channel.apiUrl}?q=${encodeURIComponent(keyword)}`);
        const data = await res.json();
        return { channel: channel.name, data };
      } catch (e) {
        return { channel: channel.name, data: [], error: true };
      }
    })
  );

  return NextResponse.json({ results });
}
