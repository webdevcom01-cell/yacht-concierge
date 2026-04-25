#!/usr/bin/env python3
"""
Voli Image Scraper
──────────────────
Automatically matches every product in our catalog to its
image on voli.me and updates src/lib/products.js.

Strategy (per product):
  1. Search voli.me by product code  (most precise)
  2. Search voli.me by Montenegrin name from HORECA xlsx (good match)
  3. Search voli.me by English name from FOOD SERVICE xlsx (fallback)

Features:
  - Saves progress to scripts/image-mapping.json after each product
  - Resumes automatically if interrupted (skips already-found products)
  - Polite delays between requests to avoid getting blocked
  - Detailed console output so you can see what's happening

Run from project root:
  pip install requests beautifulsoup4 pandas openpyxl tqdm
  python scripts/scrape-voli-images.py

Output:
  scripts/image-mapping.json   — full code → image_url mapping
  src/lib/products.js          — updated with image fields
"""

import requests
from bs4 import BeautifulSoup
import pandas as pd
import json, time, re, os, random, warnings
warnings.filterwarnings('ignore')

# ── Configuration ─────────────────────────────────────────────────────────────

FOOD_SERVICE_XLSX = 'FOOD SERVICE 2025.xlsx'
HORECA_XLSX       = 'PONUDA PO ROBNIM GRUPAMA HORECA 2025 NOVEMBER.xlsx'
MAPPING_FILE      = 'scripts/image-mapping.json'
PRODUCTS_JS       = 'src/lib/products.js'
MARKUP            = 0.30

BASE_URL          = 'https://voli.me'
SEARCH_URL        = 'https://voli.me/pretraga?q={query}'

DELAY_MIN         = 1.2   # seconds between requests (be polite)
DELAY_MAX         = 2.5
REQUEST_TIMEOUT   = 10

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
                  'AppleWebKit/537.36 (KHTML, like Gecko) '
                  'Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'hr,bs;q=0.9,sr;q=0.8,en;q=0.7',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}

# ── Category mapping (same as import-voli.py) ─────────────────────────────────

CAT_MAP = {
    'ASIAN FOOD':'asian','LARNAUDIE DUCK & GOOSE':'meat','PREMIUM MEAT':'meat',
    'WAGYU BEEF':'meat','RISTORIS PROFESSIONAL':'ristoris','BAKERY & BREADS':'bakery',
    'JAMS- HONEY & CEREALS':'jams','CHICKEN & TURKEY MEAT':'meat',
    'SEA PRODUCTS':'seafood','CHEESES':'dairy','CHARCUTERIE':'charcuterie',
    'SAUSAGES AND LOCAL CURED MEAT':'charcuterie','PASTA & FLOURS':'pasta',
    'TOMATO & RICE':'condiments','FROZEN VEGETABLES & POTATOES':'frozen',
    'TRUFFLES':'truffles','THERMOSTABLE JAMS AND CONFECT':'jams',
    'OILS':'condiments','SPICES':'spices',
}

# ── Load Montenegrin names from HORECA xlsx ───────────────────────────────────

def load_horeca_names():
    """Returns dict: code → montenegrin_name"""
    if not os.path.exists(HORECA_XLSX):
        print(f'  [!] {HORECA_XLSX} not found — will use English names only')
        return {}
    xl = pd.ExcelFile(HORECA_XLSX)
    mapping = {}
    for sheet in xl.sheet_names:
        df = pd.read_excel(HORECA_XLSX, sheet_name=sheet, header=None)
        header_row = None
        for i, row in df.iterrows():
            vals = [str(v).upper().strip() for v in row.values if pd.notna(v)]
            if any(k in vals for k in ['SIFRA', 'CODE']):
                header_row = i; break
        if header_row is None: continue
        df = pd.read_excel(HORECA_XLSX, sheet_name=sheet, header=header_row).dropna(how='all')
        cols = {str(c).strip().upper(): c for c in df.columns}
        code_col = cols.get('SIFRA') or cols.get('CODE')
        name_col = cols.get('ARTIKAL') or cols.get('NAZIV ARTIKLA') or cols.get('PRODUCT')
        if not code_col or not name_col: continue
        for _, row in df.iterrows():
            try:
                code = str(int(row[code_col]))
                name = str(row[name_col]).strip()
                if code and name and name.upper() not in ('NAN', ''):
                    mapping[code] = name
            except: pass
    print(f'  Loaded {len(mapping)} Montenegrin names from HORECA xlsx')
    return mapping

# ── Load all products from FOOD SERVICE xlsx ──────────────────────────────────

def load_products():
    if not os.path.exists(FOOD_SERVICE_XLSX):
        print(f'ERROR: {FOOD_SERVICE_XLSX} not found in project root.')
        return []
    xl = pd.ExcelFile(FOOD_SERVICE_XLSX)
    products = []
    for sheet in xl.sheet_names:
        cat = CAT_MAP.get(sheet, 'pantry')
        df = pd.read_excel(FOOD_SERVICE_XLSX, sheet_name=sheet, header=None)
        header_row = None
        for i, row in df.iterrows():
            vals = [str(v).upper().strip() for v in row.values if pd.notna(v)]
            if any(k in vals for k in ['CODE', 'PRODUCT', 'SIFRA']):
                header_row = i; break
        if header_row is None: continue
        df = pd.read_excel(FOOD_SERVICE_XLSX, sheet_name=sheet, header=header_row).dropna(how='all')
        cols = {str(c).strip().upper(): c for c in df.columns}
        code_col = cols.get('CODE') or cols.get('SIFRA')
        name_col = cols.get('PRODUCT') or cols.get('NAZIV ARTIKLA') or cols.get('ARTIKAL')
        unit_col = cols.get('UNIT') or cols.get('J/MJ') or cols.get('J.MJ')
        vat_col  = cols.get('VAT INCLUDED') or cols.get('CIJENA SA PDV') or cols.get('CIJENA SA PDV ')
        if not name_col or not vat_col: continue
        for _, row in df.iterrows():
            name = str(row[name_col]).strip() if pd.notna(row[name_col]) else ''
            if not name or name.upper() in ('PRODUCT', 'NAZIV ARTIKLA', 'ARTIKAL', 'NAN', ''): continue
            try: price = round(float(row[vat_col]) * (1 + MARKUP), 2)
            except: continue
            if price <= 0: continue
            code = str(int(row[code_col])) if code_col and pd.notna(row.get(code_col)) else ''
            unit = str(row[unit_col]).strip() if unit_col and pd.notna(row.get(unit_col)) else 'pc'
            products.append({'id': f'v{code}', 'code': code, 'name': name,
                             'cat': cat, 'price': price, 'unit': unit})
    return products

# ── Voli.me scraper ───────────────────────────────────────────────────────────

session = requests.Session()
session.headers.update(HEADERS)

def name_words(text):
    """Extract significant words (>2 chars) from a product name, lowercased."""
    return set(w.lower() for w in re.split(r'[\s\-/,\.]+', text) if len(w) > 2)

def alt_matches(alt_text, product_name, montenegrin_name='', min_overlap=1):
    """Return True if the image alt text shares enough words with our product name."""
    if not alt_text:
        return False
    alt_words = name_words(alt_text)
    en_words  = name_words(product_name)
    me_words  = name_words(montenegrin_name) if montenegrin_name else set()
    # Accept if at least min_overlap significant words match either name
    overlap_en = len(alt_words & en_words)
    overlap_me = len(alt_words & me_words)
    return overlap_en >= min_overlap or overlap_me >= min_overlap

def search_voli(query, product_name='', montenegrin_name=''):
    """Search voli.me and return first MATCHING product image URL, or None.
    Uses alt-text validation to avoid returning images for wrong products."""
    try:
        url = SEARCH_URL.format(query=requests.utils.quote(query))
        resp = session.get(url, timeout=REQUEST_TIMEOUT)
        if resp.status_code != 200:
            return None
        soup = BeautifulSoup(resp.text, 'html.parser')

        # Voli.me uses lazy loading — real URL is in data-src, not src
        for img in soup.find_all('img'):
            src = img.get('data-src') or img.get('src') or ''
            if '/storage/images/products/thumbnails/' not in src:
                continue
            if 'default' in src.lower():
                continue

            # Validate: alt text must share words with our product name
            alt = img.get('alt', '')
            if product_name and not alt_matches(alt, product_name, montenegrin_name):
                continue  # Wrong product — skip this image

            if src.startswith('//'): src = 'https:' + src
            elif src.startswith('/'): src = BASE_URL + src
            return src

        return None
    except Exception as e:
        return None

def get_image_for_product(code, english_name, montenegrin_name):
    """Try multiple search strategies, return image URL or None."""

    strategies = []

    # Strategy 1: search by Montenegrin name (most precise for voli.me)
    if montenegrin_name:
        short = ' '.join(montenegrin_name.split()[:4])
        strategies.append(('me_name', short))

    # Strategy 2: search by English name (first 3 words)
    if english_name:
        short = ' '.join(english_name.split()[:3])
        strategies.append(('en_name', short))

    # Strategy 3: search by product code (last resort — less reliable)
    if code:
        strategies.append(('code', code))

    for strategy, query in strategies:
        time.sleep(random.uniform(DELAY_MIN, DELAY_MAX))
        img_url = search_voli(query, english_name, montenegrin_name)
        if img_url:
            return img_url, strategy

    return None, None

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print('\n🔍 Voli Image Scraper')
    print('=' * 50)

    # Load existing progress
    mapping = {}
    if os.path.exists(MAPPING_FILE):
        with open(MAPPING_FILE) as f:
            mapping = json.load(f)
        found = sum(1 for v in mapping.values() if v)
        print(f'  Resuming — {found}/{len(mapping)} already found')

    print(f'\nLoading product data...')
    products     = load_products()
    horeca_names = load_horeca_names()
    print(f'  {len(products)} products to process\n')

    # Try tqdm for progress bar
    try:
        from tqdm import tqdm
        iterator = tqdm(products, desc='Scraping', unit='product')
    except ImportError:
        iterator = products
        print('(Install tqdm for progress bar: pip install tqdm)\n')

    found_count  = sum(1 for v in mapping.values() if v)
    skip_count   = 0

    for p in iterator:
        code = p['code']

        # Skip if already processed
        if code in mapping:
            skip_count += 1
            continue

        montenegrin = horeca_names.get(code, '')
        img_url, strategy = get_image_for_product(code, p['name'], montenegrin)

        mapping[code] = img_url  # None if not found

        if img_url:
            found_count += 1
            label = f"✓ [{strategy}] {p['name'][:45]}"
        else:
            label = f"✗ NOT FOUND — {p['name'][:45]}"

        # Print progress even without tqdm
        if not hasattr(iterator, 'set_postfix'):
            total = len(products)
            done  = skip_count + found_count + sum(1 for v in mapping.values() if v is None and v != '')
            print(f'  [{done}/{total}] {label}')

        # Save progress after every product
        with open(MAPPING_FILE, 'w') as f:
            json.dump(mapping, f, indent=2, ensure_ascii=False)

    # ── Generate updated products.js ──────────────────────────────────────────

    print(f'\n✓ Done. Found images for {found_count}/{len(products)} products')
    print(f'  Mapping saved to {MAPPING_FILE}')
    print(f'\nGenerating {PRODUCTS_JS}...')

    lines = [
        '// Auto-generated from Voli FOOD SERVICE xlsx — +30% markup applied',
        '// Do not edit manually — run: python scripts/import-voli.py',
        '',
        'export const PRODUCTS = [',
    ]

    for p in products:
        code    = p['code']
        img_url = mapping.get(code)
        parts   = [
            f"id: {json.dumps(p['id'])}",
            f"name: {json.dumps(p['name'])}",
            f"cat: {json.dumps(p['cat'])}",
            f"price: {p['price']}",
            f"unit: {json.dumps(p['unit'])}",
            f"taxFree: false",
            f"sameDay: false",
        ]
        if img_url:
            parts.append(f"image: {json.dumps(img_url)}")
        lines.append('  { ' + ', '.join(parts) + ' },')

    lines += ['];', '']

    with open(PRODUCTS_JS, 'w') as f:
        f.write('\n'.join(lines))

    print(f'✓ {PRODUCTS_JS} updated')
    print(f'\nNext steps:')
    print(f'  git add src/lib/products.js scripts/image-mapping.json')
    print(f'  git commit -m "Add Voli product images ({found_count} found)"')
    print(f'  git push')

if __name__ == '__main__':
    main()
