import type { Handle } from "@sveltejs/kit";

const securityHeaders = {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    // 'Content-Security-Policy': 'default-src localhost https://endevyr.com https://*.googleapis.com https://*.gstatic.com *.logr-ingest.com *.min.js',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), fullscreen=(), payment=(), usb=(), sync-xhr=(), magnetometer=(), gyroscope=(), accelerometer=(), midi=(), xr-spatial-tracking=(), autoplay=()',
    'Referrer-Policy': 'origin-when-cross-origin',
}

export const handle: Handle = async ({ event, resolve }) => {
    const response = await resolve(event);
    Object.entries(securityHeaders).forEach(
        ([header, value]) => response.headers.set(header, value)
    );

    return response;
}