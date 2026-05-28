export function getMangaInfo(manga: any) {
  if (!manga) return { title: '', description: '', coverImageUrl: '', proxyImageUrl: '' }

  const attributes = manga.attributes || {}
  const relationships = manga.relationships || []

  const title =
    attributes.altTitles?.find((t: any) => t.vi)?.vi ||
    attributes.title?.en ||
    attributes.title?.ja ||
    attributes.title?.['ja-ro'] ||
    'Không rõ tiêu đề'

  const subTitle =
    attributes.altTitles?.find((t: any) => t.en)?.en ||
    attributes.altTitles?.find((t: any) => t.ja)?.ja ||
    attributes.altTitles?.find((t: any) => t['ja-ro'])?.['ja-ro'] ||
    ''

  const description =
    attributes.description?.vi ||
    attributes.description?.en ||
    'Không có mô tả.'

  const coverArt = relationships.find((rel: any) => rel.type === 'cover_art')
  const coverArtFileName = coverArt?.attributes?.fileName
  const coverImageUrl = coverArtFileName
    ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArtFileName}`
    : ''
  const proxyImageUrl = coverImageUrl ? `/api/image?url=${encodeURIComponent(coverImageUrl)}` : ''

  return { title, subTitle, description, coverImageUrl, proxyImageUrl }
}
