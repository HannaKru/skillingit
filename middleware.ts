import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

export function middleware (request: NextRequest){
    const token = request.cookies.get('firebase-auth-token');
    const isLoginPage = request.nextUrl.pathname === '/LoginPage';
    const isRegisterPage = request.nextUrl.pathname === '/RegistrationPage';

    if(!token && !isLoginPage && !isRegisterPage) {
        return NextResponse.redirect(new URL('/LoginPage', request.url))

    }
    return NextResponse.next;

}