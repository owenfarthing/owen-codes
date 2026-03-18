import { motion } from 'motion/react';
import { childVariants } from '@/components/layout/SectionWrapper';
import styles from './ExperienceSection.module.css';

const skills = {
	Languages: ['TypeScript', 'JavaScript', 'SQL', 'HTML', 'CSS'],
	Frameworks: ['React', 'Node.js', 'Next.js', 'Express', 'React Query', 'tRPC'],
	Cloud: ['AWS', 'Azure', 'PostgreSQL', 'Databricks'],
};

const experience = [
	{
		company: 'Freelance / Contract',
		role: 'Full-Stack Engineer',
		summary: 'Building custom web applications for clients across industries.',
	},
	{
		company: 'Current Role',
		role: 'Software Engineer',
		summary: 'Developing and maintaining production web applications at scale.',
	},
	{
		company: 'Early Career',
		role: 'Junior Developer',
		summary: 'Learned the fundamentals of software engineering and web development.',
	},
];

export function ExperienceSection() {
	return (
		<div className={styles.grid}>
			<motion.div variants={childVariants}>
				<h2 className={styles.heading}>Skills</h2>
				{Object.entries(skills).map(([group, items]) => (
					<div key={group} className={styles.skillGroup}>
						<div className={styles.skillLabel}>{group}</div>
						<div className={styles.chips}>
							{items.map((skill) => (
								<span key={skill} className={styles.chip}>
									{skill}
								</span>
							))}
						</div>
					</div>
				))}
			</motion.div>

			<motion.div variants={childVariants}>
				<h2 className={styles.heading}>Experience</h2>
				<ul className={styles.timeline}>
					{experience.map((exp) => (
						<li key={exp.company} className={styles.timelineItem}>
							<div className={styles.company}>{exp.company}</div>
							<div className={styles.role}>{exp.role}</div>
							<div className={styles.summary}>{exp.summary}</div>
						</li>
					))}
				</ul>
			</motion.div>
		</div>
	);
}
