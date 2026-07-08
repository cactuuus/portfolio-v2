<div align="center">
    <h1>Hi Stranger!</h1>
    <p><strong>This is my personal portfolio website, built to showcase my projects and skills.</strong></p>
</div>

<p align="center">
    <a href="https://jacopocalvi.com">
        <img src="https://img.shields.io/badge/self--hosted-blueviolet?logo=coolify" alt="Website" />
    </a>
    <a href="https://apiwatch.eu/status/6fb0f36e-42be-446c-b995-80dd03cf4c02">
        <img src="https://img.shields.io/website?url=https://jacopocalvi.com/health&label=status&up_message=online&up_color=brightgreen&down_message=offline&down_color=red" alt="Status" />
    </a>
    <a href="LICENSE">
        <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" />
    </a>
</p>

<figure>
    <img src="./assets/preview.avif" alt="" width="100%" />
    <figcaption align="center">
        Preview of the website, showing both light and dark themes.
        Live at: <a href="https://jacopocalvi.com">jacopocalvi.com</a>
    </figcaption>
</figure>

## About

Here is a list of amazing tools I have used:

- [SvelteKit](https://kit.svelte.dev/)
- [DaisyUI](https://daisyui.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Bun](https://bun.sh/)
- [Unplugin-Icons](https://github.com/unplugin/unplugin-icons)
- [Docker](https://www.docker.com/)
- [Coolify](https://coolify.io/) (for hosting)

It is a bit overkill for a simple portfolio, but I wanted to play around with APIs and make it a bit more interesting than a simple, static page.

On the server side, it fetches data from external APIs (like GitHub and LeetCode) which is then used to hydrate the page. Because of this, it uses a very small in-memory cache to optimize performance and prevent rate-limiting.
For this reason, I hosted it on my own server (using [Docker](https://www.docker.com/) and [Coolify](https://coolify.io/)), instead of using some straightforward platform like [Netlify](https://www.netlify.com/), where in-memory caching doesn't make much sense.

### Forking

If you stumbled upon this and want to use it for yourself, feel free to fork it and make it your own.

Shoot me a message if you have any questions!

### License

The code is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. This of course does not apply to personal content (such as name, bio, resume, photos, project descriptions), which is not covered and remains mine.
