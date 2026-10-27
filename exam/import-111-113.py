#!/usr/bin/env python3
"""Import 111, 112 and 113 teacher qualification exam PDFs with PyMuPDF.

Usage: python exam/import-111-113.py <111-PDF-directory> <112-PDF-directory> <113-PDF-directory>
"""

import importlib.util
import json
import re
import sys
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("exam_parser", ROOT / "exam" / "import-115.py")
parser = importlib.util.module_from_spec(spec)
spec.loader.exec_module(parser)
OUTPUT = ROOT / "assets" / "exams"
SUBJECTS = {
    "chinese": ("國語文能力測驗", "國語文能力測驗"),
    "education": ("教育理念與實務", "教育理念與實務"),
    "development": ("學習者發展與適性輔導", "學習者發展與適性輔導"),
    "curriculum": ("課程教學與評量（身心障礙組）", "課程教學與評量"),
}


def choose_pdf(source: Path, year: int, key: str, answer: bool) -> Path:
    matches = [
        path for path in source.glob(f"*{year}*{key}*.pdf")
        if ("選擇題參考答案" in path.name) == answer
    ]
    if len(matches) != 1:
        raise ValueError(f"Expected one {year} {key} {'answer' if answer else 'question'} PDF, found {matches}")
    return matches[0]


def source_text_early(document: pymupdf.Document) -> str:
    pages = []
    for page in list(document)[1:]:
        lines = [
            line for line in page.get_text(sort=True).splitlines()
            if line.strip() not in {"◎", "●", ""} and not re.fullmatch(r"\s*[1-9]\s*", line)
        ]
        pages.append("\n".join(lines))
    text = "\n".join(pages)
    start = re.search(r"選擇題（占\s*50\s*分）", text)
    end = re.search(r"第貳部分、", text)
    if not start or not end or end.start() <= start.end():
        raise ValueError("Cannot locate the multiple choice section")
    return text[start.end():end.start()]


def save_choice_sheet(document: pymupdf.Document, page_number: int, xrefs: list[int], path: Path, tall=False):
    sheet = pymupdf.open()
    page = sheet.new_page(width=600, height=460 if tall else 370)
    for index, xref in enumerate(xrefs):
        column, row = index % 2, index // 2
        x = 25 + column * 290
        y = 20 + row * (225 if tall else 180)
        page.insert_text((x, y + 19), "ABCD"[index], fontsize=19, fontname="helv")
        image = document.extract_image(xref)
        image_width = 180 if tall else 260
        image_height = 175 if tall else 140
        page.insert_image(
            pymupdf.Rect(x + 36, y + 12, x + 36 + image_width, y + 12 + image_height),
            stream=image["image"], keep_proportion=True,
        )
    pixmap = page.get_pixmap(matrix=pymupdf.Matrix(2, 2), alpha=False)
    pixmap.save(path)
    sheet.close()
    return pixmap.width, pixmap.height


def historical_passage(document: pymupdf.Document) -> str:
    # The original lays out a historical source and a fictional monologue in two columns.
    # Read each pair together, then advance to the next pair.
    boxes = [
        (3, (110, 560, 270, 720), (370, 590, 510, 725)),
        (4, (105, 110, 270, 235), (370, 110, 510, 320)),
        (4, (105, 470, 270, 600), (370, 490, 510, 665)),
        (5, (105, 110, 270, 235), (370, 120, 510, 270)),
        (5, (105, 340, 270, 430), (370, 350, 500, 465)),
        (5, (105, 545, 270, 665), (370, 590, 510, 710)),
    ]
    intro = parser.tidy(document[2].get_textbox(pymupdf.Rect(80, 470, 550, 530)))
    paragraphs = [intro]
    for page_number, left, right in boxes:
        page = document[page_number - 1]
        source = parser.tidy(page.get_textbox(pymupdf.Rect(left))).replace("《明史紀事本末》", "")
        monologue = parser.tidy(page.get_textbox(pymupdf.Rect(right)))
        paragraphs.append(f"史書記載：{source}\n皇帝獨白：{monologue}")
    paragraphs.append("註：「帝北狩」字面上指皇帝到北方巡狩，此處指皇帝被俘虜。")
    return "\n\n".join(paragraphs)


def refine_chinese(year: int, document: pymupdf.Document, questions: list[dict], output: Path):
    if year == 112:
        question = questions[4]
        filename = "chinese-q05-image-options.png"
        width, height = save_choice_sheet(document, 3, [18, 20, 16, 22], output / filename)
        question.update({
            "image": f"/assets/exams/{year}/{filename}",
            "image_width": width, "image_height": height,
            "image_alt": "四幅圖像選項：A 為宮殿與道路，B 為山水，C 為路線及地點，D 為城郭及人物",
            "image_text": "A：宮殿與道路；B：山水；C：路線及地點；D：城郭及人物。",
        })
        question["options"] = {key: f"附圖 {key}" for key in "ABCD"}
    elif year == 113:
        questions[1]["question"] = "根據本文描述，帖的內容與用途多為下列何者？"
        questions[1]["options"] = {
            "A": "內容：宦遊經歷；用途：朝廷奏啟",
            "B": "內容：生活瑣事；用途：書信往來",
            "C": "內容：議政觀點；用途：論說策略",
            "D": "內容：頌揚德行；用途：墓誌碑銘",
        }
        question = questions[2]
        filename = "chinese-q03-image-options.png"
        width, height = save_choice_sheet(document, 3, [40, 44, 46, 50], output / filename, tall=True)
        question.update({
            "image": f"/assets/exams/{year}/{filename}",
            "image_width": width, "image_height": height,
            "image_alt": "四個書法圖片選項 A、B、C、D，內容均為鴨頭丸三字，書寫風格不同",
            "image_text": "A、B、C、D 均為「鴨頭丸」三字的不同書法風格。",
        })
        question["options"] = {key: f"附圖 {key}" for key in "ABCD"}
        passage = historical_passage(document)
        for item in questions[4:10]:
            item["context"] = passage


def import_year(year: int, source: Path):
    output = OUTPUT / str(year)
    output.mkdir(parents=True, exist_ok=True)
    subjects = []
    for slug, (subject, key) in SUBJECTS.items():
        question_file = choose_pdf(source, year, key, False)
        answer_file = choose_pdf(source, year, key, True)
        question_pdf = pymupdf.open(question_file)
        answer_pdf = pymupdf.open(answer_file)
        text = source_text_early(question_pdf) if year <= 112 else parser.source_text(question_pdf)
        if year == 111 and slug == "development":
            # The official answer PDF shows both B and D for question 23.
            answer_lines = answer_pdf[0].get_text(sort=True).splitlines()
            answers = [choice for line in answer_lines if re.match(r"\s*答案\s", line)
                       for choice in re.findall(r"(?<![A-Z])[ABCD](?![A-Z])", line)]
            if len(answers) != 24 or answers[20:22] != ["B", "A"] or answers[22:24] != ["A", "B"]:
                raise ValueError("Unexpected 111 development answer layout")
            answers.insert(22, "B")
        else:
            answers = parser.parse_answers(answer_pdf)
        questions = parser.parse_questions(text, answers)
        if slug == "chinese":
            refine_chinese(year, question_pdf, questions, output)
        if year == 111 and slug == "development":
            questions[22]["accepted_answers"] = ["B", "D"]
        if year == 111 and slug == "curriculum":
            question = questions[13]
            if not re.search(r"[\u0b00-\u0b7f]", question["question"]):
                raise ValueError("111 curriculum question 14 arithmetic layout changed")
            question["question"] = re.split(r"[\u0b00-\u0b7f]", question["question"], maxsplit=1)[0].strip()
            question["question"] += "\n學生作答：57－28＝39；83－46＝47；90－22＝78。"
        if len(questions) != 25 or any(
            not item["question"] or any(not item["options"][key] for key in "ABCD")
            for item in questions
        ):
            raise ValueError(f"Incomplete {year} {subject} questions")
        payload = {
            "exam_metadata": {
                "title": f"{year} 年教師資格考試",
                "year": year,
                "category": "全類科" if slug == "chinese" else "特殊教育學校（班）",
                "subject": subject,
                "parts": [{"name": "選擇題", "points": 50}],
                "source_page": parser.OFFICIAL_SOURCE_URL,
            },
            "multiple_choice_questions": questions,
        }
        (output / f"{slug}.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
        subjects.append({"id": slug, "name": subject, "count": 25, "data": f"/assets/exams/{year}/{slug}.json"})
        print(f"{year} {subject}: {len(questions)} questions")
    return {"year": year, "subjects": subjects}


def main(sources: dict[int, Path]):
    years = [import_year(year, source) for year, source in sorted(sources.items())]
    index_file = OUTPUT / "index.json"
    index = json.loads(index_file.read_text())
    index["years"] = [item for item in index["years"] if item["year"] not in sources]
    index["years"].extend(years)
    index["years"].sort(key=lambda item: item["year"], reverse=True)
    index_file.write_text(json.dumps(index, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    if len(sys.argv) != 4:
        raise SystemExit("Usage: exam/import-111-113.py <111-PDF-directory> <112-PDF-directory> <113-PDF-directory>")
    main({111: Path(sys.argv[1]), 112: Path(sys.argv[2]), 113: Path(sys.argv[3])})
