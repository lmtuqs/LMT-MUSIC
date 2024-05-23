const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Khai báo các biến
const player = $('.player');

const headingSong = $('header h2');

const cd = $('.cd');
const cdThumb = $('.cd-thumb');

const btnRepeat = $('.btn-repeat');
const btnPrev = $('.btn-prev');
const btnPlay = $('.btn-toggle-play');
const btnNext = $('.btn-next');
const btnRandom = $('.btn-random');

const timer = $('.time-remain')
const progress = $('#progress');

const audioVolumeBar = $('#progress-volume')
let volumeValue = audioVolumeBar.value / 100;
const currentVolume = $('.current-volume')

const audioVolumeWarn = $('.audio-control-volume-warn')
const volumeWarnClose = $('.volume-warn-close-btn')

const audio = $('#audio');

const playlist = $('.playlist');

const PLAYER_STORAGE_KEY = 'LMT_Player'

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    randomPlaylist: [],
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs: [

        {
            name: 'Cẩm tú cầu',
            singer: 'AT',
            path: './assets_album0/music/camtucau_at.mp3',
            image: './assets_album0/images/camtucau.png'
        },
        {
            name: 'Chỉ là',
            singer: 'AT',
            path: './assets_album0/music/chila_at.mp3',
            image: './assets_album0/images/camtucau.png'
        },
        {
            name: 'Có thể hay không',
            singer: 'AT',
            path: './assets_album0/music/cothehaykhong_at.mp3',
            image: './assets_album0/images/camtucau.png'
        },

        {
            name: 'Đào hoa mặc',
            singer: 'AT',
            path: './assets_album0/music/daohoamac_at.mp3',
            image: './assets_album0/images/camtucau.png'
        },

        {
            name: 'Kẻ theo đuổi ánh sáng',
            singer: 'AT',
            path: './assets_album0/music/ketheoduoianhsang_at.mp3',
            image: './assets_album0/images/camtucau.png'
        },

        {
            name: 'Không thể say',
            singer: 'AT',
            path: './assets_album0/music/khongthesay_at.mp3',
            image: './assets_album0/images/camtucau.png'
        },

        {
            name: 'Chạy ngay đi',
            singer: 'Sơn Tùng M-TP',
            path: './assets_album0/music/song0.mp3',
            image: './assets_album0/images/song0.png'
        },

        {
            name: 'Nắng ấm xa dần',
            singer: 'Sơn Tùng M-TP',
            path: './assets_album0/music/song1.mp3',
            image: './assets_album0/images/song1.png'
        },

        {
            name: 'Hãy trao cho anh',
            singer: 'Sơn Tùng M-TP',
            path: './assets_album0/music/song2.mp3',
            image: './assets_album0/images/song2.png'
        },

        {
            name: 'Âm thầm bên em',
            singer: 'Sơn Tùng M-TP',
            path: './assets_album0/music/song3.mp3',
            image: './assets_album0/images/song3.png'
        },

        {
            name: 'Buông đôi tay nhau ra',
            singer: 'Sơn Tùng M-TP',
            path: './assets_album0/music/song4.mp3',
            image: './assets_album0/images/song4.png'
        },

        {
            name: 'Chúng ta không thuộc về nhau',
            singer: 'Sơn Tùng M-TP',
            path: './assets_album0/music/song5.mp3',
            image: './assets_album0/images/song5.png'
        },

        {
            name: 'Lạc trôi',
            singer: 'Sơn Tùng M-TP',
            path: './assets_album0/music/song6.mp3',
            image: './assets_album0/images/song6.png'
        },

        {
            name: 'Nơi này có anh',
            singer: 'Sơn Tùng M-TP',
            path: './assets_album0/music/song7.mp3',
            image: './assets_album0/images/song7.png'
        },

        {
            name: 'Có chắc yêu là đây',
            singer: 'Sơn Tùng M-TP',
            path: './assets_album0/music/song8.mp3',
            image: './assets_album0/images/song8.png'
        },

        {
            name: 'Muộn rồi mà sao còn',
            singer: 'Sơn Tùng M-TP',
            path: './assets_album0/music/song9.mp3',
            image: './assets_album0/images/song9.png'
        },

        
    ],

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">

            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
      
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
    },

    handleEvents: function() {  
        _this = this;      
        const cdWidth = cd.offsetWidth;

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: `rotate(360deg)`}
        ], {
            duration: 10000,
            iterations: Infinity,
        })

        cdThumbAnimate.pause();

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;

            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;

            cd.style.opacity = newCdWidth / cdWidth;
        }

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

        // Khi bài hát dừng
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Xử lý thanh âm lượng khi có sự thay đổi trên thanh điều khiển âm thanh
        audioVolumeBar.oninput = function(e) {
            volumeValue = e.target.value / audioVolumeBar.max
            audio.volume = volumeValue
            currentVolume.textContent = e.target.value
        }

        // Khi tiến độ bài hát thay đổi 
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
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
        }

        // Xử lý khi nhấn nút next song
        btnNext.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong();                
            } else {
                _this.nextSong();               
            }
            audio.play();
            _this.scrollToActiveSong();
        }

        // Xử lý khi nhấn prev song
        btnPrev.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();                
            }
            audio.play();
            _this.scrollToActiveSong();
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
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        btnRandom.classList.toggle('active', this.isRandom);  
        this.isRepeat = this.config.isRepeat;
        btnRepeat.classList.toggle('active', this.isRepeat);
    },

    scrollToActiveSong: function() {
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
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

        console.log(this.songs.length - this.randomPlaylist.length)
        const songs = $$('.song');
        songs[oldIndex].classList.remove('active');

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    
    start: function() {
        // Gán cấu hình config vào object app
        this.loadConfig();

        // Định nghĩa thuộc tính cho Object
        this.defineProperties();

        // Lắng nghe / xử lý sự kiện (DOM Events)
        this.handleEvents();

        // Tải lên thông tin bài hát đầu tiên lên UI 
        this.loadCurrentSong();        

        // Render playlist
        this.render();
    },
}

app.start();