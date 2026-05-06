import {NextRequest, NextResponse} from 'next/server';
import {pool} from '../db';

export async function PATCH(request: NextRequest){
    try{
        const {firebaseUid, email, isEmailVerified, isSSO}=await request.json();
        if(!firebaseUid || !email){
            return NextResponse.json(
                {error:'firebaseUid and email are required'},
                {status:400}
            );
        }
        const updateResult = await pool.query(
            `UPDATE users
            SET last_login=NOW(), 
                is_online=true,
                last_seen=NOW(),
                firebase_uid=$1, is_email_verified=$2
                WHERE firebase_uid=$1 OR email=$3
                RETURNING id, email,profile_complete`,[firebaseUid, isEmailVerified, email]
        );

        if(updateResult.rows.length === 0){
            if(isSSO){
                const insertResult= await pool.query(
                    `INSERT INTO users (email, firebase_uid, is_email_verified, account_created_at, last_login, is_online)
                    VALUES ($1, $2, $3, NOW(), NOW(), true)
                    RETURNING id, email, profile_complete`, [email, firebaseUid,isEmailVerified]
                );
                return NextResponse.json({user: insertResult.rows[0], isNewUser: true});
            }
            else {
                return NextResponse.json(
                    {error: 'User not found'},
                    {status: 404}
                );
            }
        }
        return NextResponse.json({
            message: 'Login updated successfully',
            user: updateResult.rows[0]
        });
    }
    catch(error){
        console.error('Error updating login: ', error);
        return NextResponse.json(
            {error: 'Internal server error'},
            {status:500}
        );
    }
}