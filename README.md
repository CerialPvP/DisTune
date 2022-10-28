[![Support DisTune on Ko-fi](https://storage.ko-fi.com/cdn/brandasset/kofi_s_tag_dark.png)](https://ko-fi.com/distune "Support DisTune on Ko-fi")

*To support my work on DisTune, you can donate to me on Ko-fi by clicking on the image above or by clicking on the link in the "Support this project" section.*

## DisTune

This is the new version of DisTune, made fully on JavaScript with the help of the **discord.js** NodeJS library.

Interested in the Skript version? Visit the public archive [here](https://github.com/CerialPvP/distune-sk).

> Why did you move off of Skript?

With every new update of [DiSky](https://github.com/DiSkyOrg/DiSky/releases/tag/4.4.3) (the Skript addon for Discord stuff), the syntax changes drastically. In the lastest update (at the time of writing this, it is 4.4.3), the syntax for sending embeds and storing it has changed, and that will affect most of DisTune's code.

Because DisTune is going to be a **long term** bot, DiSky is not the fit. It is an addon for a simple Discord to Minecraft or just basic commands, but if I want this bot to actually be popular, welp, mission impossible with DiSky, since it does not have sharding support.

Now, you might ask, **what is sharding?**

**Sharding** is splitting the bot's process and then allocating that "shard" to guilds.

Let's say the bot is in 4,000 guilds, if we were to allocate 1,000 servers per shard, then we would have 4 shards.

Now, we can't just avoid the sharding process, since if we reach 2,500 guilds, Discord will not let us login regularly; Instead we need to do sharding.

You can see how sharding can be critical to DisTune. Now, Sky (the maker of DiSky) said he will **not** implement sharding support, so this is why we switched over to discord.js.