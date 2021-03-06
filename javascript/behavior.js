var resources = [];
var buildings = [];
var buildQueue;
var userResource = "Logs";

var ticksSinceLastSave = 0;
var ticksBetweenSaves = 60;

var frameCounter = 0;
var framesBetweenKeyFrames = 1000;

$( window ).on("load", function(){
    console.log("Welcome");

    CreateResources();
    setUserResource("Logs");

    CreateBuildings();

    buildQueue = new BuildQueue();

    window.setInterval(tick, 1000);
    window.setInterval(frame, 10);

    LoadGame();

    keyFrame();
});

function tick(){
    for(var i = 0; i < Object.keys(buildings).length; i++){
        Object.values(buildings)[i].produce();
    }

    buildQueue.tick();

    resources[userResource].increase(1);

    if(ticksSinceLastSave >= ticksBetweenSaves){
        SaveGame();
        ticksSinceLastSave = 0;
    }else{
        ticksSinceLastSave++;
    }
}

function frame(){
    if(frameCounter >= framesBetweenKeyFrames){
        keyFrame();
        frameCounter = 0;
        return;
    }

    Object.values(resources).forEach(resource => {
        resource.updateView();
    });

    Object.values(buildings).forEach(building => {
        building.updateView();
    });

    this.buildQueue.frame();

    frameCounter++;
}

function keyFrame(){
    var baseString = "<li><h3>Basic</h3></li>";
    var intermediateString = "<li><h3>Intermediate</h3></li>";
    var toolsString = "<li><h3>Tools</h3></li>";
    var popString = "<li><h3>Population</h3></li>";

    Object.values(resources).forEach(element => {
        switch(element.getCategory()){
            case "intermediate":
                intermediateString += element.getViewString();
                break;
            case "tools":
                toolsString += element.getViewString();
                break;
            case "pop":
                popString += element.getViewString();
                break;
            default:
                baseString += element.getViewString();
                break;
        }
    });
    $("#resourcesList").html(baseString + intermediateString + toolsString + popString);

    var buildingsText = "";
    Object.values(buildings).forEach(element => {
        buildingsText += element.getViewString();
    });
    $("#buildingListList").html(buildingsText);
}

function LoadGame(){
    if(!localStorage.getItem("saved")){
        return false;
    }

    Object.values(resources).forEach(resource => {
        resource.Load();
    });

    Object.values(buildings).forEach(building => {
        building.Load();
    });
}

function SaveGame(){
    console.log("Saving");
    localStorage.setItem("saved", true);

    Object.values(resources).forEach(resource => {
        resource.Save();
    });

    Object.values(buildings).forEach(building => {
        building.Save();
    });
}

function setUserResource(resource){
    clearManualResource();
    userResource = resource;
    
    var foundIt = false;

    Object.values(resources).forEach(tempResource => {
        if(tempResource.getName() == resource){
            $("#" + resource).children(".userCanDo").addClass("userDoing");
            foundIt = true;
        }
    });

    if(!foundIt){
        userResource = "Logs";
        console.log("UNKNOWN USER RESOURCE: " + resource);
    }

}

function clearManualResource(){
    Object.values(resources).forEach(resource => {
        $("#" + resource.getName()).children(".userCanDo").removeClass("userDoing");
    });
}

function tryBuildBuilding(buildingName){
    buildQueue.enqueueBuilding(buildingName);
}