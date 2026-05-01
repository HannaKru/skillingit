import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../db';

export async function PATCH(request: NextRequest) {
    try {
        const { firebaseUid, emailVerified } = await request.json();

        const result = await pool.query(
            `UPDATE users
             SET is_email_verified = $1
             WHERE firebase_uid = $2
                 RETURNING id, email, firebase_uid, is_email_verified`,
            [emailVerified, firebaseUid]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user: result.rows[0] });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}