// #region [ Request send to server ]
const RequestData = {

    get: async (route) => {
        
        try {

            const response = await fetch(route, {
                method: 'GET',
                headers: {                    
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('lmt-music-token')}`
                }               
            })
    
            return response;

        } catch (err) {

            console.error('Error post request: ' + err.message);
            return null
        }
        
    },   
        
    post: async (route, data) => {
        
        try {

            const response = await fetch(route, {
                method: 'POST',
                headers: {                    
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('lmt-music-token')}`
                },
                body: JSON.stringify(data),
            })
    
            return response;

        } catch (err) {

            console.error('Error post request: ' + err.message);
            return null

        }
        
    }

}
// #endregion

// #region [ Method ]

function getCrrTime() {
    const date = new Date();
    const options = { timeZone: "Asia/Bangkok", hour12: false }
    const timeStamp = date.toLocaleString("en-GB", options);
    return timeStamp;
}

function renderMenu() {
    
    let html = ``
    MenuData.forEach(item => {        
        html += `<a href="${item.Href}" class="menu-item">
                    <i class="fa-solid ${item.Icon ? item.Icon : "fa-tag"}"></i>
                    <span>${item.Name}</span>
                </a>`;
    })

    $("#menu").append(html)
}

renderMenu()

// #endregion

// #region [ Events ]
// #region [ Menu ]

$(document).on('click', '#btn-open-menu', function() {
    $("#overlay-menu").addClass("active")
})

$(document).on('click', '#overlay-menu', function(e) {
    if ($(e.target).hasClass("overlay")) {
        $("#overlay-menu").removeClass("active")
    }
})

// #endregion
$(document).on('click', '#btn-reload', function() {
    location.reload();
})
// #endregion