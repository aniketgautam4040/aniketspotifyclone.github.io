console.log | "lets write some javasript";

let currentSong = new Audio();
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currfolder = folder;
  let a = await fetch(`http://127.0.0.1:3000//${folder}/`);
  let response = await a.text();

  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;

  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }



   let songul = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
    songul.innerHTML=""
  for (const song of songs) {
    songul.innerHTML =
      songul.innerHTML +
      `<li> <img class= "invert" src="music.svg" alt="">
               <div class="info">
                  <div> ${song.replaceAll("%20", " ")}</div>
                  <div>Aniket</div>
                </div>
                <div class="playnow">
                <span>Play Now</sapn>
                <img class="invert" src="play.svg" alt="">
                </div></li>`;
  }
  
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
 
  
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currfolder}/`+ track;
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

  
};
async function main() {
   await getSongs("songs/sad");
  playMusic(songs[0], true);
  console.log(songs);
 
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });
  
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) * 100 +"%"
  })
  document.querySelector(".seekbar").addEventListener("click", e=>{
    let percent =  (e.offsetX/e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle").style.left = percent + "%"
    currentSong.currentTime = ((currentSong.duration)* percent)/100
  })
  document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "0"
  })
   document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "-100%"
  })
  pervious.addEventListener("click",()=>{
    console.log("pervious clicked")
    
      let index = songs.indexOf( currentSong.src.split("/").slice(-1)[0])

    if((index-1) >= 0)
    playMusic(songs[index-1])
  })
  next.addEventListener("click",()=>{
   
    console.log("Next clicked")
    let index = songs.indexOf( currentSong.src.split("/").slice(-1)[0])

    if((index+1) < songs.length-0)
    playMusic(songs[index+1])
})
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
  console.log("setting volume to" ,e.target.value)
  currentSong.volume = parseInt(e.target.value)/100
})
Array.from(document.getElementsByClassName("card")).forEach(e=>{
  e.addEventListener("click", async item=>{
    console.log(item,  item.currentTarget.dataset)
    songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
  })

  })
 document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })

}

main()
