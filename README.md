# Smash Stream Tool
A streaming tool for running Smash Bros.-streams.
Streamlines workflow by automating most of the Melee stream using Slippi, and updates Ultimate scoreboards using websockets instead of text files!

## Functionality checklist
 - [ ] Get character/port info from Slippi
 - [ ] Trigger transitions on Melee game start
 - [ ] Automatically switch between video capture and mirrored Dolphin capture
 - [ ] Automatically update scores using Slippi
 - [ ] Gather stats to present after the set
 - [ ] Manual OBS control (mostly for Ultimate)
 - [ ] Settings screen
 - [ ] Properly handle OBS/Slippi connection failure/drop
 - [ ] Separate Melee/Ultimate modes


## Requirements
Requires [Project Slippi](https://slippi.gg) set up for console mirroring for Melee automation

Requires [obs-websocket](https://github.com/Palakis/obs-websocket) to be installed for OBS scene switching and scoreboard control
