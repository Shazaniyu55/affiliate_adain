

// window.alert("oooooo")

// window.alert("ddjjddj")

// document.getElementById("wallet").addEventListener("click", function(){

//     window.location = "wallet.html"

// })

// document.getElementById("withdraw").addEventListener("click", function(){

//     window.location = "withdraw.html"

// })

// document.getElementById("plan").addEventListener("click", function(){

//     window.location = "plan.html"

// })

document.querySelector("#toback").addEventListener("mouseover", function(){
    // window.alert("jjj")
    document.getElementById("backimg").classList.add("active")
})
document.querySelector("#toback").addEventListener("mouseout", function(){
    // window.alert("jjj")
    document.getElementById("backimg").classList.remove("active")
})



document.getElementById("withdraw").addEventListener("click", function(){
document.getElementById("withdraw").classList.add("active")
document.getElementById("plan").classList.add("active")
document.getElementById("upgrade").classList.remove("active")

document.querySelector("#Top-up").classList.remove("active")
document.querySelector(".vtu").classList.remove("active")
})

// document.getElementById("upgrade").addEventListener("click", function(){

//     // document.getElementById("withdraw").classList.remove("active")
//     // document.getElementById("upgrade").classList.add("active")
//     // document.getElementById("plan").classList.add("active")
//     // // document.querySelector(".upgrade").classList.add("active")
//     // document.querySelector(".pland").classList.add("active")

//     window.location = "upgrade.html"

// })



// document.getElementById("Top-up").addEventListener("click", function(){

//     window.location = "vtu.html"
// })


// document.getElementById("tools").addEventListener("click", function(){

//     window.location = "tools.html"
// })
// document.getElementById("profile").addEventListener("click", function(){

//     window.location = "profile.html"
// })



// document.getElementById("moon").addEventListener("click", function rat(){
//     // window.alert("kkk")
//     document.getElementById("moon").classList.add("active")
//     document.getElementById("sun").classList.add("active")
//     document.querySelector("body").classList.add("highlight")
//     document.querySelector(".side-bar").classList.add("highlight")
//     document.querySelector(".tootop").classList.add("highlight")
//     document.querySelector(".nav").classList.add("highlight")
//     document.querySelector(".nav2").classList.add("highlight")
//     document.querySelector("input").classList.add("highlight")
// })


document.getElementById("hamm").addEventListener("click", function(){
    // window.alert("llll")
    document.querySelector(".left-side").classList.toggle("active")
})
document.querySelector(".dontsho").addEventListener("click", function(){
    // window.alert("llll")
    document.querySelector(".left-side").classList.remove("active")
})







document.querySelector(".logout").addEventListener("click", function(){
    document.querySelector(".oveelayy").classList.toggle("active")
    document.querySelector(".sure").classList.toggle("active")
    document.querySelector("body").classList.toggle("active")
    document.querySelector(".tools").classList.toggle("active")
    document.querySelector(".pland").classList.toggle("highlight")
    })


    document.querySelector("#logout").addEventListener("click", function(){
        document.querySelector(".oveelayy").classList.toggle("active")
        document.querySelector(".sure").classList.toggle("active")
        document.querySelector("body").classList.toggle("active")
        document.querySelector(".tools").classList.toggle("active")
        })
    
    document.querySelector(".cancel").addEventListener("click", function(){
        // window.alert("kk")
    document.querySelector(".oveelayy").classList.toggle("active")
    document.querySelector(".sure").classList.toggle("active")
    document.querySelector("body").classList.toggle("active")
    document.querySelector(".tools").classList.toggle("active")
    })
    
    
    document.querySelector("#bell").addEventListener("click", function(){
        document.querySelector(".noti-down").classList.toggle("active")
        document.querySelector(".not").classList.add("active")
        })
    
    
    // document.querySelector("#search").addEventListener("click", function(){
    // // document.querySelector("#searchbar").classList.toggle("active")
    // document.querySelector("#search").classList.toggle("active")
    // document.querySelector(".profile").classList.toggle("active")
    // document.querySelector("#bell").classList.toggle("active")
    // document.querySelector(".dark").classList.toggle("active")
    // document.querySelector(".sear").classList.toggle("active")
    // document.querySelector(".noti").classList.toggle("active")
    // })
    
    
    
    document.querySelector(".profile").addEventListener("click", function(){
    // window.alert("ll")
    document.querySelector("#around").classList.toggle("active")
    document.querySelector(".tootop").classList.toggle("active")
    })


    // document.querySelector(".choice1").addEventListener("click", function(){
    //     window.alert("ll")
    //     // document.querySelector("#around").classList.toggle("active")
    // })



    

    // Function to apply dark mode classes
    function applyDarkMode() {
        document.getElementById("moon").classList.add("active");
        document.getElementById("sun").classList.add("active");
        document.querySelector("body").classList.add("highlight");
        document.querySelector(".side-bar").classList.add("highlight");
        document.querySelector(".tootop").classList.add("highlight");
        document.querySelector(".nav").classList.add("highlight");
        document.querySelector(".nav2").classList.add("highlight");
        document.querySelector("input").classList.add("highlight");
        document.querySelector("#searchbar").classList.add("highlight");
        document.querySelector("#search").classList.add("highlight");
    }
    
    // Function to remove dark mode classes
    function removeDarkMode() {
        document.getElementById("moon").classList.remove("active");
        document.getElementById("sun").classList.remove("active");
        document.querySelector("body").classList.remove("highlight");
        document.querySelector(".side-bar").classList.remove("highlight");
        document.querySelector(".tootop").classList.remove("highlight");
        document.querySelector(".nav").classList.remove("highlight");
        document.querySelector(".nav2").classList.remove("highlight");
        document.querySelector("input").classList.remove("highlight");
        document.querySelector("#searchbar").classList.remove("highlight");
        document.querySelector("#search").classList.remove("highlight");
    }
    
    // Check localStorage on page load to set the initial mode
    if (localStorage.getItem("darkMode") === "enabled") {
        applyDarkMode();
    }
    
    // Event listener for enabling dark mode
    document.getElementById("moon").addEventListener("click", function() {
        localStorage.setItem("darkMode", "enabled");
        applyDarkMode();
    });
    
    // Event listener for disabling dark mode
    document.getElementById("sun").addEventListener("click", function() {
        localStorage.setItem("darkMode", "disabled");
        removeDarkMode();
    });






    
// Function to apply dark mode classes
// function applyDarkMode() {
//     document.getElementById("moon").classList.add("active");
//     document.getElementById("sun").classList.add("active");
//     document.querySelector("body").classList.add("highlight");
//     document.querySelector(".side-bar").classList.add("highlight");
//     document.querySelector(".tootop").classList.add("highlight");
//     document.querySelector(".nav").classList.add("highlight");
//     document.querySelector(".nav2").classList.add("highlight");
//     document.querySelector("input").classList.add("highlight");
// }

// // Function to remove dark mode classes
// function removeDarkMode() {
//     document.getElementById("moon").classList.remove("active");
//     document.getElementById("sun").classList.remove("active");
//     document.querySelector("body").classList.remove("highlight");
//     document.querySelector(".side-bar").classList.remove("highlight");
//     document.querySelector(".tootop").classList.remove("highlight");
//     document.querySelector(".nav").classList.remove("highlight");
//     document.querySelector(".nav2").classList.remove("highlight");
//     document.querySelector("input").classList.remove("highlight");
// }

// // Check localStorage on page load to set the initial mode
// if (localStorage.getItem("darkMode") === "enabled") {
//     applyDarkMode();
// }

// // Event listener for enabling dark mode
// document.getElementById("moon").addEventListener("click", function() {
//     applyDarkMode();
//     localStorage.setItem("darkMode", "enabled");
// });

// // Event listener for disabling dark mode
// document.getElementById("sun").addEventListener("click", function() {
//     removeDarkMode();
//     localStorage.setItem("darkMode", "disabled");
// });




// // Function to apply the dark mode classes
// function applyDarkMode() {
//     document.getElementById("moon").classList.add("active");
//     document.getElementById("sun").classList.add("active");
//     document.querySelector("body").classList.add("highlight");
//     document.querySelector(".side-bar").classList.add("highlight");
//     document.querySelector(".tootop").classList.add("highlight");
//     document.querySelector(".nav").classList.add("highlight");
//     document.querySelector(".nav2").classList.add("highlight");
//     document.querySelector("input").classList.add("highlight");
// }

// // Check if dark mode is enabled in localStorage on page load
// if (localStorage.getItem("darkMode") === "enabled") {
//     applyDarkMode();
// }

// // Add event listener to the "moon" element
// document.getElementById("moon").addEventListener("click", function() {
//     applyDarkMode();
//     // Save the dark mode state in localStorage
//     localStorage.setItem("darkMode", "enabled");
// });


// // localStorage.rat();

// document.getElementById("sun").addEventListener("click", function(){
//     // window.alert("kkk")
//     document.getElementById("moon").classList.remove("active")
//     document.getElementById("sun").classList.remove("active")
//     document.querySelector("body").classList.remove("highlight")
//     document.querySelector(".side-bar").classList.remove("highlight")
//     document.querySelector(".tootop").classList.remove("highlight")
//     document.querySelector(".nav").classList.remove("highlight")
//     document.querySelector(".nav2").classList.remove("highlight")
// })











//    document.querySelectorAll(".reg .reg2").addEventListener("click", function(){
//     window.alert("llll")
//    })



    

document.querySelector("#bb").addEventListener("click", function(){
    document.getElementById("bb").classList.remove("active")
    document.querySelector(".dis2").classList.remove("active")

    document.getElementById("bb2").classList.remove("active")
    document.querySelector(".dis3").classList.remove("active")

    document.getElementById("bb3").classList.remove("active")
    document.querySelector(".dis4").classList.remove("active")

    document.getElementById("bb4").classList.remove("active")
    document.querySelector(".dis5").classList.remove("active")

    document.getElementById("bb5").classList.remove("active")
    document.querySelector(".dis6").classList.remove("active")

    document.getElementById("bb6").classList.remove("active")
    document.querySelector(".dis7").classList.remove("active")
   })


   document.querySelector("#bb2").addEventListener("click", function(){
    document.getElementById("bb").classList.add("active")
    document.querySelector(".dis2").classList.add("active")

    document.getElementById("bb2").classList.add("active")
    document.querySelector(".dis3").classList.add("active")

    document.getElementById("bb3").classList.remove("active")
    document.querySelector(".dis4").classList.remove("active")

    document.getElementById("bb4").classList.remove("active")
    document.querySelector(".dis5").classList.remove("active")

    document.getElementById("bb5").classList.remove("active")
    document.querySelector(".dis6").classList.remove("active")

    document.getElementById("bb6").classList.remove("active")
    document.querySelector(".dis7").classList.remove("active")
   })


   document.querySelector("#bb3").addEventListener("click", function(){
    document.getElementById("bb").classList.add("active")
    document.querySelector(".dis2").classList.add("active")
    document.getElementById("bb2").classList.remove("active")
    document.querySelector(".dis3").classList.remove
    ("active")
    document.getElementById("bb3").classList.add("active")
    document.querySelector(".dis4").classList.add("active")

    document.getElementById("bb4").classList.remove("active")
    document.querySelector(".dis5").classList.remove("active")

    document.getElementById("bb5").classList.remove("active")
    document.querySelector(".dis6").classList.remove("active")

    document.getElementById("bb6").classList.remove("active")
    document.querySelector(".dis7").classList.remove("active")
   })


   document.querySelector("#bb4").addEventListener("click", function(){
    document.getElementById("bb").classList.add("active")
    document.querySelector(".dis2").classList.add("active")
    document.getElementById("bb2").classList.remove("active")
    document.querySelector(".dis3").classList.remove
    ("active")
    document.getElementById("bb3").classList.remove("active")
    document.querySelector(".dis4").classList.remove("active")

    document.getElementById("bb4").classList.add("active")
    document.querySelector(".dis5").classList.add("active")

    document.getElementById("bb5").classList.remove("active")
    document.querySelector(".dis6").classList.remove("active")

    document.getElementById("bb6").classList.remove("active")
    document.querySelector(".dis7").classList.remove("active")
   })



   document.querySelector("#bb5").addEventListener("click", function(){
    document.getElementById("bb").classList.add("active")
    document.querySelector(".dis2").classList.add("active")
    
    document.getElementById("bb2").classList.remove("active")
    document.querySelector(".dis3").classList.remove
    ("active")
    document.getElementById("bb3").classList.remove("active")
    document.querySelector(".dis4").classList.remove("active")

    document.getElementById("bb4").classList.remove("active")
    document.querySelector(".dis5").classList.remove("active")

    document.getElementById("bb5").classList.add("active")
    document.querySelector(".dis6").classList.add("active")


    document.getElementById("bb6").classList.remove("active")
    document.querySelector(".dis7").classList.remove("active")
   })



   document.querySelector("#bb6").addEventListener("click", function(){
    document.getElementById("bb").classList.add("active")
    document.querySelector(".dis2").classList.add("active")
    
    document.getElementById("bb2").classList.remove("active")
    document.querySelector(".dis3").classList.remove
    ("active")
    document.getElementById("bb3").classList.remove("active")
    document.querySelector(".dis4").classList.remove("active")

    document.getElementById("bb4").classList.remove("active")
    document.querySelector(".dis5").classList.remove("active")

    document.getElementById("bb5").classList.remove("active")
    document.querySelector(".dis6").classList.remove("active")

    document.getElementById("bb6").classList.add("active")
    document.querySelector(".dis7").classList.add("active")
   })




   






   document.querySelector(".reg").addEventListener("click", function(){
    window.alert("This Is Your Current Plan")
    })
    
    document.querySelector(".reg2").addEventListener("click", function(){
    window.alert("Upgrade In Progress")
    })
    
    document.querySelector(".reg3").addEventListener("click", function(){
    window.alert("Will Get Back To You When The Upgrade Is Done")
    })
    
    document.querySelector(".reg4").addEventListener("click", function(){
    window.alert("insuficent Fund")
    })
    
    document.querySelector(".reg5").addEventListener("click", function(){
    window.alert("insuficent Fund")
    })
    
    document.querySelector(".reg6").addEventListener("click", function(){
    window.alert("insuficent Fund")
    })
    
    
 







    