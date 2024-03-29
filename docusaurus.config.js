require('dotenv').config()

// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Alice.net - Hello Alice',
    tagline: 'A simple, secure, Layer 2 solution',
    url: 'https://your-docusaurus-test-site.com',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'alicenet', // Usually your GitHub org/user name.
    projectName: 'hello-world', // Usually your repo name.
    plugins: [
        // 'docusaurus-tailwindcss',
        require.resolve('./plugin/index.js'),
    ],

    customFields: {
        'MADNET_API': process.env.REACT_APP_MADNET_RPC_ENDPOINT,
        'TEST_FUND_API': process.env.REACT_APP_TEMP_FUND_API_ENDPONT,
        'BLOCK_EXPLORER_URL': process.env.REACT_APP_BLOCK_EXPLORER_ENDPONT,
    },

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    // Please change this to your repo.
                    editUrl: 'https://github.com/alicenet/hello-world/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            colorMode: {
                disableSwitch: true,
            },
            navbar: {
                title: 'CRUD Quickstart',
                logo: {
                    alt: 'My Site Logo',
                    src: 'img/icon.png',
                },
                items: [
                    {
                        type: 'doc',
                        docId: 'intro',
                        position: 'left',
                        label: 'In Depth',
                    },
                    {
                        href: 'https://docs.alicenet.duckdns.org/quickstart',
                        label: 'AliceNet Docs Hub',
                        position: 'right',
                    },
                ],
            },
            footer: {
                style: 'dark',
                // links: [
                //     {
                //         title: 'Docs',
                //         items: [
                //             {
                //                 label: 'Tutorial',
                //                 to: '/docs/intro',
                //             },
                //         ],
                //     },
                //     {
                //         title: 'Community',
                //         items: [
                //             {
                //                 label: 'Stack Overflow',
                //                 href: 'https://stackoverflow.com/questions/tagged/docusaurus',
                //             },
                //             {
                //                 label: 'Discord',
                //                 href: 'https://discordapp.com/invite/docusaurus',
                //             },
                //         ],
                //     },
                //     {
                //         title: 'More',
                //         items: [
                //             {
                //                 label: 'Blog (To New Website Blog)',
                //                 to: 'https://google.com',
                //             },
                //             {
                //                 label: 'GitHub',
                //                 href: 'https://github.com/facebook/docusaurus',
                //             },
                //         ],
                //     },
                // ],
                copyright: `Copyright © ${new Date().getFullYear()} AliceNet`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
        }),
};

module.exports = config;
