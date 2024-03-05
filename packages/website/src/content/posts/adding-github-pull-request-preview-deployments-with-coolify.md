---
title: "Adding GitHub Pull Request Preview Deployments with Coolify"
pubDate: 2024-03-05
description: "Pull Request Preview Deployments are a neat feature where you receive a shareable link so you can showcase a feature before merging it into production. In this post, I'll show you how you can set up your Coolify to create those magical Pull Request Preview Deploys just like Netlify."
author: "Billy Le"
image:
  url: "https://images.unsplash.com/photo-1475706398693-8250350bc704?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHVsbHxlbnwwfDB8MHx8fDA%3D"
  alt: "a top-down view of a man pulling a thick rope"
  className: ""
tags: ["self-hosting", "devops", "tutorial", "paas"]
draft: false
---

One of the nice things about Netlify, Vercel, etc. is automatic commit deployments on your main branch. We can use the same manner in Coolify's feature using "Private Repository with GitHub app". Not only will we get the benefit commit deployments, but we can also set it up for Pull Request preview deploys before we make a merge to main.

Let's cover what we're going to do:

1. Create a subdomain wildcard DNS record inside Cloudflare
2. Update Localhost server to use the wildcard domain setting
3. Add a Coolify's Source
4. Deploy a resource and configure our application to use Pull Request Previews
5. Test Pull Request Previews by creating a Pull Request on GitHub

## Update DNS Records for Wildcard Subdomains

I’m using Cloudflare but whatever you’re using should likely be the same. All you need to do is go to your DNS Records dashboard and enter the details below.

In Cloud, navigate to the DNS Records dashboard.

![navigating to cloudflare's dns records dashboard](../../../public/images/blog/self-hosting/cloudflare-dns-management.png)

We’ll create a new record by clicking on the add new record button.

A form should pop up and we’ll enter an "**A**"" record, with a host name of "**\***"" and the value of the IP address. I'm using `192.0.2.1` but you'll replace it with your remote server IP where your Coolify instance is running.

![adding an A record for subdomain wildcards](../../../public/images/blog/pull-request-previews/cloudflare-dns-wildcard.png)

The "**\***" represents a catch all for any subdomain so when we make Pull Requests on GitHub, Coolify will automatically create a Preview Deploy that looks like `<subdomain_pr_id>.<your_domain>`. You can then click on that URL and be taken to a live instance of your Preview Deploy.

Click save and close Cloudflare since we won't be accessing them from here.

## Allow Coolify to create wildcard domains

Navigate to your Coolify instance and head over to the server that will handle the wildcard domains. In my case, it is the "Localhost" server that Coolify lives on.

![navigating to the server we want to use wildcard domains](../../../public/images/blog/pull-request-previews/coolify-wildcard-server.png)

You should see a "Wildcard Domain" field. Let's update that to use our custom domain URL. I'm using "https://billyle.dev". Be sure to include the https protocol.

Some things you need to be sure of is that the wildcard DNS record is pointing to the server IP where Coolify instance lives and that the wildcard domain you're entering is being served by Coolify.

![entering wildcard domain url](../../../public/images/blog/pull-request-previews/coolify-wildcard-domain.png)

Click save and confirmation prompt will display. Click continue.

![entering wildcard domain url](../../../public/images/blog/pull-request-previews/coolify-wildcard-confirmation.png)

## Creating a Source

Next up is creating a "Source". Coolify will create a private GitHub app for you. After creating the GitHub app, Coolify will automatically grab all the details from the GitHub app (App Id, Installation Id, Client Id, Client Secret, and Webhook Secret) and store it as a Source. This GitHub app later will ask your GitHub account to grant it permission to watch for Pull Requests and commits to main.

Head over the the Sources page so we can start creating one.

![navigation to the sources page](../../../public/images/blog/pull-request-previews/coolify-menu-sources.png)

Click on "+ Add" and you'll be taken to enter some details about the GitHub you're about to create.

![navigation to the sources page](../../../public/images/blog/pull-request-previews/coolify-add-source.png)

We're only going to change the name of the GitHub app to something more recognizable. I'm using "billylecoolify". Click continue.

![navigation to the sources page](../../../public/images/blog/pull-request-previews/coolify-github-app-name.png)

The next screen is where Coolify needs to register the GitHub app. Before we do that, we're going to change the "Webhook Endpoint" so we don't expose our server IP to the world. I'm using the domain where my Coolify instance is lives.

We also want to turn on "Preview Deployments" for this Source so be sure to toggle that on.

![navigation to the sources page](../../../public/images/blog/pull-request-previews/coolify-github-app-register.png)

After completing the steps above, click on "Register Now".

You should be taken to a Github in the browser where it will ask your to login. I have 2FA set up so this screen may be different for you. Just enter your details and you should be good to go.

![entering github authentication details](../../../public/images/blog/pull-request-previews/github-authentication.png)

After you login, you will see the GitHub app you're about to create. The name should match the GitHub App name given in the Coolify instance.

![entering github app name](../../../public/images/blog/pull-request-previews/github-app-name.png)

Click on "Create Github App" and you'll be redirected back to Coolify.

You should see a screen now that says with a button that says "Install Repositories on GitHub". We want to connect our GitHub App and our GitHub account so click on that.

![screen that shows the GitHub app with an install repositories button](../../../public/images/blog/pull-request-previews/coolify-install-repositories.png)

This next step will grant your GitHub app that you just created (mine was named "billylecoolify") to have access to your GitHub repositories. You can select specific repositories or all repositories. I think keeping it on "All repositories" makes it easier so you don't need to manually keep adding repositories later.

![installing the github app](../../../public/images/blog/pull-request-previews/github-app-install.png)

Notice all the permission the GitHub app is requesting.

- **Read** access to administration, code, and metadata
- **Read** and **write** access to pull requests

The write access here is for Coolify to create comments on your Pull Requests which I will show you later. Click on "Install" and it will redirect you back to Coolify.

The Coolify GitHub App Source was auto-populated and now has all the necessary details for it to trigger builds on your commits.

![github app auto-populated](../../../public/images/blog/pull-request-previews/coolify-github-app-populated.png)

Now we're going to create a new project and test for Pull Request Preview Deploy feature.

## Add a new Project with our new Source

Head over to the projects page in the navigation menu and create a new Project.

![navigation menu for projects](../../../public/images/blog/pull-request-previews/coolify-navigate-to-projects.png)

Give it whatever name you like. I'm going to name mine "my-cool-project" and click save.

![naming your project](../../../public/images/blog/pull-request-previews/coolify-project-name.png)

Select an environment on the next page. I only have one environment, "production".

![select environment for your project](../../../public/images/blog/pull-request-previews/coolify-project-environment.png)

And then we'll add a new Resource for our project.

![add new resource for your project](../../../public/images/blog/pull-request-previews/coolify-add-resource.png)

You'll see a page with many different resources. Since we created a GitHub App, we're going to choose the "Private Repository (with GitHub App)" option.

![selecting a new resource page](../../../public/images/blog/pull-request-previews/coolify-select-resource.png)

The next screens will ask you where to store your resources. Select "localhost" for your Server and "docker-standalone" for Destination.

![selecting a resource server](../../../public/images/blog/self-hosting/coolify-resource-add-server.png)

![selecting a resource destination](../../../public/images/blog/self-hosting/coolify-resource-destination.png)

Now it will ask you which GitHub app you want to use. We're going to select the one we just created.

![selecting a resource github app](../../../public/images/blog/pull-request-previews/coolify-select-github-app.png)

Now we can see all our repositories and choose the one we want to deploy! How awesome is that? I'm going to select an old project that runs on a node server.

From the dropdown list, select your project you want to deploy.

![selecting a github repository](../../../public/images/blog/pull-request-previews/coolify-select-repository.png)

One you select your repository, click on "Load Repository".

Coolify will try its best to gather information about your project like the main branch we want to deploy, the build pack, and port.

Here I had to adjust the Branch to "master". If your site is static, be sure to toggle that on. You can change all of this in the configuration page if you mess up. Click "Continue".

![configure github repository](../../../public/images/blog/pull-request-previews/coolify-load-repository.png)

This next section should be familiar if you followed my other tutorial when I set up self-hosting for this website.

## Configuring the application for Preview Deployments

Notice now in the "Domains" field, we see the Coolify wildcard domain being auto-generated with the domain we gave it earlier in the ["Localhost" server configuration](#allow-coolify-to-create-wildcard-domains).

![arrow showing the subdomain feature](../../../public/images/blog/pull-request-previews/coolify-autogen-subdomain.png)

Change the subdomain portion to whatever name you like. I used the name "conversus". Click "Save" next to the General heading.

![renaming subdomain](../../../public/images/blog/pull-request-previews/coolify-name-subdomain.png)

Now click on the "Advanced" menu item where we will turn on Preview Deployments for this application.

![navigation to the advanced settings page](../../../public/images/blog/pull-request-previews/coolify-navigate-to-app-advanced-settings.png)

And toggle on "Preview Deployments". These next steps can be ignore if you don't want to limit resources for you application. In my case, since this application is a demo, I don't want it to hog resources in case there are a lot of requests coming from it. Click on "Resource Limits" if you want this feature.

![navigation to the advanced settings page](../../../public/images/blog/pull-request-previews/coolify-turn-on-preview-deployments.png)

## Limit resources for your application (optional)

Under the "Resource Limits" menu, we will find several fields we can set to limit resources for the application. You can follow the link when you hover the asterisk in the field label to get more information.

Here I'm adjusting the "Number of CPUs", "CPU sets to use", and "Maximum Memory Limit". Click save to apply the changes.

![setting resource limits](../../../public/images/blog/pull-request-previews/coolify-resource-limits.png)

## Launching Preview Deployments

Okay, so we're ready to deploy our application. Let's give it a try and see if it builds. Click on the "Deploy" button on the top right in the previous picture.

You will be taken the build logs and see real-time output from your build.

![viewing build progress logs](../../../public/images/blog/pull-request-previews/coolify-build-progress.png)

Once it's complete, you should see that the Deployment status is changed from "In Progress" to "Finished". Also you will see a green "Running (healthy)" at the top. You can now view your application by following the "Open Application Menu" and click the link.

![build finished and navigating to the build link](../../../public/images/blog/pull-request-previews/coolify-build-finished.png)

If it doesn't work because of SSL, give it a few minutes so your SSL cert that Coolify generated is being validated.

This is how my app looks when everything went well.

![deployed app with ui bugs](../../../public/images/blog/pull-request-previews/app-before-pr-preview.png)

Notice the URL is now `conversus.billyle.dev`. We deployed an app on the `conversus` subdomain on our shared domain of `billyle.dev`. This shows you the power of Coolify being able to host multiple apps under one domain.

I have a UI bug where the list of active rooms is collapsed and I want to set a minimum height. This is a good opportunity to show you the Preview Deployment feature.

I created a fix for this repository and pushed it onto GitHub. When we create a Pull Request to the `master` branch, the GitHub App "billylecoolify" we created will trigger a build. It will even leave a comment in your PR to show you how you can view the Preview Deployment or check the build log.

![github app leaving a pr comment](../../../public/images/blog/pull-request-previews/github-app-pr-comment.png)

Talk about awesomeness! It's integrated in our GitHub Workflow now.

Let's navigate the Deployment build list.

![a list of all deployment builds](../../../public/images/blog/pull-request-previews/coolify-deployment-list.png)

You see that the latest deployment shows that it was triggered by a "Webhook". We now know it's working. Let's click into our build and see how things are going.

Not much has changed from before. The build should complete and say that the deployment is "finished".

Let's check out what apps are available to view by clicking on the "Open Applications" menu.

You should see a new app called, `<pr_id>.<subdomain>.<your_domain>`

![a list available deployed apps](../../../public/images/blog/pull-request-previews/coolify-prefix-preview-deployment.png)

The PR id is the Pull Request ID retrieved from GitHub. The subdomain is what we entered when we [configured the app](#configuring-the-application-for-preview-deployments).

So let's try opening the app now. Click on it and see what happens.

![a ssl error no cypher overlap](../../../public/images/blog/pull-request-previews/ssl-err-no-cypher-overlap.png)

Viewing it on Firefox and oh no! What error is this?! Seems like I have an SSL error? I'm not sure what's going on here but I believe my DNS doesn't like using `sub.subdomain.domain` which might be causing the error. How do we fix this?

Luckily, we can configure how our Preview Deployments are named. Let's do that now.

Back in the configuration page, you will see a "Preview Deployments" menu item. Let's click on that and bring up this page.

![an arrow showing where to navigate to the preview deployments](../../../public/images/blog/pull-request-previews/coolify-navigate-to-preview-deployments.png)

You will see a field, "Preview URL Template", where the default value is: `{{pr_id}}.{{domain}}`. If you hover over the field label, you can find more template tags to use.

![changing preview url template](../../../public/images/blog/pull-request-previews/coolify-preview-url-template.png)

So instead of having a "." separator, I'm going to use a "-".
From this: `{{pr_id}}.{{domain}}`, to this: `{{pr_id}}-{{domain}}`

Be sure to click "Save".

So now that we have that all set. We need to redeploy our Preview Deployment build so that we can see changes to the URL.

On the same page, there will be a list of open Pull Request Preview Deployments. Find the one that is matching your PR ID and click on "Redeploy".

![redeploying pr preview](../../../public/images/blog/pull-request-previews/coolify-preview-redeploy.png)

Two things will happen now. First, you have just triggered a new build so if you go to the Deployments tab, you will see a new build running that was manually triggered.

Second, is that the GitHub app will create a new comment on your PR to the new Preview Deployment and build log.

Let's wait it out for the deployment to finish and see what available apps there are.

We now see the updated URL, `6-conversus.billyle.dev`, so now I can check it out.

![corrected preview deployment url from dropdown list](../../../public/images/blog/pull-request-previews/coolify-postfix-preview-deployment.png)

Awesome, I can also see the changes are working from the PR! If it doesn't work for you because the browser is complaining about SSL, just give it a few minutes and try again.

![preview deployment with visible changes](../../../public/images/blog/pull-request-previews/app-preview-fix.png)

## Cleanup and Merge Pull Request

Okay, everything looks well on my end so I'm going to merge and close my Pull Request.

What Coolify does in this stage is trigger a new build for the updated `master` branch and remove the Preview Deployment builds from our application automatically because it's no longer needed.

You can verify this by going to the Deployment list and checking the dropdown lists of available apps.

![deployment list of previous or ongoing builds](../../../public/images/blog/pull-request-previews/coolify-pr-merge-deployment.png)

If you do need the preview deployments to stick around, I'm not sure how that's done yet.

Finally I can check my application and verify the new code is working.

![production app with merged changes](../../../public/images/blog/pull-request-previews/app-after-pr-preview.png)

## What you learned

Wow, so many topics were covered in this tutorial! I hope you made it this far and got some value of out it.

Now you learned how to use Coolify to create Preview Deployments for your Pull Requests.

To get to this point, there were several steps like setting up your DNS to accept subdomain wildcards. We then had to use that in our Coolify server as well and give it a wildcard domain so that it will autogenerate subdomains for us.

The next steps were to create a Source, in our case the GitHub app, and grant it permissions to our GitHub account. We started a new project, then add a resource that pulled in all of our repositories.

Once we selected a repository, we updated our subdomain name, preview URL template, and turned on Preview Deployments.

There was a few of mini-steps in between but that was the gist of it. I'm confident that you can do this on your own with your own applications. And if you ever need help, you can reach out to me from one of my socials.

Good luck and I hope you create awesome things. Until next time, have a good one!
