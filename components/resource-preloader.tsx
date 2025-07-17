import Head from "next/head"

export interface PreloadResource {
  /**
   * Path or URL of the resource to preload.
   */
  href: string
  /**
   * Hint to the browser about the resource type.
   * Defaults to "script".
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload#the_as_attribute
   */
  as?: "script" | "style" | "font" | "image" | "fetch"
  /**
   * Optional `type` attribute (e.g. "font/woff2").
   */
  type?: string
}

/**
 * Injects <link rel="preload"> tags for critical resources.
 * Can be used in any Server Component (e.g. app/layout.tsx).
 */
export function ResourcePreloader({
  resources = [],
}: {
  resources?: PreloadResource[]
}) {
  if (resources.length === 0) return null

  return (
    <Head>
      {resources.map(({ href, as = "script", type }) => (
        <link key={href} rel="preload" href={href} as={as} {...(type ? { type } : {})} />
      ))}
    </Head>
  )
}
