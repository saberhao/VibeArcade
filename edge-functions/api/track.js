export async function onRequestPost(context) {
  const kv = context.env.ANALYTICS_KV;
  if (!kv) {
    return new Response(JSON.stringify({ error: 'KV not bound' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  let body;
  try {
    body = await context.request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'invalid json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  const { userId, event } = body;
  if (!userId) {
    return new Response(JSON.stringify({ error: 'missing userId' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  // 获取当前日期 (UTC)
  const now = new Date();
  const today = now.toISOString().slice(0, 10);   // "2026-05-17"
  const month = today.slice(0, 7);                  // "2026-05"

  // DAU: 按 "dau:日期" 存储 userId 集合
  const dauKey = `dau:${today}`;
  const dauVal = await kv.get(dauKey) || '';
  const dauSet = new Set(dauVal ? dauVal.split(',') : []);
  if (!dauSet.has(userId)) {
    dauSet.add(userId);
    await kv.put(dauKey, [...dauSet].join(','));
  }

  // MAU: 按 "mau:月份" 存储 userId 集合
  const mauKey = `mau:${month}`;
  const mauVal = await kv.get(mauKey) || '';
  const mauSet = new Set(mauVal ? mauVal.split(',') : []);
  if (!mauSet.has(userId)) {
    mauSet.add(userId);
    await kv.put(mauKey, [...mauSet].join(','));
  }

  // 今日 PV
  const pvKey = `pv:${today}`;
  const pvVal = Number(await kv.get(pvKey) || 0);
  await kv.put(pvKey, String(pvVal + 1));

  // 事件计数 (visit / game_start / game_end / triangle_formed)
  if (event) {
    const eventKey = `evt:${today}:${event}`;
    const eventVal = Number(await kv.get(eventKey) || 0);
    await kv.put(eventKey, String(eventVal + 1));
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}

// 处理 CORS 预检
export function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
