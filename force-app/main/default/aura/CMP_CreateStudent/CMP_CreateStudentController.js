({
    // call awake
    doInit: function (component, event, helper) {
        // Fetch Data
    helper.fetchGenderOptions(component);
    helper.fetchClassOptions(component);
    helper.fetchLearningStatusOptions(component);

// Call First time
    const action = component.get("c.createStudent");
    action.setParams({
        firstName: component.get("v.firstName"),
        lastName: component.get("v.lastName"),
        gender: component.get("v.gender"),
        birthday: component.get("v.birthday"),
        learningStatus: component.get("v.learningStatus"),
        class: component.get("v.selectedClass")
    });

    action.setCallback(this, function (response) {
        const state = response.getState();
        if (state === "SUCCESS") {
            alert("Student record created successfully!");
            // Optionally clear fields
            component.set("v.firstName", "");
            component.set("v.lastName", "");
            component.set("v.gender", "");
            component.set("v.birthday", "");
            component.set("v.learningStatus", "");
            component.set("v.selectedClass","");
        } else {
            console.error("Error creating student: ", response.getError());
        }
    });

    $A.enqueueAction(action);
    },
    //Fire create event
    fireComponentEvent: function (component, event, helper) {
        const isValid = true;
        
        // Catch error
        if(!helper.validateNameFields(component)){
            isValid = false;
        }

        if(!helper.validateBirthday(component)){
            isValid = false;    
        }

        if(!helper.validateSelections(component)){
            isValid = false;
        }
        // Break if invalid
        if(isValid != true){
            return;
        }


        console.log("Fire component Event Operating");
         //Call create function
         helper.handleCreate(component,event,helper);
        let myEvent = component.getEvent("ComponentEvent");
        myEvent.setParams({
            "message": "Creating new student record"
        });
        console.log("Fire component Event end");
        myEvent.fire();
    },
    // Handle close modal event 
    fireCloseModalEvent: function (component, event, helper) {
        console.log("Fire Close Modal Event Operating");
        var closeEvent = component.getEvent("CloseModalEvent");
        closeEvent.fire();
    }
    
}
);
