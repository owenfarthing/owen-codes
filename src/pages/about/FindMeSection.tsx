import { motion } from 'motion/react';
import { Github, Linkedin } from 'lucide-react';
import { childVariants } from '@/components/layout/SectionWrapper';
import styles from './FindMeSection.module.css';

// Custom SVG icons for platforms without lucide equivalents
function ArcIcon() {
	return (
		<svg
			width="32"
			height="32"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="10" />
			<path d="M12 2a15 15 0 0 1 4 20" />
			<path d="M12 2a15 15 0 0 0-4 20" />
			<path d="M2 12h20" />
		</svg>
	);
}

function UpworkIcon() {
	return (
		<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
			<path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703s-1.212 2.703-2.703 2.703zm0-7.93c-2.539 0-4.51 1.649-5.31 4.366-1.214-1.832-2.148-4.032-2.687-5.886H7.828v7.112c0 1.406-1.141 2.546-2.547 2.546-1.406 0-2.546-1.141-2.546-2.546V3.709H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z" />
		</svg>
	);
}

const socials = [
	{
		id: 'linkedin',
		label: 'LinkedIn',
		href: 'https://www.linkedin.com/in/owen-farthing-5b42771a5',
		icon: <Linkedin size={32} />,
	},
	{ id: 'github', label: 'GitHub', href: 'https://github.com/owenfarthing', icon: <Github size={32} /> },
	{ id: 'arc', label: 'Arc.dev', href: 'https://arc.dev/@owenfarthing', icon: <ArcIcon /> },
	{
		id: 'upwork',
		label: 'Upwork',
		href: 'https://www.upwork.com/freelancers/~01014f5f176148d320?mp_source=share',
		icon: <UpworkIcon />,
	},
];

export function FindMeSection() {
	return (
		<div className={styles.container}>
			<motion.h2 className={styles.heading} variants={childVariants}>
				Find Me
			</motion.h2>
			<div className={styles.icons}>
				{socials.map((social) => (
					<motion.a
						key={social.id}
						href={social.href}
						target="_blank"
						rel="noopener noreferrer"
						className={styles.iconLink}
						variants={childVariants}
						whileHover={{ scale: 1.12 }}
						transition={{ type: 'spring', stiffness: 400, damping: 20 }}
					>
						<div className={styles.iconCircle}>{social.icon}</div>
						{social.label}
					</motion.a>
				))}
			</div>
		</div>
	);
}
