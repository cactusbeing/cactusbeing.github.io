#!/usr/bin/env python3
"""Import the 115 teacher qualification exam PDFs into the site's question schema.

Usage: /path/to/python-with-pymupdf exam/import-115.py /path/to/115教檢
"""

import json
import re
import sys
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "exams" / "115"
OFFICIAL_SOURCE_URL = "https://tqa.rcpet.edu.tw/TEA_Exam/TEA03.aspx"
SUBJECTS = {
    "chinese": ("國語文能力測驗", "115_全類科_國語文能力測驗"),
    "education": ("教育理念與實務", "3-2_115_特殊教育學校(班)_教育理念與實務"),
    "development": ("學習者發展與適性輔導", "6-1_115_特殊教育學校(班)_學習者發展與適性輔導"),
    "curriculum": ("課程教學與評量（身心障礙組）", "115_特殊教育學校(班)_課程教學與評量(身心障礙組)"),
}
TABLE_TEXT = {
    1: "觀察時段：1、2、3、4、5、6、7、8、9、10\n黃老師：＋、＋、－、－、＋、－、＋、＋、－、－\n李老師：＋、＋、＋、－、－、－、＋、＋、＋、－",
    14: "題目：為什麼我會試著回答困難的問題呢？（資優學生%、一般學生%）\n選項一：我期待老師和同學誇我很聰明；5、33\n選項二：我想要獲得禮物；15、15\n選項三：越難的問題我越喜歡去挑戰；72、7\n選項四：沒有努力寫會被爸媽處罰；8、45",
}
PASSAGE = re.compile(r"閱讀下文後，回答\s*(\d+)\s*[-－–]\s*(\d+)\s*題[。.]?")
NUMBER = re.compile(r"(?m)^\s*(\d{1,2})\.(?=\D)")
OPTION = re.compile(r"\(([ABCD])\)")


def tidy(value: str) -> str:
    lines = [line.strip() for line in value.splitlines() if line.strip()]
    joined = ""
    for line in lines:
        if joined and re.match(r"^[甲乙丙丁戊己]、", line):
            joined += "\n"
        if joined and not joined.endswith("\n") and not (re.search(r"[\u3400-\u9fff，。；：、）]$", joined) and re.match(r"^[\u3400-\u9fff（]", line)):
            joined += " "
        joined += line
    return re.sub(r" {2,}", " ", joined).strip()


def source_text(document: pymupdf.Document) -> str:
    pages = []
    for page in list(document)[1:]:
        lines = []
        for line in page.get_text(sort=True).splitlines():
            if line.strip() in {"", "◎", "●"} or re.fullmatch(r"\s*[1-9]\s*", line):
                continue
            lines.append(line)
        pages.append("\n".join(lines))
    text = "\n".join(pages)
    start = re.search(r"選擇題（占\s*50\s*分）", text)
    end = re.search(r"(?m)^\s*(?:非選擇題|綜合題)（占", text)
    if not start or not end:
        raise ValueError("Cannot locate the multiple choice section")
    return text[start.end():end.start()]


def parse_answers(document: pymupdf.Document) -> list[str]:
    lines = document[0].get_text(sort=True).splitlines()
    answers = []
    for line in lines:
        if re.match(r"\s*答案\s", line):
            answers.extend(re.findall(r"(?<![A-Z])[ABCD](?![A-Z])", line))
    if len(answers) != 25:
        raise ValueError(f"Expected 25 answers, found {len(answers)}")
    return answers


def parse_questions(text: str, answers: list[str]) -> list[dict]:
    matches = list(NUMBER.finditer(text))
    numbers = [int(match.group(1)) for match in matches]
    if numbers != list(range(1, 26)):
        raise ValueError(f"Question numbers are incomplete: {numbers}")
    contexts = {}
    initial = text[:matches[0].start()]
    passage = PASSAGE.search(initial)
    if passage:
        first, last = map(int, passage.groups())
        for number in range(first, last + 1):
            contexts[number] = tidy(initial[passage.end():])
    questions = []
    for i, match in enumerate(matches):
        number = int(match.group(1))
        segment = text[match.end():matches[i + 1].start() if i + 1 < len(matches) else len(text)]
        next_passage = PASSAGE.search(segment)
        if next_passage:
            first, last = map(int, next_passage.groups())
            for target in range(first, last + 1):
                contexts[target] = tidy(segment[next_passage.end():])
            segment = segment[:next_passage.start()]
        options = list(OPTION.finditer(segment))
        if [item.group(1) for item in options] != list("ABCD"):
            raise ValueError(f"Question {number}: options are incomplete")
        choices = {}
        for j, item in enumerate(options):
            end = options[j + 1].start() if j < 3 else len(segment)
            choices[item.group(1)] = tidy(segment[item.end():end])
        question = {
            "id": number,
            "answer": answers[number - 1],
            "question": tidy(segment[:options[0].start()]),
            "options": choices,
        }
        if number in contexts:
            question["context"] = contexts[number]
        questions.append(question)
    return questions


def write_table_image(document: pymupdf.Document, page_number: int, top: str, bottom: str, path: Path):
    page = document[page_number - 1]
    top_rects = page.search_for(top)
    bottom_rects = page.search_for(bottom)
    if not top_rects or not bottom_rects:
        raise ValueError(f"Could not locate table {top} / {bottom}")
    clip = pymupdf.Rect(85, top_rects[0].y0 - 7, page.rect.width - 55, bottom_rects[-1].y1 + 7)
    pixmap = page.get_pixmap(matrix=pymupdf.Matrix(2, 2), clip=clip, alpha=False)
    pixmap.save(path)
    return pixmap.width, pixmap.height


def main(source: Path):
    OUTPUT.mkdir(parents=True, exist_ok=True)
    manifest = {"years": [{"year": 115, "subjects": []}]}
    for slug, (subject, prefix) in SUBJECTS.items():
        question_file = next(source.glob(prefix + "(試題本)*.pdf"))
        if slug == "development":
            answer_file = next(source.glob("6-2_*選擇題參考答案*.pdf"))
        else:
            answer_file = next(source.glob(prefix + "(選擇題參考答案)*.pdf"))
        question_pdf = pymupdf.open(question_file)
        answer_pdf = pymupdf.open(answer_file)
        questions = parse_questions(source_text(question_pdf), parse_answers(answer_pdf))
        if slug == "development":
            for number, page, first, last in [
                (1, 2, "觀察時段", "李老師"),
                (14, 4, "為什麼我會試著", "選項四"),
            ]:
                filename = f"{slug}-q{number:02d}-table.png"
                width, height = write_table_image(question_pdf, page, first, last, OUTPUT / filename)
                question = questions[number - 1]
                question["image"] = f"/assets/exams/115/{filename}"
                question["image_width"] = width
                question["image_height"] = height
                marker = "觀察時段" if number == 1 else "題目 為什麼我會試著"
                if marker not in question["question"]:
                    raise ValueError(f"Question {number}: table text not found")
                question["image_text"] = TABLE_TEXT[number]
                question["question"] = question["question"].split(marker, 1)[0].strip()
                question["image_alt"] = "試題原卷中的資料表；下方提供文字版"
        for kind in ("questions", "answers"):
            (OUTPUT / f"{slug}-{kind}.pdf").unlink(missing_ok=True)
        payload = {
            "exam_metadata": {
                "title": "115 年教師資格考試",
                "year": 115,
                "category": "特殊教育學校（班）" if slug != "chinese" else "全類科",
                "subject": subject,
                "parts": [{"name": "選擇題", "points": 50}],
                "source_page": OFFICIAL_SOURCE_URL,
            },
            "multiple_choice_questions": questions,
        }
        (OUTPUT / f"{slug}.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
        manifest["years"][0]["subjects"].append({
            "id": slug,
            "name": subject,
            "count": len(questions),
            "data": f"/assets/exams/115/{slug}.json",
        })
        print(f"{subject}: {len(questions)} questions, {len([q for q in questions if 'context' in q])} passage questions")
    index_file = OUTPUT.parent / "index.json"
    if index_file.exists():
        previous = json.loads(index_file.read_text())
        manifest["years"].extend(year for year in previous.get("years", []) if year.get("year") != 115)
    index_file.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: exam/import-115.py <directory-of-PDFs>")
    main(Path(sys.argv[1]))
