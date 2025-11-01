export type CompanyInfo = {
  name: string
  description: string
}

const COMPANIES: Record<string, CompanyInfo> = {
  adobe: {
    name: "Adobe",
    description:
      "Adobe empowers creators and businesses with world‑class digital design and document tools. From Photoshop to Acrobat, we help bring ideas to life and drive creative transformation.",
  },
  google: {
    name: "Google",
    description:
      "Google builds helpful products powered by cutting‑edge AI and cloud infrastructure. Our mission is to organize the world’s information and make it universally accessible and useful.",
  },
  tesla: {
    name: "Tesla",
    description:
      "Tesla accelerates the world’s transition to sustainable energy with electric vehicles, solar, and integrated renewable solutions. Innovation is at the core of everything we do.",
  },
  amazon: {
    name: "Amazon",
    description:
      "Amazon is driven by customer obsession, operational excellence, and long‑term thinking. We invent on behalf of customers across retail, logistics, devices, and cloud computing.",
  },
  apple: {
    name: "Apple",
    description:
      "Apple designs products that enrich people’s lives — from iPhone and Mac to services that bring creativity and connection to everyone. Privacy and accessibility are foundational values.",
  },
  meta: {
    name: "Meta",
    description:
      "Meta builds technologies that help people connect, find communities, and grow businesses. We are advancing responsible AI and building towards the metaverse.",
  },
  netflix: {
    name: "Netflix",
    description:
      "Netflix is the world’s leading streaming entertainment service, bringing stories to life for hundreds of millions of members. We champion creativity and global storytelling.",
  },
}

export function getCompanyInfo(rawName: string): CompanyInfo {
  const key = rawName?.toLowerCase() || ""
  return COMPANIES[key] ?? {
    name: rawName,
    description: "This company shares updates and ideas with the community.",
  }
}
