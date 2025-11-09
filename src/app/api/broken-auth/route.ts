import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

let failedAttempts: Record<string, { count: number; lockedUntil: number }> = {};

export async function POST(req: NextRequest) {
    const body = await req.json();
    const username = body.username?.trim();
    const password = body.password;
    const vulnerable = Boolean(body.vulnerable);

    if (!username || !password)
        return NextResponse.json(
            { error: "Missing credentials" },
            { status: 400 }
        );

    const user = await prisma.demoAuth.findUnique({ where: { username } });

    if (vulnerable) {
        if (!user) return NextResponse.json({ message: "username wrong" });
        if (user.password !== password)
            return NextResponse.json({ message: "password wrong" });
        return NextResponse.json({
            message: "Login successful",
            user: { id: user.id, username: user.username },
        });
    }

    const now = Date.now();
    const entry = failedAttempts[username] ?? { count: 0, lockedUntil: 0 };

    if (entry.lockedUntil > now) {
        const secondsLeft = Math.ceil((entry.lockedUntil - now) / 1000);
        return NextResponse.json(
            { message: `Account locked. Try again in ${secondsLeft}s.` },
            { status: 429 }
        );
    }

    if (!user || user.password !== password) {
        entry.count += 1;
        if (entry.count >= 3) {
            entry.lockedUntil = now + 3 * 60 * 1000;
        }
        failedAttempts[username] = entry;
        return NextResponse.json(
            { message: "Invalid username or password" },
            { status: 401 }
        );
    }

    delete failedAttempts[username];

    return NextResponse.json({
        message: "Login successful",
        user: { id: user.id, username: user.username },
    });
}
