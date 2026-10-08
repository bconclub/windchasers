"""Parse the IndiGo (JAR ATPL databank) question bank PDF into JSON.

    python scripts/parse-indigo-bank.py "INDIGO QUESTION BANK.pdf" indigo-bank.json

Source format, one block per question:

    10.1.1.1 (1)
    <stem, wrapped over lines>
    a) <option>
    b) <option>
    c) <option>
    d) <option>

In this databank option (a) is always the keyed answer. The JSON keeps that
order and records it as `correct`, the importer shuffles before insert.

Requires pypdf.
"""

import json
import re
import sys

from pypdf import PdfReader

HEADER = re.compile(r"^(\d{2})\.(\d+)\.[\d.]+\s*\((\d+)\)\s*$")
OPTION = re.compile(r"^([a-d])\)\s*(.*)$")
PAGE_NUMBER = re.compile(r"^\d{1,3}$")
FIGURE = re.compile(
    r"annex|appendix|figure|CAP\s*69|refer to the (chart|diagram|graph)|see (chart|diagram)|attached",
    re.I,
)


def clean(text: str) -> str:
    text = " ".join(text.split())
    text = text.replace('""', '"').replace("''", '"').replace("´", "'")
    return text.strip()


def main(pdf_path: str, out_path: str) -> None:
    reader = PdfReader(pdf_path)
    lines: list[str] = []
    for page in reader.pages:
        page_lines = (page.extract_text() or "").splitlines()
        # Footer page number is the last line on the page
        while page_lines and PAGE_NUMBER.match(page_lines[-1].strip()):
            page_lines.pop()
        lines.extend(page_lines)

    questions = []
    current = None
    part = None
    for raw in lines:
        line = raw.strip()
        if not line or line == "JAR Databank Preparation":
            continue
        header = HEADER.match(line)
        if header:
            current = {
                "code": line.split()[0],
                "subject": header.group(1),
                "area": f"{header.group(1)}.{header.group(2)}",
                "number": int(header.group(3)),
                "stem": "",
                "options": {},
            }
            questions.append(current)
            part = "stem"
            continue
        if current is None:
            continue
        option = OPTION.match(line)
        if option and (option.group(1) not in current["options"]) and (
            option.group(1) == "a" or part != "stem"
        ):
            part = option.group(1)
            current["options"][part] = option.group(2)
            continue
        if part == "stem":
            current["stem"] += " " + line
        else:
            current["options"][part] += " " + line

    out = []
    problems = []
    for q in questions:
        options = [clean(q["options"].get(k, "")) for k in "abcd"]
        stem = clean(q["stem"])
        if not stem or any(not o for o in options):
            problems.append(q["number"])
            continue
        out.append(
            {
                "number": q["number"],
                "code": q["code"],
                "subject": q["subject"],
                "area": q["area"],
                "stem": stem,
                "options": options,
                "correct": 0,
                "needs_figure": bool(FIGURE.search(stem)),
            }
        )

    numbers = [q["number"] for q in questions]
    missing = sorted(set(range(1, max(numbers) + 1)) - set(numbers))
    with open(out_path, "w", encoding="utf-8") as handle:
        json.dump(out, handle, ensure_ascii=False, indent=1)
    print(f"parsed {len(out)} questions, {len(problems)} malformed {problems[:20]}")
    print(f"missing numbers: {missing[:20]}{' ...' if len(missing) > 20 else ''}")
    print(f"needs figure: {sum(q['needs_figure'] for q in out)}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
