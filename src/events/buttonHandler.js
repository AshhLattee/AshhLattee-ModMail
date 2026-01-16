const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'close_ticket') {
            try {
                await interaction.deferReply();
            } catch (err) {
                if (err.code === 10062) return; // Unknown interaction (already handled/expired), ignore
                console.error("Interaction defer error:", err);
                return;
            }

            // Verify logic (similar to close command)
            const parts = interaction.channel.name.split('-');
            const userId = parts[parts.length - 1];

            if (!/^\d{17,20}$/.test(userId)) {
                return interaction.followUp({ content: '❌ Could not find user ID from thread name.', ephemeral: true });
            }

            // Close logic
            try {
                // Determine if interaction is from Staff or User (though button is only in thread for now)
                const isStaff = !interaction.user.bot; // For now assuming anyone clicking in thread is staff

                // Notify User
                const client = interaction.client;
                try {
                    const user = await client.users.fetch(userId);
                    await user.send('**Ticket Closed**\nYour ticket has been closed via the dashboard button.');
                } catch (err) {
                    console.log('Could not DM user', err);
                }

                await interaction.followUp('🔒 Button clicked: Closing ticket...');
                await interaction.channel.setLocked(true);
                await interaction.channel.setArchived(true);

            } catch (error) {
                console.error("Error closing via button:", error);
                await interaction.followUp({ content: '❌ Error closing ticket.', ephemeral: true });
            }
        }
    },
};
