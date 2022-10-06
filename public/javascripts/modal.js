// let modalBtn = document.getElementsByClassName("toggle-button");
// let modal = document.querySelector("#myModal")
// let closeBtn = document.querySelector(".closeBtn")

var toggleButton = document.querySelector(".toggle-button");
// let modalBtn = document.getElementById("myBtn");
let modal = document.querySelector(".modal")
let closeBtn = document.querySelector(".closeBtn")

toggleButton.onclick = function(){
    modal.style.display = "block"
}

closeBtn.onclick = function(){
    modal.style.display = "none"
}

window.onclick = function(e){
    if(e.target == modal && window.screen.width <= "40rem" && window.screen.height <= "40rem"){
      modal.style.display = "none"
    }
    // else {
    //     modal.style.display = "inline-block"
    // }
}