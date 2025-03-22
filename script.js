let currentsong = new Audio();

async function getsongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith("mp3")) {
            // Get the filename directly from the href
            let filename = element.href.split("/songs/")[1];
            songs.push(filename); 
        }
    }
    
    return songs;
}


const playmusic = (track) => {
    console.log("Playing:", track);
    
    currentsong.src = "/songs/" + track;
    currentsong.play().then(() => {
        play.src = "pause.svg";
        document.querySelector(".songinfo").innerHTML = track;
        document.querySelector(".songtime").innerHTML = "00:00 / 00:00"; // Add this line
    })
};

async function main() {
    let songs = await getsongs();
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        let displayName = decodeURIComponent(song); // Decode for display
        songul.innerHTML += `<li data-song="${song}">
            <img class="invert" src="music.svg" alt="">
            <div class="info">
                <div>${displayName}</div>
                <div>Asim Khatri</div>
            </div>
            <div class="playnow">
                <span>Play now</span>
                <img class="invert" src="plays.svg" alt="">
            </div>
        </li>`;
    }
    
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            let songName = e.getAttribute("data-song");
            console.log(songName);
            playmusic(songName);
        });
    });

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play().then(() => {
                play.src = "pause.svg";
            }).catch((error) => {
                console.error("Error playing audio:", error);
            });
        } else {
            currentsong.pause();
            play.src = "plays.svg";
        }
    });
}
main();