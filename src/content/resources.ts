export interface ResourceCategory {
  title: string;
  href?: string;
  image: string;
  description: string;
  files: string[];
  editableFiles?: Record<string, string>;
  comingSoon?: boolean;
}
export const mathGameMaterialPdf = '/files/特教班數學｜認識新台幣×魔法烘焙坊.pdf';

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
    description: '教材暫未開放，敬請期待。',
    files: [],
    comingSoon: true,
  },
  {
    title: '特教班數學',
    href: '/數學slide.html',
    image: '/assets/img/math.jpg',
    description: '搭配「認識新台幣」與「魔法烘焙坊」遊戲，練習錢幣、湊錢、找零、形狀與數量。',
    files: [mathGameMaterialPdf],
  },
  {
    title: '生活管理',
    href: '/生活管理slide.html',
    image: '/assets/img/life.jpg',
    description: '從日常生活出發，練習口腔保健與自我照顧。',
    files: ['/files/生活管理-護牙大冒險.pdf'],
    editableFiles: {
      '/files/生活管理-護牙大冒險.pdf': '/files/生活管理-護牙大冒險_可編輯版.pptx',
    },
  },
  {
    title: '關係教育',
    href: '/關係教育slide.html',
    image: '/assets/img/yan-krukov-8618062.jpg',
    description: '在家庭、學校與職場中認識人際關係。',
    files: ['/files/關係教育手冊-「隱性虐待」(家庭、學校、職場).pdf'],
  },
  {
    title: '學習策略',
    image: '/assets/img/learn.jpg',
    description: '教材準備中，敬請期待。',
    files: [],
    comingSoon: true,
  },
  {
    title: '社會技巧',
    image: '/assets/img/social.jpg',
    description: '教材準備中，敬請期待。',
    files: [],
    comingSoon: true,
  },
  {
    title: '英文',
    image: '/assets/img/english.jpg',
    description: '教材準備中，敬請期待。',
    files: [],
    comingSoon: true,
  },
  {
    title: '國文',
    image: '/assets/img/chinese.jpg',
    description: '教材準備中，敬請期待。',
    files: [],
    comingSoon: true,
  },
];
