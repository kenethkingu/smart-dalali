# Proland — Advanced Animation Components (Named, Real, Curated)

The prior animation sections described *behaviors* in prose. This gives Claude Code the actual, currently-dominant component ecosystem to pull from instead of hand-rolling everything — three libraries lead this space in 2026, with 100+ battle-tested effects between them. But most of what they're famous for is wrong for Proland's brand, so this is a curated list, not "install whatever looks cool."

## The three libraries, what each is actually for

| Library | Character | Install |
|---|---|---|
| **react-bits** | Fastest-growing (#3 in JS Rising Stars 2025, 26K new GitHub stars) — 110+ fully *structurally* customizable components, not just styled. Best text-effect collection of the three. | `npx jsrepo add` or copy-paste per component (ships JS/TS, CSS/Tailwind variants — [reactbits.dev](https://reactbits.dev)) |
| **Aceternity UI** | Bold, cinematic, dark-mode-leaning effects — 3D cards, spotlights, parallax. The one people mean when they say "make it like that landing page." | `npx shadcn@latest add @aceternity/<component>` |
| **Magic UI** | 150+ polished, opinionated, drop-in components built on shadcn + Motion — marquees, bento grids, animated beams. | shadcn CLI, same pattern |

All three are free/open-source, shadcn-compatible, and installable directly into the existing project structure.

## Use these — brand-consistent, mapped to real Proland components

| Component (library) | Where it goes | Brand constraint |
|---|---|---|
| **3D Card Effect** / **Card Spotlight** (Aceternity) | `PropertyCard` — replaces the hand-rolled tilt from the original animation spec | Spotlight glow color = `--pl-accent` green only, not the library's default multi-color |
| **Glowing Effect** (Aceternity — "the border glow that adapts to any container, as seen on Cursor's website") | Featured/Sponsored `PropertyCard` variant | Glow color locked to `--pl-accent`, not a rainbow sweep |
| **Direction Aware Hover** (Aceternity) | Alternative/addition to card tilt for the "Why Proland" trust cards — content slides in from whichever edge the cursor entered | Keep to ink/white only, no color shift |
| **SplitText, BlurText** (react-bits) | Headline and section-title reveals — this is the actual component backing what `PROLAND_TEXT_ANIMATIONS.md` described by hand | Use as-is, these are structural (motion), not color effects |
| **ShinyText** (react-bits — "metallic shine sweep, popular for premium SaaS CTAs") | The one-word shimmer treatment already spec'd in `PROLAND_TEXT_ANIMATIONS.md` Section 3 | Recolor the sweep to ink→accent→ink, not the default metallic multi-tone |
| **GradientText** (react-bits) | Same shimmer use case as ShinyText — pick one of the two, don't ship both doing the same job | Two-stop gradient only: `--pl-ink` to `--pl-accent` |
| **Tracing Beam** (Aceternity — a line that traces down the page marking scroll progress) | The About page, and the Owner property-upload multi-step form — a real functional fit, not just decoration, since both are longer scrollable/sequential content | Beam color = `--pl-accent`, thin, not glowing/neon |
| **Infinite Moving Cards** (Aceternity) | A testimonials marquee, if/when testimonials get added to the About page (named in the earlier real-estate research as part of the standard About-page skeleton) | Cards use the existing hairline-border card style from `PROLAND_DESIGN.md`, not the library's default shadow-heavy card |
| **Magnetic Button** (Aceternity) | Primary CTAs specifically — the hero Search button, "Request Site Visit," "List Your Property" — button subtly pulls toward the cursor as it approaches | No color dependency, safe as-is |
| **Timeline** (Aceternity) | A real fit for the "How Proland Works" section redesign (already flagged for a fix in `PROLAND_DESIGN.md` Section 3) — vertical timeline instead of the generic numbered-circle row | Ink/accent only |
| **Pointer Highlight** or **Container Text Flip** (Aceternity) | Alternative techniques for the rotating hero word from `PROLAND_TEXT_ANIMATIONS.md` Section 1 — worth comparing against the hand-rolled `AnimatePresence` version and picking whichever reads cleaner | Same fixed-width/layout-stability rules from that section still apply regardless of which implementation wins |

## Skip these — popular, well-built, wrong fit for this brand

Naming these explicitly so they don't get pulled in just because they're sitting in the same library, one click away:

- **Aurora Background, Wavy Background, Background Gradient Animation, Lamp Effect** — all beautiful, all multi-color by design. Directly contradicts the monochrome/one-accent system.
- **Metallic Paint, Balatro, Holographic/Diamond glare modes on GlareCard** — gem-like, iridescent, rainbow-shifting. Belongs on an NFT gallery or creative portfolio, not a property-booking platform.
- **Ballpit, Blob Cursor, Splash Cursor, Antigravity, Confetti-style backgrounds** — playful/toy-like. Wrong emotional register for a high-stakes purchase decision.
- **Sparkles, Evervault Card** (reveals "encrypted text" on hover — a developer/hacker-culture visual joke that means nothing in a real estate context).
- **Floating Dock** (macOS-style magnifying icon dock) — novel, but reads as a portfolio-site gimmick on a navbar, not appropriate for Proland's navigation.
- **Comet Card, GitHub Globe, 3D Marquee, Macbook Scroll** — all well-built, all solving a problem Proland doesn't have.

If a future page genuinely needs something not on the "use" list above, check it against `PROLAND_DESIGN.md` Section 7's ban list and Section 1's locked direction before adding it — the question is never "does this library have something cool for this," it's "does this specific effect survive contact with the black/white/one-accent system."

## Going further — react-three-fiber (mention, not a requirement)

For genuine 3D/WebGL (an interactive 3D render of the roof-mark logo, a subtle depth-of-field property image viewer), `react-three-fiber` is the real tool, not any of the three libraries above. **Deliberately not speccing this in as a requirement** — it adds real bundle weight and GPU/battery cost, and a meaningful share of Proland's actual users are on mobile connections in Tanzania where that cost is felt more than it would be for a typical SaaS audience. If it comes up later as a specific, narrow idea (e.g. just the logo), evaluate that one instance on its own merits rather than adopting the library broadly.
