'use client';
import React from 'react';
import { ShieldCheckIcon, PlusIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { InteractiveHoverButton } from './interactive-hover-button';

export interface PricingProps {
	eyebrow: string;
	title: string;
	price: number;
	priceNote: string;
	items: string[];
	ctaLabel: string;
	ctaHref: string;
	secondaryLines?: string[];
}

export function Pricing({
	eyebrow,
	title,
	price,
	priceNote,
	items,
	ctaLabel,
	ctaHref,
	secondaryLines = [],
}: PricingProps) {
	return (
		<section className="relative overflow-hidden py-16 md:py-24">
			<div className="mx-auto w-full max-w-2xl space-y-8 px-4">
				<div className="relative">
					<div
						className={cn(
							'z--10 pointer-events-none absolute inset-0 size-full',
							'bg-[linear-gradient(to_right,--theme(--color-foreground/.08)_1px,transparent_1px),linear-gradient(to_bottom,--theme(--color-foreground/.08)_1px,transparent_1px)]',
							'bg-[size:32px_32px]',
							'[mask-image:radial-gradient(ellipse_at_center,var(--background)_10%,transparent)]',
						)}
					/>

					<motion.div
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
						viewport={{ once: true }}
						className="relative w-full rounded-[2rem] border border-border bg-primary text-primary-foreground p-4"
					>
						<PlusIcon className="absolute -top-3 -left-3 size-5 text-primary-foreground/70" />
						<PlusIcon className="absolute -top-3 -right-3 size-5 text-primary-foreground/70" />
						<PlusIcon className="absolute -bottom-3 -left-3 size-5 text-primary-foreground/70" />
						<PlusIcon className="absolute -right-3 -bottom-3 size-5 text-primary-foreground/70" />

						<div className="w-full px-4 pt-6 pb-5">
							<p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground/70">
								{eyebrow}
							</p>
							<h3 className="mt-2 text-2xl font-semibold leading-tight md:text-3xl">{title}</h3>

							<div className="mt-6 flex items-end gap-1">
								<span className="text-2xl">€</span>
								<span className="text-5xl font-semibold tracking-tight md:text-6xl">{price}</span>
							</div>
							<p className="mt-1 text-sm text-primary-foreground/70">{priceNote}</p>

							<ul className="mt-6 space-y-3">
								{items.map((item) => (
									<li key={item} className="flex items-start gap-3 text-sm text-primary-foreground/90">
										<span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[color:var(--color-accent-copper)]" />
										{item}
									</li>
								))}
							</ul>

							<InteractiveHoverButton
								text={ctaLabel}
								className="mt-8 w-full border-primary-foreground/20 bg-[color:var(--color-accent-copper)] text-primary [&_svg]:text-primary"
								onClick={() => {
									window.location.href = ctaHref;
								}}
							/>
						</div>
					</motion.div>

					{secondaryLines.length > 0 && (
						<div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm text-muted-foreground">
							{secondaryLines.map((line) => (
								<span key={line}>{line}</span>
							))}
						</div>
					)}

					<div className="mt-4 flex items-center justify-center gap-x-2 text-xs text-muted-foreground">
						<ShieldCheckIcon className="size-3.5" />
						<span>Approccio complementare — non sostituisce la valutazione veterinaria.</span>
					</div>
				</div>
			</div>
		</section>
	);
}
