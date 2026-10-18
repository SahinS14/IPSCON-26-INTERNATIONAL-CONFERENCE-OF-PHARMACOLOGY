# IPSCON ’26 — International Conference of Pharmacology

A responsive conference website developed as a **freelance project for the Indian Pharmacological Society, West Bengal Chapter**. The site presents conference information, registration guidance, and delegate-facing interfaces for IPSCON ’26 in Kolkata.

**Developer:** [Sahin Pradhan](https://github.com/SahinS14)  
**Engagement:** Freelance web development  
**Stack:** HTML5 · CSS3 · Vanilla JavaScript  
**Delivery:** Static website with no framework, package installation, or build step

## Project overview

The project brings the conference's information into one visual experience: event highlights, the organising team, registration categories, venue information, and ways to contact the organisers. Separate account and delegate pages extend that experience beyond the landing page.

The design uses Kolkata-inspired imagery, typography, video, and motion to give the conference a distinct identity while keeping navigation and key information accessible across screen sizes.

## My contribution

As the freelance developer, I implemented the website's frontend, including:

- Responsive page layouts and reusable visual styles for the conference and delegate pages.
- Interactive navigation, event countdowns, registration rate displays, and enquiry interactions.
- Video-led hero sections, scroll-driven effects, reveal animations, and loading transitions.
- Registration and account form interfaces with browser-side validation and feedback.
- Delegate dashboard interfaces for instructions, abstracts, profile details, and password changes.
- A readable HTML, CSS, and JavaScript codebase with separate folders for styles, scripts, and media.
- Static deployment preparation and verification of local page, stylesheet, script, and image references.

## Features

| Area | Implementation |
| --- | --- |
| Conference landing page | Event presentation, countdown, conference content, organising team, and contact information |
| Responsive navigation | Mobile menu with keyboard dismissal and accessible expanded-state updates |
| Visual storytelling | Kolkata imagery, hero video, scroll interactions, and animated section reveals |
| Registration | Delegate categories, payment guidance, receipt type and size validation |
| Account pages | Login, signup, password visibility controls, and field validation |
| Delegate dashboard | Instructions, abstract interface, profile editing, and password interface |
| Accessibility considerations | Semantic markup, labelled controls, form error feedback, and reduced-motion handling |

## Technical approach

The site uses native browser capabilities rather than a frontend framework. CSS handles responsive layouts and presentation; JavaScript adds focused interactions through DOM events, `IntersectionObserver`, `requestAnimationFrame`, and media queries.

Styles and scripts are separated by page or feature so the code can be reviewed and maintained without reading a single compressed file. Images and videos live in one assets directory, and existing page URLs remain simple HTML paths.

This project demonstrates frontend implementation for a client brief, responsive interface development, browser API usage, and static hosting delivery.

## Repository structure

```text
public/                         # Website document root
├── index.html                  # Conference landing page
├── register.html               # Registration page
├── login.html                  # Login interface
├── signup.html                 # Signup interface
├── dashboard.html              # Delegate instructions
├── dashboard-abstract.html     # Abstract interface
├── dashboard-profile.html      # Profile interface
├── dashboard-password.html     # Password interface
├── css/                        # Main, page, and feature stylesheets
├── js/                         # Page interactions and animation scripts
└── assets/                     # Images, logos, and videos
```

## View locally

Clone the repository and open `public/index.html` in a browser. For the most reliable video playback and account-page navigation, serve `public/` using any static web server, such as your editor's Live Server extension.

No npm dependencies or compilation are required.

## Deploy

Set **`public/` as the hosting document root**, or upload everything inside it to your host's web directory. Keep the `css/`, `js/`, and `assets/` folders alongside `index.html`.

- HTML loads styles from `css/`, scripts from `js/`, and media from `assets/`.
- CSS loads media using `../assets/`, relative to the stylesheet location.
- No build command is needed.

## Implementation scope

This repository contains the static frontend. Login currently opens a preview dashboard; dashboard information is stored in the browser. Signup and registration provide helpdesk guidance rather than creating server-side records.

Production authentication, payment verification, receipt uploads, password changes, and abstract submission processing require backend integration. The interfaces in this repository should not be interpreted as completed backend services.

## Credits

Developed by [Sahin Pradhan](https://github.com/SahinS14) as a freelance project for the **Indian Pharmacological Society, West Bengal Chapter**. Conference branding and supplied media remain associated with their respective owners.
