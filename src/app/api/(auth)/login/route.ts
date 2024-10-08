import { NextRequest, NextResponse } from "next/server";
import validateEmail from "helpers/validateEmail";
import validatePassword from "helpers/validatePassword";
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";
import * as jose from "jose";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { email, password } = body;

    // Validate email
    if (!validateEmail(email)) {
        return NextResponse.json({ 'message': 'Invalid Email' }, { status: 400 });
    }

    // Validate password
    if (!validatePassword(password)) {
        return NextResponse.json({ 'message': 'Invalid Password' }, { status: 400 });
    }

    // Find user by email and await the promise
    const user = await prisma.user.findFirst({
        where: {
            email
        }
    });

    if (!user) {
        return NextResponse.json({ 'message': 'Invalid email or password' }, { status: 404 });
    }

    // Compare password and await the promise
    const isCorrectPassword = bcrypt.compareSync(password, user.password);
    if (!isCorrectPassword) {
        return NextResponse.json({ 'message': 'Invalid Email or Password' }, { status: 400 });
    }

    // Create JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = 'HS256';

    const jwt = await new jose.SignJWT({
        id:user.id.toString(),
        name:user.name,
        role:user.role
    })
        .setProtectedHeader({ alg })
        .setExpirationTime('1h')
        .sign(secret);

        
        cookies().set('Authorization', jwt, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
        });
    
        return NextResponse.json({'token':jwt});
}


