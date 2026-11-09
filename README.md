# TournamentHelper

Single-elimination tournament bracket simulator. Tournaments can have any number of contestants (2 or more): the bracket is padded with byes up to the next power of 2, and contestants facing a bye advance automatically.

Contestants can optionally be given a `seed` (1 being the best). Seeds must be unique and run 1, 2, 3... with no gaps. Seeded contestants get byes first and are placed so the top seeds can only meet in later rounds (1 and 2 in the final, 1 to 4 in the semifinals, and so on). Everyone else is shuffled into the remaining slots.

Each tournament has its own URL (`/t/<slug>` for the contestants, `/t/<slug>/play` to vote). The bracket is drawn when a tournament is first opened and saved in the browser after every pick, so refreshing or leaving picks up where you left off. Use **restart** in the bottom bar to throw it away and draw a new one. A saved bracket is also redrawn automatically if the tournament's contestants change.

While voting, **bracket** in the bottom bar shows the whole bracket (Escape or × closes it). The winner screen shows the finished bracket below the winner.

This project uses [Angular](https://angular.dev) version 22.

## Running Locally

In your terminal, type ```ng serve```, then navigate over to [localhost:4200](http://localhost:4200).

If you're running this inside [VSCode](https://code.visualstudio.com), just go the the "Run and Debug" tab in the sidebar, and click the green arrow at the top for the launch config "Serve Angular".

If your project's out of date, run ```git pull``` in your terminal to update it, or navigate to the "Source Control" tab in VSCode and in the source control dropdown, click the ellipsis that appear when hovered > Pull, Push > Pull.

## Code scaffolding

Run `ng g c components/component-name` to generate a new component, or `ng g c pages/page-name`. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.
