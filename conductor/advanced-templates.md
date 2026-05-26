# Advanced Template Ecosystem & Layout Engine

## Overview
This architecture scales the Resume Builder to support an ecosystem of highly diverse, visually distinct templates while preserving a unified underlying data schema. It implements configuration-driven rendering, dynamic block styling, and a live template gallery.

## Core Advancements

### 1. Robust Template Schema (`src/types/template.ts`)
The `ResumeTemplate` type was completely overhauled to define strict configuration constraints rather than just generic CSS variables.
- **Layout Definition**: Supports `single-column`, `two-column`, `grid`, `timeline`, and `magazine` topologies, alongside sidebar configuration.
- **Photo Configuration**: Controls visibility, required status, shape (`circle`, `square`, `rounded`), and position (`top`, `sidebar`, `banner`, `floating`).
- **Typography & Spacing**: Defines discrete scales and variables mapped down to standardized CSS properties.
- **Block Styling Variables**: Instructs blocks how to render (e.g., `sectionStyle: uppercase`, `experienceStyle: timeline`).

### 2. Comprehensive Template Registry (`src/templates/registry.ts`)
15 diverse templates were implemented, spanning multiple categories:
- **ATS & Minimal**: *ATS Single Column*, *Minimal Elegant*
- **Professional**: *Modern Professional*, *Compact Dense*, *Sidebar Profile*
- **Creative & Designer**: *Creative Designer*, *Portfolio Style*, *Timeline Resume*, *Magazine Style*, *Modern Card Layout*
- **Executive**: *Executive Corporate*, *Personal Brand*, *Dark Luxury*
- **Developer & Academic**: *Developer Resume*, *Traditional CV*, *Academic Research CV*

### 3. Dynamic Renderer & CSS Variable Injection
- `templateToCssVariables` (`src/templates/mapper.ts`) translates the strict configuration into standardized CSS Custom Properties (e.g., `--primary-color`, `--section-title-border-bottom`).
- `A4Page.tsx` injects these properties at the root level of each page, enabling descendant blocks to inherit them without explicitly importing template logic. This maintains perfect decoupling.

### 4. Layout Engine Extensibility
- `A4Page.tsx` currently applies a layout-specific class (e.g., `.layout-two-column`).
- The internal structure uses Flexbox and Grid, heavily leveraging `gap` powered by `--section-gap` and `--item-gap` to fluidly handle spacing changes during live template switches.
- **Pagination Safety**: The `usePagination` hook explicitly watches the `templateId` and triggers a debounced recalculation to ensure page boundaries remain accurate when margins and fonts change.

### 5. Photo Upload System
- `HeaderBlock.tsx` was enhanced to conditionally render a photo based on the active template's `photo.enabled` flag.
- Incorporates a native `FileReader` API for seamless inline uploads, saving the `photoUrl` directly into the Zustand store.
- Shape styling (`borderRadius`) is driven dynamically by the template configuration.

### 6. Template Gallery UI (`TemplateGallery.tsx`)
- A professional, categorized marketplace UI for templates.
- Includes instantaneous search and filtering by categories like "Professional", "Creative", and "Designer".
- Utilizes smooth hover animations, strict active state indicators, and realistic mock thumbnails.

## Future Extensibility & Scalability
- **True Multi-Column DnD**: To support dragging items specifically into a left or right sidebar, the layout engine will need to wrap columns in independent `SortableContext`s, referencing nested array layouts in the Zustand store (`layout.columns`).
- **Marketplace Readiness**: The strict `ResumeTemplate` typing means templates could easily be fetched from an external API, database, or created via a dedicated GUI Theme Editor.
- **Thumbnail Generation**: For realistic thumbnails, integrate a serverless function (like Puppeteer) or `html-to-image` on the client to snap the current resume state into a miniature preview when templates are created.
