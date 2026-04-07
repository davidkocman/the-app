type PlatformType = {
  icon: string
  name: string
}

const slugMap: Record<string, PlatformType> = {
  // PC / Desktop
  pc: { icon: 'mdi-microsoft-windows', name: 'PC' },
  mac: { icon: 'mdi-apple', name: 'macOS' },
  linux: { icon: 'mdi-linux', name: 'Linux' },
  web: { icon: 'mdi-web', name: 'Web' },

  // PlayStation
  playstation5: { icon: 'mdi-sony-playstation', name: 'PlayStation 5' },
  playstation4: { icon: 'mdi-sony-playstation', name: 'PlayStation 4' },
  playstation3: { icon: 'mdi-sony-playstation', name: 'PlayStation 3' },
  playstation2: { icon: 'mdi-sony-playstation', name: 'PlayStation 2' },
  playstation: { icon: 'mdi-sony-playstation', name: 'PlayStation' },
  'ps-vita': { icon: 'mdi-sony-playstation', name: 'PS Vita' },
  psp: { icon: 'mdi-sony-playstation', name: 'PSP' },

  // Xbox
  'xbox-series-x': { icon: 'mdi-microsoft-xbox', name: 'Xbox Series S/X' },
  'xbox-one': { icon: 'mdi-microsoft-xbox', name: 'Xbox One' },
  xbox360: { icon: 'mdi-microsoft-xbox', name: 'Xbox 360' },
  xbox: { icon: 'mdi-microsoft-xbox', name: 'Xbox' },

  // Nintendo
  'nintendo-switch': { icon: 'mdi-nintendo-switch', name: 'Nintendo Switch' },
  'nintendo-3ds': { icon: 'mdi-gameboy', name: 'Nintendo 3DS' },
  'nintendo-ds': { icon: 'mdi-gameboy', name: 'Nintendo DS' },
  'nintendo-dsi': { icon: 'mdi-gameboy', name: 'Nintendo DSi' },
  'wii-u': { icon: 'mdi-nintendo-game-boy', name: 'Wii U' },
  wii: { icon: 'mdi-nintendo-game-boy', name: 'Wii' },
  gamecube: { icon: 'mdi-nintendo-game-boy', name: 'GameCube' },
  n64: { icon: 'mdi-nintendo-game-boy', name: 'Nintendo 64' },
  snes: { icon: 'mdi-nintendo-game-boy', name: 'SNES' },
  nes: { icon: 'mdi-nintendo-game-boy', name: 'NES' },
  'game-boy-advance': { icon: 'mdi-gameboy', name: 'Game Boy Advance' },
  'game-boy-color': { icon: 'mdi-gameboy', name: 'Game Boy Color' },
  'game-boy': { icon: 'mdi-gameboy', name: 'Game Boy' },

  // Mobile
  ios: { icon: 'mdi-apple-ios', name: 'iOS' },
  android: { icon: 'mdi-android', name: 'Android' },
}

const platformData = (slug: string): PlatformType | null => {
  return slugMap[slug] ?? null
}

export { platformData }
