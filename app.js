let currentUser = localStorage.getItem("vf_current_user");
let userData = { liked: [], playlists: [] };

const displayName = document.getElementById("displayName");
const songsGrid = document.getElementById("songsGrid");
const playlistList = document.getElementById("playlistList");
const newPlaylistBtn = document.getElementById("newPlaylistBtn");

if (!currentUser) location.href = "login.html";

displayName.textContent = currentUser;

// Load user data
const saved = localStorage.getItem("vf_user_" + currentUser);
if (saved) userData = JSON.parse(saved);

// Example songs (you will replace these)
const songs = [
  { id: "1", title: "Song One", artist: "Artist A", emoji: "🎵" },
  { id: "2", title: "Song Two", artist: "Artist B", emoji: "🔥" },
  { id: "3", title: "Song Three", artist: "Artist C", emoji: "🎧" }
];

// Render songs
function renderSongs() {
  songsGrid.innerHTML = "";
  songs.forEach(song => {
    const card = document.createElement("div");
    card.className = "song-card";
    card.dataset.id = song.id;

    card.innerHTML = `
      <div class="song-cover">${song.emoji}</div>
      <h3>${song.title}</h3>
      <p>${song.artist}</p>
      <button class="like-btn">♡</button>
    `;

    songsGrid.appendChild(card);
  });

  updateLikes();
}

// Like system
songsGrid.addEventListener("click", e => {
  if (!e.target.classList.contains("like-btn")) return;

  const id = e.target.closest(".song-card").dataset.id;

  if (userData.liked.includes(id)) {
    userData.liked = userData.liked.filter(x => x !== id);
  } else {
    userData.liked.push(id);
  }

  saveUser();
  updateLikes();
});

function updateLikes() {
  document.querySelectorAll(".song-card").forEach(card => {
    const id = card.dataset.id;
    const btn = card.querySelector(".like-btn");

    if (userData.liked.includes(id)) {
      btn.classList.add("liked");
      btn.textContent = "♥";
    } else {
      btn.classList.remove("liked");
      btn.textContent = "♡";
    }
  });
}

// Playlists
newPlaylistBtn.onclick = () => {
  const name = prompt("Playlist name:");
  if (!name) return;

  userData.playlists.push({ name, songs: [] });
  saveUser();
  renderPlaylists();
};

function renderPlaylists() {
  playlistList.innerHTML = "";
  userData.playlists.forEach(pl => {
    const li = document.createElement("li");
    li.textContent = pl.name;
    playlistList.appendChild(li);
  });
}

function saveUser() {
  localStorage.setItem("vf_user_" + currentUser, JSON.stringify(userData));
}

renderSongs();
renderPlaylists();
