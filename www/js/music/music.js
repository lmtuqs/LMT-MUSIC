// #region [ Album ]
const $$ = document.querySelectorAll.bind(document);

// Khai báo các biến
const player = $('.player')[0];

const headingSong = $('header h2')[0];

const cdThumb = $('.cd-thumb')[0];

const btnRepeat = $('.btn-repeat')[0];
const btnPrev = $('.btn-prev')[0];
const btnPlay = $('.btn-toggle-play')[0];
const btnNext = $('.btn-next')[0];
const btnRandom = $('.btn-random')[0];

const timer = $('.time-remain')[0]
const progress = $('#progress')[0];

const audioVolumeBar = $('#progress-volume')[0];
let volumeValue = audioVolumeBar.value / 100;

const audioVolumeWarn = $('.audio-control-volume-warn')[0];
const volumeWarnClose = $('.volume-warn-close-btn')[0];

const audio = $('#audio')[0];

const playlist = $('.playlist')[0];

const PLAYER_STORAGE_KEY = 'LMT-MUSIC-Player'
const HISTORY_STORAGE_KEY = 'LMT-MUSIC-History'

const app = {
    currentIndex: 0,
    topicID: location.search.split("=")[1],
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    randomPlaylist: [],
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    history: JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs: topics[0].audios,

    render: function() {
        const htmls = this.songs.map((song, index) => {
            let imgPath = song.id.includes("HSK") ? 'default' : `${song.id}`
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">

                        <div class="thumb" style="background-image: url('/img/music/${imgPath}.png')"></div>
                
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
      
                    </div>`;                    
        })

        playlist.innerHTML = htmls.join('');

        // Album
        $('#album').text(`Nhạc - ${this.songs.length} ca khúc`)
    },

    handleEvents: function() {  
        _this = this;                       

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: `rotate(360deg)`
            }
        ], 
        {
            duration: 10000,
            iterations: Infinity,
        })

        cdThumbAnimate.pause();        

        // Xử lý khi nhấn play audio
        btnPlay.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }        

        // Khi bài hát được phát
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
            audio.volume = volumeValue;
            
            const songs = $$('.song');
            songs[_this.currentIndex].classList.add('active');                        
        }

        // Save history 
        let intervalSaveHistory = setInterval(() => {
            
            if (_this.isPlaying) {
                _this.history[_this.topicID] = {
                    currentSongID: _this.currentSong.id,
                    currentSongTime: audio.currentTime
                }         
                
                localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(_this.history));                
            }

        }, 1000);        

        // Khi bài hát dừng
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Xử lý thanh âm lượng khi có sự thay đổi trên thanh điều khiển âm thanh
        let interalTime = null;
        let crrTime = null;
        audioVolumeBar.oninput = function(e) { 
            volumeValue = e.target.value / audioVolumeBar.max 
            handleVolume()                                 
        }

        // let gain = 2;
        // let track, gainNode;
        // let audioContext = null;
        $(document).on('click', '.btn-volume', function(e) {
            const type = $(this).data("value");            
            volumeValue = audio.volume;               
            if (type == true) {
                volumeValue += 0.1;
                if (volumeValue > 1) volumeValue = 1;                
            } else if (type == false) {
                volumeValue -= 0.1;
                if (volumeValue < 0) volumeValue = 0;
            }                       
            
            audioVolumeBar.value = volumeValue * 100;            
            handleVolume();

            // Khuếch đại âm lượng  
            // if (audioContext == null) {
            //     audioContext = new (window.AudioContext || window.webkitAudioContext)();
            //     track = audioContext.createMediaElementSource(audio);
            //     gainNode = audioContext.createGain();
            //     track.connect(gainNode).connect(audioContext.destination);
            // }

            // gainNode.gain.value = gain++;        
            // alert(gain)

            // if (audioContext == null)
            //     audio.addEventListener("play", () => {
            //         if (audioContext.state === "suspended") {
            //             audioContext.resume();
            //         }
            //     });
        })

        function handleVolume() {
            audioVolumeBar.style.opacity = 1;

            crrTime = Date.now();              
            if (!interalTime) {
                interalTime = setInterval(() => {                                   
                    let time = Date.now() - crrTime;
                    if (time > 2000) {
                        audioVolumeBar.style.opacity = 0;
                        clearInterval(interalTime)
                        interalTime = null;
                    }
                }, 1000);
            }

            audio.volume = volumeValue
            audioVolumeBar.style.background = `linear-gradient(to right, var(--primary-color) ${audioVolumeBar.value}%, #c0e3fe ${audioVolumeBar.value}%)`;
        }        

        // Xử lý tua bài hát
        $(document).on('click', '.btn-seek', function() {
            const type = $(this).data("type");
            const value = Number.parseInt($("#seek-value").text());
            if (type == "backward") {
                audio.currentTime -= value;
            } else if (type == "forward") {
                audio.currentTime += value;
            }
        })

        // Khi tiến độ bài hát thay đổi 
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                changeProgress(progressPercent)
                progress.value = progressPercent;

                const timeRemain = audio.duration - audio.currentTime
                let timeRemainAsMinute
                if (Math.floor(timeRemain % 60) < 10) {
                    timeRemainAsMinute = (timeRemain - (timeRemain % 60)) /60 + ':0' + Math.floor(timeRemain % 60)
                    timer.textContent = timeRemainAsMinute
                } else {
                    timeRemainAsMinute = (timeRemain - (timeRemain % 60)) /60 + ':' + Math.floor(timeRemain % 60)
                    timer.textContent = timeRemainAsMinute
                }
            }
        }

        // Xử lý khi tua
        progress.oninput = function(e) {
            seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
            changeProgress(e.target.value)
        }

        function changeProgress(percentage) {            
            // Thay đổi màu background
            percentage = percentage < 50 ? percentage + 1 : percentage
            progress.style.background = `linear-gradient(to right, var(--primary-color) ${percentage}%, #c0e3fe ${percentage}%)`;
        
        }

        // Xử lý khi nhấn nút next song
        btnNext.onclick = function() {
            nextSong();
        }

        function nextSong() {
            if (_this.isRandom) {
                _this.randomSong();                
            } else {
                _this.nextSong();               
            }
            audio.play();
            _this.scrollToActiveSong();
        }

        function previousSong() {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();                
            }
            audio.play();
            _this.scrollToActiveSong();
        }

        // Xử lý khi nhấn prev song
        btnPrev.onclick = function() {
            previousSong()
        }

        // Xử lý nhấn vào nút next hoặc previous trên điều khiển thu nhỏ của trình duyệt
        if ('mediaSession' in navigator) {        
            navigator.mediaSession.setActionHandler('nexttrack', nextSong);
            navigator.mediaSession.setActionHandler('previoustrack', previousSong);
        }        

        // Xử lý phát bài hát ngẫu nhiên
        btnRandom.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            btnRandom.classList.toggle('active', _this.isRandom)
        }

        // Xử lý khi bài hát kết thúc
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            } else {
                btnNext.click();                                
            }
        }

        // Xử lý khi phát lại bài hát
        btnRepeat.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            btnRepeat.classList.toggle('active', _this.isRepeat);
        }

        // Xử lý khi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            const optionNode =  e.target.closest('.option')
            if ( songNode || optionNode ) {
                // Xử lý khi click vào bài hát
                if (songNode && !optionNode) {
                    let indexSongPrev = _this.currentIndex;
                    const indexSongClicked = Number.parseInt(songNode.dataset.index);
                    _this.onclickSong(indexSongPrev, indexSongClicked);
                    audio.play();
                    _this.scrollToActiveSong();                   
                }

                // Xử lý khi click vào option
                if ( optionNode && !songNode) {
                    
                }
            }
        }
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    loadCurrentSong: function() {        
        headingSong.textContent = this.currentSong.name;
        let imgPath = this.currentSong.id.includes("HSK") ? 'default' : `${this.currentSong.id}`
        cdThumb.style.backgroundImage = `url('/img/music/${imgPath}.png')`;
        // audio.src = `/audio/music/${this.currentSong.id}.mp3`;
        audio.src = `https://github.com/phanmemlmt/sources-music/raw/refs/heads/main/lmt-tool-audio/${this.currentSong.id}.mp3`;
        audio.volume = volumeValue;

        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: this.currentSong.name,
                artist: this.currentSong.singer,
                album: 'My Playlist',
                artwork: [
                    { src: `/img/music/${imgPath}.png`, sizes: '512x512', type: 'image/jpeg' }, // Ảnh bìa (tuỳ chọn)
                ],
            });
        }
    },

    loadHistory: function() {
        _this = this;

        if (_this.topicID && _this.history[_this.topicID]) {   
            
            console.log(_this.history);
            
            
            let item = _this.history[_this.topicID];
            _this.songs.forEach((song, index) => {
                if (song.id == item.currentSongID) {

                    _this.currentIndex = index;

                    _this.loadCurrentSong();
                    _this.scrollToActiveSong();

                    audio.currentTime = item.currentSongTime;
                };
            });            

        } else {           
            _this.loadCurrentSong();
        }
    },

    loadConfig: function() {    
        
        // Get audio list       
        if (this.topicID) {
            let topic = topics.filter(topic => topic.id == this.topicID)[0];
            this.songs = topic.audios;                            
        }                              
        
        this.isRandom = this.config.isRandom;
        if (this.isRandom == true) {
            btnRandom.classList.add('active');  
        }
        this.isRepeat = this.config.isRepeat;
        if (this.isRepeat) btnRepeat.classList.add('active');
    },

    scrollToActiveSong: function() {
        setTimeout(()=>{
            $('.song.active')[0].scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            })
        }, 200)
    },

    onclickSong: function(indexPrev, indexClicked) {                  
        const songs = $$('.song');
        songs[indexPrev].classList.remove('active');
        this.currentIndex = indexClicked;
        this.loadCurrentSong();
    },

    nextSong: function() {
        this.currentIndex++;
        
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
            const songs = $$('.song');
            songs[_this.songs.length - 1 ].classList.remove('active');     
        } else {
            const songs = $$('.song');
            songs[_this.currentIndex - 1].classList.remove('active'); 
        }


        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex--;
        
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
            const songs = $$('.song');
            songs[0].classList.remove('active');     
        } else {
            const songs = $$('.song');
            songs[_this.currentIndex + 1].classList.remove('active');
        }

        this.loadCurrentSong();
    },

    randomSong: function() {
        let oldIndex = this.currentIndex;
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(this.randomPlaylist.includes(newIndex) || newIndex === oldIndex);

        this.randomPlaylist = this.randomPlaylist.concat([newIndex]);
        
        if (this.songs.length - this.randomPlaylist.length === 0) {            
            this.randomPlaylist = [];
        }
       
        const songs = $$('.song');
        songs[oldIndex].classList.remove('active');

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    
    start: function() { 
                
        renderMenu();

        // Gán cấu hình config vào object app
        this.loadConfig();

        // Định nghĩa thuộc tính cho Object
        this.defineProperties();

        // Lắng nghe / xử lý sự kiện (DOM Events)
        this.handleEvents();
       
        // Load history
        this.loadHistory();

        // Render playlist
        this.render();
    },
}

app.start();
// #endregion