import boluo from '../assets/play/fruits/boluo.png';
import caomei from '../assets/play/fruits/caomei.png';
import juzi from '../assets/play/fruits/juzi.png';
import lanmei from '../assets/play/fruits/lanmei.png';
import lanmei2 from '../assets/play/fruits/lanmei2.png';
import lizhi from '../assets/play/fruits/lizhi.png';
import mangguo from '../assets/play/fruits/mangguo.png';
import mihoutao from '../assets/play/fruits/mihoutao.png';
import niuyouguo from '../assets/play/fruits/niuyouguo.png';
import pingguo from '../assets/play/fruits/pingguo.png';
import putao from '../assets/play/fruits/putao.png';
import taozi from '../assets/play/fruits/taozi.png';
import xiangjiao from '../assets/play/fruits/xiangjiao.png';
import xigua from '../assets/play/fruits/xigua.png';

export const FRUITS = [
  {
    id: 'boluo',
    name: '菠萝',
    image: boluo,
    type: 'good',
    description: '酸甜平衡，适合高分配方。',
  },
  {
    id: 'caomei',
    name: '草莓',
    image: caomei,
    type: 'good',
    description: '爆发力强，是基础增益食材。',
  },
  {
    id: 'juzi',
    name: '橘子',
    image: juzi,
    type: 'good',
    description: '维持能量供给，用来稳定产出。',
  },
  {
    id: 'lanmei',
    name: '蓝莓',
    image: lanmei,
    type: 'good',
    description: '提升暴击，常与草莓同框。',
  },
  {
    id: 'lanmei2',
    name: '霉化蓝莓',
    image: lanmei2,
    type: 'bad',
    description: '受到腐蚀的蓝莓，易触发扣分。',
  },
  {
    id: 'lizhi',
    name: '荔枝',
    image: lizhi,
    type: 'good',
    description: '可快速积攒幸运值，是稀缺资源。',
  },
  {
    id: 'mangguo',
    name: '芒果',
    image: mangguo,
    type: 'good',
    description: '热力十足，常见于夏日配方。',
  },
  {
    id: 'mihoutao',
    name: '枯萎猕猴桃',
    image: mihoutao,
    type: 'bad',
    description: '明显发黑的猕猴桃，炼金时需避开。',
  },
  {
    id: 'niuyouguo',
    name: '暗斑牛油果',
    image: niuyouguo,
    type: 'bad',
    description: '被暗雾侵蚀的牛油果，会吞噬能量。',
  },
  {
    id: 'pingguo',
    name: '苹果',
    image: pingguo,
    type: 'good',
    description: '最稳妥的基础材料，适配任何配方。',
  },
  {
    id: 'putao',
    name: '葡萄',
    image: putao,
    type: 'good',
    description: '组合延展性强，常用于连锁反应。',
  },
  {
    id: 'taozi',
    name: '桃子',
    image: taozi,
    type: 'good',
    description: '柔和的属性可缓冲高压局面。',
  },
  {
    id: 'xiangjiao',
    name: '香蕉',
    image: xiangjiao,
    type: 'good',
    description: '提升稳定性，容易与芒果配对。',
  },
  {
    id: 'xigua',
    name: '西瓜',
    image: xigua,
    type: 'good',
    description: '充能速度极快，可快速补分。',
  },
];

export const GOOD_FRUITS = FRUITS.filter((fruit) => fruit.type === 'good');
export const BAD_FRUITS = FRUITS.filter((fruit) => fruit.type === 'bad');

