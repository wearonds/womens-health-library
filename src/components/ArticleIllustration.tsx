export const articleIllustrations = {
  'uterine-fibroids': {
    src: '/illustrations/uterine-fibroids.png',
    alt: 'ภาพแผนผังมดลูก ท่อนำไข่ และรังไข่ โดยมีก้อนสีม่วงเป็นตัวอย่างเนื้องอกในผนังมดลูก',
    caption: 'ก้อนสีม่วงเป็นตัวอย่างเนื้องอกในผนังมดลูก ตำแหน่งและขนาดจริงอาจแตกต่างกัน ภาพนี้ใช้ประกอบการเรียนรู้ ไม่ใช้แทนผลตรวจอัลตราซาวด์',
    width: 1448,
    height: 1086,
  },
} as const

export function ArticleIllustration({ slug }: { slug: string }) {
  const illustration = articleIllustrations[slug as keyof typeof articleIllustrations]
  if (!illustration) return null
  return (
    <figure className="article-illustration">
      <img src={illustration.src} alt={illustration.alt} width={illustration.width} height={illustration.height} loading="lazy" decoding="async" />
      <figcaption>{illustration.caption}</figcaption>
    </figure>
  )
}
