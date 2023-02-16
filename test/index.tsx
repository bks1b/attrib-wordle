import { createRoot } from 'react-dom/client';
import Game from '../src';

createRoot(document.getElementById('root')!).render(<Game entries={Array.from({ length: 100 }, (_, n) => ({
    n: n + '',
    parity: n / 2 === Math.floor(n / 2) ? 'even' : 'odd',
    sqDist: Math.abs(n - Math.round(Math.sqrt(n)) ** 2),
}))} attribs={[
    { name: 'Number', render: x => x.n, value: x => +x.n, maxDifference: 6 },
    { name: 'Parity', render: x => x.parity, value: x => x.parity },
    { name: 'Distance from closest square', render: x => x.sqDist, value: x => x.sqDist, maxDifference: 2 },
]} id='n' optionCount={5} guesses={8}/>);