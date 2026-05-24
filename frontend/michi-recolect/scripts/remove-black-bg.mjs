import sharp from 'sharp'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { rename, unlink } from 'node:fs/promises'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const ITEM_SIZE = 56

const ITEM_ASSETS = [
  { path: 'src/assets/coin.png', threshold: 48 },
  { path: 'src/assets/chest.png', threshold: 52 },
  { path: 'src/assets/star.png', threshold: 48 },
  { path: 'src/assets/icon-info.png', threshold: 48 },
  { path: 'src/assets/michi-player.png', threshold: 40, resize: false },
  { path: 'src/assets/michi-celebrating.png', threshold: 40, resize: false },
  { path: 'src/assets/michi-saving.png', threshold: 40, resize: false },
]

async function removeBlackBackground(relativePath, threshold = 48, resize = true) {
  const absolutePath = join(root, relativePath)
  const tempPath = `${absolutePath}.tmp.png`

  const { data, info } = await sharp(absolutePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    if (r <= threshold && g <= threshold && b <= threshold) {
      data[i + 3] = 0
    }
  }

  let pipeline = sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })

  if (resize) {
    pipeline = pipeline.resize(ITEM_SIZE, ITEM_SIZE, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
  }

  await pipeline.png().toFile(tempPath)

  await unlink(absolutePath).catch(() => undefined)
  await rename(tempPath, absolutePath)

  console.log(`Listo: ${relativePath}${resize ? ` (${ITEM_SIZE}px)` : ''}`)
}

for (const asset of ITEM_ASSETS) {
  await removeBlackBackground(asset.path, asset.threshold, asset.resize !== false)
}
