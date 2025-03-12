({
    doInit: function (component, event, helper) {
        const studentId = component.get("v.studentId");
        console.log("Initializing with studentId:", studentId);

        // Fetch data for the initial student
       helper.fetchStudentDetails(component, studentId);
       helper.fetchGenderOptions(component);
       helper.fetchClassOptions(component);
       helper.fetchLearningStatusOptions(component);
    },

    // hanlde update function
    handleUpdate: function (component, event, helper) {

        // checking errors
        const isValid = true;        

        if(!helper.validateNameFields(component)){
            isValid = false;
        }

        if(!helper.validateBirthday(component)){
            isValid = false;    
        }

        if(!helper.validateSelections(component)){
            isValid = false;
        }
        // break if invalid
        if(isValid != true){
            return;
        }

        // Update student record
        const studentId = component.get("v.studentId");
        const studentData = {
            firstName: component.get("v.firstName"),
            lastName: component.get("v.lastName"),
            birthday: component.get("v.birthday"),
            gender: component.get("v.gender"),
            selectedClass: component.get("v.selectedClass"),
            learningStatus: component.get("v.learningStatus"),
        };

        console.log("Updating student with data:", studentData);
        helper.updateStudentRecord(component, studentId, studentData);

        //Fire event to close modal
        console.log("Fire Close Modal Event Operating");
        var closeEvent = component.getEvent("CloseModalEvent");
        closeEvent.fire();
    },

    
    changeStudentId: function (component, event, helper) {
        const newStudentId = "a00WU00000V8XmcYAF"; // New ID
        component.set("v.studentId", newStudentId);

        console.log("Student ID changed to:", newStudentId);
        helper.fetchStudentDetails(component, newStudentId);
    },
    // Handle the attribute change to fetch new student details
    rerenderDetails: function (component, event, helper) {
        const studentId = component.get("v.studentId");
        if (studentId) {
            helper.fetchStudentDetails(component, studentId);
        }
    },
    fireCloseModalEvent: function (component, event, helper) {
        console.log("Fire Close Modal Event Operating");
        var closeEvent = component.getEvent("CloseModalEvent");
        closeEvent.fire();
    }
})