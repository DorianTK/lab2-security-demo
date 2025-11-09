import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({}));
    const username = String(body?.sqlUsername ?? "");
    const password = String(body?.sqlPassword ?? "");
    const useVulnerable = Boolean(body?.sqlVulnerable);

    if (!username || !password) {
        return NextResponse.json(
            { error: "username and password required" },
            { status: 400 }
        );
    }

    if (useVulnerable) {
        const sql = `SELECT id, username, password FROM "DemoAuth" WHERE username='${username}' AND password='${password}';`;
        try {
            const rows = await prisma.$queryRawUnsafe(sql);
            return NextResponse.json({ vulnerable: true, sql, rows });
        } catch (err) {
            return NextResponse.json(
                { vulnerable: true, sql, error: String(err) },
                { status: 500 }
            );
        }
    } else {
        const entry = await prisma.demoAuth.findUnique({ where: { username } });
        const ok = entry && entry.password === password;
        return NextResponse.json({
            vulnerable: false,
            user: ok ? { id: entry.id, username: entry.username } : null,
        });
    }
}
