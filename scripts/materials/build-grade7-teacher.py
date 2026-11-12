#!/usr/bin/env python3
"""Build eleven answer-only teacher PDFs keyed to the original student worksheets.
Run with PyMuPDF 1.26.7: python build-grade7-teacher.py --output /tmp/grade7-teacher-output
"""
from __future__ import annotations
import argparse, ast, hashlib, json, operator, re
from fractions import Fraction
from pathlib import Path
import pymupdf as pdf

ROOT = Path(__file__).resolve().parents[2]
DATA = Path(__file__).with_name('grade7-math-answers.json')
GREEN = (0.18, 0.38, 0.28)
RED = (0.61, 0.20, 0.18)
MUTED = (0.34, 0.41, 0.36)
BORDER = (0.84, 0.89, 0.84)
FONT_PATH = Path('/System/Library/Fonts/Supplemental/Arial Unicode.ttf')
FONT = pdf.Font(fontfile=str(FONT_PATH)) if FONT_PATH.exists() else pdf.Font('cjk')
SIZE, LEADING = 11.5, 18


def calculate(expression: str) -> Fraction:
    """Exact rational arithmetic; no eval, calls, names or float rounding."""
    def visit(node):
        if isinstance(node, ast.Expression): return visit(node.body)
        if isinstance(node, ast.Constant) and type(node.value) in (int, float): return Fraction(str(node.value))
        if isinstance(node, ast.UnaryOp):
            if isinstance(node.op, ast.USub): return -visit(node.operand)
            if isinstance(node.op, ast.UAdd): return visit(node.operand)
        if isinstance(node, ast.BinOp):
            a, b = visit(node.left), visit(node.right)
            operations = {ast.Add: operator.add, ast.Sub: operator.sub, ast.Mult: operator.mul, ast.Div: operator.truediv}
            if type(node.op) in operations: return operations[type(node.op)](a, b)
            if isinstance(node.op, ast.Pow) and b.denominator == 1 and abs(b) < 20: return a ** int(b)
        raise ValueError(f'Unsupported answer expression: {expression}')
    return visit(ast.parse(expression, mode='eval'))


def answer_text(item):
    if isinstance(item, str): return item
    value = calculate(item['expression'])
    result = str(value.numerator) if value.denominator == 1 else f'{value.numerator}/{value.denominator}'
    return f"{item['display']} = {result.replace('-', '−')}。"


def wrap(text, width, size=SIZE):
    lines, line = [], ''
    for char in text:
        if char == '\n': lines.append(line); line = ''; continue
        if line and FONT.text_length(line+char, fontsize=size) > width:
            # Move a partial Latin/math token to the next line when practical.
            cut = line.rfind(' ')
            if cut > len(line) * .55:
                lines.append(line[:cut]); line = line[cut+1:] + char
            else: lines.append(line); line = char
        else: line += char
    if line: lines.append(line)
    return lines or ['']


def text(page, x, y, value, size=SIZE, color=RED):
    if not value: return
    page.insert_font(fontname='TeacherCJK', fontbuffer=FONT.buffer)
    page.insert_text((x, y), value, fontname='TeacherCJK', fontsize=size, color=color)


def diagram_height(item, width):
    kind = item['diagram']
    if kind.startswith('source-'):
        clip = pdf.Rect(item['clip']); return min(width, 320 if kind == 'source-mirror' else 430) * clip.height / clip.width + 32
    if kind == 'axes': return 145
    if kind == 'grids': return 166
    if kind == 'numberline': return 86
    if kind == 'house': return 162
    if kind == 'circle': return 120
    raise ValueError(kind)


def diagram(page, item, source, x, y, width):
    kind = item['diagram']; h = diagram_height(item, width)
    text(page, x, y+12, item['caption'], 10, MUTED)
    top = y+24
    if kind.startswith('source-'):
        clip = pdf.Rect(item['clip']); w = min(width,320 if kind == 'source-mirror' else 430); scale = w/clip.width
        dest = pdf.Rect(x+(width-w)/2,top,x+(width+w)/2,top+clip.height*scale)
        sp = source[item['source_page']-1]
        page.show_pdf_page(dest, source, item['source_page']-1, clip=clip)
        def point(a,b): return pdf.Point(dest.x0+(a-clip.x0)*scale,dest.y0+(b-clip.y0)*scale)
        axis = item['axis']
        if kind == 'source-mirror':
            count = 0
            for d in sp.get_drawings():
                r, fill = d['rect'], d['fill']
                if fill and all(abs(a-b)<.005 for a,b in zip(fill,(.6824,.8235,.7176))) and clip.contains(r) and r.x1 < axis:
                    a,b = point(2*axis-r.x1,r.y0),point(2*axis-r.x0,r.y1)
                    page.draw_rect(pdf.Rect(a,b),fill=(.98,.79,.75),color=RED,width=.5)
                    count += 1
            if count == 0: raise ValueError('No original cells located for mirror answer')
        else:
            for label,a,b in item['points']:
                original = point(a,b); reflected = point(2*axis-a,b)
                page.draw_line(original,reflected,color=BORDER,width=.7,dashes='[3 3]')
                page.draw_circle(reflected,3,fill=RED,color=RED)
                text(page,reflected.x+5,reflected.y-5,label+'′',10)
    elif kind == 'numberline':
        lo,hi=item['low'],item['high']; left=x+24; right=x+width-24; yy=top+28
        page.draw_line((left,yy),(right,yy),color=GREEN,width=1)
        for n in range(lo,hi+1):
            xx=left+(n-lo)*(right-left)/(hi-lo)
            page.draw_line((xx,yy-4),(xx,yy+4),color=GREEN,width=.8)
            text(page,xx-6,yy+19,str(n).replace('-','−'),9,MUTED)
            if n in item['points']:page.draw_circle((xx,yy),3,fill=RED,color=RED)
    elif kind == 'grids':
        grids=item['grids']; slot=width/len(grids)
        colors={'blue':(.70,.84,.96),'orange':(.99,.85,.65),'green':(.71,.89,.80)}
        for i,g in enumerate(grids):
            rows=g['rows']; cols=len(rows[0]); cell=min(28,(slot-20)/cols); gw=cols*cell
            gx=x+i*slot+(slot-gw)/2; gy=top+23
            text(page,x+i*slot+10,top+11,g['title'],11,GREEN)
            assert all(len(row)==cols for row in rows)
            for r,row in enumerate(rows):
                for c,val in enumerate(row):
                    assert val in (0,1)
                    box=pdf.Rect(gx+c*cell,gy+r*cell,gx+(c+1)*cell,gy+(r+1)*cell)
                    page.draw_rect(box,color=(.59,.68,.70),fill=colors[g['color']] if val else (1,1,1),width=.6)
    elif kind == 'axes':
        shapes=item['shapes']; slot=width/len(shapes)
        for i,name in enumerate(shapes):
            cx=x+(i+.5)*slot; cy=top+48; w=min(slot-25,90); hh=62
            if name in ('square','square-one'):w=min(w,62);hh=w
            if name in ('rectangle','square','square-one'):pts=[(-w/2,-hh/2),(w/2,-hh/2),(w/2,hh/2),(-w/2,hh/2)]
            elif name in ('triangle','scalene'):pts=[(-w/2,hh/2),(w/2,hh/2),(0 if name=='triangle' else -w*.15,-hh/2)]
            elif name=='parallelogram':pts=[(-w/2,hh/2),(w*.3,hh/2),(w/2,-hh/2),(-w*.3,-hh/2)]
            elif name=='trapezoid':pts=[(-w/2,hh/2),(w/2,hh/2),(w/4,-hh/2),(-w/4,-hh/2)]
            elif name=='kite':pts=[(0,-hh/2),(w/2,hh*.12),(0,hh/2),(-w/2,hh*.12)]
            else:raise ValueError(name)
            points=[pdf.Point(cx+a,cy+b) for a,b in pts]; shape=page.new_shape();shape.draw_polyline(points+[points[0]]);shape.finish(fill=(.93,.96,.93),color=GREEN,width=1);shape.commit()
            axes=[]
            if name not in ('parallelogram','scalene'):axes.append(((cx,cy-hh/2-8),(cx,cy+hh/2+8)))
            if name in ('rectangle','square'):axes.append(((cx-w/2-8,cy),(cx+w/2+8,cy)))
            if name=='square':axes += [((cx-w/2-4,cy-hh/2-4),(cx+w/2+4,cy+hh/2+4)),((cx-w/2-4,cy+hh/2+4),(cx+w/2+4,cy-hh/2-4))]
            for a,b in axes:page.draw_line(a,b,color=RED,width=1.1,dashes='[4 3]')
            labels={'square-one':'正方形','rectangle':'長方形','square':'正方形','triangle':'等腰三角形','parallelogram':'平行四邊形','trapezoid':'等腰梯形','scalene':'不等邊三角形','kite':'風箏形'}
            label=labels[name];text(page,cx-FONT.text_length(label,fontsize=9)/2,top+105,label,9,MUTED)
    elif kind == 'house':
        cx=x+width/2; yy=top+35
        page.draw_rect(pdf.Rect(cx-85,yy,cx+85,yy+77),color=GREEN,fill=(.94,.97,.93))
        shape=page.new_shape();shape.draw_polyline([(cx-95,yy),(cx,yy-30),(cx+95,yy),(cx-95,yy)]);shape.finish(color=GREEN,fill=(.82,.90,.81));shape.commit()
        for dx in [-52,52]:page.draw_rect(pdf.Rect(cx+dx-14,yy+20,cx+dx+14,yy+46),color=GREEN,fill=(.88,.94,.98))
        page.draw_rect(pdf.Rect(cx-14,yy+35,cx+14,yy+77),color=GREEN)
        page.draw_line((cx,yy-40),(cx,yy+85),color=RED,dashes='[4 3]',width=1.2)
    elif kind == 'circle':
        page.draw_circle((x+width/2,top+40),36,color=GREEN,fill=(.85,.94,.86),width=1.2)
    return h


def block_height(block,width):
    result=33
    for section in block['sections']:
        result+=23
        for item in section['items']:
            result += diagram_height(item,width-16)+7 if isinstance(item,dict) and 'diagram' in item else len(wrap(answer_text(item),width-16))*LEADING+5
    return result+18


def build(book,output):
    path=ROOT/book['file']; raw=path.read_bytes()
    assert hashlib.sha256(raw).hexdigest()==book['sha256'],f'Student PDF changed; review answers again: {path}'
    source=pdf.open(path); assert len(source)==len(book['answers'])==book['pages']
    doc=pdf.open()
    code=book['code']; w,h=source[0].rect.width,source[0].rect.height
    title=book['title'];margin=43;usable=w-2*margin
    toc=[[1,'教師逐頁解答',1]]
    answer_page=0;page=None;y=0
    def new_page():
        nonlocal page,y,answer_page
        page=doc.new_page(width=w,height=h);answer_page+=1
        text(page,margin,43,f'{code}｜教師逐頁解答',19,GREEN)
        text(page,margin,65,title,11,GREEN)
        page.draw_line((margin,77),(w-margin,77),color=BORDER,width=.8)
        if answer_page==1:
            text(page,margin,98,'依學生講義頁碼與題號對照；紅字為答案。a/b 表示分數。',10,MUTED)
            text(page,margin,115,'自我評量依實際表現填寫；開放題所列為示例，可接受其他合理答案。',9.5,MUTED)
            y=139
        else:y=98
        page.draw_line((margin,h-45),(w-margin,h-45),color=BORDER,width=.7)
        text(page,margin,h-28,f'特教百寶袋｜國一上資源班數學｜{code} 教師解答 {answer_page}',8.5,MUTED)
    new_page()
    for index,block in enumerate(book['answers'],1):
        needed=block_height(block,usable)
        if needed>h-145:raise ValueError(f'Answer block too tall: {code} p{index} ({needed})')
        if y+needed>h-60:new_page()
        toc.append([2,f'學生講義第 {index} 頁｜{block["title"]}',len(doc)])
        text(page,margin,y,f'學生講義第 {index} 頁｜{block["title"]}',13,GREEN);y+=25
        for section in block['sections']:
            text(page,margin+5,y,section['title'],10.5,GREEN);y+=21
            for item in section['items']:
                if isinstance(item,dict) and 'diagram' in item:y+=diagram(page,item,source,margin+8,y-9,usable-16)+7
                else:
                    for line in wrap(answer_text(item),usable-16):text(page,margin+8,y,line);y+=LEADING
                    y+=5
        page.draw_line((margin,y),(w-margin,y),color=BORDER,width=.5);y+=25
    # Bookmarks appear in page order; each answer block targets its actual answer page.
    doc.set_toc(toc)
    doc.set_metadata({'title':title+'｜教師版（僅解答）','author':'特教百寶袋','subject':'按學生講義頁碼對照的標準答案、計算過程及圖形作答示範；不含學生講義','keywords':f'國一上,資源班,數學,{code},教師版,解答','creator':'特教百寶袋教材工具'})
    doc.subset_fonts()
    output.mkdir(parents=True,exist_ok=True)
    dest=output/(path.stem+'_教師版.pdf')
    doc.save(dest,garbage=4,deflate=True)
    summary={'code':code,'file':str(dest),'referenceStudentPages':len(source),'answerPages':answer_page,'totalPages':len(doc),'sha256':hashlib.sha256(dest.read_bytes()).hexdigest()}
    doc.close();source.close();return summary


def main():
    global FONT
    args=argparse.ArgumentParser();args.add_argument('--output',type=Path,default=Path('/tmp/grade7-teacher-output'));args.add_argument('--font',type=Path,help='Font with Traditional Chinese and math Unicode glyphs');options=args.parse_args()
    if options.font: FONT=pdf.Font(fontfile=str(options.font))
    data=json.loads(DATA.read_text())
    missing={c for c in json.dumps(data,ensure_ascii=False) if ord(c)>31 and not FONT.has_glyph(ord(c))}
    if missing: raise ValueError(f'The PDF font cannot display: {missing}; supply a complete Unicode font with --font')
    summaries=[build(book,options.output) for book in data['books']]
    (options.output/'manifest.json').write_text(json.dumps(summaries,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(summaries,ensure_ascii=False,indent=2))
if __name__=='__main__':main()
