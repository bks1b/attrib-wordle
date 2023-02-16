import { ReactNode, useRef, useState } from 'react';
import { compareTwoStrings } from 'string-similarity';
import { Arrow, Cross } from './icons';

const ARROW_SIZE = 20;

export default <T extends { [k in U]: string; } & { [k in string]: any; }, U extends string>({ entries, id, attribs, guesses, optionCount }: {
    entries: T[];
    id: U;
    attribs: {
        name: string;
        render: (x: T) => ReactNode;
        value: (x: T) => string | number | (string | number)[];
        maxDifference?: number;
    }[];
    guesses: number;
    optionCount: number;
}) => {
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [correct, setCorrect] = useState(entries[Math.floor(Math.random() * entries.length)]);
    const [attempts, setAttempts] = useState<T[]>([]);
    const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);
    const [options, setOptions] = useState<[string, number][]>([]);
    const attempt = (str: string) => {
        const match = entries.find(x => x[id] === str);
        if (!match || isOver) return;
        inputRef.current!.value = '';
        setAttempts([...attempts, match]);
        setDropdownIndex(null);
        setInput('');
        setOptions([]);
    };
    const reset = () => {
        setCorrect(entries[Math.floor(Math.random() * entries.length)]);
        setAttempts([]);
    };
    const isCorrect = attempts.slice(-1)[0]?.[id] === correct[id];
    const isOver = isCorrect || attempts.length === guesses;
    const thead = <thead><tr>{attribs.map((x, i) => <th key={i}>{x.name}</th>)}</tr></thead>;
    return <>
        {
            isOver
                ? <div className='popupContainer' onClick={e => {
                    if ((e.target as HTMLElement).className === 'popupContainer') reset();
                }}>
                    <div className='popup'>
                        <div className='popupHeader'>
                            <a>{isCorrect ? 'Correct' : 'Out of guesses'}</a>
                            <Cross size={15} fn={reset}/>
                        </div>
                        <table className='table'>
                            {thead}
                            <tbody><tr>{attribs.map((x, i) => <td key={i}><div className='cell'>{x.render(correct)}</div></td>)}</tr></tbody>
                        </table>
                    </div>
                </div>
                : ''
        }
        <div className='container'>
            <input autoComplete='off' enterKeyHint='done' ref={inputRef} onKeyDown={e => {
                const inp = e.target as HTMLInputElement;
                if (e.key === 'Enter') attempt(inp.value);
                else if (['ArrowUp', 'ArrowDown'].includes(e.key) && options.length) {
                    e.preventDefault();
                    const i = dropdownIndex === null
                        ? e.key === 'ArrowUp' ? options.length - 1 : 0
                        : (dropdownIndex + (e.key === 'ArrowUp' ? -1 : 1) + options.length) % options.length;
                    setDropdownIndex(i);
                    setInput(inputRef.current!.value = options[i][0]);
                }
            }} onKeyUp={e => {
                const val = (e.target as HTMLInputElement).value;
                if (input === val) return;
                setDropdownIndex(null);
                setInput(val);
                setOptions(entries
                    .map(x => [x[id], compareTwoStrings(x[id].toLowerCase(), val.toLowerCase())] as [string, number])
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, optionCount));
            }} className='input'/>
            <div className='dropdown'>{options.map((x, i) => <div key={i} onClick={() => attempt(x[0])} className={'option' + (i === dropdownIndex ? ' selected' : '')}>{x[0]}</div>)}</div>
            <table className='table'>
                {thead}
                <tbody>{attempts.map((x, i) => <tr key={i}>{attribs.map((a, i) => {
                    const val = a.value(x);
                    const correctVal = a.value(correct);
                    return <td key={i} className={
                        val === correctVal
                            ? 'green'
                            : typeof val === 'number' && typeof correctVal === 'number'
                                ? Math.abs(val - correctVal) <= a.maxDifference!
                                    ? 'yellow'
                                    : ''
                                : Array.isArray(val) && Array.isArray(correctVal)
                                    ? val.length === correctVal.length && val.every(x => correctVal.includes(x))
                                        ? 'green'
                                        : val.some(x => correctVal.includes(x))
                                            ? 'yellow'
                                            : ''
                                    : ''
                    }><div className='cell'>{a.render(x)} {
                            typeof val === 'number' && typeof correctVal === 'number'
                                ? <div className='arrow' style={{ width: ARROW_SIZE }}>{
                                    val === correctVal
                                        ? ''
                                        : <Arrow size={ARROW_SIZE} rotation={correctVal > val ? 0 : 180}/>
                                }</div>
                                : ''
                        }</div></td>;
                })}</tr>)}</tbody>
            </table>
        </div>
    </>;
};

export { Arrow, Cross };