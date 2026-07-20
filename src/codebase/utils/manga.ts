import { Manga } from '@/codebase/api/paginate'

export function getMangaInfo(manga: Manga | null | undefined) {
  if (!manga) return { title: '', subTitle: '', description: '', coverImageUrl: '', coverFullUrl: '', proxyImageUrl: '' }

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
  
  // Tải thumbnail 256px từ CDN MangaDex (siêu nhẹ ~20-50KB thay vì 2-5MB)
  const coverImageUrl = coverArtFileName
    ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArtFileName}.256.jpg`
    : ''
  
  const coverFullUrl = coverArtFileName
    ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArtFileName}`
    : ''

  // Chuyển proxyImageUrl trỏ trực tiếp đến coverImageUrl để loại bỏ các serverless function request
  const proxyImageUrl = coverImageUrl

  return { title, subTitle, description, coverImageUrl, coverFullUrl, proxyImageUrl }
}
