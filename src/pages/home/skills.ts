export type SkillHue = 'magenta' | 'violet' | 'cyan' | 'pink'

export interface Skill {
  label: string
  hue: SkillHue
}

/** Canonical skill tags - shared by the Who section's own toolkit rail
 * (WhoSection.tsx) and every project case study's "skills & toolkit" line,
 * so the same skill always renders as the same colored tag across the site. */
export const SKILLS: Skill[] = [
  { label: 'AI-Assisted Design Workflows', hue: 'magenta' },
  { label: 'Enterprise UX Design', hue: 'violet' },
  { label: 'Cross-functional Collaboration', hue: 'cyan' },
  { label: 'Figma', hue: 'pink' },
  { label: 'GitHub', hue: 'violet' },
  { label: 'User Research', hue: 'magenta' },
]

const skillByLabel = new Map(SKILLS.map((skill) => [skill.label, skill]))

/** Tag color for a project's toolkit entry - falls back to violet for
 * anything that isn't already one of Katarina's own skill tags. */
export function skillHue(label: string): SkillHue {
  return skillByLabel.get(label)?.hue ?? 'violet'
}
