# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-01-16
### Added
- Initial release of the Modmail Bot.
- **core**: Database-free ticket system using Discord Threads.
- **core**: `/close` slash command for staff.
- **core**: `!close` DM command for users.
- **ui**: Beautiful Rich Embeds for new tickets, messages, and staff replies.
- **ui**: "Modmail" naming convention for consistency.

### Fixed
- Fixed issue where `setTopic` failed on Private Threads by moving ID storage to Thread Name.
