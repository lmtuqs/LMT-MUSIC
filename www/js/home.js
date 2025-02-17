// #region [ Method ]
function renderData() {
    let data = topics;     

    let html = ``
    data.forEach(item => {        
        html += `<a class="item" href="/music?id=${item.id}">

                    <div class="thumb" style="background-image: url('/img/music/default.png')"></div>
                
                    <div class="body">
                        <h3 class="title">${item.name}</h3>        
                    </div>
                    
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                
                </a>`;
    })

    $(".container").append(html)
}
// #endregion

// #region [ Events ]

// #endregion

// #region [ Start App ]

function startApp() {
   renderData();
}

startApp();

// #endregion