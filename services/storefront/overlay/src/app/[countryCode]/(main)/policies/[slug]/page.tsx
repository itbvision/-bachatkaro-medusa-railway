import { Metadata } from "next"
import { notFound } from "next/navigation"
import { POLICIES } from "@lib/policies"
import { SITE } from "@lib/site-config"

type Props = { params: Promise<{ countryCode: string; slug: string }> }

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params
  const policy = POLICIES[slug]
  return { title: policy ? `${policy.title} | Bachat Karo Mart` : "Policy" }
}

export default async function PolicyPage(props: Props) {
  const { slug } = await props.params
  const policy = POLICIES[slug]
  if (!policy) notFound()

  return (
    <article lang="en" dir="ltr" className="mx-auto max-w-3xl px-4 py-8 font-sans">
      <h1 className="font-display text-2xl font-bold text-bk-navy">{policy.title}</h1>
      <p className="mt-1 text-sm text-stone-600">Last updated: {SITE.lastUpdated}</p>
      {policy.sections.map((s, i) => (
        <section key={s.heading} className="mt-6">
          <h2 className="font-display text-lg font-bold text-bk-navy">{i + 1}. {s.heading}</h2>
          {s.body.map((para) => (
            <p key={para} className="mt-2 leading-relaxed text-stone-800">{para}</p>
          ))}
        </section>
      ))}
    </article>
  )
}
