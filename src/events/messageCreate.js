const { Events, ChannelType, ThreadAutoArchiveDuration, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Ignore bots
        if (message.author.bot) return;

        const client = message.client;
        const guildId = process.env.GUILD_ID;
        const mailChannelId = process.env.MAIL_CHANNEL_ID;

        // -----------------------------
        // 1. Handle DMs (User -> Bot)
        // -----------------------------
        if (message.channel.type === ChannelType.DM) {
            const guild = await client.guilds.fetch(guildId).catch(console.error);
            if (!guild) return console.error(`Guild ${guildId} not found`);

            const mailChannel = await guild.channels.fetch(mailChannelId).catch(console.error);
            if (!mailChannel) return console.error(`Mail channel ${mailChannelId} not found`);

            // Check for existing thread
            // We search active threads for one that ends with the User ID
            let thread = mailChannel.threads.cache.find(t => t.name.endsWith(message.author.id));

            if (!thread) {
                // Try fetching active threads if not in cache
                const activeThreads = await mailChannel.threads.fetchActive();
                thread = activeThreads.threads.find(t => t.name.endsWith(message.author.id));
            }

            if (!thread) {
                // Try fetching archived threads (might be expensive, but needed if thread was auto-archived)
                // NOTE: fetching archived threads requires history, we might skip this optimization for simplicity 
                // and just create a new one or assuming we don't spam. 
                // For now, let's keep it simple: if not found in active, create new. 
                // Better: Try to find by name "ticket-username" if topic lookup adds complexity? 
                // Topic is safer for name changes.

                // Create new thread
                try {
                    // Format: modmail-username-userid
                    // Limit username length to avoid >100 limitation
                    const safeUsername = message.author.username.slice(0, 50);
                    thread = await mailChannel.threads.create({
                        name: `modmail-${safeUsername}-${message.author.id}`,
                        autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
                        // Private threads require level 2 boost for non-moderators to see? 
                        // Actually, Private Threads are free now but logic differs.
                        // "GUILD_PRIVATE_THREAD" requires 'Create Private Threads'.
                        // If standard channel, Type: PrivateThread
                        type: ChannelType.PrivateThread,
                        reason: `New modmail from ${message.author.tag}`
                    });

                    // New Ticket Embed
                    const newTicketEmbed = new EmbedBuilder()
                        .setTitle('📨 New Modmail Ticket')
                        .setDescription(`**User:** ${message.author} (\`${message.author.id}\`)\n**Created:** <t:${Math.floor(Date.now() / 1000)}:R>`)
                        .setColor(0x0099FF) // Blue
                        .setThumbnail(message.author.displayAvatarURL());

                    await thread.send({ embeds: [newTicketEmbed] });
                } catch (error) {
                    console.error("Error creating thread:", error);
                    return message.reply("❌ Error creating ticket. Please contact an admin directly.");
                }
            }

            // Forward message to thread
            const content = message.content || "(No Content)";

            // Check for user-side close command
            if (content.trim().toLowerCase() === '!close') {
                if (!thread) return message.reply("❌ No active ticket found to close.");

                try {
                    await thread.send('🔒 **User has closed this ticket.**');
                    await thread.setLocked(true);
                    await thread.setArchived(true);
                    return message.reply("✅ Ticket closed.");
                } catch (error) {
                    console.error("Error closing thread from user side:", error);
                    return message.reply("❌ Error closing ticket.");
                }
            }

            const files = message.attachments.map(a => a.url);

            // User Message Embed
            const userEmbed = new EmbedBuilder()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(content)
                .setColor(0x57F287) // Greenish
                .setFooter({ text: 'User Message' })
                .setTimestamp();

            if (files.length > 0) {
                userEmbed.setImage(files[0]); // Display first image if present
                if (files.length > 1) userEmbed.addFields({ name: 'Attachments', value: files.join('\n') });
            }

            try {
                await thread.send({ embeds: [userEmbed] });
                await message.react('✅'); // Confirm receipt
            } catch (error) {
                console.error("Error forwarding to thread:", error);
                message.reply("❌ Failed to send message.");
            }
        }

        // -----------------------------
        // 2. Handle Thread Replies (Staff -> User)
        // -----------------------------
        else if (message.channel.type === ChannelType.PrivateThread || message.channel.type === ChannelType.PublicThread) {
            // Check if this thread belongs to mail channel
            if (message.channel.parentId !== mailChannelId) return;

            // Get User ID from Thread Name
            // Format: modmail-username-userid
            const parts = message.channel.name.split('-');
            const userId = parts[parts.length - 1]; // Last part is always ID

            // Basic validation that it looks like an ID (snowflakes are ~18-19 digits)
            if (!/^\d{17,20}$/.test(userId)) return;

            try {
                const user = await client.users.fetch(userId);

                const content = message.content || "";
                const files = message.attachments.map(a => a.url);

                // Staff Reply Embed
                const staffEmbed = new EmbedBuilder()
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                    .setDescription(content)
                    .setColor(0xEB459E) // Blurple/Pinkish
                    .setFooter({ text: `Staff: ${message.author.username}` }) // Show staff name in footer
                    .setTimestamp();

                if (files.length > 0) {
                    staffEmbed.setImage(files[0]);
                    if (files.length > 1) staffEmbed.addFields({ name: 'Attachments', value: files.join('\n') });
                }

                // Send DM
                await user.send({ embeds: [staffEmbed] });
                // await message.react('✅'); // Optional: confirm sent
            } catch (error) {
                console.error("Error replying to user:", error);
                message.reply("❌ Failed to send DM. User might have DMs off.");
            }
        }
    },
};
