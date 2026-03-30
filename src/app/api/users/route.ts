import {NextRequest, NextResponse} from 'next/server';
import {pool} from './db';
//import {hashPassword} from '@/lib/auth-helpers';

export async function POST (request: NextRequest){
    try{
        const {email, firebaseUid, emailVerified} = await request.json();
        const existingUser = await pool.query('SELECT id FROM users WHERE email= $1', [email]);
        if (existingUser.rows.length > 0){
            return NextResponse.json(
                {error: 'User already exists'},
                {status: 400}
            );
        }
        //add user to db
        const result = await pool.query(
            'INSERT INTO users (email, firebase_uid, email_verified, created_at)'+
            'VALUES ($1, $2, $3, NOW())'+
            'RETURNING id, email, email_verified, created_at',
            [email, firebaseUid, emailVerified]
        );
        return NextResponse.json({
            message: 'User created successfully',
            user: result.rows[0],
        }, {status: 201});
    } catch (error) {
        console.error('Database error: ', error);
        return NextResponse.json(
            {error: 'Internal Server Error'},
            {status: 500}
        );
    }
}

export async function GET (request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const firebaseUid = searchParams.get('firebase_uid')
    try {
        let query = 'SELECT id, email, firebase_uid, email_verified FROM users';
        let params=[]
        if (email){
            query += ' WHERE email= $1'
            params=[email]
        } else if (firebaseUid){
            query += 'WHERE firebase_uid = $1'
            params=[firebaseUid]
        } else {
            return NextResponse.json(
                {error : 'Missing search parameters'},
                {status: 400}

            )
        }
    } catch (e){

    }
}