const playlist = $('.play-list');

const app = {
    albums: [
        {
            name: 'Album Chúng ta',
            path: './album0.html',
            image: './assets_index/images/background-album0.png',
            singer: 'Sơn Tùng M-TP'
        },
    ],
    render: function() {
        const htmls = this.albums.map((album, index) => {
            return `<div class="album">
            <a href="${album.path}">
                <div class="thumb" style="background-image: url(${album.image})"></div>
            </a>
            <div class="album-name">${album.name}</div>
            <div class="singer">${album.singer}</div>                
            </div>`;                    
        })

        playlist.innerHTML = htmls.join('');
    },
    start: function() {
        // Render album
        this.render();
    }
}

app.start();