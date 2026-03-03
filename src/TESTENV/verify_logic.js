// 1. Get the input from the React App (Webhook)
let userInput = {};
try {
    // Try finding the node by your custom name first
    userInput = $('Auth Webhook1').first().json.body;
} catch (e) {
    try {
        // Fallback: Try standard 'Auth Webhook'
        userInput = $('Auth Webhook').first().json.body;
    } catch (e2) {
        try {
             // Last resort: Generic 'Webhook'
             userInput = $('Webhook').first().json.body;
        } catch (e3) {
             console.log("Warning: Could not find webhook node data.");
        }
    }
}

// Get clean input values
const targetId = (userInput.bookingid || '').toString().trim();
// We lowercase the name for comparison to be user-friendly (e.g. "Smith" matches "smith")
const targetName = (userInput.lastname || '').toString().trim().toLowerCase();

// 2. Iterate through ALL items from the Google Sheet to find a matching pair
let match = null;

// 'items' is the array of rows returned by the Google Sheets node
for (const item of items) {
    const row = item.json;
    
    // Get row values safely
    const rowId = (row.bookingid || '').toString().trim();
    const rowName = (row.lastname || '').toString().trim().toLowerCase();
    
    // COMPARE: Does both the ID and Name match this row?
    // We use 'includes' for name to handle cases like "Doe" matching "John Doe"
    // But for ID we want an exact match.
    if (rowId === targetId && rowName.includes(targetName) && targetName.length > 0) {
        match = row;
        break; // Found it, stop looking
    }
}

// 3. Construct Response
let response = { 
    valid: false, 
    message: "Reservation not found",
    debug: {
        targetId,
        targetName,
        rowsScanned: items.length
    }
};

if (match) {
    // Optional: Check if cancelled
    const status = (match.status || '').toLowerCase();
    
    if (status === 'cancelled') {
        response.message = "This reservation has been cancelled.";
    } else {
        // SUCCESS - Populate guest data for App.jsx
        response = {
            valid: true,
            guest: {
                name: match.lastname,
                property: match.property,
                email: match.email,
                phone: match.phone,
                stay: {
                    start: match.arrival,
                    end: match.departure,
                }
            }
        };
    }
}

return [ { json: response } ];