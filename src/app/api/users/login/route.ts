import {NextRequest, NextResponse} from 'next/server';
import {pool} from '../db';

export async function PATCH(request: NextRequest){
    try{
        const {firebaseUid}=await request.json();
        if(!firebaseUid){
            return NextResponse.json(
                {error:'firebaseUid is required'},
                {status:400}
            );
        }
        const result = await pool.query(
            `UPDATE users
            SET last_login=NOW(), 
                is_online=true,
                last_seen=NOW()
                WHERE firebas_uid=$1
                RETURNING id, email,last_login`,[firebaseUid]
        );

        if(result.rows.length === 0){
            return NextResponse.json(
                {error:'User not found'},
                {status:404}
            );
        }
        return NextResponse.json({
            message: 'Login updated successfully',
            user: result.rows[0]
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