# Shortwave

A 1970s shortwave receiver with analogue tuning, a station guide, presets, reception logs and generated radio static. Built with plain HTML, CSS and JavaScript.

**Live demo:** https://ayo-2010.github.io/shortwave/

## Features

- Tune across 530–1600 kHz with the dial, arrow keys or the station guide
- Eight invented stations with locations, power, language and programme schedules
- Signal strength meter and reception descriptions that change as you tune
- Generated Web Audio static, tuning whistle and volume control
- Five presets with a store mode for saving the current frequency
- Scan to the next station on the dial
- Live clock and an on-air schedule for the selected station
- Reception book with time, frequency and signal strength, saved locally
- Responsive walnut cabinet layout down to 390px, reduced motion support and a global `[hidden]` rule

## Running it

Open `index.html` in a browser. There is no build step and no dependencies to install. Sound starts only after you press the power switch, as browsers require a user gesture before audio can play.

## Files

```
index.html
styles.css
app.js
```

## Tech

Plain HTML, CSS and JavaScript, with the Web Audio API for the receiver noise.
