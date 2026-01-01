import React from 'react';

type Props = {
	children?: React.ReactNode;
	className?: string;
};

export function Badge({ children, className }: Props) {
	return (
		<span className={`bf-badge ${className ?? ''}`} style={{ padding: '2px 6px', background: '#eee', borderRadius: 6 }}>
			{children}
		</span>
	);
}
