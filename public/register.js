//REGISTRATION STEPS
$(document).ready(function(){
    //set class numbers to 0
    sessionStorage.setItem("prevNum", 0);
    sessionStorage.setItem("currentNum", 0);
    sessionStorage.setItem("prevClasses", "");
    sessionStorage.setItem("currentClasses", "");
    //WHERE CLASS SELECTION STUFF WILL BE READ IN
});
//using session storage to save choices right now
function nextStep(step){
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if(step.id == "basic"){
        //make sure all fields are filled out
        if(document.getElementById("fname").value == ""){
            alert("Please enter your First Name");
            return;
        }
        else if(document.getElementById("lname").value == ""){
            alert("Please enter your Last Name");
            return;
        }
        else if(document.getElementById("gradYr").value == ""){
            alert("Please enter your Graduation Year");
            return;
        }
        else if(document.getElementById("rpi").value == ""){
            alert("Please enter your RPI Email");
            return;
        }
        else if(document.getElementById("discord").value == ""){
            alert("Please enter your Discord Username");
            return;
        }
        //store in sessionStorage
        sessionStorage.setItem("fname", document.getElementById("fname").value);
        sessionStorage.setItem("lname", document.getElementById("lname").value);
        sessionStorage.setItem("gradYr", document.getElementById("gradYr").value);
        sessionStorage.setItem("rpi", document.getElementById("rpi").value);
        sessionStorage.setItem("discord", document.getElementById("discord").value);
        //hide last step and show next step
        document.getElementById("basicInfo").style.display = "none";
        document.getElementById("currentClasses").style.display = "block";
    }
    else if(step.id == "current"){
        if(sessionStorage.getItem("currentNum") == 0){
            alert("Please select your current classes");
            return;
        }
        //hide last step and show next step
        document.getElementById("currentClasses").style.display = "none";
        document.getElementById("previousClasses").style.display = "block";
    }
    else if(step.id == "previous"){
        if(sessionStorage.getItem("prevNum") == 0){
            alert("Please select your previously taken classes");
            return;
        }
        //hide last step and show next step
        document.getElementById("previousClasses").style.display = "none";
        document.getElementById("confirm").style.display = "block";
        //read in confirmation
        document.getElementById("fullName").innerHTML = "Name: " + sessionStorage.getItem("fname") + "  "  + sessionStorage.getItem("lname");
        document.getElementById("grad").innerHTML = "Graduation Year: " + sessionStorage.getItem("gradYr");
        document.getElementById("rpi").innerHTML = "RPI Email: " + sessionStorage.getItem("rpi");
        document.getElementById("disc").innerHTML = "Discord: " + sessionStorage.getItem("discord");
        var list = "";
        var classes = sessionStorage.getItem("currentClasses").split(" ");
        for(var i = 0; i < classes.length; i+=2){
            list += "<p class = \"list\">" + classes[i] + "  " + classes[i+1] + "</p>";
        }
        document.getElementById("currentList").innerHTML = list;
        list = "";
        classes = sessionStorage.getItem("prevClasses").split(" ");
        for(var i = 0; i < classes. length; i += 2){
            list += "<p class = \"list\">" + classes[i] + "  " + classes[i+1] + "</p>";
        }
        document.getElementById("prevList").innerHTML = list;
    }
}

function prevStep(step){
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if(step.id == "current"){
        //hide current step and show last step
        document.getElementById("currentClasses").style.display = "none";
        document.getElementById("basicInfo").style.display = "block";
    }
    else if(step.id == "previous"){
        //hide current step and show last step
        document.getElementById("previousClasses").style.display = "none";
        document.getElementById("currentClasses").style.display = "block";
        //read in last step with previous choices
    }
    else if(step.id == "confirmInfo"){
        document.getElementById("confirm").style.display = "none";
        document.getElementById("previousClasses").style.display = "block";
    }
}

//also currently uses session storage
function selectClass(course){
    //remove course from list
    if(course.classList.contains("select")){
        course.classList.remove("select");
        //current
        if(course.classList.contains("current")){
            sessionStorage.setItem("currentNum", parseInt(sessionStorage.getItem("currentNum")) - 1);
            var courses = sessionStorage.getItem("currentClasses").split(" ");
            var removed = course.innerHTML;
            var newStr = "";
            for(var i = 0; i < courses.length; i+=2){
                if(courses[i] != removed.split(" ")[0] || courses[i+1] != removed.split(" ")[1]){
                    if(newStr == ""){
                        newStr += courses[i] + " " + courses[i+1];
                    }
                    else{
                        newStr += " " + courses[i] + " " + courses[i+1];
                    }
                }
            }
            sessionStorage.setItem("currentClasses", newStr);
            if(!newStr.includes(removed.split(" ")[0])){
                document.getElementById("current" + removed.split(" ")[0].toLowerCase()).classList.remove("select");
            }
        }
        else{//previous
            sessionStorage.setItem("prevNum", parseInt(sessionStorage.getItem("prevNum")) - 1);
            var courses = sessionStorage.getItem("prevClasses").split(" ");
            var removed = course.innerHTML;
            var newStr = "";
            for(var i = 0; i < courses.length; i+=2){
                if(courses[i] != removed.split(" ")[0] || courses[i+1] != removed.split(" ")[1]){
                    if(newStr == ""){
                        newStr += courses[i] + " " + courses[i+1];
                    }
                    else{
                        newStr += " " + courses[i] + " " + courses[i+1];
                    }
                }
            }
            sessionStorage.setItem("prevClasses", newStr);
            if(!newStr.includes(removed.split(" ")[0])){
                document.getElementById("prev" + removed.split(" ")[0].toLowerCase()).classList.remove("select");
            }
        }
    }//add course to list
    else{
        //find class from opposite class selection
        if(course.classList.contains("current")){
            var prevs = document.getElementsByClassName("prev");
            for(var i = 0; i < prevs.length; i++){
                if(prevs[i].innerHTML == course.innerHTML && prevs[i].classList.contains("select")){
                    alert("Already selected class in Previous Classes");
                    return;
                }
            }
        }
        if(course.classList.contains("prev")){
            var currents = document.getElementsByClassName("current");
            for(var i = 0; i < currents.length; i++){
                if(currents[i].innerHTML == course.innerHTML && currents[i].classList.contains("select")){
                    alert("Already selected class in Current Classes");
                    return;
                }
            }
        }

        course.classList.add("select");
        var prefix = course.innerHTML;
        //current
        if(course.classList.contains("current")){
            if(!document.getElementById("current" + prefix.split(" ")[0].toLowerCase()).classList.contains("select")){
                document.getElementById("current" + prefix.split(" ")[0].toLowerCase()).classList.add("select");
            }
            sessionStorage.setItem("currentNum", parseInt(sessionStorage.getItem("currentNum")) + 1);
            if(sessionStorage.getItem("currentClasses") == ""){
                sessionStorage.setItem("currentClasses", course.innerHTML);
            }
            else{
                sessionStorage.setItem("currentClasses", sessionStorage.getItem("currentClasses") + " " + course.innerHTML);
            }
        }
        else{//previous
            if(!document.getElementById("prev" + prefix.split(" ")[0].toLowerCase()).classList.contains("select")){
                document.getElementById("prev" + prefix.split(" ")[0].toLowerCase()).classList.add("select");
            }
            sessionStorage.setItem("prevNum", parseInt(sessionStorage.getItem("prevNum")) + 1);
            if(sessionStorage.getItem("prevClasses") == ""){
                sessionStorage.setItem("prevClasses", course.innerHTML);
            }
            else{
                sessionStorage.setItem("prevClasses", sessionStorage.getItem("prevClasses") + " " + course.innerHTML);
            }
        }
    }
}

//DROPDOWN FUNCTION
function dropdown(target) {
    const dropMenu = target.nextElementSibling;
    var accordions = document.getElementsByClassName("accordion");
    for(var i = 0; i < accordions.length; i++){
        if(accordions[i].id != dropMenu.id){
            accordions[i].style.display = "none";
        }
    }
    //Show dropdown for clicked content
    if(dropMenu.style.display === "block"){
        dropMenu.style.display = "none";
    }
    else{
        dropMenu.style.display = "block";
    }
}

function register(){
    //add info
    var prevClasses = [];
    var classes = sessionStorage.getItem("prevClasses").split(" ");
    for(var i = 0; i < classes.length(); i++){
        prevClasses[i] = classes[i];
    }
    var currentClasses = [];
    classes = sessionStorage.getItem("currentClasses").split(" ");
    for(var i = 0; i < classes.length(); i++){
        currentClasses[i] = classes[i];
    }
    var name = sessionStorage.getItem("fname") + " " + sessionStorage.getItem("lname");
    var gradYr = sessionStorage.getItem("gradYr");
    var email = sessionStorage.getItem("rpi");
    var discord = sessionStorage.getItem("discord");
    //sample schema for users
    /*
        {
            name: 
            gradYr:
            email:
            discord:
            current: []
            prev: []
            reqs: []
        }
    */
    

}