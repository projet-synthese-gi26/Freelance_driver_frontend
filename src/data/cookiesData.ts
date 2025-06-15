const cookiesData=[
    {
        name: 'Essential Features',
        description: 'These cookies are necessary for the proper functioning of Letsgo Freelance Driver' +
            '\'s websites and applications. These cookies and trackers include,' +
            ' for example, AT Internet cookies, which are exempt from consent ' +
            'and allow traffic measurement on these sites and applications, ' +
            'IT security cookies, authentication cookies necessary on sites and applications ' +
            'offering this functionality, and the cookie that allows the storage of your ' +
            'preferences regarding trackers.\n\nThis purpose is required by our site ' +
            'to function normally and cannot be disabled.',
        required: true,
        enabled: true,
    },
    {
        name: 'Audience Measurement',
        description: 'Audience tracking allows for the collection of statistical data on traffic in order to improve the user experience and site performance.',
        enabled: false,
    },
    {
        name: 'Personalization',
        description: 'We personalize the content of the site based on your previous visits or your country of residence.',
        enabled: false,
        subCategories: [
            {
                name: 'Use profiles to select personalized content',
                description: 'The content presented to you on this service may be based on your content personalization profiles, which may correspond to your activity on this service or other services (for example, the forms you submit, the content you view, possible interests and personal information). This can be used, for example, by adapting the order of presentation of content to make it easier for you to find (non-advertising) content corresponding to your interests.',
                enabled: false,
            },
            {
                name: 'Use precise geolocation data',
                description: 'With your acceptance, your precise location (within a radius of less than 500 meters) can be used to support the purposes explained in this notice.',
                enabled: false,
            },
            {
                name: 'Create personalized content profiles',
                description: 'Information about your activity on this service (for example, the forms you submit, the non-advertising content you view) can be stored and combined with other information about you (such as information from your previous activity on this service or other websites or applications) or about similar users. This information is then used to create or improve a profile about you (which may include, for example, possible interests and personal information). Your profile can be used (including at any later date) to present content that seems more relevant to your possible interests, for example by adapting the order in which content is presented to you to make it easier for you to find content matching your interests.',
                enabled: false,
            },
            {
                name: 'Actively scan device characteristics for identification',
                description: 'With your acceptance, certain specific characteristics of your device may be requested and used to distinguish it from other devices (such as installed fonts or plugins, your screen resolution) to support the purposes explained in this notice.',
                enabled: false,
            },
        ],
    },
    {
        name: 'Store and/or access information on a device',
        description: 'Cookies, similar online devices or identifiers (e.g. login identifiers, randomly assigned identifiers, network identifiers) as well as any other information (e.g. browser type and information, language, screen size, supported technologies, etc.) may be stored or read on your device to recognize it each time it connects to an application or website, for one or more of the purposes presented here.',
        enabled: false,
    },
    {
        name: "Performance Measurement",
        description: "The performance and effectiveness of the content and advertisements you see or interact with can be measured.",
        enabled: false,
        subCategories: [
            {
                name: "Measure content performance",
                description: "Information about the content presented to you and how you interact with it can be used to determine if non-advertising content, for example, has reached its target audience and aligns with your interests. For instance, how long you spent on a service and the web pages you visit when reading an article, watching a video, listening to a podcast, or viewing a product description, etc. This information is very useful for understanding the relevance of the non-advertising content presented to you.",
                enabled: false
            },
            {
                name: "Measure ad performance",
                description: "Information about the advertisements presented to you and how you interact with them can be used to determine how effective an ad was for you or other users, and whether the ad's objectives were met. For example, if you viewed an ad, clicked on it, if it led you to purchase a product or visit a website, etc. This information is very useful for understanding the relevance of advertising campaigns.",
                enabled: false
            },
            {
                name: "Understand audiences through statistics or combinations of data from different sources",
                description: "Reports can be generated based on the combination of data sets (such as user profiles, statistics, market studies, analytical data) regarding your interactions and those of other users with advertising or non-advertising content to identify common characteristics (for example, to determine which target audiences are most receptive to an advertising campaign or certain content).",
                enabled: false
            }
        ]
    },

    {
        name: 'Advertising',
        description: 'These cookies allow us to offer you advertising content based on your profile or browsing history and to measure the performance of our advertising campaigns visible on Google or Facebook, in order to promote this site',
        enabled: false,
        subCategories: [
            {
                name: 'Use limited data to select advertising',
                description: "The advertising presented to you on this service may be based on limited data, such as the website or application you are using, your approximate location, your device type, or the content you interact with (or have interacted with) (for example, to limit the number of times a given advertisement is shown to you).",
                enabled: false,
            },
            {
                name: "Use profiles to select personalized advertisements",
                description: "The advertising presented to you on this service may be based on your advertising profiles, which can be created based on your activity on this service or other websites or applications (such as the forms you submit, the content you view), as well as your potential interests and personal information.",
                enabled: false,
            },
            {
                name: 'Create profiles for personalized advertising',
                description: "Information about your activity on this service (such as the forms you submit, the content you view) may be stored and combined with other information about you (for example, information from your previous activity on this service and other websites or applications) or about similar users. This information is then used to create or improve a profile about you (which may include potential interests and personal information). Your profile can be used (also later) to present advertisements that seem more relevant based on your potential interests by this entity and other entities.",
                enabled: false,
            },
        ],
    },

    {
        name:"Use limited data to select content",
        description: "The content presented to you on this service may be based on limited data, such as the website or application you are using, your non-precise location, your device type, or the content you interact with (or have interacted with) (for example, to limit the number of times a video or article is shown to you)",
        enabled: false,
    },

    {
        name: "Analyze device and browsing to send personalized messages",
        description: "Personalized notifications may be sent to your device, based on your use of the application and your browsing.",
        enabled: false,
    },

]

export default cookiesData;