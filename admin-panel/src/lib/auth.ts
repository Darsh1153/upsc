import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'upsc-admin-secret-key';

// Hardcoded admin credentials
const HARDCODED_ADMIN = {
    username: 'admin',
    password: '123',
    id: 0,
    email: 'admin@upscprep.com',
    name: 'Admin',
    role: 'admin',
};

export interface AdminUser {
    id: number;
    email: string;
    name: string;
    role: string;
}

export function verifyCredentials(username: string, password: string): AdminUser | null {
    if ((username === HARDCODED_ADMIN.username || username === HARDCODED_ADMIN.email) 
        && password === HARDCODED_ADMIN.password) {
        return {
            id: HARDCODED_ADMIN.id,
            email: HARDCODED_ADMIN.email,
            name: HARDCODED_ADMIN.name,
            role: HARDCODED_ADMIN.role,
        };
    }
    return null;
}

export function generateToken(user: AdminUser): string {
    return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AdminUser | null {
    try {
        return jwt.verify(token, JWT_SECRET) as AdminUser;
    } catch {
        return null;
    }
}

export function getTokenFromRequest(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    return request.cookies.get('token')?.value || null;
}

export function verifyAuth(request: NextRequest): AdminUser | null {
    const token = getTokenFromRequest(request);
    if (!token) return null;
    return verifyToken(token);
}

