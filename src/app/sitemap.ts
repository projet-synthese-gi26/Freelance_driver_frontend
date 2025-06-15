import { MetadataRoute } from "next";

export default async function sitemap() :Promise <MetadataRoute.Sitemap>{


    return [
        {
            url:'https://stage-bice-alpha.vercel.app/',
            lastModified: new Date(),
        },
        {
            url:'https://stage-bice-alpha.vercel.app/freelance/about',
            lastModified: new Date(),
        },
        {
            url:'https://stage-bice-alpha.vercel.app/pricing-plan',
            lastModified: new Date(),
        },
    ]
}