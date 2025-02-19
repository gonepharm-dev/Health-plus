// src/routes/register/+page.ts
export const ssr = false;

export async function load({ url }) {
    // Handle Google OAuth redirect if present
    const code = url.searchParams.get('code');
    return {
        code
    };
}