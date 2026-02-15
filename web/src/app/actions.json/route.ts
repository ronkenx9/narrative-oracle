import { NextResponse } from 'next/server';

export const GET = async () => {
    return NextResponse.json({
        rules: [
            {
                pathPattern: "/api/actions/**",
                apiPath: "/api/actions/**"
            }
        ]
    });
};
