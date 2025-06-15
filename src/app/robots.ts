import { MetadataRoute } from "next";

export default function robots():MetadataRoute.Robots{

    return {
        rules:{
            userAgent: '*',
            disallow: '/admin',
            allow: '/',
        },
        sitemap: 'https://stage-bice-alpha.vercel.app/sitemap.xml'
    }
}