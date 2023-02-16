export const Arrow = ({ size, rotation, fn }: { size: number; rotation: number; fn?: () => any; }) => <svg width={size} height={size} onClick={fn} style={{
    transformBox: 'fill-box',
    transformOrigin: 'center',
    transform: `rotate(${rotation}deg)`,
}}><polygon points={`${size / 2},0 0,${size} ${size},${size}`} fill='black'/></svg>;

export const Cross = ({ size, fn }: { size: number; fn: () => any; }) => <svg width={size} height={size} onClick={fn}>
    <line x1={0} y1={0} x2={size} y2={size} stroke='black'/>
    <line x1={size} y1={0} x2={0} y2={size} stroke='black'/>
</svg>;