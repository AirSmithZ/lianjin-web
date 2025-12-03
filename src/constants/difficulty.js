export const DIFFICULTY_STEPS = [
  { key: 'low', label: '하', caption: '低 · 坏水果 0 个', badCount: 0 },
  { key: 'mid', label: '중', caption: '中 · 坏水果 1 个', badCount: 1 },
  { key: 'high', label: '상', caption: '高 · 坏水果 3 个', badCount: 3 },
];

export const DEFAULT_DIFFICULTY_KEY = DIFFICULTY_STEPS[0].key;

export const BAD_COUNT_BY_DIFFICULTY = DIFFICULTY_STEPS.reduce((map, item) => {
  const nextMap = { ...map };
  nextMap[item.key] = item.badCount;
  return nextMap;
}, {});

