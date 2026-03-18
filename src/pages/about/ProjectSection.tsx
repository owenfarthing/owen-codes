import { motion } from 'motion/react';
import { childVariants } from '@/components/layout/SectionWrapper';
import workflowsImg from '@/images/Workflows Dashboard.png';
import recoveryImg from '@/images/Recovery.png';
import adverseImg from '@/images/Adverse Parties & liability.png';
import styles from './ProjectSection.module.css';

const screenshots = [
	{ src: recoveryImg, alt: 'Recovery Tracking' },
	{ src: adverseImg, alt: 'Adverse Parties & Liability' },
	{ src: workflowsImg, alt: 'Workflows Dashboard' },
];

export function ProjectSection() {
	return (
		<div className={styles.layout}>
			<motion.div className={styles.screenshots} variants={childVariants}>
				{screenshots.map((img) => (
					<motion.div key={img.alt} className={styles.screenshot} variants={childVariants}>
						<img src={img.src} alt={img.alt} className={styles.screenshotImg} />
					</motion.div>
				))}
			</motion.div>

			<motion.div className={styles.info} variants={childVariants}>
				<h2 className={styles.projectName}>Latest Project: Insurance Subrogation Platform</h2>
				<p className={styles.projectSummary}>
					A private, enterprise-grade platform for streamlining workflows and information management across
					insurance subrogation teams.
				</p>
				<ul className={styles.bullets}>
					<li>Customizable checklist workflows for claims assessment</li>
					<li>Full claims tracking — metadata, parties, payments, liability, and coverage</li>
					<li>Smart pipelines with automation and algorithm-driven workload analysis</li>
					<li>Azure-backed file system for document management and storage</li>
					<li>Dashboarding, data exploration, and extensive admin tooling</li>
					<li>SOC-2 targeted security with MFA, Private VNet, and Clerk auth</li>
				</ul>
				<div className={styles.techChips}>
					{['React', 'Next.js', 'tRPC', 'TypeScript', 'Node.js', 'PostgreSQL', 'Clerk', 'Azure'].map((t) => (
						<span key={t} className={styles.techChip}>
							{t}
						</span>
					))}
				</div>
			</motion.div>
		</div>
	);
}
