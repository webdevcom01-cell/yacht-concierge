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

  var subject = 'Enquiry received · Ref. ' + ref + ' — Yacht Concierge Montenegro';

  var body = [
    'Dear ' + name + ',',
    '',
    'We have received your enquiry and a coordinator has been assigned to your file.',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'REFERENCE      ' + ref,
    'VESSEL         ' + (data.yacht || '—'),
    'PORT           ' + (data.port  || '—'),
    'ETA            ' + (data.eta   || '—'),
    'SERVICES       ' + (data.services || '—'),
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    'You will receive a full service proposal within 24 hours.',
    '',
    'For urgent matters, reach us directly:',
    '  WhatsApp / Phone: +382 67 144 555',
    '  Email: info@yacht-concierge.me',
    '',
    'Fair winds,',
    'Iva Erceg',
    'Operations Director · Yacht Concierge Montenegro',
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
  var ref = data.ref || 'N/A';

  var subject = 'Order Confirmation №' + ref + ' — Yacht Concierge Montenegro';

  var body = [
    'Order confirmed.',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'ORDER №        ' + ref,
    'VESSEL         ' + (data.yacht  || '—'),
    'MARINA         ' + (data.marina || '—'),
    'BERTH          ' + (data.berth  || '—'),
    'DELIVERY DATE  ' + (data.date   || '—'),
    'DELIVERY TIME  ' + (data.time   || '—'),
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    'ITEMS',
    (data.items || '—').split(' | ').join('\n'),
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'SUBTOTAL       ' + (data.subtotal || '—'),
    'TOTAL          ' + (data.total    || '—'),
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    'Your coordinator will confirm the delivery window within two operational hours.',
    'VAT will be itemised on the final invoice.',
    '',
    'For changes or urgent queries:',
    '  WhatsApp / Phone: +382 67 144 555',
    '  Email: orders@yacht-concierge.me',
    '',
    'Yacht Concierge Montenegro',
    'Pomorska ulica, Zgrada Baia · Porto Montenegro · Tivat 85320',
    'yacht-concierge.me',
  ].join('\n');

  MailApp.sendEmail({
    to:       toEmail,
    subject:  subject,
    body:     body,
    name:     REPLY_FROM,
    replyTo:  'orders@yacht-concierge.me',
  });
}
