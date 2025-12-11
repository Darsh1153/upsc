import { NextRequest } from 'next/server';
import { createServerClient } from './supabase';

export interface AdminUser {
    id: string;
    email: string;
    name?: string;
    role: string;
}

// Verify credentials using Supabase
export async function verifyCredentials(email: string, password: string): Promise<AdminUser | null> {
    try {
        const supabase = createServerClient();
        
        // Sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error || !data.user) {
            console.log('Authentication error:', error?.message);
            return null;
        }

        // Get user metadata
        const userMetadata = data.user.user_metadata || {};
        
        // Check if user has admin role
        // You can set this in Supabase Dashboard > Authentication > Users > User Metadata
        // Or use Supabase RLS policies to manage admin access
        const userRole = userMetadata.role || 'user';

        return {
            id: data.user.id,
            email: data.user.email!,
            name: userMetadata.name || userMetadata.full_name || data.user.email?.split('@')[0] || 'Admin',
            role: userRole,
        };
    } catch (error) {
        console.error('Error verifying credentials:', error);
        return null;
    }
}

// Verify token from Supabase session
export async function verifyToken(accessToken: string): Promise<AdminUser | null> {
    try {
        const supabase = createServerClient();
        
        const { data: { user }, error } = await supabase.auth.getUser(accessToken);

        if (error || !user) {
            console.log('Token verification error:', error?.message);
            return null;
        }

        const userMetadata = user.user_metadata || {};
        const userRole = userMetadata.role || 'user';

        return {
            id: user.id,
            email: user.email!,
            name: userMetadata.name || userMetadata.full_name || user.email?.split('@')[0] || 'Admin',
            role: userRole,
        };
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
}

export function getTokenFromRequest(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    return request.cookies.get('sb-access-token')?.value || null;
}

export async function verifyAuth(request: NextRequest): Promise<AdminUser | null> {
    const token = getTokenFromRequest(request);
    if (!token) return null;
    return await verifyToken(token);
}

