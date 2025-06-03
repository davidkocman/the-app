type PlatformType = {
  icon: string
  name: string
}

const Platform = Object({
  186: { icon: 'sports_esports', name: 'Xbox Series S/X' },
  4: { icon: 'desktop_windows ', name: 'PC' },
  187: { icon: 'sports_esports ', name: 'PlayStation 5' }
})

const platformData = (id: number): PlatformType | null => {
  return Platform[id] || null
}

export { platformData }
