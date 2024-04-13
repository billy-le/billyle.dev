---
title: "Highlight Table of Content Items Using Intersection Observer"
pubDate: 2024-04-05
description: "After creating my Table of Contents for my blog, I needed a way to let the readers know which part of it they are viewing. By adding text decorations to the Table of Content links, I'm able to give a visual indicator by using the Web API Intersection Observer."
author: "Billy Le"
image:
  url: "https://images.unsplash.com/photo-1580569214296-5cf2bffc5ccd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  alt: "a set of four highlighters of different colors"
  className: ""
tags: ["blogging", "content creation", "astro"]
draft: false
---

Giving your readers a way to navigate through the Table of Contents (ToC) is a nice feature but I was _still_ missing a **critical** detail that would make the experience much more pleasant.

The missing feature was a way to highlight or give some sort of visual indicator of which part of the ToC the reader was viewing.

I've adapted the [work of Reza Zahedi](https://rezahedi.dev/blog/create-table-of-contents-in-astro-and-sectionize-the-markdown-content#separating-markdown-content-into-sections) as I did before in my other blog post so all credit goes to him.

You'll more or less likely find the same information in his blog and this post and I'm creating this post as an entry for my own record.

## A bit about AstroJS remark support

AstroJS ships with [remark](https://github.com/remarkjs/remark), a markdown processor with many community-built plugins.

You can add things like linters, MDX support, or compile your markdown to PDFs. [The list goes on and on](https://github.com/remarkjs/remark/blob/main/doc/plugins.md#list-of-plugins).

I am going to use the [remark-sectionize plugin](https://github.com/jake-low/remark-sectionize). This plugin will parse through my markdowns and for every article heading greater than `<h1>`, it will wrap a surrounding `<section>` element.

To see what I mean, here is an example:

**Before**:

```html
<article>
  <h1>My Article Title</h1>
  <h2 id="heading-1">This is the first heading</h2>
  <p>This paragraph is about whatever heading-1 is about.</p>
  <h2 id="heading-2">This is the second heading</h2>
  <p>This paragraph is about whatever heading-2 is about.</p>
</article>
```

**After**:

```html
<article>
  <h1>My Article Title</h1>
  <section>
    <h2 id="heading-1">This is the first heading</h2>
    <p>This paragraph is about whatever heading-1 is about.</p>
  </section>
    <h2 id="heading-2">This is the second heading</h2>
    <p>This paragraph is about whatever heading-2 is about.</p>
  </section>
</article>
```

It seems simple enough, right?

## Highlight Table of Contents

For now, I simply want to change the text color in the ToC whenever a reader is viewing that section.

To do so, I have to use the Intersection Observer API which will allow me to manipulate the DOM elements as they enter or leave the viewport.

Here are the steps I'll need to complete it:

1. Give my ToC a class name, `.toc-links` for selecting the DOM element.
2. Select all `<section>` elements within the `<article>` tag.
3. Create an Intersection Observer and write a callback function to process the event and data.
4. Inside the callback, find the heading element of that section, map it to the ToC, and toggle on/off the class `active` as they enter or leave.
5. Loop over the `<section>` tags from Step 1 and use the Intersection Observer we created to observe each section.

### The Intersection Observer API

If you have never used or heard of [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), it's a Web API that allows us to listen to events and trigger functions when an element is entering or leaving the viewport.

This is the perfect use case for using the Intersection Observer API because we want to manipulate DOM elements whenever the events fire.

We will create an Intersection Observer that will change the class name of the `<a>` tags inside our Table of Contents whenever we are viewing the corresponding section.

### The implementation code

In my `BlogLayout.astro` file that is responsible for rendering the very HTML page you're reading, I'm going to write a `<script>` tag.

Here is the code:

```tsx
<script>
  const articleSections = document.querySelectorAll<HTMLDivElement>("article section");

  const observer = new IntersectionObserver((entries) => {
    entries.map((entry) => {
      const heading =
        entry.target.querySelector<HTMLHeadingElement>("h2,h3,h4,h5");
      if (!heading) return;
      const id = heading.getAttribute("id");
      if (!id) return;
      const link = document.querySelector<HTMLAnchorElement>(
        `.toc-links a[href="#${id}"]`,
      );
      if (!link) return;

      const addRemove = entry.intersectionRatio > 0 ? "add" : "remove";
      link.classList[addRemove]("text-blue-500", "dark:text-blue-400");
    });
  });

  for (const section of articleSections) {
    observer.observe(section);
  }

  window.document.addEventListener("beforeunload", () => {
    observer.disconnect();
  });
</script>
```

### Breaking the code down

```typescript
const articleSections =
  document.querySelectorAll<HTMLDivElement>("article section");
```

I'm collecting all the article sections using the `document.querySelectAll()` function.

<br>

```typescript
const observer = new IntersectionObserver((entries) => {});
```

I'm creating a `new IntersectionObserver()` that takes a callback function whenever it is fired.

The `entries` parameter is coming from the intersection event triggered and is an array of [IntersectionObserverEntry](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry).

<br>

```typescript
entries.forEach((entry) => {});
```

Using the `entries` parameter from the callback, we loop over it in a `.forEach()`.

From each entry, there is a target. That target is the HTML element that fired the event. In my case, it will be a `<section>` tag.

How does it know that it's a section element? Well, I'll explain later in the code.

<br>

```typescript
const heading = entry.target.querySelector<HTMLHeadingElement>("h2,h3");
if (!heading) return;
```

To get the heading of the section, we use `entry.target.querySelector<HTMLHeadingElement>("h2,h3")` and store it in a variable called `heading`. There is a guard clause to return if nothing is found.

<br>

```typescript
const id = heading.getAttribute("id");
if (!id) return;
```

Next, I find the id attribute by calling `heading.getAttribute("id")` and store that in another variable called `id`.

<br>

```typescript
const link = document.querySelector<HTMLAnchorElement>(
  `.toc-links a[href="#${id}"]`,
);
if (!link) return;
```

Next up, find the associated `<a>` tag by using string interpolation and storing that into a `link` variable.

<br>

```typescript
const addRemove = entry.intersectionRatio > 0 ? "add" : "remove";
link.classList[addRemove]("text-blue-500", "dark:text-blue-400");
```

Using the `entry` variable from before, we can detect when a section is entering or leaving by using the `intersectionRatio`. If the `intersectionRatio` is greater than 0, the element is entering, and when it's below 0, it is leaving.

The `addRemove` variable stores the `key` of the `classList` API so we can easily toggle on and off the class names.

If the section is being viewed, I changed the ToC item to a blue text and off when the section is no longer in view.

<br>

```typescript
for (const section of articleSections) {
  observer.observe(section);
}
```

Now that the Intersection Observer is created with a callback function, we can observe elements in our DOM to invoke the callback as they enter or leave.

In this case, I loop over all the sections from my `articleSections` variable and observe them.

<br>

```typescript
window.document.addEventListener("beforeunload", () => {
  observer.disconnect();
});
```

You may not need this but I added this part anyway. Before a user navigates away from the page, I want to disconnect the observer.

## Summary

As you can probably see, the text turns blue when you go from one section to the other.

If there is a child section within a parent section, such as an h3 within an h2 section, it still keeps the parent heading highlighted.

This is great since most articles have a hierarchy.

Congratulations! You learned to add this simple feature in your blog or anywhere you need to highlight different parts of your site by using the Intersection Observer API.

You can do some more fancy stuff with the Intersection Observer like this [Progress Navigation by Hakim El Hattab](https://lab.hakim.se/progress-nav/) that I found via [Kevin Drum](https://kld.dev/toc-animation/#lets-start-with-the-markup).

If you end up implementing this, let me know! I would love to see your work.

Until next time, have a good one, and happy coding!
