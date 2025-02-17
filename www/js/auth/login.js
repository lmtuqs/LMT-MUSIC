const btnSendPin = $("#btn-send-pin");

$(document).on('click', '#btn-send-pin', async function() {    

    let data = {
        email: $("#Email").val()
    }   

    let res = await RequestData.post("/send-pin", data);    
    
    res = await res.json();

    if (res.status) countDown(180);

    alert(res.message);
})

$(document).on('click', '#btn-submit', async function() {
    let data = {
        email: $("#Email").val(),
        pin: $("#Pin").val()
    }   

    let res = await RequestData.post("/login", data);        
        
    res = await res.json();
    if (res.url) {
        location.href = res.url;
    } else {
        alert(res.message); 
    }
})

function countDown(time) { 
    btnSendPin.prop("disabled", true);   
    btnSendPin.text(time + "s");
    let interval = setInterval(() => {
        btnSendPin.text(--time + "s");
        if (time == 0) {
            clearInterval(interval);
            btnSendPin.text("Gửi Mã");
            btnSendPin.prop("disabled", false);
        }
    }, 1000);
}