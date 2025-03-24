let currentsong = new Audio();

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
    return "Invalid input";
    }
   const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
   const formattedSeconds = String(remainingSeconds).padStart(2, '0')
    return `${formattedMinutes}:${formattedSeconds}`;
}
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


const playmusic = (track, pause=false) => {
    currentsong.src = "/songs/" + track;
    if (!pause) {
       currentsong.play()
       play.src = "pause.svg";
    }

        document.querySelector(".songinfo").innerHTML = decodeURIComponent(track);
        document.querySelector(".songtime").innerHTML = "00:00 / 00:00"; // Add this line
};

async function main() {
    let songs = await getsongs();
    playmusic(songs[0], true)

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

    currentsong.addEventListener("timeupdate", ()=>{
        console.log(currentsong.currentTime, currentsong.duration); 
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
    document.querySelector(".circle").style.left = (currentsong.currentTime/ currentsong.duration) * 100 + "%"
    })

   document.querySelector(".seekbar").addEventListener("click", e=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%"
    currentsong.currentTime = ((currentsong.duration)* percent)/100
})
document.querySelector(".hamburger").addEventListener("click", ()=>{
document.querySelector(".left").style.left = "0"
})
document.querySelector(".close").addEventListener("click", ()=>{
    document.querySelector(".left").style.left = "-100%"
    })
}
main();