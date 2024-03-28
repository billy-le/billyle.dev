---
title: "Enabling Developer Mode on iOS 17.3.1"
pubDate: 2024-03-07
description: "If you have trouble finding the Developer Mode settings on your iPhone, I may have the fix for you. The official documentation was outdated and other users' comments around the internet echoed what the docs said. "
author: "Billy Le"
image:
  url: "https://images.unsplash.com/photo-1598170845055-806a9e9f3f72?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  alt: "a pile of fresh red apples"
  className: ""
tags: ["mobile development", "iOS"]
draft: false
---

I had trouble recently trying to find the "Developer Mode" settings on my iPhone. I tried viewing the "Privacy & Security" settings and scrolling down to the bottom only to find that it wasn't there.

![screen of iphone where developer mode is not showing](../../../public/images/blog/developer-mode/developer-mode-invisible.jpg)

Even the official documentation was not helpful and users around the internet repeated the same instructions.

It wasn't until I found an obscure comment that helped me unlock "Developer Mode". So now I'm going to share how I got "Developer Mode" to show.

## How to enable "Developer Mode" for iPhone and Xcode

1. [Download Xcode](https://developer.apple.com/xcode/) on your macOS device.
   ![xcode logo](../../../public/images/blog/developer-mode/xcode-logo.png)

2. Connect your iPhone to your macOS device and make sure to trust your device on your iPhone.
   ![trust computer prompt on iOS](../../../public/images/blog/developer-mode/trust-computer-prompt.jpeg)

3. And enter your passcode on your iPhone
   ![enter passcode on iOS](../../../public/images/blog/developer-mode/enter-device-passcode.jpeg)

4. Open Xcode and navigate to the settings "Product" > "Destination" > "Manage Run Destinations"
   ![menu navigation to "manage run destinations"](../../../public/images/blog/developer-mode/xcode-manage-run-destinations.png)

5. You should see your device now but there's a warning banner that "Developer Mode" is not enabled.
   ![destinations management showing a banner that dev mode is not enabled](../../../public/images/blog/developer-mode/xcode-destinations-no-dev-mode.png)

6. Head over to "Privacy & Security" in "Settings" on your iPhone and you should now see "Developer Mode".
   ![privacy and security menu](../../../public/images/blog/developer-mode/privacy-and-security.jpeg)

7. Turn it on and it will ask you to "Restart" which is required.
   ![turning on dev mode](../../../public/images/blog/developer-mode/dev-mode-on.jpeg)

8. Upon logging back into your iPhone, it will confirm you want to turn on "Developer Mode". Press "Turn On".
   ![dev mode reduced security prompt](../../../public/images/blog/developer-mode/dev-mode-reduced-security.jpeg)

9. One last time you'll be asked to enter your passcode.
   ![dev mode enter the passcode](../../../public/images/blog/developer-mode/dev-mode-passcode.jpeg)

10. If you look at Xcode, you should see that your iPhone will try to pair. If not, you may need to wait or click on the warning banner.
    ![iphone and xcode paring](../../../public/images/blog/developer-mode/xcode-device-pairing.png)

That's it!

You now have "Developer Mode" set on your iPhone. Turn off "Developer Mode" by going back to your iPhone "Privacy & Security" settings if you no longer need it.

Good luck, happy coding and see you next time.
