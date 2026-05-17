export async function onRequestGet(context) {
  const kv = context.env.ANALYTICS_KV;
  if (!kv) {
    return new Response(JSON.stringify({ error: 'KV not bound' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const month = today.slice(0, 7);

  // DAU
  const dauVal = await kv.get(`dau:${today}`) || '';
  const dau = dauVal ? dauVal.split(',').length : 0;

  // MAU
  const mauVal = await kv.get(`mau:${month}`) || '';
  const mau = mauVal ? mauVal.split(',').length : 0;

  // 今日 PV
  const pv = Number(await kv.get(`pv:${today}`) || 0);

  // 今日各事件计数
  const eventTypes = ['visit', 'game_start', 'game_end', 'triangle_formed'];
  const events = {};
  for (const evt of eventTypes) {
    events[evt] = Number(await kv.get(`evt:${today}:${evt}`) || 0);
  }

  // 最近 7 天趋势
  const trend = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dVal = await kv.get(`dau:${dateStr}`) || '';
    const pVal = Number(await kv.get(`pv:${dateStr}`) || 0);
    trend.push({
      date: dateStr,
      dau: dVal ? dVal.split(',').length : 0,
      pv: pVal
    });
  }

  return new Response(JSON.stringify({
    date: today,
    month,
    dau,
    mau,
    pv,
    events,
    trend
  }, null, 2), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}
