


function toggleActiveClass(add) {
    const elements = [
        ".right-side", ".one-side", ".header", ".hamm", ".ham", ".close", ".first", "#show", 
        ".four-divs", "#ooo", "#ooo2", "#ooo3", 
        "#ooo4", "#imgg", "#imgg2", "#imgg3", "#imgg4", ".first-table", ".stay", ".second-table", ".inside", ".far", ".one-s", ".stside", ".signup-back", ".stside1", ".signup-back1", ".stside2", ".four-divs2", "#oooo", "#oooo2", "#oooo3", "#oooo4", "#imggg", "#imggg2", "#imggg3", "#imggg4", ".table2", ".go", "#inpp", "#tab", "#sel", "#selp", ".stside3", ".four-divs3", "#ooooo", "#ooooo2", "#ooooo3", "#imgggg", "#imgggg2", "#imgggg3", ".table3", ".goo", "#inppp", "#tabb",
    ];
    elements.forEach(selector => {
        document.querySelector(selector).classList[add ? 'add' : 'remove']("active");
    });
}

document.querySelector(".ham").addEventListener("click", function() {
    toggleActiveClass(true);
});

document.querySelector(".close").addEventListener("click", function() {
    toggleActiveClass(false);
});







// Cache frequently accessed elements
const elements = {
    tootop: document.querySelector(".tootop"),
    every: document.querySelector(".every"),
    every2: document.querySelector(".every2"),
    every3: document.querySelector(".every3"),
    every4: document.querySelector(".every4"),
    every5: document.querySelector(".every5"),
    rotate2: document.querySelector("#rotate2"),
    rotate: document.querySelector("#rotate"),
    subp: document.querySelector(".subp")
};


// ham up

document.addEventListener("DOMContentLoaded", function() {
    const ham = document.querySelector(".ham");
    const close = document.querySelector(".close");
    const tootop = document.querySelector(".tootop");

    if (ham && tootop) {
        ham.addEventListener("click", function() {
            tootop.classList.add("highlight");
        });
    }

    if (close && tootop) {
        close.addEventListener("click", function() {
            tootop.classList.remove("highlight");
        });
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const profile = document.querySelector(".profile");
    const tootop = document.querySelector(".tootop");

    if (profile && tootop) {
        profile.addEventListener("click", function() {
            tootop.classList.toggle("active");
        });
    }
});




// Utility functions
function toggleClass(element, className) {
    if (element) element.classList.toggle(className);
}

function addClass(element, className) {
    if (element) element.classList.add(className);
}

function removeClass(element, className) {
    if (element) element.classList.remove(className);
}

function clearActiveClasses() {
    removeClass(elements.every, "active");
    removeClass(elements.every2, "active");
    removeClass(elements.every3, "active");
    removeClass(elements.every4, "active");
    removeClass(elements.every5, "active");
}

// Event listeners
document.addEventListener("click", function(e) {
    switch (e.target.id) {
        case "dashboard":
            clearActiveClasses();
            break;
        case "Signup":
            clearActiveClasses();
            addClass(elements.every, "active");
            addClass(elements.every2, "active");
            break;
        case "profile":
            clearActiveClasses();
            addClass(elements.every, "active");
            addClass(elements.every3, "active");
            break;
        case "wallet":
            toggleClass(elements.rotate2, "active");
            toggleClass(elements.rotate, "active");
            toggleClass(elements.subp, "active");
            break;
    }

    switch (e.target.className) {
        case "ham":
            addClass(elements.tootop, "highlight");
            break;
        case "close":
            removeClass(elements.tootop, "highlight");
            break;
        case "profile":
            toggleClass(elements.tootop, "active");
            break;
        case "sum":
            clearActiveClasses();
            addClass(elements.every, "active");
            addClass(elements.every4, "active");
            break;
        case "topup":
            clearActiveClasses();
            addClass(elements.every, "active");
            addClass(elements.every5, "active");
            break;
    }
});



document.querySelector(".moon").addEventListener("click",function(){
    document.querySelector(".moon").classList.add("active")
    document.querySelector(".sun").classList.add("active")
    document.getElementById("bell").classList.add("active")
    document.querySelector("body").classList.add("active")
    document.querySelector(".tables").classList.add("highlight")
    document.querySelector(".signup-back").classList.add("highlight")
    document.querySelector(".signup-back1").classList.add("highlight")
    document.querySelector(".table2").classList.add("highlight")
    document.querySelector(".table3").classList.add("highlight")
})

document.querySelector(".sun").addEventListener("click",function(){
    document.querySelector(".moon").classList.remove("active")
    document.querySelector(".sun").classList.remove("active")
    document.getElementById("bell").classList.remove("active")
    document.querySelector("body").classList.remove("active")
    document.querySelector(".tables").classList.remove("highlight")
    document.querySelector(".signup-back").classList.remove("highlight")
    document.querySelector(".signup-back1").classList.remove("highlight")
    document.querySelector(".table2").classList.remove("highlight")
    document.querySelector(".table3").classList.remove("highlight")
})
// script.js

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("act");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
}

// Get the second modal
// var modal2 = document.getElementById("myModal2");

// // Get the button that opens the modal
// var update = document.getElementById("act2");

// // Get the <span> element that closes the modal
// var span2 = document.getElementsByClassName("close")[0];

// // When the user clicks the button, open the modal 
// update.onclick = function() {
//   modal2.style.display = "block";
// }

// // When the user clicks on <span> (x), close the modal
// span2.onclick = function() {
//   modal2.style.display = "none";
// }

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target === modal2) {
//     modal2.style.display = "none";
//   }
// }
