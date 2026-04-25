/**
 * YACHT CONCIERGE — Google Apps Script Backend
 * ─────────────────────────────────────────────
 * Deploy as Web App:
 *   Execute as:       Me
 *   Who has access:   Anyone
 *
 * This script receives GET requests from the website contact form
 * and provisioning shop, writes rows to the appropriate Google Sheet
 * tab, sends an email notification to the operations inbox, and
 * sends an auto-reply confirmation to the client.
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

var NOTIFY_EMAIL = 'info@yacht-concierge.me';
var REPLY_FROM   = 'Yacht Concierge Montenegro';

var SHEET_HEADERS = {
  'Quote Requests': [
    'Timestamp', 'Ref', 'Name', 'Role', 'Email', 'Phone',
    'Yacht', 'LOA', 'Flag', 'Port', 'ETA', 'ETD', 'Services', 'Notes'
  ],
  'Provisioning Orders': [
    'Timestamp', 'Ref', 'Yacht', 'Marina', 'Berth',
    'Date', 'Time', 'Email', 'Notes', 'Items', 'Item Count', 'Subtotal', 'Total'
  ]
};

// ── Entry point ───────────────────────────────────────────────────────────────

function doPost(e) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    var data = JSON.parse(e.postData.contents);
    var sheetName = data._sheet || 'Quote Requests';
    var subject   = data._subject || 'New Submission — Yacht Concierge';
    delete data._sheet;
    delete data._subject;

    writeRow(sheetName, data);
    sendNotification(subject, data);
    sendAutoReply(sheetName, data);

    output.setContent(JSON.stringify({ result: 'ok' }));
  } catch (err) {
    console.error('Submission error: ' + err.toString());
    output.setContent(JSON.stringify({ result: 'error', message: err.toString() }));
  }

  return output;
}

function doGet(e) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    if (e.parameter && e.parameter.payload) {
      var data = JSON.parse(e.parameter.payload);
      var sheetName = data._sheet || 'Quote Requests';
      var subject   = data._subject || 'New Submission — Yacht Concierge';
      delete data._sheet;
      delete data._subject;

      writeRow(sheetName, data);
      sendNotification(subject, data);
      sendAutoReply(sheetName, data);

      output.setContent(JSON.stringify({ result: 'ok' }));
    } else {
      output.setContent(JSON.stringify({ status: 'ok', service: 'Yacht Concierge API' }));
    }
  } catch (err) {
    console.error('Submission error: ' + err.toString());
    output.setContent(JSON.stringify({ result: 'error', message: err.toString() }));
  }

  return output;
}

// ── Sheet writer ──────────────────────────────────────────────────────────────

function writeRow(sheetName, data) {
  var ss    = SpreadsheetApp.openById('1pLJ-0thQLh12DVbCHa9gsztoIM8iNwQRZhwrCDaoKVM');
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  if (sheet.getLastColumn() === 0) {
    var hdrs = SHEET_HEADERS[sheetName] || ['Timestamp'].concat(Object.keys(data));
    sheet.getRange(1, 1, 1, hdrs.length).setValues([hdrs]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, hdrs.length)
      .setBackground('#001730')
      .setFontColor('#EFEAE2')
      .setFontWeight('bold');
  }

  var headers   = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

  var row = headers.map(function(h) {
    if (h === 'Timestamp') return timestamp;
    var key = h.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    if (data[h]   !== undefined) return data[h];
    if (data[key] !== undefined) return data[key];
    var variations = [h, h.toLowerCase(), key];
    for (var i = 0; i < variations.length; i++) {
      if (data[variations[i]] !== undefined) return data[variations[i]];
    }
    return '—';
  });

  sheet.appendRow(row);
}

// ── Internal notification ─────────────────────────────────────────────────────

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

// ── Auto-reply to client ──────────────────────────────────────────────────────

function sendAutoReply(sheetName, data) {
  var clientEmail = data.email || data.Email;
  if (!clientEmail || clientEmail === '—') return; // no email, skip

  if (sheetName === 'Quote Requests') {
    sendQuoteAutoReply(data, clientEmail);
  } else if (sheetName === 'Provisioning Orders') {
    sendOrderAutoReply(data, clientEmail);
  }
}

function sendQuoteAutoReply(data, toEmail) {
  var ref  = data.ref  || 'N/A';
  var name = data.name || 'Captain';

  var subject = 'Your enquiry is with us — Ref. ' + ref;

  var body = [
    'Dear ' + name + ',',
    '',
    'Thank you for reaching out. Your enquiry has been received and I have personally',
    'taken on your file.',
    '',
    'Here is a summary of what we have logged:',
    '',
    '  Reference    ' + ref,
    '  Vessel       ' + (data.yacht    || '—'),
    '  Port         ' + (data.port     || '—'),
    '  Arrival      ' + (data.eta      || '—'),
    '  Departure    ' + (data.etd      || '—'),
    '  Services     ' + (data.services || '—'),
    '',
    'You will receive a full service proposal — berths, customs approach, provisioning',
    'calendar, and an itemised budget — within 24 hours.',
    '',
    'If anything changes on your end in the meantime, or if there is anything urgent,',
    'the fastest way to reach me is WhatsApp: +382 67 144 555.',
    'I am typically available 06:00 – 22:00 CET.',
    '',
    'Looking forward to having you in Montenegrin waters.',
    '',
    'Warm regards,',
    '',
    'Iva Erceg',
    'Operations Director',
    'Yacht Concierge Montenegro',
    '',
    'WhatsApp / Phone: +382 67 144 555',
    'Email: info@yacht-concierge.me',
    'Pomorska ulica, Zgrada Baia · Porto Montenegro · Tivat 85320',
    'yacht-concierge.me',
  ].join('\n');

  MailApp.sendEmail({
    to:       toEmail,
    subject:  subject,
    body:     body,
    name:     REPLY_FROM,
    replyTo:  NOTIFY_EMAIL,
  });
}

function sendOrderAutoReply(data, toEmail) {
  var ref   = data.ref   || 'N/A';
  var items = (data.items || '—').split(' | ');

  var subject = 'Order №' + ref + ' confirmed — delivery to ' + (data.marina || 'your berth');

  var body = [
    'Your provisioning order has been received.',
    '',
    'Here is your confirmation:',
    '',
    '  Order №       ' + ref,
    '  Vessel        ' + (data.yacht  || '—'),
    '  Marina        ' + (data.marina || '—'),
    '  Berth         ' + (data.berth  || '—'),
    '  Delivery      ' + (data.date   || '—') + (data.time && data.time !== '—' ? ' at ' + data.time : ''),
    '',
    'Items ordered:',
  ].concat(
    items.map(function(line) { return '  · ' + line; })
  ).concat([
    '',
    '  Subtotal      ' + (data.subtotal || '—'),
    '  Total         ' + (data.total    || '—'),
    '  (VAT will be itemised on the final invoice)',
    '',
    'A coordinator will confirm your exact delivery window within two operational hours.',
    'If you need to add items, change the delivery time, or have any special instructions,',
    'please reply to this email or contact us on WhatsApp.',
    '',
    'We look forward to having everything ready at the berth.',
    '',
    'Warm regards,',
    '',
    'Iva Erceg',
    'Operations Director',
    'Yacht Concierge Montenegro',
    '',
    'WhatsApp / Phone: +382 67 144 555',
    'Email: orders@yacht-concierge.me',
    'Pomorska ulica, Zgrada Baia · Porto Montenegro · Tivat 85320',
    'yacht-concierge.me',
  ]).join('\n');

  MailApp.sendEmail({
    to:       toEmail,
    subject:  subject,
    body:     body,
    name:     REPLY_FROM,
    replyTo:  'orders@yacht-concierge.me',
  });
}
