import avatar from "../assets/webp/avatar.webp";
import workstation from "../assets/webp/workstation.webp";
import workstation400 from "../assets/webp/workstation-400.webp";
import projectAnalytics from "../assets/webp/project-analytics.webp";
import projectAnalytics320 from "../assets/webp/project-analytics-320.webp";
import projectFinance from "../assets/webp/project-finance.webp";
import projectFinance320 from "../assets/webp/project-finance-320.webp";
import projectKanban from "../assets/webp/project-kanban.webp";
import projectKanban320 from "../assets/webp/project-kanban-320.webp";
import galleryPortrait from "../assets/webp/gallery-portrait.webp";
import galleryPortrait200 from "../assets/webp/gallery-portrait-200.webp";
import galleryHouse from "../assets/webp/gallery-house.webp";
import galleryHouse200 from "../assets/webp/gallery-house-200.webp";
import galleryGeo from "../assets/webp/gallery-geo.webp";
import galleryGeo200 from "../assets/webp/gallery-geo-200.webp";
import galleryGeo80 from "../assets/webp/gallery-geo-80.webp";
import gallerySign from "../assets/webp/gallery-sign.webp";
import gallerySign200 from "../assets/webp/gallery-sign-200.webp";
import galleryHeart from "../assets/webp/gallery-heart.webp";
import galleryHeart200 from "../assets/webp/gallery-heart-200.webp";
import gallerySunset from "../assets/webp/gallery-sunset.webp";
import gallerySunset200 from "../assets/webp/gallery-sunset-200.webp";
import gallerySunset80 from "../assets/webp/gallery-sunset-80.webp";
import albumLofi from "../assets/webp/album-lofi.webp";
import albumLofi200 from "../assets/webp/album-lofi-200.webp";
import albumLofi80 from "../assets/webp/album-lofi-80.webp";

export const profile = {
  firstName: "Shrey",
  lastName: "Saraswat",
  displayName: "Shrey Saraswat",
  handle: "Frontend Developer — React & Angular",
  initials: "SS",
  role: "Frontend Developer — React & Angular",
  tagline: "Product-UI engineer — specs and Figma to working, API-integrated interfaces.",
  greeting: "Hello, I'm",
  description:
    "Cross-framework (React/Angular) product-UI engineer with strong API-integration and bug-resolution discipline, currently doing high-fidelity responsive/design-system work in a fintech-lending product.",
  about:
    "B.Tech in Mechanical Engineering from GLA University (2015–2019). I worked as a Senior Executive in 3D Design at UNO Minda Groups, then moved into software. Since 2021 I have owned frontend delivery on client products across telecom-regulatory, payments, blockchain, supply-chain, EdTech, and mortgage-lending domains — turning specs and Figma into working, API-integrated interfaces.",
  birthday: "~4.5 years in software",
  location: "Gurugram, India",
  joinedOn: "Software work since 2021",
  email: "",
  available: false,
  cvUrl: "#",
};

export const socials = [
  {
    id: "facebook",
    label: "Facebook",
    handle: "On request",
    href: "#",
    variant: "facebook",
  },
  {
    id: "github",
    label: "GitHub",
    handle: "On request",
    href: "#",
    variant: "github",
  },
  {
    id: "figma",
    label: "Figma",
    handle: "On request",
    href: "#",
    variant: "figma",
  },
  {
    id: "instagram",
    label: "Instagram",
    handle: "On request",
    href: "#",
    variant: "instagram",
  },
  {
    id: "email",
    label: "Email",
    handle: "On request",
    href: "#",
    variant: "email",
  },
  {
    id: "devto",
    label: "Dev.to",
    handle: "On request",
    href: "#",
    variant: "devto",
  },
];

export const navItems = [
  { id: "home", label: "Home", href: "#home" },
  { id: "about", label: "About Me", href: "#about" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "skills", label: "Skills", href: "#skills" },
  { id: "experience", label: "Experience", href: "#experience" },
  { id: "blog", label: "More work", href: "#blog" },
  { id: "contact", label: "Contact", href: "#contact" },
];

export const infoStats = [
  {
    id: "experience",
    label: "Software experience",
    value: "~4.5 years",
    icon: "calendar",
  },
  {
    id: "role",
    label: "Profession",
    value: "Product UI engineer",
    icon: "briefcase",
  },
  { id: "location", label: "Location", value: profile.location, icon: "pin" },
  {
    id: "frameworks",
    label: "UI frameworks",
    value: "React & Angular",
    icon: "cake",
  },
];

export const primarySkills = [
  "React JS",
  "JavaScript",
  "HTML5",
  "CSS3",
  "Redux",
  "Redux Toolkit",
  "Angular",
  "TypeScript",
  "Git",
  "GitLab",
  "REST APIs",
  "Postman",
];

export const secondarySkills = [
  "Node.js",
  "MongoDB",
  "PostgreSQL",
  "Web3.js",
  "MetaMask",
  "JWT",
  "Razorpay",
  "React Hook Form",
  "Yup",
  "Recharts",
  "Chart.js",
  "Material UI",
];

export const skills = [...primarySkills, ...secondarySkills];

export const skillBalance = { design: 42, development: 58 };

export const achievements = [
  { id: "years", value: "~4.5", label: "Years", icon: "star" },
  { id: "products", value: "15+", label: "Products", icon: "briefcase" },
  { id: "domains", value: "6+", label: "Domains", icon: "users" },
  { id: "frameworks", value: "2", label: "Frameworks", icon: "heart" },
];

export const experience = [
  {
    id: "exp-wizni",
    role: "Web Developer",
    company: "Wizni (Arive)",
    period: "From Nov 2025",
    shortDate: "Nov 2025",
    blurb: "UI fidelity and bug-resolution on ARIVE (mortgage LOS/POS).",
    summary:
      "Frontend work on ARIVE, a US mortgage LOS/POS product — UI fidelity, responsiveness, and bug-resolution in an established Angular codebase, including VA/FHA/HECM breakpoint conversion and Document Folders.",
  },
  {
    id: "exp-teledgers",
    role: "Junior Engineer – L1",
    shortRole: "Jr. Engineer – L1",
    company: "Teledgers Technology",
    period: "Feb 2023 – Apr 2025",
    shortDate: "Feb 2023",
    blurb: "Frontend delivery on QTL-DLT, TRACEYARN, and related products.",
    summary:
      "Owned frontend delivery on client products including QTL-DLT (Angular TRAI DLT compliance), TRACEYARN (React supply-chain traceability), MAT/TELKOSH campaign tooling, NODE TRACING, and SMS-PORTAL — API-integrated UI, client demos, and QA-cycle fixes.",
  },
  {
    id: "exp-blockcube",
    role: "Junior Associate Software Engineer",
    shortRole: "Jr. Associate Software Engineer",
    company: "Blockcube Technology Limited",
    period: "2022 – 2023",
    shortDate: "2022",
    blurb: "React, Redux, and Web3/MetaMask UI on client products.",
    summary:
      "Worked on frontend for TOKEN INFRA, CRYPTO DIRECTORY, CELENFT, and TELECOM TAP — React, Redux, and Web3/MetaMask UI.",
  },
  {
    id: "exp-unominda",
    role: "Senior Executive (3D Design)",
    shortRole: "Sr. Executive (3D Design)",
    company: "UNO Minda Groups",
    period: "Jul 2019 – Dec 2020",
    shortDate: "Jul 2019",
    blurb: "3D/CATIA design at an automotive OEM supplier.",
    summary:
      "3D/CATIA design engineer at an automotive OEM supplier, before moving into software.",
  },
];

export const certifications = [
  {
    id: "supp-tokeninfra",
    title: "TOKEN INFRA",
    issuer: "Blockchain / Web3",
    year: "2021–2022",
  },
  {
    id: "supp-edcert",
    title: "EDCERT / EDCIL",
    issuer: "EdTech / KYC",
    year: "2022",
  },
  {
    id: "supp-sms",
    title: "SMS-PORTAL",
    issuer: "SMS reporting · Node.js",
    year: "2023–2024",
  },
  {
    id: "supp-node",
    title: "NODE TRACING",
    issuer: "Telecom · Node.js / MongoDB",
    year: "2024",
  },
];

export const projects = [
  {
    id: "qtl-dlt",
    title: "QTL-DLT",
    stack: "Angular · TypeScript · TRAI DLT compliance",
    summary:
      "Telecom DLT platform for Principal Entities, Telemarketers, and templates — PE-TM chain approval, Razorpay + dynamic TDS, and a 10-scenario PAN/TAN resubmission matrix.",
    image: projectAnalytics,
    imageSmall: projectAnalytics320,
    href: "#",
  },
  {
    id: "traceyarn",
    title: "TRACEYARN",
    stack: "React · Redux · Supply-chain QR traceability",
    summary:
      "0-to-1 textile traceability UI — repo scaffolding, routing, Redux, manufacturer/retailer dashboards, and QR batch provenance, through client demos and later revival.",
    image: projectKanban,
    imageSmall: projectKanban320,
    href: "#",
  },
  {
    id: "arive",
    title: "ARIVE (Wizni)",
    stack: "Angular · TypeScript · Mortgage LOS/POS",
    summary:
      "UI-fidelity and bug-resolution on an established US mortgage LOS/POS product — VA/FHA/HECM desktop-to-mobile conversion and Document Folders drag-and-drop classification.",
    image: projectFinance,
    imageSmall: projectFinance320,
    href: "#",
  },
];

export const gallery = [
  { id: "g1", src: galleryPortrait, srcSmall: galleryPortrait200, alt: "Portrait study", tab: "photos" },
  { id: "g2", src: galleryHouse, srcSmall: galleryHouse200, alt: "House under open sky", tab: "photos" },
  { id: "g3", src: galleryGeo, srcSmall: galleryGeo200, alt: "Geometric composition", tab: "photos" },
  { id: "g4", src: gallerySign, srcSmall: gallerySign200, alt: "Minimal signage", tab: "photos" },
  { id: "g5", src: galleryHeart, srcSmall: galleryHeart200, alt: "Soft heart study", tab: "photos" },
  { id: "g6", src: gallerySunset, srcSmall: gallerySunset200, alt: "Sunset clouds", tab: "photos" },
];

export const videos = [
  { id: "v1", src: projectAnalytics, srcSmall: projectAnalytics320, alt: "Product walkthrough" },
  { id: "v2", src: workstation, srcSmall: workstation400, alt: "Desk setup" },
  { id: "v3", src: projectKanban, srcSmall: projectKanban320, alt: "Workspace demo" },
  { id: "v4", src: gallerySunset, srcSmall: gallerySunset200, alt: "Mood reel" },
  { id: "v5", src: projectFinance, srcSmall: projectFinance320, alt: "App preview" },
  { id: "v6", src: galleryGeo, srcSmall: galleryGeo200, alt: "Motion study" },
];

export const tracks = [
  {
    id: "t1",
    title: "Chill Lofi Beats",
    artist: "Night Desk",
    duration: "2:48",
    cover: albumLofi,
    coverMedium: albumLofi200,
    coverThumb: albumLofi80,
    playing: true,
  },
  {
    id: "t2",
    title: "Sunset Drive",
    artist: "Amber Hours",
    duration: "3:12",
    cover: gallerySunset,
    coverMedium: gallerySunset200,
    coverThumb: gallerySunset80,
  },
  {
    id: "t3",
    title: "Midnight Thoughts",
    artist: "Violet Room",
    duration: "2:05",
    cover: galleryGeo,
    coverMedium: galleryGeo200,
    coverThumb: galleryGeo80,
  },
];

export const tabs = ["All", "Photos", "Music", "Videos"];

export const assets = {
  avatar,
  workstation,
  workstation400,
  albumLofi,
};

export const bioLines = [
  { emoji: "👨‍💻", text: "Product UI engineer — React & Angular" },
  { emoji: "📍", text: profile.location },
  { emoji: "🎓", text: "Mechanical Engineering → software" },
];
