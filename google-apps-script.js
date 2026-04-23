/**
 * YACHT CONCIERGE — Google Apps Script Backend
 * ─────────────────────────────────────────────
 * Deploy as Web App:
 *   Execute as:       Me
 *   Who has access:   Anyone
 *
 * This script receives POST requests from the website contact form
 * and provisioning shop, writes rows to the appropriate Google Sheet
 * tab, and sends an email notification to the operations inbox.
 *
 * SETUP:
 * 1. Open your Google Sheet: "Yacht Concierge — Submissions"
 * 2. Create two tabs: "Quote Requests" and "Provisioning Orders"
 * 3. In the Sheet: Extensions → Apps Script
 * 4. Replace all existing code with this file
 * 5. Click Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Authorise and copy the Web App URL
 * 7. Paste the URL into Cloudflare Pages → Settings → Environment Variables
 *    as VITE_API_URL
 */

// ── Configuration ────────────────────────────────────────────────────────────

var NOTIFY_EMAIL = 'info@yacht-concierge.com';

var SHEET_HEADERS = {
  'Quote Requests': [
    'Timestamp', 'Ref', 'Name', 'Role', 'Email', 'Phone',
    'Yacht', 'LOA', 'Flag', 'Port', 'ETA', 'ETD', 'Services', 'Notes'
  ],
  'Provisioning Orders': [
    'Timestamp', 'Ref', 'Yacht', 'Marina', 'Berth',
    'Date', 'Time', 'Notes', 'Items', 'Item Count', 'Subtotal', 'Total'
  ]
};

// ── Entry point ───────────────────────────────────────────────────────────────

function doPost(e) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    // Parse JSON body (sent as text/plain to avoid CORS preflight)
    var data = JSON.parse(e.postData.contents);

    var sheetName = data._sheet || 'Quote Requests';
    var subject   = data._subject || 'New Submission — Yacht Concierge';

    // Remove metadata fields before writing to sheet
    delete data._sheet;
    delete data._subject;

    // Write row to Google Sheet
    writeRow(sheetName, data);

    // Send email notification
    sendNotification(subject, data);

    output.setContent(JSON.stringify({ result: 'ok' }));

  } catch (err) {
    // Log error for debugging (visible in Apps Script → Executions)
    console.error('Submission error: ' + err.toString());
    output.setContent(JSON.stringify({ result: 'error', message: err.toString() }));
  }

  return output;
}

// Allow health-check GET (also confirms deployment is live)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', service: 'Yacht Concierge API' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Sheet writer ──────────────────────────────────────────────────────────────

function writeRow(sheetName, data) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    // Create tab with headers if it doesn't exist yet
    sheet = ss.insertSheet(sheetName);
    var headers = SHEET_HEADERS[sheetName] || ['Timestamp'].concat(Object.keys(data));
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground('#001730')
      .setFontColor('#EFEAE2')
      .setFontWeight('bold');
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

  // Build row in header order, fallback to '—' for missing fields
  var row = headers.map(function(h) {
    if (h === 'Timestamp') return timestamp;
    var key = h.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    // Try exact match first, then normalised key
    if (data[h] !== undefined) return data[h];
    if (data[key] !== undefined) return data[key];
    // Try common key variations
    var variations = [h, h.toLowerCase(), key];
    for (var i = 0; i < variations.length; i++) {
      if (data[variations[i]] !== undefined) return data[variations[i]];
    }
    return '—';
  });

  sheet.appendRow(row);
}

// ── Email notification ────────────────────────────────────────────────────────

function sendNotification(subject, data) {
  var lines = Object.entries(data).map(function(pair) {
    return pair[0] + ': ' + pair[1];
  });

  var body = [
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'YACHT CONCIERGE — New Submission',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
  ].concat(lines).concat([
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'Received: ' + new Date().toUTCString(),
    'Source: yacht-concierge.me',
  ]).join('\n');

  MailApp.sendEmail({
    to:      NOTIFY_EMAIL,
    subject: subject,
    body:    body,
  });
}
