#!/usr/bin/env python3
"""Check exact arithmetic, algebra identities, supplied equation solutions and grid projections."""
import json,re,importlib.util,pathlib,math
import sympy as sp
from sympy.parsing.sympy_parser import parse_expr,standard_transformations,implicit_multiplication_application,rationalize
ROOT=pathlib.Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('builder',pathlib.Path(__file__).with_name('build-grade7-teacher.py'));b=importlib.util.module_from_spec(spec);spec.loader.exec_module(b)
data=json.loads(pathlib.Path(__file__).with_name('grade7-math-answers.json').read_text())
supermap=str.maketrans('⁰¹²³⁴⁵⁶⁷⁸⁹⁻','0123456789-');x=sp.Symbol('x');trans=standard_transformations+(implicit_multiplication_application,rationalize)
def normalize(t):
 t=re.sub(r'(\d+) 又 (\d+)/(\d+)',r'(\1+\2/\3)',t)
 t=re.sub(r'[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+',lambda m:'**('+m[0].translate(supermap)+')',t)
 t=re.sub(r'\((\d+),(\d+)\)',lambda m:str(math.gcd(int(m[1]),int(m[2]))),t)
 t=re.sub(r'\[(\d+),(\d+)\]',lambda m:str(math.lcm(int(m[1]),int(m[2]))),t)
 t=t.replace('[','(').replace(']',')')
 t=t.replace('−','-').replace('×','*').replace('÷','/').replace(',','')
 return t

def parse(t):
 t=re.sub(r'^\s*(?:\(\d+\)\s+|\d+\.\s+)','',t).strip().strip('.')
 if not t:return None
 return parse_expr(t,local_dict={'x':x},transformations=trans)
checked=0;fails=[];skips=[]
for book in data['books']:
 for page,p in enumerate(book['answers'],1):
  for sec in p['sections']:
   for item in sec['items']:
    if isinstance(item,dict) and 'diagram' in item:continue
    line=normalize(b.answer_text(item));solution=None
    for m in re.finditer(r'(?<![0-9a-z])x\s*=\s*([0-9.+*/()\s-]+)',line):
     try:
      val=parse(m[1]);
      if val is not None and not val.free_symbols:solution=val
     except Exception:pass
    for m in re.finditer(r'[0-9x.+*/()\s=⇒-]+',line):
     fragment=m[0]
     for group in fragment.split('⇒'):
      if '=' not in group:continue
      parts=group.split('=')
      try:
       values=[parse(q) for q in parts];values=[v for v in values if v is not None]
       if solution is not None:values=[v.subs(x,solution) for v in values]
       if len(values)<2:continue
       # Equations requiring a value of x are checked when the line supplies that value.
       if any(v.free_symbols for v in values) and solution is None and any(not v.free_symbols for v in values):skips.append((book['code'],page,group));continue
       for a,c in zip(values,values[1:]):
        if sp.simplify(a-c)!=0:fails.append((book['code'],page,group,str(a),str(c)))
        checked+=1
      except Exception as e:skips.append((book['code'],page,group,str(e)))
print('verified equalities',checked)
assert not fails, json.dumps(fails,ensure_ascii=False,indent=2)
assert len(skips)==8 and all((s[0],s[1]) in [('2-2',2),('2-3',11)] and len(s)==3 for s in skips), skips
print('The eight unsolved equations belong to the two pages that ask for equation setup only.')
assert len(data['books'])==11 and sum(len(b['answers']) for b in data['books'])==113
scientific=next(book for book in data['books'] if book['code']=='1-3')
# Independent worksheet values also cover conversions written as bare answers.
conversions={6:['8000','41000','3200000','6.07*10**3','4.5*10**4','9*10**2'],
             8:['0.07','0.005','0.00032','2.4*10**-2','8*10**-3','6.1*10**-4']}
for page,expected in conversions.items():
 items=scientific['answers'][page-1]['sections'][0]['items']
 assert len(items)==len(expected)
 for item,value in zip(items,expected):
  assert sp.simplify(parse(normalize(b.answer_text(item)).rstrip('。'))-parse(value))==0,(page,item,value)
print('12 scientific-notation conversions independently verified against worksheet values.')
geometry=next(b for b in data['books'] if b['code']=='3-2')
def grids(page):
 return [g for s in geometry['answers'][page-1]['sections'] for i in s['items'] if isinstance(i,dict) and i.get('diagram')=='grids' for g in i['grids']]
def heights(grid):return [sum(row[c] for row in grid['rows']) for c in range(len(grid['rows'][0]))]
assert heights(grids(3)[0])==[2,1,2]
assert heights(grids(4)[0])==[1,2,1]
assert grids(5)[0]['rows']==[[0,1,1],[1,0,1]]
model=[[0,1,1],[2,1,0]] # Back row first; these are stack heights in the p7 exercise.
front=[max(row[c] for row in model) for c in range(3)]
right=[max(row) for row in model[::-1]]
top=[[int(value>0) for value in row] for row in model]
g=grids(7)
assert heights(g[0])==front and heights(g[1])==right and g[2]['rows']==top
assert heights(grids(10)[0])==[2,1]
print('11 books / 113 page keys and all three-view answer projections verified.')
