# IPS West Bengal redesign

Static, dependency-free website. Serve `dist` with any static HTTP server (for example `python3 -m http.server 4173 --directory dist`). No build step. Deploy configuration is in `.openai/hosting.json`.

## Design and motion

Reference reviewed: https://ayurworld.org/ on 16 October 2026. The desktop hero uses Slider Revolution image layers: lateral entrances around 2.9 seconds, enlarged foreground layers entering from below with perspective rotations around 2.6 seconds, and slow linear lateral movement over 9 seconds. Divi and carousel components structure the sections below it. The initially narrow browser view did not show the hero artwork; desktop inspection did.

Adaptation: original ivory/forest-green pharmacology artwork, layered introductory reveal, ambient foreground particles, a sticky hero with scroll-driven image scale/translation and independently moving copy. A second pinned scene rotates a CSS molecular sculpture and switches through three content chapters. Scroll is native, without wheel interception. Transform/opacity updates are requestAnimationFrame-batched; sections reveal once with IntersectionObserver. The sculpture is decorative, not a chemically accurate model.

Reduced-motion mode removes pinning and parallax and presents all science chapters in normal flow. A pause control freezes decorative and scroll-driven motion; chapter buttons remain usable. Hover motion is limited to fine pointers. Mobile includes a keyboard-operable menu, visible focus states and smaller scenes.

## Content and destinations

Content source: https://www.ipswb.com/ inspected 16 October 2026. Society description, 33 state conferences, 5 national conferences, four organising committee names/photos, membership benefits, contact information and registration rates are taken or paraphrased from that source. Promotional headings are original editorial copy.

The source contains placeholder services, departments, testimonials and FAQs; these were omitted. Its registration form repeats a December day and conflicts with the registration windows, so no definitive conference dates are advertised. Rates are explicitly labelled with their published 16 April–31 October 2026 window. Membership fees were placeholders and are not displayed. Registration and brochure links go to the existing official site. Contact links open the visitor's mail or phone app; this site does not collect information or process payments.

## Assets

- `dist/assets/ips-logo.png`: supplied user logo, preserved.
- Committee portraits: sourced from IPSWB's doctors-1 through doctors-4 assets.
- `dist/assets/molecular-hero.png`: generated with the built-in image generation tool. Prompt: “Premium medical research website hero, landscape 1536x1024. Exquisite editorial 3D scientific still life: satin forest-green and translucent frosted jade spheres connected by delicate brushed pale gold rods, suspended in air; one subtle translucent glass capsule; warm ivory #f6f4ed background; subject on right 60%, left 40% negative space; realistic studio lighting; no text, logos or watermark. Abstract pharmacology art, not a chemically accurate diagram.”
- Fonts: Google Fonts DM Sans and Manrope; system fallbacks included.

## Verification

JS syntax check; desktop 1440×900 and mobile 390×844 browser inspection; no horizontal overflow; all image assets loaded; navigation, chapter selection and delegate fee selection verified; no browser console errors. Reduced-motion CSS/JS reviewed. Real-device and assistive-technology testing remain advisable before replacing the production site.
