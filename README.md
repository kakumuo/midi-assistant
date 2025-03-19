# Overview
A midi visualizer for piano
![alt text](./concept//sc1.png)

### Inspriation 
- Kepiano: https://x.com/kepano/status/1884672012292923580/video/1

## Dependencies
- React 
- MUI Joy
- Web Midi
- Tonal

# Todo
### Fixes
- Practice: 
    - ~~Accurate detection of tempo~~[DONE]
    - ~~Get velocity of multiple notes being held simultaneously~~[DONE]
    - ~~Add lines for notes outside of bar in chord viewer or implement existing library~~[DONE]
    - ~~Clef doesnt appear on page refresh/load~~[DONE]
    - ~~Stack CoF and scale display over each other when window width < window hieght~~[DONE]
    - ~~Show all notes faded out on scale display under chord, highlight when notes are pressed. Stack like keys on piano. Ignore octaves~~[DONE]
    - ~~Metronome highlights not showing up on iOS~~[IGNORE]
    - ~~Add Sustain input~~[DONE]
### Future
- General
    - Onscreen Virtual Keyboard (Controllable on PC Keyboard)
    - Save data to browser/server
    - Use Notes type/class from 'tonal' library
    - React Router
- Practice
    - ~~Session Duration: Pause, Reset, Start Countdown Timer~~ [DONE]
    - ~~Chord Viewer~~ [DONE]
    - ~~Circle of Fifths Viewer~~ [DONE]
    - ~~Metrinome~~ [DONE]
    - ~~Basic/Intermediate/Advanced Panel View (Tap/Click to Change Size)~~ [IGNORE]
    - ~~Long Press to reset individual panels~~ [IGNORE]
    - Y & X Axis w/ Gridlines to Tempo and Velocity charts
- Drills: 
    - Create, play, edit and delete drills
    - Display stats at the end of the exercise
- SightReading: 
    - Sightreading trainer
- Settings
    - View Connected Midi Device
    - Select Target Midi Device
    - UI Themeing
### Brainstorming
- Display when Midi Device is connected or removed
- ~~iOS Support through WebMidi App~~ [DONE]