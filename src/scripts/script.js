
const searchInput = document.getElementById("search-input");

const playListControls = document.querySelector(".playlists-controls");
const playlists = document.querySelector(".playlists");
const cardContainer = document.querySelector(".cards__container");
const tematicPlaylists = document.querySelector(".tematic-playlists");
const resultsArtists = document.querySelector(".searchResults__container");
const searchOptions = document.querySelector(".searchOptions");
const musicPlayerElement = document.querySelector(".playerMusic");


const card = document.querySelectorAll('.card')
const cardPlayBtn = document.querySelectorAll('.card-playBtn')

card.forEach((e, i) => {
  e.addEventListener("mouseenter", () => {
    cardPlayBtn[i].classList.remove("displayOff")
  })
  e.addEventListener("mouseleave", () => {
    cardPlayBtn[i].classList.add("displayOff")
  })
  e
})

const backbtn = document.getElementById('back-btn')
backbtn.addEventListener('click', () => location.reload())


const player = document.querySelector("#player");

function musicPlayer(songs) {

  const musicName = document.querySelector("#musicName");
  const playPauseBtn = document.querySelector("#playBtn");
  const playPauseImg = document.querySelector("#playBtn img");
  const prevBtn = document.querySelector("#prevBtn");
  const nextBtn = document.querySelector("#nextBtn");
  const currentTime = document.querySelector("#currentTime");
  const duration = document.querySelector("#duration");
  const progress = document.querySelector("#progress");
  const progressBar = document.querySelector(".player-progress");

  const pauseBtnSrc = "./assets/img/icons/pause.svg";
  const playBtnSrc = "./assets/img/icons/play.svg";

  let index = 0;

  prevBtn.addEventListener("click", () => prevNextMusic("prev"));
  nextBtn.addEventListener("click", () => prevNextMusic());

  playPauseBtn.addEventListener("click", () => playPause());

  document.querySelector('.play-btn__container').addEventListener('click', () => playPause())

  function playPause() {
    if (player.paused) {
      player.play();
      playPauseImg.src = pauseBtnSrc;
      playPauseBtn.style.backgroundColor = "#ffffff";
    } else {
      player.pause();
      playPauseImg.src = playBtnSrc;
      playPauseBtn.style.backgroundColor = "#4C4C4C";
    }
  }

  player.ontimeupdate = () => updateTime();

  function updateTime() {
    const currentMinutes = Math.floor(player.currentTime / 60);
    const curretSeconds = Math.floor(player.currentTime % 60);

    currentTime.textContent = currentMinutes + ":" + formateZero(curretSeconds);

    const durationFormatted = isNaN(player.duration) ? 0 : player.duration;
    const durationMinutes = Math.floor(durationFormatted / 60);
    const durationSeconds = Math.floor(durationFormatted % 60);

    duration.textContent = durationMinutes + ":" + formateZero(durationSeconds);

    const progressWidth = durationFormatted
      ? (player.currentTime / durationFormatted) * 100
      : 0;

    progress.style.width = progressWidth + "%";
  }

  function formateZero(n) {
    return n < 10 ? "0" + n : n;
  }

  progressBar.addEventListener("click", (e) => {
    const newTime = (e.offsetX / progressBar.offsetWidth) * player.duration;

    player.currentTime = newTime;
  });

  function prevNextMusic(type = "next") {
    if ((type == "next" && index + 1 === songs.length) || type === "init") {
      index = 0;
    } else if (type == "prev" && index === 0) {
      index = songs.length;
    } else {
      index = type === "prev" && index ? index - 1 : index + 1;
    }


    player.src = songs[index].src;
    musicName.textContent = songs[index].name;

    if (type !== "init") playPause();

    updateTime();
  }

  prevNextMusic("init");
}

function searchInputControl() {
  document.addEventListener("input", () => {

    fetch(
      "https://raw.githubusercontent.com/Joaommsp/Spotify-Front-End-Clone/main/artistsapi.json"
    )
      .then((response) => response.json())
      .then((data) => {
        let inputTerm = searchInput.value;
        let inputFormater = inputTerm.toLowerCase();

        let list = data.artists;
        let artistsToShow = [];

        let i = 0;
        while (i < list.length) {
          let artistName = list[i].name;
          let firstLetterName = artistName[0].toLowerCase();

          if (inputFormater[0] === firstLetterName && inputTerm !== "") {
            artistsToShow.push(list[i]);
          }
          i++;
        }

        if (inputTerm === "") {
          location.reload();
          itemsAdded = [];

          searchOptions.innerHTML = "";
          searchOptions.classList.add("displayOff");
          resultsArtists.classList.add("displayOff");
          playListControls.classList.remove("displayOff");
          cardContainer.classList.remove("displayOff");
          tematicPlaylists.classList.remove("displayOff");
          musicPlayerElement.classList.add("displayOff");
        }

        if (artistsToShow.length > 0) {
          displayOptions(artistsToShow);
        }
      });
  });
}

let itemsAdded = [];

function displayOptions(artistListToShow) {
  searchOptions.classList.remove("displayOff");
  resultsArtists.classList.add("displayOff");
  playListControls.classList.add("displayOff");
  cardContainer.classList.add("displayOff");
  tematicPlaylists.classList.add("displayOff");
  musicPlayerElement.classList.add("displayOff");

  let card = document.createElement("div");
  card.classList.add("cardOption");

  let artistImg = document.createElement("img");
  artistImg.classList.add("imgOption");

  let artistName = document.createElement("span");
  artistName.classList.add("nameOption");

  let artistGenre = document.createElement('span') 
  artistGenre.classList.add("genreOption");

  for (let i = 0; i < artistListToShow.length; i++) {
    if (!itemsAdded.includes(artistListToShow[i].id)) {
      itemsAdded.push(artistListToShow[i].id);

      artistImg.src = artistListToShow[i].urlImg;
      artistName.textContent = artistListToShow[i].name;
      artistGenre.textContent =  artistListToShow[i].genre;

      card.append(artistImg, artistName, artistGenre);
      card.addEventListener("click", () => {
        displayResults(artistListToShow[i])
      });

      searchOptions.appendChild(card);
    }
  }
}

searchInputControl();

function displayResults(artist) {
  let artistName = document.getElementById("search-name");
  let artistType = document.getElementById("search-type");
  let backGroundElement = document.querySelector(".search-header");

  musicPlayerElement.classList.remove("displayOff");
  musicPlayer(artist.songs);

  searchOptions.classList.add("displayOff");
  resultsArtists.classList.remove("displayOff");
  playListControls.classList.add("displayOff");
  cardContainer.classList.add("displayOff");
  tematicPlaylists.classList.add("displayOff");

  artistName.innerText = artist.name;
  artistType.innerText = artist.genre;

  backGroundElement.style.backgroundImage = `url(${artist.urlImg})`;
}
