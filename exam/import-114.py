#!/usr/bin/env python3
"""Import the supplied 114 exam PDFs. Run with a Python environment containing PyMuPDF."""

import importlib.util
import json
import sys
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parents[1]
SOURCE_MODULE = ROOT / "exam" / "import-115.py"
spec = importlib.util.spec_from_file_location("exam_115_import", SOURCE_MODULE)
parser = importlib.util.module_from_spec(spec)
spec.loader.exec_module(parser)
OUTPUT = ROOT / "assets" / "exams" / "114"
SUBJECTS = {
    "chinese": ("國語文能力測驗", "114_全類科_國語文能力測驗"),
    "education": ("教育理念與實務", "114_特殊教育學校(班)_教育理念與實務"),
    "development": ("學習者發展與適性輔導", "114_特殊教育學校(班)_學習者發展與適性輔導"),
    "curriculum": ("課程教學與評量（身心障礙組）", "114_特殊教育學校(班)_課程教學與評量(身心障礙組)"),
}


def main(source: Path):
    OUTPUT.mkdir(parents=True, exist_ok=True)
    subjects = []
    for slug, (subject, prefix) in SUBJECTS.items():
        question_file = next(source.glob(prefix + "(試題本)*.pdf"))
        answer_file = next(source.glob(prefix + "(選擇題參考答案)*.pdf"))
        question_pdf = pymupdf.open(question_file)
        answer_pdf = pymupdf.open(answer_file)
        questions = parser.parse_questions(
            parser.source_text(question_pdf), parser.parse_answers(answer_pdf)
        )
        if slug == "chinese":
            # The first passage includes a chat screenshot that PDF text extraction omits.
            clip = pymupdf.Rect(196, 165, 540, 595)
            pixmap = question_pdf[1].get_pixmap(matrix=pymupdf.Matrix(2, 2), clip=clip, alpha=False)
            image_name = "chinese-q01-chat.png"
            pixmap.save(OUTPUT / image_name)
            questions[0].update({
                "image": f"/assets/exams/114/{image_name}",
                "image_width": pixmap.width,
                "image_height": pixmap.height,
                "image_alt": "原試題的通訊軟體對話框；下方提供文字版",
                "image_text": "群組對話：唉，哭泣表情。兒子怎麼了？發生什麼事？今天化學考得爆爛，昨天花了很多時間準備，完全沒用，整個破防啦！哥哥，你 EMO 了嗎？（抱）破防？EMO？",
            })
            question = questions[16]
            question["question"] = question["question"].split(" 李白 司馬遷", 1)[0]
            question["options"] = {
                "A": "李白：生死是一個回歸的過程；司馬遷：生命就如曇花短暫而美麗",
                "B": "李白：人生就像是短暫的旅途；司馬遷：生命的意義重在活出價值",
                "C": "李白：只看過去必會錯過未來；司馬遷：有價值的死去比活著更有意義",
                "D": "李白：天地是生命的臨時居所；司馬遷：生命的意義在於呼吸的每一刻",
            }
        if slug == "development":
            questions[9]["question"] = (
                "以下各教育階段身心障礙學生的「自我決策」與「自我倡議」具體事項，哪些較適切？\n"
                "甲、學前：智能障礙學生在點心時間，選擇自己要吃什麼口味的餅乾。\n"
                "乙、國小：自閉症學生在運動會時，可視環境音量自行戴上耳機。\n"
                "丙、國中：在 IEP 會議上同意學習障礙學生放棄特教生身分的自我決定。\n"
                "丁、高中：情緒行為障礙學生在 IEP 會議表達自我控制問題，需輔導室提供冷靜角。"
            )
            questions[15]["question"] = (
                "表格為數理資優班甄試的測驗結果，依據現行特殊教育法規，哪一位學生較可能無法通過學術性向資賦優異鑑定？\n"
                "學生｜數學成就 T 分數｜數學性向（μ＝100，σ＝15）｜自然成就 T 分數｜自然性向（μ＝100，σ＝15）\n"
                "甲｜68｜131｜69｜126\n乙｜71｜127｜69｜124\n丙｜71｜135｜72｜131\n丁｜69｜128｜69｜128"
            )
        payload = {
            "exam_metadata": {
                "title": "114 年教師資格考試",
                "year": 114,
                "category": "全類科" if slug == "chinese" else "特殊教育學校（班）",
                "subject": subject,
                "parts": [{"name": "選擇題", "points": 50}],
                "source_page": parser.OFFICIAL_SOURCE_URL,
            },
            "multiple_choice_questions": questions,
        }
        (OUTPUT / f"{slug}.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
        subjects.append({"id": slug, "name": subject, "count": len(questions), "data": f"/assets/exams/114/{slug}.json"})
        print(f"{subject}: {len(questions)} questions")
    index_file = OUTPUT.parent / "index.json"
    index = json.loads(index_file.read_text())
    index["years"] = [year for year in index["years"] if year["year"] != 114]
    index["years"].append({"year": 114, "subjects": subjects})
    index_file.write_text(json.dumps(index, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: exam/import-114.py <directory-of-PDFs>")
    main(Path(sys.argv[1]))
