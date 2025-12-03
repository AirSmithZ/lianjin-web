
export const FRUITS = [
  {
    id: 'boluo',
    name: '菠萝',
    image: '/assets/play/fruits/boluo.png',
    type: 'good',
    description: '酸甜平衡，适合高分配方。',
  },
  {
    id: 'caomei',
    name: '草莓',
    image: '/assets/play/fruits/caomei.png',
    type: 'good',
    description: '爆发力强，是基础增益食材。',
  },
  {
    id: 'juzi',
    name: '橘子',
    image: '/assets/play/fruits/juzi.png',
    type: 'good',
    description: '维持能量供给，用来稳定产出。',
  },
  {
    id: 'lanmei',
    name: '蓝莓',
    image: '/assets/play/fruits/lanmei.png',
    type: 'good',
    description: '提升暴击，常与草莓同框。',
  },
  {
    id: 'lanmei2',
    name: '霉化蓝莓',
    image: '/assets/play/fruits/lanmei2.png',
    type: 'bad',
    description: '受到腐蚀的蓝莓，易触发扣分。',
  },
  {
    id: 'lizhi',
    name: '荔枝',
    image: '/assets/play/fruits/lizhi.png',
    type: 'good',
    description: '可快速积攒幸运值，是稀缺资源。',
  },
  {
    id: 'mangguo',
    name: '芒果',
    image: '/assets/play/fruits/mangguo.png',
    type: 'good',
    description: '热力十足，常见于夏日配方。',
  },
  {
    id: 'mihoutao',
    name: '枯萎猕猴桃',
    image: '/assets/play/fruits/mihoutao.png',
    type: 'bad',
    description: '明显发黑的猕猴桃，炼金时需避开。',
  },
  {
    id: 'niuyouguo',
    name: '暗斑牛油果',
    image: '/assets/play/fruits/niuyouguo.png',
    type: 'bad',
    description: '被暗雾侵蚀的牛油果，会吞噬能量。',
  },
  {
    id: 'pingguo',
    name: '苹果',
    image: '/assets/play/fruits/pingguo.png',
    type: 'good',
    description: '最稳妥的基础材料，适配任何配方。',
  },
  {
    id: 'putao',
    name: '葡萄',
    image: '/assets/play/fruits/putao.png',
    type: 'good',
    description: '组合延展性强，常用于连锁反应。',
  },
  {
    id: 'taozi',
    name: '桃子',
    image: '/assets/play/fruits/taozi.png',
    type: 'good',
    description: '柔和的属性可缓冲高压局面。',
  },
  {
    id: 'xiangjiao',
    name: '香蕉',
    image: '/assets/play/fruits/xiangjiao.png',
    type: 'good',
    description: '提升稳定性，容易与芒果配对。',
  },
  {
    id: 'xigua',
    name: '西瓜',
    image: '/assets/play/fruits/xigua.png',
    type: 'good',
    description: '充能速度极快，可快速补分。',
  },
];

export const GOOD_FRUITS = FRUITS.filter((fruit) => fruit.type === 'good');
export const BAD_FRUITS = FRUITS.filter((fruit) => fruit.type === 'bad');

