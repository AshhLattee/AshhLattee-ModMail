const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('Closes the current modmail ticket'),
    async execute(interaction) {
        // Check if inside a thread
        if (!interaction.channel.isThread()) {
            return interaction.reply({ content: 'This command can only be used in a ticket thread.', ephemeral: true });
        }

        const parts = interaction.channel.name.split('-');
        const userId = parts[parts.length - 1];

        // Basic validation
        if (!/^\d{17,20}$/.test(userId)) {
            return interaction.reply({ content: 'This thread does not seem to contain a valid User ID in the name.', ephemeral: true });
        }

        const client = interaction.client;

        await interaction.reply('🔒 Closing ticket...');

        // Notify User
        try {
            const user = await client.users.fetch(userId);
            await user.send('**Ticket Closed**\nYour support ticket has been closed by staff. If you need further assistance, please reply to create a new ticket.');
        } catch (error) {
            console.error('Could not DM user on close:', error);
            await interaction.followUp({ content: '⚠️ Could not notify user (DMs off?), but closing anyway.', ephemeral: true });
        }

        // Archive/Lock Thread
        try {
            await interaction.channel.setLocked(true);
            await interaction.channel.setArchived(true);
        } catch (error) {
            console.error('Error closing thread:', error);
            await interaction.followUp({ content: '❌ Error archiving thread. Check my permissions.', ephemeral: true });
        }
    },
};
