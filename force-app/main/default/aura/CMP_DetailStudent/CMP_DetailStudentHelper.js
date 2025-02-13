({
    // Get student detail
    fetchStudentDetails: function (component, studentId) {
        console.log("Fetching student details for student ID:", studentId);
        const action = component.get("c.getStudent");
        action.setParams({ studentId: studentId });

        component.set("v.isLoading", true);

        action.setCallback(this, function (response) {
            const state = response.getState();
            console.log("Response state:", state);
            if (state === "SUCCESS") {
                const studentData = response.getReturnValue();
                console.log("Student data received:", studentData);
                if (studentData) {
                    component.set("v.student", studentData);
                } else {
                    console.warn("No student data returned!");
                }
            } else {
                console.error("Error fetching student details:", response.getError());
            }
            component.set("v.isLoading", false); // Hide the spinner
        });

        $A.enqueueAction(action);
    },
   
})
