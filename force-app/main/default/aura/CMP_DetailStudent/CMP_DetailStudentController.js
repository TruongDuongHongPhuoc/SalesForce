({
    doInit: function (component, event, helper) {
        const studentId = component.get("v.studentId");
        if (studentId) {
            helper.fetchStudentDetails(component, studentId);
        } else {
            console.error("No studentId provided!");
            component.set("v.isLoading", false);
        }
    },

    // may be useless
    closeStudentDetail: function (component, event, helper) {
        // Hide the modal by setting isVisible to false
        component.set("v.isVisible", false);
    },

    // Fire close modals event 
    fireCloseModalEvent: function (component, event, helper) {
        console.log("Fire Close Modal Event Operating");
        var closeEvent = component.getEvent("CloseModalEvent");
        closeEvent.fire();
    }
})