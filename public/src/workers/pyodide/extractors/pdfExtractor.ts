import { ERROR_MESSAGES } from 'public/src/consts/pyodide';
import { PyodideInterface } from 'pyodide';

export const extractPdf = async (
  filePath: string,
  pyodide: PyodideInterface
): Promise<{ markdownContent: string; pageCount: number }> => {
  if (!pyodide) {
    throw new Error(ERROR_MESSAGES.NOT_INITIALIZED);
  }

  // Load micropip and install pdfminer.six
  await pyodide.loadPackage('micropip');
  const micropip = pyodide.pyimport('micropip');
  await micropip.install('pdfminer.six');

  const escapedPath = filePath.replace(/'/g, "\\'");
  const script = `
from pdfminer.high_level import extract_pages
from pdfminer.layout import LTTextContainer, LTChar, LTTextLine
import json
import re

# ============================================
# SAFE KEYWORDS
# ============================================
def get_safe_keywords():
    """Keywords that should NOT be masked"""
    english_keywords = {
        "invoice", "bill", "receipt", "statement", "credit", "quote", "estimate",
        "number", "no", "no.", "ref", "reference", "id", "code", "account", "acc",
        "order", "po", "p.o.", "purchase", "job", "ticket",
        "date", "dated", "issued", "due", "period", "time", "year", "month",
        "total", "subtotal", "sub-total", "net", "gross", "amount", "amt",
        "balance", "price", "rate", "cost", "fee", "charge",
        "tax", "vat", "gst", "hst", "sales", "discount", "less",
        "paid", "payment", "deposit", "owing", "currency",
        "to", "from", "bill", "ship", "remit", "sold", "vendor", "supplier",
        "client", "customer", "buyer", "payer", "payee", "attention", "attn",
        "description", "desc", "details", "item", "product", "service",
        "qty", "quantity", "unit", "uom", "hours", "hrs", "type",
        "terms", "notes", "memo", "authorized", "signature", "email", "tel",
        "phone", "fax", "mobile", "iban", "swift"
    }

    hebrew_keywords = {
        "חשבונית", "מס", "מס.", "קבלה", "חשבון", "הזמנה", "עסקה", "מקור", "העתק",
        "אסמכתא", "סימוכין", "תיק", "לקוח", "ספק", "ח.פ.", "ח.פ", "ע.מ.", "ע.מ", "ת.ז.",
        "תאריך", "יום", "חודש", "שנה", "תקופה", "ערך", "מועד", "פירעון",
        "סה\\"כ", "סה״כ", "סך", "הכל", "סיכום", "לתשלום", "תשלום", "סכום",
        "מחיר", "עלות", "תעריף", "שווי",
        "מע\\"מ", "מע״מ", "מס", "ניכוי", "הנחה",
        "שולם", "יתרה", "חוב", "מטבע", "ש\\"ח", "דולר", "יורו",
        "לכבוד", "עבור", "מאת", "אל", "שם", "כתובת", "עיר", "מיקוד",
        "תיאור", "פירוט", "פרטים", "מוצר", "שירות", "פריט",
        "כמות", "יח", "יחידה", "יחידות", "קוד",
        "טלפון", "נייד", "פקס", "מייל", "דוא\\"ל", "אתר", "חתימה", "עמוד", "מתוך", "תנאי"
    }

    return english_keywords.union(hebrew_keywords)

SAFE_KEYWORDS = get_safe_keywords()

def is_safe_word(word):
    """Check if a word is a safe keyword"""
    clean_word = word.strip('.,;:!?()[]{}"\\'').lower()
    return clean_word in SAFE_KEYWORDS

# ============================================
# MASKING FUNCTIONS
# ============================================
def mask_word(word):
    """
    Mask a single word according to rules:
    - Capital letters → 'A'
    - Lowercase letters → 'a'
    - Numbers → 'n'
    - All other characters → preserved
    """
    result = []
    for char in word:
        if char.isupper():
            result.append('A')
        elif char.islower():
            result.append('a')
        elif char.isdigit():
            result.append('n')
        else:
            result.append(char)
    return ''.join(result)

def contains_safe_keyword(text):
    """Check if text contains any safe keywords"""
    words = re.findall(r'\\b\\w+\\b', text)
    return any(is_safe_word(word) for word in words)

def mask_text(text):
    """
    Mask text intelligently based on safe keywords:
    - If text has NO safe keywords → replace entire text with '**REDACTED**'
    - If text HAS safe keywords → mask individual words but preserve safe keywords
    """
    if not text or not text.strip():
        return text

    # Check if text contains any safe keywords
    if not contains_safe_keyword(text):
        return '**REDACTED**'

    # Text has safe keywords - mask individual words
    def mask_match(match):
        word = match.group(0)
        if is_safe_word(word):
            return word
        else:
            return mask_word(word)

    # Replace words while preserving spaces and punctuation
    masked = re.sub(r'\\b\\w+\\b', mask_match, text)
    return masked

def merge_consecutive_redactions(lines):
    """Merge consecutive **REDACTED** lines into a single **REDACTED**"""
    result = []
    prev_was_redacted = False

    for line in lines:
        is_redacted = line.strip() == '**REDACTED**'

        if is_redacted:
            if not prev_was_redacted:
                result.append(line)
            prev_was_redacted = True
        else:
            result.append(line)
            prev_was_redacted = False

    return result

# ============================================
# LIST DETECTION
# ============================================
def is_list_item(text):
    """Check if a line is a list item"""
    stripped = text.strip()
    # Bullet points
    if stripped.startswith(('-', '•', '*', '+')):
        return True
    # Numbered lists
    if re.match(r'^\\d+[\\.\\)]\\s', stripped):
        return True
    # Lettered lists
    if re.match(r'^[a-z][\\.\\)]\\s', stripped):
        return True
    return False

def format_list_item(line):
    """Format a line as a markdown list item"""
    stripped = line.strip()
    # Already starts with markdown bullet
    if stripped.startswith(('-', '*')):
        return stripped
    # Convert other bullets to markdown
    if stripped.startswith(('•', '+')):
        return '- ' + stripped[1:].strip()
    # Numbered/lettered lists - keep as is
    return stripped

# ============================================
# PDFMINER.SIX EXTRACTION
# ============================================
def get_text_with_font_info(element):
    """Extract text and font sizes from layout element"""
    text = ""
    font_sizes = []

    if isinstance(element, LTTextContainer):
        for text_line in element:
            if isinstance(text_line, LTTextLine):
                for character in text_line:
                    if isinstance(character, LTChar):
                        text += character.get_text()
                        font_sizes.append(character.height)
                    elif hasattr(character, 'get_text'):
                        text += character.get_text()

    return text, font_sizes

def calculate_median_font_size(page_layout):
    """Calculate median font size for the page"""
    all_sizes = []
    for element in page_layout:
        if isinstance(element, LTTextContainer):
            _, sizes = get_text_with_font_info(element)
            all_sizes.extend(sizes)

    if all_sizes:
        sorted_sizes = sorted(all_sizes)
        return sorted_sizes[len(sorted_sizes) // 2]
    return 12  # Default font size

def is_heading(text, avg_font_size, median_font_size):
    """Determine if text is a heading based on font size"""
    if not text or not avg_font_size:
        return None

    # Large text (>1.5x median) is likely a heading
    if avg_font_size > median_font_size * 1.5:
        return 'h1'
    # Moderately large text (>1.2x median) is likely a subheading
    elif avg_font_size > median_font_size * 1.2:
        return 'h2'

    return None

def select_pages(total_pages):
    """Select first 3 and last 3 pages (6 total)"""
    if total_pages <= 6:
        return list(range(total_pages))
    first_three = list(range(3))
    last_three = list(range(total_pages - 3, total_pages))
    return first_three + last_three

def extract_pdf_to_markdown(pdf_path):
    """Extract PDF content and convert to masked markdown"""
    markdown_lines = []

    # First pass: count total pages
    page_count = sum(1 for _ in extract_pages(pdf_path))
    page_indices = select_pages(page_count)

    # Add note if pages were skipped
    if page_count > 6:
        markdown_lines.append('*[Showing first 3 and last 3 pages]*')
        markdown_lines.append('')

    # Second pass: extract selected pages
    for idx, page_layout in enumerate(extract_pages(pdf_path)):
        if idx not in page_indices:
            continue

        # Calculate median font size for this page
        median_font_size = calculate_median_font_size(page_layout)

        # Process text elements
        for element in page_layout:
            if isinstance(element, LTTextContainer):
                text, font_sizes = get_text_with_font_info(element)
                text = text.strip()

                if not text:
                    continue

                # Calculate average font size for this element
                avg_font_size = sum(font_sizes) / len(font_sizes) if font_sizes else median_font_size

                # Mask the text
                masked_text = mask_text(text)

                # Check if it's a heading
                heading_level = is_heading(text, avg_font_size, median_font_size)
                if heading_level == 'h1':
                    markdown_lines.append(f"# {masked_text}")
                elif heading_level == 'h2':
                    markdown_lines.append(f"## {masked_text}")
                # Check if it's a list item
                elif is_list_item(text):
                    formatted = format_list_item(text)
                    masked_line = mask_text(formatted)
                    markdown_lines.append(masked_line)
                else:
                    markdown_lines.append(masked_text)

        # Add separator between first and last group
        if page_count > 6 and idx == page_indices[2]:
            markdown_lines.append('')
            markdown_lines.append('...')
            markdown_lines.append('')

    # Post-process: merge consecutive redactions
    markdown_lines = merge_consecutive_redactions(markdown_lines)

    # Join lines
    markdown_content = '\\n'.join(markdown_lines)

    return {
        'markdown_content': markdown_content,
        'page_count': page_count
    }

# Execute extraction
result = extract_pdf_to_markdown('${escapedPath}')
json.dumps(result)
  `.trim();

  const resultJson = await pyodide.runPythonAsync(script);
  return JSON.parse(resultJson);
};
