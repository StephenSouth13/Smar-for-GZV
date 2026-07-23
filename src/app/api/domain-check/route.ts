import { NextResponse } from "next/server";
import { resolve4, resolve6, resolveCname } from "node:dns/promises";

export const runtime = "nodejs";

async function settle<T>(fn: () => Promise<T>) {
  try {
    return { ok: true as const, value: await fn() };
  } catch (err) {
    return { ok: false as const, error: err instanceof Error ? err.message : "Không kiểm tra được." };
  }
}

async function checkUrl(url: string) {
  const result = await settle(async () => {
    const res = await fetch(url, { method: "GET", redirect: "manual", cache: "no-store" });
    return {
      status: res.status,
      location: res.headers.get("location"),
      server: res.headers.get("server"),
    };
  });
  return result.ok ? result.value : { error: result.error };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url") || "https://marketing.gzv.one";
  const normalizedUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
  const hostname = new URL(normalizedUrl).hostname;

  const [cname, ipv4, ipv6, http, https] = await Promise.all([
    settle(() => resolveCname(hostname)),
    settle(() => resolve4(hostname)),
    settle(() => resolve6(hostname)),
    checkUrl(`http://${hostname}`),
    checkUrl(`https://${hostname}`),
  ]);

  const cnameValue = cname.ok ? cname.value : [];
  const ipv4Value = ipv4.ok ? ipv4.value : [];
  const ipv6Value = ipv6.ok ? ipv6.value : [];
  const httpsStatus = "status" in https ? https.status : undefined;
  const dnsReady = cnameValue.length > 0 || ipv4Value.length > 0 || ipv6Value.length > 0;
  const httpsReady = !!httpsStatus && httpsStatus < 500;

  return NextResponse.json({
    hostname,
    dnsReady,
    httpsReady,
    diagnosis:
      dnsReady && httpsStatus === 404
        ? "DNS đã tới Firebase nhưng backend/Hosting đang trả 404. Cần kiểm tra domain đã gắn đúng App Hosting backend hoặc Hosting site đã deploy nội dung."
        : dnsReady && httpsReady
          ? "DNS và HTTPS đã phản hồi. Nếu vẫn chưa thấy website, hãy kiểm tra domain đang gắn đúng backend triển khai."
          : dnsReady
            ? "DNS đã trỏ nhưng HTTPS chưa sẵn sàng. Firebase có thể đang cấp SSL hoặc cần xác minh domain."
            : "DNS chưa resolve từ môi trường kiểm tra này.",
    records: {
      cname: cname.ok ? cname.value : [],
      a: ipv4.ok ? ipv4.value : [],
      aaaa: ipv6.ok ? ipv6.value : [],
    },
    http,
    https,
    checkedAt: new Date().toISOString(),
  });
}
