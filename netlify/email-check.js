/*
 * FILE: netlify/functions/email-check.js
 * Simulates the LeakCheck.io API response for email breach checks.
 */
exports.handler = async (event, context) => {
    const { query } = event.queryStringParameters; // Get email from query param

    if (!query || !query.includes('@')) {
        return {
            statusCode: 400,
            body: JSON.stringify({ success: false, error: 'Invalid email query parameter provided.' }),
            headers: { 'Content-Type': 'application/json' },
        };
    }

    // --- SIMULATED RESPONSE ---
    // You can customize this data or add logic based on the query email
    let responseData;
    if (query.toLowerCase() === 'example@example.com') {
        responseData = {
            success: true,
            found: 1,
            quota: 399, // Simulate quota decrease
            result: [
                {
                    email: "example@example.com",
                    source: {
                        name: "SimulatedBreach.net",
                        breach_date: "2023-10",
                        unverified: 0,
                        passwordless: 0,
                        compilation: 0
                    },
                    first_name: "Example",
                    last_name: "User",
                    username: "example_user",
                    fields: ["first_name", "last_name", "username", "email", "password_plaintext_simulated"] // Added simulated password field
                }
            ]
        };
    } else if (query.toLowerCase() === 'another@test.org') {
         responseData = {
            success: true,
            found: 2,
            quota: 398,
            result: [
                 {
                    email: "another@test.org",
                    source: { name: "DataDumpSite", breach_date: "2022-01", unverified: 1, passwordless: 0, compilation: 0 },
                    username: "tester2",
                    fields: ["username", "email"]
                },
                {
                    email: "another@test.org",
                    source: { name: "OldForumDb", breach_date: "2019-05", unverified: 0, passwordless: 1, compilation: 1 },
                    fields: ["email"]
                }
            ]
        };
    } else {
        // Simulate nothing found
        responseData = {
            success: true,
            found: 0,
            quota: 397,
            result: []
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(responseData),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Allow requests from any origin (adjust if needed)
        },
    };
};

// ========================================================================

/*
 * FILE: netlify/functions/phone-lookup.js
 * Simulates responses from phone lookup and WhatsApp APIs.
 */
exports.handler = async (event, context) => {
    const { query } = event.queryStringParameters; // Get phone number

    if (!query || !query.startsWith('+')) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid phone number query parameter (must start with +).' }),
            headers: { 'Content-Type': 'application/json' },
        };
    }

    // --- SIMULATED DATA ---
    const simulatedLookupData = {
        data: {
            valid_number: true,
            national_format: `(123) 456-${query.slice(-4)}`, // Make it slightly dynamic
            country_code: query.slice(1, 4), // Guess country code
            carrier: { name: "Simulated Carrier Inc.", type: "mobile" },
        },
        error: null
    };

    const simulatedWhatsAppData = {
        number: query,
        isWAContact: Math.random() > 0.3, // Randomly decide if registered
        isBusiness: Math.random() > 0.8, // Randomly decide if business
        type: "Mobile",
        profilePic: Math.random() > 0.6 ? `https://placehold.co/100x100/7f9cf5/ffffff?text=WA+${query.slice(-2)}` : null, // Random profile pic
        about: Math.random() > 0.5 ? "Simulated WhatsApp status message." : "Hey there! I am using Simulated WhatsApp.",
        error: null
    };

    // Simulate potential API errors randomly
    if (Math.random() < 0.1) {
        simulatedLookupData.data = {};
        simulatedLookupData.error = "Simulated Lookup API Timeout";
    }
     if (Math.random() < 0.1) {
        simulatedWhatsAppData.error = "Simulated WhatsApp API Not Found";
        // Clear other fields if error occurs
        Object.keys(simulatedWhatsAppData).forEach(key => {
            if (key !== 'error') simulatedWhatsAppData[key] = null;
        });
    }


    return {
        statusCode: 200,
        body: JSON.stringify({
            phoneLookup: simulatedLookupData,
            whatsApp: simulatedWhatsAppData,
        }),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
    };
};


// ========================================================================

/*
 * FILE: netlify/functions/ip-lookup.js
 * Simulates the response from an IP geolocation API.
 */
exports.handler = async (event, context) => {
    const { query } = event.queryStringParameters; // Get IP address

     if (!query) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing IP address query parameter.' }),
            headers: { 'Content-Type': 'application/json' },
        };
    }

    // --- SIMULATED RESPONSE --- (Example for 8.8.8.8)
    // You could add more IPs or generate random data
    let data;
    if (query === '8.8.8.8') {
        data = {
            ip: "8.8.8.8",
            city: "Mountain View",
            region: "California",
            region_code: "CA",
            region_type: "state",
            country_code: "US",
            country_name: "United States",
            continent_code: "NA",
            continent_name: "North America",
            latitude: 37.422,
            longitude: -122.084,
            postal: "94043",
            calling_code: "1",
            flag: "https://ipdata.co/flags/us.png", // Example flag URL
            emoji_flag: "🇺🇸",
            emoji_unicode: "U+1F1FA U+1F1F8",
            asn: { asn: "AS15169", name: "Google LLC", domain: "google.com", route: "8.8.8.0/24", type: "hosting" },
            languages: [{ name: "English", native: "English", code: "en" }],
            currency: { name: "US Dollar", code: "USD", symbol: "$", native: "$", plural: "US dollars" },
            time_zone: { name: "America/Los_Angeles", abbr: "PDT", offset: "-0700", is_dst: true, current_time: new Date().toISOString() },
            threat: { is_tor: false, is_icloud_relay: false, is_proxy: false, is_datacenter: true, is_anonymous: false, is_known_attacker: false, is_known_abuser: false, is_threat: false, is_bogon: false, scores: { vpn_score: 0, proxy_score: 10, threat_score: 5, trust_score: 95 } }, // Example threat data
            carrier: { name: "Google Cloud", mcc: "", mnc: "" },
            company: { name: "Google LLC", domain: "google.com", network: "8.8.8.0/24", type: "hosting" },
        };
    } else if (query === '1.1.1.1') {
         data = { // Data for Cloudflare
            ip: "1.1.1.1", city: "Sydney", region: "New South Wales", region_code: "NSW", country_code: "AU", country_name: "Australia", continent_code: "OC", continent_name: "Oceania", latitude: -33.8688, longitude: 151.2093, postal: "2000", calling_code: "61", flag: "https://ipdata.co/flags/au.png", emoji_flag: "🇦🇺", asn: { asn: "AS13335", name: "Cloudflare, Inc.", domain: "cloudflare.com", route: "1.1.1.0/24", type: "cdn" }, languages: [{ name: "English", native: "English", code: "en" }], currency: { name: "Australian Dollar", code: "AUD", symbol: "A$", native: "$", plural: "Australian dollars" }, time_zone: { name: "Australia/Sydney", abbr: "AEST", offset: "+1000", is_dst: false, current_time: new Date().toISOString() }, threat: { is_tor: false, is_icloud_relay: false, is_proxy: false, is_datacenter: true, is_anonymous: false, is_known_attacker: false, is_known_abuser: false, is_threat: false, is_bogon: false, scores: { vpn_score: 0, proxy_score: 5, threat_score: 2, trust_score: 98 } }, carrier: {}, company: { name: "Cloudflare, Inc.", domain: "cloudflare.com", type: "cdn" }
        };
    } else {
         // Generic fallback data
         data = {
            ip: query, city: "Simulated City", region: "Simulated Region", country_code: "XX", country_name: "Simulatia", continent_code: "ZZ", latitude: 0, longitude: 0, postal: "00000", calling_code: "0", flag: `https://placehold.co/32x24/cccccc/999999?text=${query.slice(0,1)}X`, emoji_flag: "❓", asn: { asn: "AS0000", name: "Simulated ISP", domain: "simulated.net", route: `${query}/32`, type: "isp" }, languages: [], currency: { name: "Simulon", code: "SIM", symbol: "§" }, time_zone: { name: "Etc/UTC", abbr: "UTC", offset: "+0000", is_dst: false, current_time: new Date().toISOString() }, threat: { is_tor: Math.random() < 0.1, is_vpn: Math.random() < 0.2, is_proxy: Math.random() < 0.15, is_datacenter: Math.random() < 0.3, is_anonymous: false, is_known_attacker: Math.random() < 0.05, is_known_abuser: Math.random() < 0.08, is_threat: Math.random() < 0.1, is_bogon: false, scores: { vpn_score: Math.floor(Math.random()*30), proxy_score: Math.floor(Math.random()*40), threat_score: Math.floor(Math.random()*50), trust_score: Math.floor(Math.random()*50)+50 } }, carrier: {}, company: {}
        };
    }


    return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
    };
};

// ========================================================================

/*
 * FILE: netlify/functions/social-check.js
 * Simulates checking if an email is linked to social media accounts.
 * NOTE: This simulation does NOT use the unreliable CORS proxy.
 */
exports.handler = async (event, context) => {
    const { query } = event.queryStringParameters; // Get email

    if (!query || !query.includes('@')) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid email query parameter provided.' }),
            headers: { 'Content-Type': 'application/json' },
        };
    }

    // --- SIMULATED RESPONSE ---
    // Determine results based on the email (or randomly)
    const results = {
        twitter: { linked: null, error: null },
        instagram: { linked: null, error: null },
        snapchat: { linked: null, error: null },
    };

    // Example logic: specific emails have specific results
    if (query.toLowerCase() === 'linked@everywhere.com') {
        results.twitter.linked = true;
        results.instagram.linked = true;
        results.snapchat.linked = true;
    } else if (query.toLowerCase() === 'on@twitter.com') {
         results.twitter.linked = true;
         results.instagram.linked = false;
         results.snapchat.linked = false;
    } else if (query.toLowerCase() === 'error@test.net') {
         results.twitter.error = "Simulated API Error";
         results.instagram.linked = false;
         results.snapchat.error = "Simulated Timeout";
    } else {
        // Default: Random results
        results.twitter.linked = Math.random() > 0.6;
        results.instagram.linked = Math.random() > 0.5;
        results.snapchat.linked = Math.random() > 0.7;
        // Randomly inject an error
        if (Math.random() < 0.1) results.twitter.error = "Simulated Random Error";
    }


    return {
        statusCode: 200,
        body: JSON.stringify(results),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
    };
};


// ========================================================================

/*
 * FILE: netlify/functions/generic-lookup.js
 * Handles simple lookups like username and address with placeholder text.
 */
exports.handler = async (event, context) => {
    const { query, type } = event.queryStringParameters; // Get query and type

    if (!query || !type) {
        return {
            statusCode: 400,
            body: 'Missing query or type parameter.',
            headers: { 'Content-Type': 'text/plain' },
        };
    }

    // --- SIMULATED RESPONSE (Plain Text) ---
    let responseText = `// Simulated Report: ${type.toUpperCase()} Query\n`;
    responseText += `// Timestamp: ${new Date().toISOString()}\n`;
    responseText += `// Target: ${query}\n`;
    responseText += `// -----------------------------------------\n`;
    responseText += `// [INFO] This is placeholder data for the ${type} simulation.\n`;
    responseText += `// In a real application, this function would query relevant databases or APIs.\n`;
     if (type === 'username') {
         responseText += `// Potential profiles for '${query}': None found in simulation.\n`;
     } else if (type === 'address') {
         responseText += `// Geolocation/Property data for '${query}': Not available in simulation.\n`;
     }
    responseText += `// -----------------------------------------\n`;
    responseText += `// Status: Simulated Scan Complete.`;


    return {
        statusCode: 200,
        body: responseText,
        headers: {
            'Content-Type': 'text/plain', // Return plain text
            'Access-Control-Allow-Origin': '*',
        },
    };
};
