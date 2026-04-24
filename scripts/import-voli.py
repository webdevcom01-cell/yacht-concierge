#!/usr/bin/env python3
"""
Voli Product Importer
─────────────────────
Generates src/lib/products.js from Voli FOOD SERVICE xlsx.

Usage:
  python scripts/import-voli.py

Options (set at top of file):
  XLSX_PATH      — path to Voli xlsx file
  IMAGE_CDN      — CDN URL pattern, e.g. "https://cdn.voli.me/products/{code}.jpg"
                   Leave empty ("") to use abstract swatches (no images)
  IMAGE_ZIP      — path to a ZIP of product images named by code (e.g. 200735.jpg)
                   Leave empty ("") if not available
  OUTPUT_PATH    — where to write the JS file
"""

import pandas as pd
import json
import os
import zipfile
import shutil
import warnings
warnings.filterwarnings('ignore')

# ── Configuration ────────────────────────────────────────────────────────────

XLSX_PATH   = 'FOOD SERVICE 2025.xlsx'   # Put xlsx in project root or adjust path
IMAGE_CDN   = ''                          # e.g. 'https://cdn.voli.me/products/{code}.jpg'
IMAGE_ZIP   = ''                          # e.g. 'voli-images.zip'
OUTPUT_PATH = 'src/lib/products.js'
MARKUP      = 0.30                        # 30% markup on all Voli prices

# ── Category mapping ─────────────────────────────────────────────────────────

CAT_MAP = {
    'ASIAN FOOD':                   'asian',
    'LARNAUDIE DUCK & GOOSE':       'meat',
    'PREMIUM MEAT':                 'meat',
    'WAGYU BEEF':                   'meat',
    'RISTORIS PROFESSIONAL':        'pantry',
    'BAKERY & BREADS':              'bakery',
    'JAMS- HONEY & CEREALS':        'pantry',
    'CHICKEN & TURKEY MEAT':        'meat',
    'SEA PRODUCTS':                 'seafood',
    'CHEESES':                      'dairy',
    'CHARCUTERIE':                  'charcuterie',
    'SAUSAGES AND LOCAL CURED MEAT':'charcuterie',
    'PASTA & FLOURS':               'pantry',
    'TOMATO & RICE':                'pantry',
    'FROZEN VEGETABLES & POTATOES': 'frozen',
    'TRUFFLES':                     'pantry',
    'THERMOSTABLE JAMS AND CONFECT':'pantry',
    'OILS':                         'pantry',
    'SPICES':                       'pantry',
}

# ── Helpers ───────────────────────────────────────────────────────────────────

def resolve_image(code):
    """Return image URL/path for a product code, or None if not available."""
    if IMAGE_CDN and code:
        return IMAGE_CDN.replace('{code}', code)
    if IMAGE_ZIP and code:
        return f'/products/{code}.jpg'   # served from public/products/
    return None

def extract_zip_images(zip_path):
    """Unzip product images into public/products/."""
    dest = 'public/products'
    os.makedirs(dest, exist_ok=True)
    with zipfile.ZipFile(zip_path) as z:
        for name in z.namelist():
            if name.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                z.extract(name, dest)
    print(f'Images extracted to {dest}/')

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    if not os.path.exists(XLSX_PATH):
        print(f'ERROR: {XLSX_PATH} not found. Place the Voli xlsx in the project root.')
        return

    if IMAGE_ZIP and os.path.exists(IMAGE_ZIP):
        print(f'Extracting images from {IMAGE_ZIP}...')
        extract_zip_images(IMAGE_ZIP)

    xl = pd.ExcelFile(XLSX_PATH)
    products = []
    skipped = 0

    for sheet in xl.sheet_names:
        cat = CAT_MAP.get(sheet, 'pantry')
        df = pd.read_excel(XLSX_PATH, sheet_name=sheet, header=None)

        header_row = None
        for i, row in df.iterrows():
            vals = [str(v).upper().strip() for v in row.values if pd.notna(v)]
            if any(k in vals for k in ['CODE', 'PRODUCT', 'SIFRA']):
                header_row = i
                break
        if header_row is None:
            continue

        df = pd.read_excel(XLSX_PATH, sheet_name=sheet, header=header_row)
        df = df.dropna(how='all')

        cols = {str(c).strip().upper(): c for c in df.columns}
        code_col = cols.get('CODE') or cols.get('SIFRA')
        name_col = cols.get('PRODUCT') or cols.get('NAZIV ARTIKLA') or cols.get('ARTIKAL')
        unit_col = cols.get('UNIT') or cols.get('J/MJ') or cols.get('J.MJ')
        vat_col  = cols.get('VAT INCLUDED') or cols.get('CIJENA SA PDV') or cols.get('CIJENA SA PDV ')
        net_col  = cols.get('NET PRICE') or cols.get('NETO CIJENA') or cols.get('VP CIJENA') or cols.get('CIJENA BEZ PDV')

        if not name_col or not vat_col:
            continue

        for _, row in df.iterrows():
            name = str(row[name_col]).strip() if pd.notna(row[name_col]) else ''
            if not name or name.upper() in ('PRODUCT', 'NAZIV ARTIKLA', 'ARTIKAL', 'NAN', ''):
                skipped += 1
                continue

            price_raw = row[vat_col] if pd.notna(row.get(vat_col)) else None
            if price_raw is None and net_col:
                try:
                    price_raw = row[net_col] if pd.notna(row[net_col]) else None
                except:
                    pass
            try:
                price = round(float(price_raw) * (1 + MARKUP), 2)
            except:
                skipped += 1
                continue
            if price <= 0:
                skipped += 1
                continue

            code = str(int(row[code_col])) if code_col and pd.notna(row.get(code_col)) else ''
            unit = str(row[unit_col]).strip() if unit_col and pd.notna(row.get(unit_col)) else 'pc'
            image = resolve_image(code)

            entry = {
                'id':      f'v{code}' if code else f'v{len(products)+1}',
                'name':    name,
                'cat':     cat,
                'price':   price,
                'unit':    unit,
                'taxFree': False,
                'sameDay': False,
            }
            if image:
                entry['image'] = image

            products.append(entry)

    # Write JS
    lines = [
        '// Auto-generated from Voli FOOD SERVICE xlsx',
        '// Do not edit manually — run: python scripts/import-voli.py',
        '',
        'export const PRODUCTS = [',
    ]
    for p in products:
        parts = [
            f"id: {json.dumps(p['id'])}",
            f"name: {json.dumps(p['name'])}",
            f"cat: {json.dumps(p['cat'])}",
            f"price: {p['price']}",
            f"unit: {json.dumps(p['unit'])}",
            f"taxFree: false",
            f"sameDay: false",
        ]
        if 'image' in p:
            parts.append(f"image: {json.dumps(p['image'])}")
        lines.append('  { ' + ', '.join(parts) + ' },')
    lines.append('];')
    lines.append('')

    with open(OUTPUT_PATH, 'w') as f:
        f.write('\n'.join(lines))

    print(f'✓ {len(products)} products written to {OUTPUT_PATH} (markup: +{int(MARKUP*100)}%)')
    if IMAGE_CDN:
        print(f'  Images: CDN pattern → {IMAGE_CDN}')
    elif IMAGE_ZIP:
        print(f'  Images: local ZIP → public/products/')
    else:
        print(f'  Images: none (abstract swatches)')

if __name__ == '__main__':
    main()
