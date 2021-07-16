# SerenityOS' supported CSS properties
This is a simple webpage (hosted [here](https://css.tobyase.de)) that displays the most used CSS-properties and whether [SerenityOS](https://github.com/SerenityOS/serenity)' Browser implements them.

## Inner workings
Google provides us with the tasty [CSS-property-metric-data](https://chromestatus.com/metrics/css/popularity) collected by the usage statistics in Chrome. Conveniently there is an endpoint that just spits out JSON.

Getting the implemented properties from SerenityOS is a bit harder and also quite naive:
There is a file called [`Properties.json`](https://github.com/SerenityOS/serenity/blob/master/Userland/Libraries/LibWeb/CSS/Properties.json) that includes all properties that the parser recognizes. However this doesn't neccessarily imply that the given properties are indeed implemented nor that they are in any way shape or form spec-compliant. It's a good first approximation though.

## Build instructions
It's plain HTML, SCSS and JavaScript.

To create the CSS from SCSS use your favourite converter, for example [this](https://marketplace.visualstudio.com/items?itemName=ritwickdey.live-sass) VS Code extension.

## Contributors
- [TobyAsE](https://github.com/TobyAsE)
- [AtkinsSJ](https://github.com/AtkinsSJ)
