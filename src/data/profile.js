import avatar from '../assets/avatar.png'
import workstation from '../assets/workstation.png'
import projectAnalytics from '../assets/project-analytics.png'
import projectFinance from '../assets/project-finance.png'
import projectKanban from '../assets/project-kanban.png'
import galleryPortrait from '../assets/gallery-portrait.png'
import galleryHouse from '../assets/gallery-house.png'
import galleryGeo from '../assets/gallery-geo.png'
import gallerySign from '../assets/gallery-sign.png'
import galleryHeart from '../assets/gallery-heart.png'
import gallerySunset from '../assets/gallery-sunset.png'
import albumLofi from '../assets/album-lofi.png'

export const profile = {
  firstName: 'Shrey',
  lastName: '',
  displayName: 'Shrey',
  handle: '@shrey',
  initials: 'S',
  role: 'Full-Stack Developer',
  tagline: 'Dev by Day | Design Wizard by Night.',
  greeting: "Hello, I'm",
  description:
    'I craft glassmorphic interfaces and sturdy product backends — turning messy ideas into calm, usable software.',
  birthday: 'Building since 2022',
  location: 'India',
  joinedOn: 'Joined in 2024',
  email: 'hello@shrey.dev',
  available: true,
  cvUrl: '#',
}

export const socials = [
  {
    id: 'facebook',
    label: 'Facebook',
    handle: '@shrey',
    href: '#',
    stat: '3.5k',
    variant: 'facebook',
  },
  {
    id: 'github',
    label: 'GitHub',
    handle: '@shrey',
    href: 'https://github.com/',
    stat: '359',
    variant: 'github',
    action: 'Follow',
  },
  {
    id: 'figma',
    label: 'Figma',
    handle: '@shrey',
    href: '#',
    stat: '620',
    variant: 'figma',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    handle: '@shrey',
    href: '#',
    stat: '1.6k',
    variant: 'instagram',
  },
  {
    id: 'email',
    label: 'Email',
    handle: profile.email,
    href: `mailto:${profile.email}`,
    variant: 'email',
  },
  {
    id: 'devto',
    label: 'Dev.to',
    handle: '@shrey',
    href: '#',
    variant: 'devto',
  },
]

export const navItems = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About Me', href: '#about' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'experience', label: 'Experience', href: '#experience' },
  { id: 'blog', label: 'Blog', href: '#blog' },
  { id: 'contact', label: 'Contact', href: '#contact' },
]

export const infoStats = [
  { id: 'dob', label: 'Date of Birth', value: profile.birthday, icon: 'calendar' },
  { id: 'role', label: 'Profession', value: profile.role, icon: 'briefcase' },
  { id: 'location', label: 'Location', value: profile.location, icon: 'pin' },
  { id: 'joined', label: 'Joined On', value: '2024', icon: 'cake' },
]

export const skills = [
  'React',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'Tailwind',
  'Node.js',
  'Framer Motion',
  'Figma',
  'Python',
  'PostgreSQL',
  'Git',
  'Vite',
]

export const skillBalance = { design: 42, development: 58 }

export const achievements = [
  { id: 'followers', value: '3.5K', label: 'Followers', icon: 'users' },
  { id: 'projects', value: '25+', label: 'Projects', icon: 'briefcase' },
  { id: 'experience', value: '4+', label: 'Years Exp.', icon: 'star' },
  { id: 'following', value: '1.6K', label: 'Following', icon: 'heart' },
]

export const experience = [
  {
    id: 'exp-1',
    role: 'Full-Stack Developer',
    company: 'Independent',
    period: '2024 — Present',
    summary: 'Shipping product UIs, APIs, and design systems for web apps.',
  },
  {
    id: 'exp-2',
    role: 'Frontend Engineer',
    company: 'Product Studio',
    period: '2023 — 2024',
    summary: 'Built component libraries and dashboard experiences in React.',
  },
  {
    id: 'exp-3',
    role: 'Design + Code Intern',
    company: 'Creative Lab',
    period: '2022 — 2023',
    summary: 'Paired visual design with production-ready interface code.',
  },
]

export const certifications = [
  { id: 'cert-1', title: 'Meta Front-End', issuer: 'Coursera', year: '2024' },
  { id: 'cert-2', title: 'React Nanodegree', issuer: 'Udacity', year: '2023' },
  { id: 'cert-3', title: 'UI Engineering', issuer: 'Figma', year: '2023' },
]

export const projects = [
  {
    id: 'proj-1',
    title: 'Analytics Dashboard',
    stack: 'React · Node.js · Tailwind',
    image: projectAnalytics,
    href: '#',
  },
  {
    id: 'proj-2',
    title: 'Finance Mobile App',
    stack: 'React Native · TypeScript',
    image: projectFinance,
    href: '#',
  },
  {
    id: 'proj-3',
    title: 'Kanban Workspace',
    stack: 'Next.js · PostgreSQL',
    image: projectKanban,
    href: '#',
  },
]

export const gallery = [
  { id: 'g1', src: galleryPortrait, alt: 'Portrait study', tab: 'photos' },
  { id: 'g2', src: galleryHouse, alt: 'House under open sky', tab: 'photos' },
  { id: 'g3', src: galleryGeo, alt: 'Geometric composition', tab: 'photos' },
  { id: 'g4', src: gallerySign, alt: 'Minimal signage', tab: 'photos' },
  { id: 'g5', src: galleryHeart, alt: 'Soft heart study', tab: 'photos' },
  { id: 'g6', src: gallerySunset, alt: 'Sunset clouds', tab: 'photos' },
]

export const videos = [
  { id: 'v1', src: projectAnalytics, alt: 'Product walkthrough' },
  { id: 'v2', src: workstation, alt: 'Desk setup' },
  { id: 'v3', src: projectKanban, alt: 'Workspace demo' },
  { id: 'v4', src: gallerySunset, alt: 'Mood reel' },
  { id: 'v5', src: projectFinance, alt: 'App preview' },
  { id: 'v6', src: galleryGeo, alt: 'Motion study' },
]

export const tracks = [
  { id: 't1', title: 'Chill Lofi Beats', artist: 'Night Desk', duration: '2:48', cover: albumLofi, playing: true },
  { id: 't2', title: 'Sunset Drive', artist: 'Amber Hours', duration: '3:12', cover: gallerySunset },
  { id: 't3', title: 'Midnight Thoughts', artist: 'Violet Room', duration: '2:05', cover: galleryGeo },
]

export const tabs = ['All', 'Photos', 'Music', 'Videos']

export const assets = {
  avatar,
  workstation,
  albumLofi,
}

export const bioLines = [
  { emoji: '🎈', text: profile.birthday },
  { emoji: '📍', text: profile.role },
  { emoji: '👨‍💻', text: profile.tagline },
]
