// Vercel Edge Middleware — 環境変数をHTMLに注入
// Vercelデプロイ時に process.env.* から読み取り、<head>内にscriptタグとして挿入

export var config = {
  matcher: ['/', '/admin.html'],
};

function escapeJs(str) {
  return (str || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

export default async function middleware(request) {
  var response = await fetch(request);
  var contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('text/html')) {
    return response;
  }

  var html = await response.text();

  var envScript = '<script>'
    + "window.ENV_SUPABASE_URL='"  + escapeJs(process.env.ENV_SUPABASE_URL)  + "';"
    + "window.ENV_SUPABASE_ANON='" + escapeJs(process.env.ENV_SUPABASE_ANON) + "';"
    + "window.ENV_SLACK_WEBHOOK='" + escapeJs(process.env.ENV_SLACK_WEBHOOK_HYGIENE) + "';"
    + '</script>';

  var modifiedHtml = html.replace('<head>', '<head>\n' + envScript);

  return new Response(modifiedHtml, {
    status: response.status,
    headers: response.headers,
  });
}
