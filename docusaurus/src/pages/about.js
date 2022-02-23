import React from 'react';
import Layout from '@theme/Layout';
import madnetjs from 'madnetjs'

export default function () {

    console.log(madnetjs);

    let madwallet = new madnetjs();

    console.log(madwallet);

    return (
        <Layout>
            <div className="page-wrap">
                Fancy Splash / About in a nutshell?
            </div>
        </Layout>
    )

}