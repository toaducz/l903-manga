import { Manga } from '@/codebase/api/paginate'

export function getMangaInfo(manga: Manga | null | undefined) {
  if (!manga) return { title: '', subTitle: '', description: '', coverImageUrl: '', proxyImageUrl: '' }

  const attributes = manga.attributes || {}
  const relationships = manga.relationships || []

  const title =
    attributes.altTitles?.find((t) => t.vi)?.vi ||
    attributes.title?.en ||
    attributes.title?.ja ||
    attributes.title?.['ja-ro'] ||
    'Không rõ tiêu đề'

  const subTitle =
    attributes.altTitles?.find((t) => t.en)?.en ||
    attributes.altTitles?.find((t) => t.ja)?.ja ||
    attributes.altTitles?.find((t) => t['ja-ro'])?.['ja-ro'] ||
    ''

  const description =
    attributes.description?.vi ||
    attributes.description?.en ||
    'Không có mô tả.'

  const coverArt = relationships.find((rel) => rel.type === 'cover_art')
  const coverArtFileName = coverArt?.attributes?.fileName
  const coverImageUrl = coverArtFileName
    ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArtFileName}`
    : ''
  const proxyImageUrl = coverImageUrl ? `/api/image?url=${encodeURIComponent(coverImageUrl)}` : ''

  return { title, subTitle, description, coverImageUrl, proxyImageUrl }
}
