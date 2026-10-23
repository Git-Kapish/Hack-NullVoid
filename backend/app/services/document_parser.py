import io
import json
import logging
import re
from typing import List, Dict, Any, Tuple
from app.core.config import settings

logger = logging.getLogger(__name__)


def sniff_content(content: bytes, document_type: str) -> None:
    """
    Validate uploaded file content against size limits, magic bytes, and formatting constraints.
    Raises ValueError with explanatory message on invalid input.
    """
    # 1. Size limit check
    if len(content) > settings.RAG_MAX_UPLOAD_SIZE_BYTES:
        raise ValueError(
            f"File exceeds maximum permitted size of {settings.RAG_MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)}MB "
            f"({len(content)} bytes uploaded)."
        )

    doc_type = document_type.upper()

    # 2. PDF sniffing
    if doc_type == "PDF":
        if not content.startswith(b"%PDF-"):
            raise ValueError("Invalid PDF format: file content does not begin with standard '%PDF-' magic bytes.")
        try:
            from pypdf import PdfReader
            reader = PdfReader(io.BytesIO(content))
            if len(reader.pages) == 0:
                raise ValueError("Invalid PDF: document contains 0 pages.")
        except Exception as e:
            raise ValueError(f"Corrupt or unreadable PDF: {str(e)}")

    # 3. JSON sniffing
    elif doc_type == "JSON":
        try:
            text = content.decode("utf-8")
        except UnicodeDecodeError as e:
            raise ValueError(f"Invalid JSON: content must be valid UTF-8: {str(e)}")
        try:
            json.loads(text)
        except Exception as e:
            raise ValueError(f"Malformed JSON: {str(e)}")

    # 4. Markdown sniffing
    elif doc_type in ("MARKDOWN", "MD"):
        try:
            text = content.decode("utf-8")
        except UnicodeDecodeError as e:
            raise ValueError(f"Invalid Markdown: content must be valid UTF-8: {str(e)}")
        if "\x00" in text:
            raise ValueError("Invalid Markdown: file contains null bytes.")
    else:
        raise ValueError(f"Unsupported document type '{document_type}'. Allowed: PDF, MARKDOWN, JSON.")


def parse_markdown(text: str) -> Tuple[Dict[str, Any], List[Dict[str, str]]]:
    """
    Extract metadata frontmatter and sections from a Markdown policy document.
    Splits by Markdown headings (#, ##, ###).
    """
    metadata: Dict[str, Any] = {}
    lines = text.split("\n")

    # Extract bullet or frontmatter metadata (e.g. - title: ...)
    body_lines = []
    for line in lines:
        stripped = line.strip()
        m = re.match(r"^[-*]\s*([a-zA-Z_]+)\s*:\s*(.*)$", stripped)
        if m:
            key, val = m.group(1).lower(), m.group(2).strip()
            # Convert simple types
            if val.upper() == "NULL" or val == "":
                metadata[key] = None
            else:
                metadata[key] = val
        else:
            body_lines.append(line)

    body_text = "\n".join(body_lines)

    # Split on headings
    heading_pattern = re.compile(r"^(#{1,3})\s+(.+)$", re.MULTILINE)
    matches = list(heading_pattern.finditer(body_text))

    sections: List[Dict[str, str]] = []
    if not matches:
        sections.append({
            "section_title": metadata.get("title") or metadata.get("section") or "General Policy",
            "content": body_text.strip(),
        })
    else:
        for i, match in enumerate(matches):
            section_title = match.group(2).strip()
            start = match.end()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(body_text)
            section_content = body_text[start:end].strip()
            if section_content:
                sections.append({
                    "section_title": section_title,
                    "content": section_content,
                })

    if not sections:
        sections.append({
            "section_title": metadata.get("title") or "General Policy",
            "content": text.strip(),
        })

    return metadata, sections


def parse_json_document(text: str) -> Tuple[Dict[str, Any], List[Dict[str, str]]]:
    """
    Extract metadata and structured sections from a JSON policy document.
    """
    data = json.loads(text)
    metadata: Dict[str, Any] = {}
    sections: List[Dict[str, str]] = []

    # Known metadata keys
    meta_keys = [
        "document_id", "title", "document_type", "version", "effective_date",
        "region", "category", "membership_tier", "status", "uploaded_by", "data_status"
    ]
    for k in meta_keys:
        if k in data:
            metadata[k] = data[k]

    # Explicit sections array
    if "sections" in data and isinstance(data["sections"], list):
        for s in data["sections"]:
            if isinstance(s, dict):
                sections.append({
                    "section_title": s.get("section_title") or s.get("title") or "Section",
                    "content": s.get("content") or s.get("text") or "",
                })

    # Fallback to single section or keys
    if not sections:
        if "content" in data:
            sections.append({
                "section_title": data.get("section") or data.get("title") or "Policy Content",
                "content": str(data["content"]),
            })
        else:
            # Flatten dictionary key/values as sections
            for k, v in data.items():
                if k not in meta_keys and isinstance(v, (str, list, dict)):
                    content_str = json.dumps(v, indent=2) if isinstance(v, (dict, list)) else str(v)
                    sections.append({
                        "section_title": k.replace("_", " ").title(),
                        "content": content_str,
                    })

    if not sections:
        sections.append({
            "section_title": metadata.get("title") or "General Policy",
            "content": text,
        })

    return metadata, sections


def parse_pdf_document(content: bytes) -> Tuple[Dict[str, Any], List[Dict[str, str]]]:
    """
    Extract text and page-aware sections from a PDF policy document using pypdf.
    """
    from pypdf import PdfReader
    reader = PdfReader(io.BytesIO(content))
    metadata: Dict[str, Any] = {}
    sections: List[Dict[str, str]] = []

    if reader.metadata:
        if reader.metadata.title:
            metadata["title"] = reader.metadata.title

    for idx, page in enumerate(reader.pages):
        page_text = page.extract_text() or ""
        lines = [line.strip() for line in page_text.split("\n") if line.strip()]
        if not lines:
            continue

        # Look for leading heading or page number
        first_line = lines[0]
        if len(first_line) < 80 and not first_line.endswith("."):
            section_title = first_line
            content_text = "\n".join(lines[1:])
        else:
            section_title = f"Page {idx + 1}"
            content_text = "\n".join(lines)

        sections.append({
            "section_title": section_title,
            "content": content_text.strip() or page_text.strip(),
        })

    return metadata, sections


def chunk_sections(
    sections: List[Dict[str, str]],
    target_chunk_size: int = 800,
    overlap: int = 100,
) -> List[Dict[str, Any]]:
    """
    Split document sections into overlapping chunks preserving section boundaries and section titles.
    Target chunk size is ~800 characters with ~100 characters overlap.
    """
    chunks: List[Dict[str, Any]] = []
    chunk_index = 0

    for section in sections:
        section_title = section["section_title"]
        content = section["content"]

        if len(content) <= target_chunk_size:
            chunks.append({
                "chunk_index": chunk_index,
                "section_title": section_title,
                "content": content,
            })
            chunk_index += 1
            continue

        # Split content into sentences/paragraphs
        paragraphs = content.split("\n\n")
        current_chunk = ""

        for p in paragraphs:
            p = p.strip()
            if not p:
                continue

            if len(current_chunk) + len(p) + 2 <= target_chunk_size:
                current_chunk = (current_chunk + "\n\n" + p).strip()
            else:
                if current_chunk:
                    chunks.append({
                        "chunk_index": chunk_index,
                        "section_title": section_title,
                        "content": current_chunk,
                    })
                    chunk_index += 1
                    # Start next chunk with overlap from previous chunk
                    if overlap > 0 and len(current_chunk) > overlap:
                        current_chunk = current_chunk[-overlap:] + "\n\n" + p
                    else:
                        current_chunk = p
                else:
                    # Paragraph itself exceeds target_chunk_size, split by sentences or slice
                    for i in range(0, len(p), target_chunk_size - overlap):
                        part = p[i:i + target_chunk_size]
                        if part.strip():
                            chunks.append({
                                "chunk_index": chunk_index,
                                "section_title": section_title,
                                "content": part.strip(),
                            })
                            chunk_index += 1
                    current_chunk = ""

        if current_chunk.strip():
            chunks.append({
                "chunk_index": chunk_index,
                "section_title": section_title,
                "content": current_chunk.strip(),
            })
            chunk_index += 1

    return chunks
