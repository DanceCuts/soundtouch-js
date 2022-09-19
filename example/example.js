const context = new AudioContext();
let pitchshifter, buffer; //buffer must remain a global variable so it doesn't get deleted

//PLAYBACK
function play() {
    console.log("Playing...");
    pitchshifter.connect(context.destination);
}

function pause() {
    console.log("Paused");
    pitchshifter.disconnect();
}

//this "checkAudioState" trick is from the wavesurfer.js library
function checkAudioState() {
    if (context.state === "suspended") {
        console.log("AudioContext's state is SUSPENDED, attempting to resume...");
        context.resume();
    }
    else if (context.state === "running") {
        console.log("Captured AudioContext!");
        window.removeEventListener("click", checkAudioState);
        window.removeEventListener("touchstart", checkAudioState);
        window.removeEventListener("touchend", checkAudioState);
    }
    else {
        console.log("WARNING unknown AudioContext state: ", context.state);
    }
}
window.addEventListener("click", checkAudioState);
window.addEventListener("touchstart", checkAudioState);
window.addEventListener("touchend", checkAudioState);

document.getElementById('tempoSlider').addEventListener('input', (e) => {
    document.getElementById("tempoLabel").innerText = `${Math.round(e.target.value * 100)}%`;
    pitchshifter.tempo = e.target.value;
});

document.getElementById('pitchSlider').addEventListener('input', (e) => {
    document.getElementById("pitchLabel").innerText = `${Math.round(e.target.value * 100)}%`;
    pitchshifter.pitch = e.target.value;
});

document.getElementById('file').addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onload = (loadEvent) => {
        context.decodeAudioData(loadEvent.target.result, (buf) => {
            buffer = buf; //buffer must remain a global variable so it doesn't get deleted
            console.log(buffer);
            pitchshifter = new PitchShifter(context, buffer, buffer.length);
            pitchshifter.tempo = 1;
            pitchshifter.pitch = 1;
            console.log('Audio ready!');
            document.getElementById("controls").style = "";
        });
    };
});