import React from 'react';
import {Composition} from 'remotion';
import {Reel, ReelProps} from './Reel';

const demo: ReelProps = {
  video: 'base.mp4', duration: 12, punch: [4.2],
  words: 'Самая частая ошибка при подготовке к USMLE это учить всё подряд без плана и без повторения'.split(' ').map((w, i) => ({w, s: 0.3 + i * 0.45, e: 0.3 + i * 0.45 + 0.4})),
  items: [
    {kind: 'hook', t0: 0, t1: 3, small: 'Ошибка №1 при подготовке', big: 'USMLE', sub: 'без плана не сдать'},
    {kind: 'card', t0: 3.4, t1: 7, title: 'Повторение', lines: [{text: 'каждые 3 дня', at: 4, tone: 'plus'}, {text: 'без него забываешь 70%', at: 5, tone: 'minus'}]},
    {kind: 'note', t0: 7.2, t1: 9, text: 'это важно!'},
    {kind: 'stamp', t0: 9.2, t1: 10.5, big: '70%', small: 'забывается за неделю'},
    {kind: 'cta', t0: 10.6, t1: 12, big: 'Сохрани', small: 'чтобы не потерять план'},
  ],
};

export const RemotionRoot: React.FC = () => (
  <Composition id="Reel" component={Reel} width={1080} height={1920} fps={30} durationInFrames={360} defaultProps={demo}
    calculateMetadata={({props}) => ({durationInFrames: Math.max(1, Math.round((props as ReelProps).duration * 30))})} />
);
