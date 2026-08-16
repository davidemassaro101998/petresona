/**
 * Source: https://21st.dev/@dillionverma/components/interactive-hover-button
 * Real upstream source verified at: https://github.com/magicuidesign/magicui
 *   (apps/www/registry/magicui/interactive-hover-button.tsx)
 * Imported from the real MagicUI component source, unmodified except:
 *   - added `href`/`onClick`/`asChild`-style dual rendering (as an <a> when
 *     `href` is passed, a <button> otherwise) since ResonaPet's CTAs need to
 *     both navigate (to richiedi-accesso) and submit a form — the original
 *     is a bare <button>.
 *   - ResonaPet copper dot / ivory text colors are supplied via the
 *     existing `className` prop at call sites, using the same
 *     group-hover mechanics as the original (dot scale, text slide/fade).
 * The core interaction (dot that blooms to fill the button on hover, label
 * that slides out while a second label+arrow slides in) is unchanged.
 */
import { ArrowRight } from "lucide-react"
import { forwardRef } from "react"

import { cn } from "@/lib/utils"

type CommonProps = {
  children: React.ReactNode
  className?: string
}

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }
type ButtonAsLink = CommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

type InteractiveHoverButtonProps = ButtonAsButton | ButtonAsLink

export const InteractiveHoverButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  InteractiveHoverButtonProps
>(({ children, className, ...props }, ref) => {
  const sharedClassName = cn(
    "group bg-background relative w-auto cursor-pointer overflow-hidden rounded-full border p-2 px-6 text-center font-semibold",
    "min-h-[52px] inline-flex items-center justify-center active:scale-[0.97] transition-transform",
    className
  )

  const content = (
    <>
      <div className="flex items-center justify-center gap-2">
        <div className="bg-primary h-2 w-2 rounded-full transition-all duration-[280ms] group-hover:scale-[100.8]"></div>
        <span className="inline-block transition-all duration-[280ms] group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div className="text-primary-foreground absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-[280ms] group-hover:-translate-x-5 group-hover:opacity-100">
        <span>{children}</span>
        <ArrowRight className="transition-transform duration-[280ms] group-hover:translate-x-1" />
      </div>
    </>
  )

  if ("href" in props && props.href) {
    const { href, ...rest } = props as ButtonAsLink
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={sharedClassName}
        {...rest}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={sharedClassName}
      {...(props as ButtonAsButton)}
    >
      {content}
    </button>
  )
})
InteractiveHoverButton.displayName = "InteractiveHoverButton"
