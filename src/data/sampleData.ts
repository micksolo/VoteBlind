import type { Question, Party, PartyPolicy, PolicyArea } from '../types';

// Sample policy areas for Australian federal politics
export const POLICY_AREAS: PolicyArea[] = [
  {
    id: 'economy',
    name: 'Economy',
    description: 'Economic policy, taxation, and government spending',
    icon: '💰',
  },
  {
    id: 'environment',
    name: 'Environment',
    description: 'Climate change, renewable energy, and conservation',
    icon: '🌱',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Medicare, hospitals, and health policy',
    icon: '🏥',
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Schools, universities, and training',
    icon: '📚',
  },
  {
    id: 'housing',
    name: 'Housing',
    description: 'Housing affordability and policy',
    icon: '🏠',
  },
  {
    id: 'immigration',
    name: 'Immigration',
    description: 'Immigration levels and refugee policy',
    icon: '🌏',
  },
  {
    id: 'social',
    name: 'Social Issues',
    description: 'Social welfare, Indigenous affairs, and equality',
    icon: '👥',
  },
  {
    id: 'defense',
    name: 'Defense & Security',
    description: 'Military, national security, and foreign policy',
    icon: '🛡️',
  },
];

// Sample questions based on key Australian political issues
export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'q1',
    election_id: 'federal-2025',
    policy_area_id: 'environment',
    text: 'Australia should set more ambitious targets to reduce carbon emissions',
    description: 'This relates to Australia\'s commitment under international climate agreements.',
    order: 1,
  },
  {
    id: 'q2',
    election_id: 'federal-2025',
    policy_area_id: 'economy',
    text: 'The government should increase taxes on high-income earners',
    description: 'Progressive taxation means higher earners pay a larger percentage of their income.',
    order: 2,
  },
  {
    id: 'q3',
    election_id: 'federal-2025',
    policy_area_id: 'healthcare',
    text: 'Medicare should be expanded to cover dental care',
    description: 'Currently, dental care is not covered under Medicare for most Australians.',
    order: 3,
  },
  {
    id: 'q4',
    election_id: 'federal-2025',
    policy_area_id: 'housing',
    text: 'The government should do more to help first-home buyers enter the market',
    description: 'This could include grants, stamp duty concessions, or shared equity schemes.',
    order: 4,
  },
  {
    id: 'q5',
    election_id: 'federal-2025',
    policy_area_id: 'immigration',
    text: 'Australia should increase its annual immigration intake',
    description: 'Australia\'s permanent migration program currently targets around 190,000 places per year.',
    order: 5,
  },
  {
    id: 'q6',
    election_id: 'federal-2025',
    policy_area_id: 'education',
    text: 'University students should pay more towards the cost of their degrees',
    description: 'The HECS-HELP system currently subsidises university education.',
    order: 6,
  },
  {
    id: 'q7',
    election_id: 'federal-2025',
    policy_area_id: 'economy',
    text: 'The government should prioritise reducing the national debt over new spending programs',
    description: 'Australia\'s net debt is projected to continue growing in coming years.',
    order: 7,
  },
  {
    id: 'q8',
    election_id: 'federal-2025',
    policy_area_id: 'social',
    text: 'The Newstart/JobSeeker payment should be increased',
    description: 'JobSeeker is the main income support payment for unemployed Australians.',
    order: 8,
  },
  {
    id: 'q9',
    election_id: 'federal-2025',
    policy_area_id: 'environment',
    text: 'Australia should phase out coal mining and exports',
    description: 'Coal is currently Australia\'s second-largest export commodity.',
    order: 9,
  },
  {
    id: 'q10',
    election_id: 'federal-2025',
    policy_area_id: 'defense',
    text: 'Australia should increase defence spending',
    description: 'Current defence spending is approximately 2% of GDP.',
    order: 10,
  },
  {
    id: 'q11',
    election_id: 'federal-2025',
    policy_area_id: 'housing',
    text: 'Negative gearing tax benefits for property investors should be reduced',
    description: 'Negative gearing allows investors to offset rental losses against other income.',
    order: 11,
  },
  {
    id: 'q12',
    election_id: 'federal-2025',
    policy_area_id: 'social',
    text: 'The government should do more to close the gap in Indigenous health and education outcomes',
    description: 'The Closing the Gap framework sets targets for Indigenous Australians.',
    order: 12,
  },
  {
    id: 'q13',
    election_id: 'federal-2025',
    policy_area_id: 'immigration',
    text: 'Australia should take in more refugees',
    description: 'Australia\'s humanitarian program currently accepts around 13,750 refugees per year.',
    order: 13,
  },
  {
    id: 'q14',
    election_id: 'federal-2025',
    policy_area_id: 'economy',
    text: 'Large corporations should pay more tax',
    description: 'The corporate tax rate for large companies is currently 30%.',
    order: 14,
  },
  {
    id: 'q15',
    election_id: 'federal-2025',
    policy_area_id: 'healthcare',
    text: 'The government should regulate the prices of prescription medications more strictly',
    description: 'The Pharmaceutical Benefits Scheme (PBS) already subsidises many medications.',
    order: 15,
  },
];

// Major Australian federal parties
export const SAMPLE_PARTIES: Party[] = [
  {
    id: 'alp',
    name: 'Australian Labor Party',
    short_name: 'Labor',
    color: '#E53935', // Red
  },
  {
    id: 'lib',
    name: 'Liberal Party of Australia',
    short_name: 'Liberal',
    color: '#1565C0', // Blue
    coalition_group_id: 'coalition',
  },
  {
    id: 'nat',
    name: 'National Party of Australia',
    short_name: 'Nationals',
    color: '#2E7D32', // Green (dark)
    coalition_group_id: 'coalition',
  },
  {
    id: 'grn',
    name: 'Australian Greens',
    short_name: 'Greens',
    color: '#43A047', // Green
  },
  {
    id: 'onp',
    name: 'One Nation',
    short_name: 'One Nation',
    color: '#FF6F00', // Orange
  },
];

// Sample party positions (these are illustrative and would need to be researched properly)
// Position: 1 = Strongly Disagree, 5 = Strongly Agree
export const SAMPLE_PARTY_POLICIES: PartyPolicy[] = [
  // Q1: Climate targets
  { id: 'pp1', party_id: 'alp', question_id: 'q1', position: 4, confidence: 'explicit', source_description: 'Labor climate policy' },
  { id: 'pp2', party_id: 'lib', question_id: 'q1', position: 2, confidence: 'inferred', source_description: 'Coalition emissions policy' },
  { id: 'pp3', party_id: 'nat', question_id: 'q1', position: 2, confidence: 'inferred', source_description: 'Coalition emissions policy' },
  { id: 'pp4', party_id: 'grn', question_id: 'q1', position: 5, confidence: 'explicit', source_description: 'Greens climate policy' },
  { id: 'pp5', party_id: 'onp', question_id: 'q1', position: 1, confidence: 'explicit', source_description: 'One Nation climate policy' },

  // Q2: High-income taxes
  { id: 'pp6', party_id: 'alp', question_id: 'q2', position: 4, confidence: 'inferred', source_description: 'Labor tax policy' },
  { id: 'pp7', party_id: 'lib', question_id: 'q2', position: 2, confidence: 'explicit', source_description: 'Liberal tax policy' },
  { id: 'pp8', party_id: 'nat', question_id: 'q2', position: 2, confidence: 'inferred', source_description: 'Coalition tax policy' },
  { id: 'pp9', party_id: 'grn', question_id: 'q2', position: 5, confidence: 'explicit', source_description: 'Greens tax policy' },
  { id: 'pp10', party_id: 'onp', question_id: 'q2', position: 3, confidence: 'estimated', source_description: 'One Nation policy' },

  // Q3: Medicare dental
  { id: 'pp11', party_id: 'alp', question_id: 'q3', position: 4, confidence: 'explicit', source_description: 'Labor health policy' },
  { id: 'pp12', party_id: 'lib', question_id: 'q3', position: 2, confidence: 'inferred', source_description: 'Coalition health policy' },
  { id: 'pp13', party_id: 'nat', question_id: 'q3', position: 2, confidence: 'inferred', source_description: 'Coalition health policy' },
  { id: 'pp14', party_id: 'grn', question_id: 'q3', position: 5, confidence: 'explicit', source_description: 'Greens health policy' },
  { id: 'pp15', party_id: 'onp', question_id: 'q3', position: 3, confidence: 'estimated', source_description: 'One Nation policy' },

  // Q4: First-home buyers
  { id: 'pp16', party_id: 'alp', question_id: 'q4', position: 4, confidence: 'explicit', source_description: 'Labor housing policy' },
  { id: 'pp17', party_id: 'lib', question_id: 'q4', position: 4, confidence: 'explicit', source_description: 'Coalition housing policy' },
  { id: 'pp18', party_id: 'nat', question_id: 'q4', position: 4, confidence: 'inferred', source_description: 'Coalition housing policy' },
  { id: 'pp19', party_id: 'grn', question_id: 'q4', position: 4, confidence: 'explicit', source_description: 'Greens housing policy' },
  { id: 'pp20', party_id: 'onp', question_id: 'q4', position: 4, confidence: 'estimated', source_description: 'One Nation policy' },

  // Q5: Immigration intake
  { id: 'pp21', party_id: 'alp', question_id: 'q5', position: 4, confidence: 'inferred', source_description: 'Labor immigration policy' },
  { id: 'pp22', party_id: 'lib', question_id: 'q5', position: 3, confidence: 'inferred', source_description: 'Coalition immigration policy' },
  { id: 'pp23', party_id: 'nat', question_id: 'q5', position: 2, confidence: 'inferred', source_description: 'Nationals regional policy' },
  { id: 'pp24', party_id: 'grn', question_id: 'q5', position: 4, confidence: 'explicit', source_description: 'Greens immigration policy' },
  { id: 'pp25', party_id: 'onp', question_id: 'q5', position: 1, confidence: 'explicit', source_description: 'One Nation immigration policy' },

  // Q6: University costs
  { id: 'pp26', party_id: 'alp', question_id: 'q6', position: 2, confidence: 'inferred', source_description: 'Labor education policy' },
  { id: 'pp27', party_id: 'lib', question_id: 'q6', position: 4, confidence: 'inferred', source_description: 'Coalition education policy' },
  { id: 'pp28', party_id: 'nat', question_id: 'q6', position: 3, confidence: 'estimated', source_description: 'Coalition education policy' },
  { id: 'pp29', party_id: 'grn', question_id: 'q6', position: 1, confidence: 'explicit', source_description: 'Greens free education policy' },
  { id: 'pp30', party_id: 'onp', question_id: 'q6', position: 3, confidence: 'estimated', source_description: 'One Nation policy' },

  // Q7: Debt reduction priority
  { id: 'pp31', party_id: 'alp', question_id: 'q7', position: 2, confidence: 'inferred', source_description: 'Labor fiscal policy' },
  { id: 'pp32', party_id: 'lib', question_id: 'q7', position: 4, confidence: 'explicit', source_description: 'Liberal fiscal policy' },
  { id: 'pp33', party_id: 'nat', question_id: 'q7', position: 4, confidence: 'inferred', source_description: 'Coalition fiscal policy' },
  { id: 'pp34', party_id: 'grn', question_id: 'q7', position: 2, confidence: 'inferred', source_description: 'Greens fiscal policy' },
  { id: 'pp35', party_id: 'onp', question_id: 'q7', position: 3, confidence: 'estimated', source_description: 'One Nation policy' },

  // Q8: JobSeeker increase
  { id: 'pp36', party_id: 'alp', question_id: 'q8', position: 4, confidence: 'inferred', source_description: 'Labor welfare policy' },
  { id: 'pp37', party_id: 'lib', question_id: 'q8', position: 2, confidence: 'inferred', source_description: 'Coalition welfare policy' },
  { id: 'pp38', party_id: 'nat', question_id: 'q8', position: 2, confidence: 'inferred', source_description: 'Coalition welfare policy' },
  { id: 'pp39', party_id: 'grn', question_id: 'q8', position: 5, confidence: 'explicit', source_description: 'Greens welfare policy' },
  { id: 'pp40', party_id: 'onp', question_id: 'q8', position: 3, confidence: 'estimated', source_description: 'One Nation policy' },

  // Q9: Phase out coal
  { id: 'pp41', party_id: 'alp', question_id: 'q9', position: 3, confidence: 'inferred', source_description: 'Labor resources policy' },
  { id: 'pp42', party_id: 'lib', question_id: 'q9', position: 1, confidence: 'explicit', source_description: 'Coalition resources policy' },
  { id: 'pp43', party_id: 'nat', question_id: 'q9', position: 1, confidence: 'explicit', source_description: 'Nationals resources policy' },
  { id: 'pp44', party_id: 'grn', question_id: 'q9', position: 5, confidence: 'explicit', source_description: 'Greens climate policy' },
  { id: 'pp45', party_id: 'onp', question_id: 'q9', position: 1, confidence: 'explicit', source_description: 'One Nation resources policy' },

  // Q10: Defence spending
  { id: 'pp46', party_id: 'alp', question_id: 'q10', position: 4, confidence: 'explicit', source_description: 'Labor defence policy' },
  { id: 'pp47', party_id: 'lib', question_id: 'q10', position: 5, confidence: 'explicit', source_description: 'Coalition defence policy' },
  { id: 'pp48', party_id: 'nat', question_id: 'q10', position: 5, confidence: 'inferred', source_description: 'Coalition defence policy' },
  { id: 'pp49', party_id: 'grn', question_id: 'q10', position: 2, confidence: 'explicit', source_description: 'Greens peace policy' },
  { id: 'pp50', party_id: 'onp', question_id: 'q10', position: 5, confidence: 'explicit', source_description: 'One Nation defence policy' },

  // Q11: Negative gearing
  { id: 'pp51', party_id: 'alp', question_id: 'q11', position: 4, confidence: 'inferred', source_description: 'Labor housing policy' },
  { id: 'pp52', party_id: 'lib', question_id: 'q11', position: 1, confidence: 'explicit', source_description: 'Coalition tax policy' },
  { id: 'pp53', party_id: 'nat', question_id: 'q11', position: 1, confidence: 'inferred', source_description: 'Coalition tax policy' },
  { id: 'pp54', party_id: 'grn', question_id: 'q11', position: 5, confidence: 'explicit', source_description: 'Greens housing policy' },
  { id: 'pp55', party_id: 'onp', question_id: 'q11', position: 2, confidence: 'estimated', source_description: 'One Nation policy' },

  // Q12: Closing the Gap
  { id: 'pp56', party_id: 'alp', question_id: 'q12', position: 5, confidence: 'explicit', source_description: 'Labor Indigenous policy' },
  { id: 'pp57', party_id: 'lib', question_id: 'q12', position: 4, confidence: 'explicit', source_description: 'Coalition Indigenous policy' },
  { id: 'pp58', party_id: 'nat', question_id: 'q12', position: 4, confidence: 'inferred', source_description: 'Coalition Indigenous policy' },
  { id: 'pp59', party_id: 'grn', question_id: 'q12', position: 5, confidence: 'explicit', source_description: 'Greens Indigenous policy' },
  { id: 'pp60', party_id: 'onp', question_id: 'q12', position: 2, confidence: 'inferred', source_description: 'One Nation policy' },

  // Q13: More refugees
  { id: 'pp61', party_id: 'alp', question_id: 'q13', position: 3, confidence: 'inferred', source_description: 'Labor refugee policy' },
  { id: 'pp62', party_id: 'lib', question_id: 'q13', position: 2, confidence: 'inferred', source_description: 'Coalition refugee policy' },
  { id: 'pp63', party_id: 'nat', question_id: 'q13', position: 2, confidence: 'inferred', source_description: 'Coalition refugee policy' },
  { id: 'pp64', party_id: 'grn', question_id: 'q13', position: 5, confidence: 'explicit', source_description: 'Greens refugee policy' },
  { id: 'pp65', party_id: 'onp', question_id: 'q13', position: 1, confidence: 'explicit', source_description: 'One Nation refugee policy' },

  // Q14: Corporate tax
  { id: 'pp66', party_id: 'alp', question_id: 'q14', position: 4, confidence: 'inferred', source_description: 'Labor tax policy' },
  { id: 'pp67', party_id: 'lib', question_id: 'q14', position: 2, confidence: 'explicit', source_description: 'Coalition business policy' },
  { id: 'pp68', party_id: 'nat', question_id: 'q14', position: 2, confidence: 'inferred', source_description: 'Coalition business policy' },
  { id: 'pp69', party_id: 'grn', question_id: 'q14', position: 5, confidence: 'explicit', source_description: 'Greens tax policy' },
  { id: 'pp70', party_id: 'onp', question_id: 'q14', position: 3, confidence: 'estimated', source_description: 'One Nation policy' },

  // Q15: Medication prices
  { id: 'pp71', party_id: 'alp', question_id: 'q15', position: 4, confidence: 'inferred', source_description: 'Labor health policy' },
  { id: 'pp72', party_id: 'lib', question_id: 'q15', position: 3, confidence: 'inferred', source_description: 'Coalition health policy' },
  { id: 'pp73', party_id: 'nat', question_id: 'q15', position: 3, confidence: 'inferred', source_description: 'Coalition health policy' },
  { id: 'pp74', party_id: 'grn', question_id: 'q15', position: 5, confidence: 'explicit', source_description: 'Greens health policy' },
  { id: 'pp75', party_id: 'onp', question_id: 'q15', position: 3, confidence: 'estimated', source_description: 'One Nation policy' },
];
