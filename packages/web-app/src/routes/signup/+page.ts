// src/routes/register/+page.ts
export const ssr = false;

export async function load({ url }) {
    const code = url.searchParams.get('code');
    return {
        code
    };
}