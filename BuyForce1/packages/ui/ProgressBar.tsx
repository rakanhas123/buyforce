import React from 'react';

type Props = {
	value: number; // 0-100
	className?: string;
};

export function ProgressBar({ value, className }: Props) {
	const pct = Math.max(0, Math.min(100, value));
	return (
		<div className={`bf-progress ${className ?? ''}`} style={{ background: '#eee', borderRadius: 4 }}>
			<div style={{ width: `${pct}%`, background: '#06f', height: 8, borderRadius: 4 }} />
		</div>
	);
}
