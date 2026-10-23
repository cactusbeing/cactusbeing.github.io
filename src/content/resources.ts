export interface ResourceCategory {
  title: string;
  href: string;
  image: string;
  description: string;
  files: string[];
}
export const resources: ResourceCategory[] = [
  {
    title: '特教宣導',
    href: '/特教宣導slide.html',
    image: '/assets/img/pexels-mh-j-5720724.jpg',
    description: '認識差異，練習理解與尊重。',
    files: [
      '/files/特教宣導海報(智障、視障、聽障、語障、肢障、腦麻).pdf',
      '/files/聽障宣導簡報.pdf',
    ],
  },
  {
    title: '職業教育',
    href: '/職業教育slide.html',
    image: '/assets/img/work.jpg',
    description: '收錄手工皂製作、園藝栽培、色彩學等實務操作課程大綱與教材。',
    files: [
      '/files/色彩學X花藝 課程大綱簡報.pdf',
      '/files/職業教育-手工皂基礎.pdf',
      '/files/職業教育-芳香精油手工皂製作方法.pdf',
      '/files/職業教育-甜點樣態手工皂製作方法.pdf',
      '/files/職業教育-礦物皂製作方法.pdf',
      '/files/職業教育-基礎園藝課程.pdf',
    ],
  },
  {
    title: '特教班數學',
    href: '/數學slide.html',
    image: '/assets/img/math.jpg',
    description: '包含採購預算組合、認識幣值計算與生活比例應用等實用教案。',
    files: [
      '/files/特教班數學-採購與預算組合配對.pdf',
      '/files/特教班數學-數值大小與比例的應用.pdf',
      '/files/特教班數學-認識並使用不同面值的硬幣和紙鈔.pdf',
    ],
  },
  {
    title: '生活管理',
    href: '/生活管理slide.html',
    image: '/assets/img/life.jpg',
    description: '從日常生活出發，練習整理與自我照顧。',
    files: ['/files/生活管理-《雜物整理基礎課》.pdf'],
  },
  {
    title: '關係教育',
    href: '/關係教育slide.html',
    image: '/assets/img/yan-krukov-8618062.jpg',
    description: '在家庭、學校與職場中認識人際關係。',
    files: ['/files/關係教育手冊-「隱性虐待」(家庭、學校、職場).pdf'],
  },
];
