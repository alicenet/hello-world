
import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug','3d6'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config','914'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content','c28'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData','3cf'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata','31b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry','0da'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes','244'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive','f4c'),
    exact: true
  },
  {
    path: '/quickstart-steps/',
    component: ComponentCreator('/quickstart-steps/','5c9'),
    exact: true
  },
  {
    path: '/quickstart-steps/FundWallet',
    component: ComponentCreator('/quickstart-steps/FundWallet','a36'),
    exact: true
  },
  {
    path: '/quickstart-steps/GenerateWallet',
    component: ComponentCreator('/quickstart-steps/GenerateWallet','1ad'),
    exact: true
  },
  {
    path: '/quickstart-steps/GettingStarted',
    component: ComponentCreator('/quickstart-steps/GettingStarted','c40'),
    exact: true
  },
  {
    path: '/quickstart-steps/SendValue',
    component: ComponentCreator('/quickstart-steps/SendValue','cfe'),
    exact: true
  },
  {
    path: '/quickstart-steps/StoreData',
    component: ComponentCreator('/quickstart-steps/StoreData','c0c'),
    exact: true
  },
  {
    path: '/sandbox',
    component: ComponentCreator('/sandbox','3c5'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs','5c8'),
    routes: [
      {
        path: '/docs/intro',
        component: ComponentCreator('/docs/intro','99a'),
        exact: true,
        'sidebar': "tutorialSidebar"
      },
      {
        path: '/docs/ui-in-depth/create-a-wallet',
        component: ComponentCreator('/docs/ui-in-depth/create-a-wallet','605'),
        exact: true,
        'sidebar': "tutorialSidebar"
      },
      {
        path: '/docs/ui-in-depth/fund-a-wallet',
        component: ComponentCreator('/docs/ui-in-depth/fund-a-wallet','13e'),
        exact: true,
        'sidebar': "tutorialSidebar"
      },
      {
        path: '/docs/ui-in-depth/send-value',
        component: ComponentCreator('/docs/ui-in-depth/send-value','a13'),
        exact: true,
        'sidebar': "tutorialSidebar"
      },
      {
        path: '/docs/ui-in-depth/store-data',
        component: ComponentCreator('/docs/ui-in-depth/store-data','729'),
        exact: true,
        'sidebar': "tutorialSidebar"
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/','c79'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*')
  }
];
