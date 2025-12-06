import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

// Login user by email (or create if using OAuth providers)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, name, phone, picture, provider = 'email' } = body;

        if (!email) {
            return NextResponse.json(
                { success: false, error: 'Email is required' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Find user by email
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, email.toLowerCase()))
            .limit(1);

        if (existingUser) {
            // Check if user is active
            if (!existingUser.isActive) {
                return NextResponse.json(
                    { success: false, error: 'Account is deactivated. Please contact support.' },
                    { status: 403, headers: corsHeaders }
                );
            }

            // Update last login and any new info from OAuth
            await db
                .update(users)
                .set({
                    lastLogin: new Date(),
                    updatedAt: new Date(),
                    // Update picture if provided (useful for OAuth)
                    ...(picture && { picture }),
                    ...(name && { name }),
                })
                .where(eq(users.id, existingUser.id));

            // Fetch updated user
            const [updatedUser] = await db
                .select()
                .from(users)
                .where(eq(users.id, existingUser.id))
                .limit(1);

            return NextResponse.json({
                success: true,
                user: updatedUser,
                isNewUser: false,
            }, { headers: corsHeaders });
        }

        // User doesn't exist - create new account (auto-registration)
        if (!name) {
            return NextResponse.json(
                { success: false, error: 'Name is required for new users' },
                { status: 400, headers: corsHeaders }
            );
        }

        const [newUser] = await db
            .insert(users)
            .values({
                email: email.toLowerCase(),
                name,
                phone: phone || null,
                picture: picture || null,
                provider,
                role: 'student',
                isGuest: false,
                isActive: true,
                lastLogin: new Date(),
            })
            .returning();

        return NextResponse.json({
            success: true,
            user: newUser,
            isNewUser: true,
        }, { status: 201, headers: corsHeaders });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500, headers: corsHeaders }
        );
    }
}

