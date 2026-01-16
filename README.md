# 📨 Discord Modmail Bot

A professionally designed, database-free Modmail solution for Discord communities. This application leverages **Discord Threads** to offer a streamlined, efficient support ticket system that maintains server organization without the need for external database infrastructure.

---

## ⚖️ Licensing & Usage Restrictions

This project is released under the **Apache License 2.0**, modified with the **Commons Clause**.

### 🚫 Commercial Use Prohibited
**The sale, resale, or commercial distribution of this software is strictly prohibited.**

By accessing, downloading, or using this software, you acknowledge and agree that:
1.  **No Commercial Distribution**: You may not sell, rent, lease, or sublicense this software.
2.  **No Paid Services**: You may not include this software as part of a paid service, hosting package, or premium feature set.
3.  **Personal & Internal Use Only**: Usage is permitted for personal, extensive, or internal business purposes, provided no fees are charged for the software itself.

### 🛡️ Enforcement Policy
We actively monitor and protect our intellectual property rights. Violations of the license terms will be met with immediate and decisive action, including but not limited to:
*   **DMCA Takedown Notices**: Immediate removal of infringing repositories or hosted instances.
*   **Legal Action**: Issuance of Cease & Desist orders and potential pursuit of damages.
*   **Public Disclosure**: Documented instances of license violation may be publicly listed.

**License**: Apache License 2.0 + Commons Clause.

---

## 👤 Author & Credits

**Developed by: Ashhlattee**

*   **Discord**: Ashhlattee
*   **GitHub**: [Ashhlattee](https://github.com/AshhLattee)

*If you find this project useful, please consider starring the repository.* ⭐

> **🤖 AI Augmented Engineering**
> This project was architected and implemented by an **AI Augmented Engineer**, utilizing advanced Artificial Intelligence to ensure high-quality, maintainable, and efficient code standards.

---

## ✨ Key Features

*   **Zero-Database Architecture**: Utilizes Discord's native Thread naming conventions for persistent state management, eliminating external dependencies.
*   **Professional UI/UX**: Features standardized, aesthetically pleasing Rich Embeds for all user and staff interactions.
*   **Intuitive Workflow**: Seamlessly bridges Direct Messages to Server Threads, offering a familiar experience for both users and moderation staff.
*   **Command Suite**: Includes staff-side Slash Commands (`/close`) and user-side DM commands (`!close`) for full lifecycle management.

## 🚀 Installation & Configuration

1.  **Clone the Repository**
2.  **Install Dependencies**
    Execute the following command to install required packages:
    ```bash
    npm install
    ```
3.  **Environment Configuration**
    Create a `.env` file based on the provided `.env.example` and populate the necessary credentials:
    ```env
    DISCORD_TOKEN=your_bot_token_here
    GUILD_ID=your_server_id_here
    MAIL_CHANNEL_ID=your_modmail_channel_id_here
    ```
4.  **Launch Application**
    Start the bot instance:
    ```bash
    npm start
    ```
