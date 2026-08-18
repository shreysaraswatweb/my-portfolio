import {
  Briefcase,
  FolderKanban,
  Home,
  Mail,
  Menu,
  Newspaper,
  Sparkles,
  User,
  X,
} from 'lucide-react'
import { navItems, profile } from '../data/profile'
import AvatarFrame from './AvatarFrame'
import {
  FacebookMark,
  FigmaMark,
  GithubMark,
  InstagramMark,
} from './icons/BrandIcons'

const navIcons = {
  home: Home,
  about: User,
  projects: FolderKanban,
  skills: Sparkles,
  experience: Briefcase,
  blog: Newspaper,
  contact: Mail,
}

const connect = [
  { id: 'facebook', href: '#', Mark: FacebookMark },
  { id: 'github', href: 'https://github.com/', Mark: GithubMark },
  { id: 'figma', href: '#', Mark: FigmaMark },
  { id: 'instagram', href: '#', Mark: InstagramMark },
]

export default function Sidebar({
  active = 'home',
  onNavigate,
  drawer = false,
  onClose,
}) {
  return (
    <aside
      className={[
        'sticky top-0 flex h-screen w-sidebar shrink-0 flex-col self-start bg-sidebar px-space-4 py-space-5',
        drawer ? 'fixed inset-y-0 left-0 z-50 shadow-card' : 'sticky top-0',
      ].join(' ')}
    >
      <div className="mb-space-6 flex items-center gap-space-3">
        <span className="flex h-space-10 w-space-10 items-center justify-center rounded-md bg-accent-gradient font-display text-body-lg">
          {profile.initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-body font-medium text-text-primary">{profile.displayName}</p>
          <p className="truncate text-caption text-text-secondary">{profile.role}</p>
        </div>
        {drawer ? (
          <button type="button" onClick={onClose} className="text-text-secondary" aria-label="Close menu">
            <X className="h-space-5 w-space-5" />
          </button>
        ) : (
          <Menu className="h-space-5 w-space-5 text-text-secondary" />
        )}
      </div>

      <div className="mb-space-6 flex justify-center">
        <AvatarFrame size="desktop" showBadge />
      </div>

      <nav className="flex-1 space-y-space-1">
        {navItems.map((item) => {
          const Icon = navIcons[item.id]
          const isActive = active === item.id
          return (
            <a
              key={item.id}
              href={item.href}
              onClick={() => onNavigate?.(item.id)}
              className={[
                'flex items-center gap-space-3 rounded-lg px-space-4 py-space-3 text-body',
                isActive
                  ? 'bg-nav-active-fill text-text-primary'
                  : 'text-text-secondary hover:bg-surface-secondary',
              ].join(' ')}
            >
              <Icon
                className={['h-space-5 w-space-5', isActive ? 'text-accent-primary' : ''].join(' ')}
                strokeWidth={1.75}
              />
              {item.label}
            </a>
          )
        })}
      </nav>

      <div className="mt-auto pt-space-6">
        <p className="mb-space-3 text-caption text-text-secondary">Let&apos;s Connect</p>
        <div className="mb-space-6 flex gap-space-2">
          {connect.map(({ id, href, Mark }) => (
            <a
              key={id}
              href={href}
              className="flex h-space-10 w-space-10 items-center justify-center rounded-md bg-surface-pill text-text-primary"
            >
              <Mark className="h-space-5 w-space-5" />
            </a>
          ))}
        </div>
        <p className="text-micro text-text-tertiary">© {new Date().getFullYear()} {profile.displayName}</p>
      </div>
    </aside>
  )
}
