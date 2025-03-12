({
    doInit: function (component, event, helper) {
        // get pagination setting
        helper.fetchPaginationSettings(component);
        // fetch student
        helper.fetchStudents(component);
        // Fetch gender options
        helper.fetchGenderOptions(component);
        // Fetch class options
        helper.fetchClassOptions(component);
    },

    // handle view detail pop up
    viewDetail: function (component, event, helper) {
         // Set the selected student ID
         const studentId = event.getSource().get("v.value");
         component.set("v.selectedStudentId", studentId);
     
         // Clear the current student details
         component.set("v.student", {}); // Clear existing student data
     
         // Set the isUpdate flag to true
         component.set("v.isViewStudentDetail", true);
     
         // Call the Apex method to fetch the new student details
         const action = component.get("c.getStudentDetails");
         action.setParams({ studentId: studentId });
     
         action.setCallback(this, function (response) {
             const state = response.getState();
             if (state === "SUCCESS") {
                 component.set("v.student", response.getReturnValue());
                 
             } else {
                 alert("Error fetching student details.");
             }
         });
         $A.enqueueAction(action);
    },


    // handle update student popup
    UpdateStudent: function (component, event, helper) {
        // Set the selected student ID
        const studentId = event.getSource().get("v.value");
        component.set("v.selectedStudentId", studentId);
    
        // Clear the current student details
        component.set("v.student", {}); // Clear existing student data
    
        // Set the isUpdate flag to true
        component.set("v.isUpdatingStudents", true);
    
        // Call the Apex method to fetch the new student details
        const action = component.get("c.getStudentDetails");
        action.setParams({ studentId: studentId });
    
        action.setCallback(this, function (response) {
            const state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.student", response.getReturnValue());
                
            } else {
                alert("Error fetching student details.");
            }
        });
        $A.enqueueAction(action);
    },
    
    // Statis testing changed gender
    handleGenderChange: function(component, event, helper) {
        // Get selected value when combobox changes
        var selectedGender = component.get("v.selectedGender");
        console.log("Selected Gender: " + selectedGender);
    },

    // handle search function
    handleSearch: function(component, event, helper) {
        helper.handleSearch(component);
        helper.clearSelectedStudent(component);
    },

    // Function to clear input fields
    clearInputs: function (component, event, helper) {
        component.set("v.searchName", null);         // Clear searchName
        component.set("v.searchStudentCode", null); // Clear searchStudentCode
        component.set("v.selectedBirthday", null);  // Clear selectedBirthday

         // Reset dropdowns (set to first value in the options list)
         const genderOptions = component.get("v.genderOptions");
         if (genderOptions && genderOptions.length > 0) {
             component.set("v.selectedGender", genderOptions[0].value);  // Reset to first gender option
         }
 
         const classOptions = component.get("v.classOptions");
         if (classOptions && classOptions.length > 0) {
             component.set("v.selectedClass", classOptions[0].value);  // Reset to first class option
         }

        console.log("Input fields cleared.");
    },

    // Open Create student pop up
    openCreateStudent: function (component, event, helper) {
        component.set("v.isCreatingStudent", true);  
    },

    // Close Create póp up all pop up not only create student but also others such as detail and update
    closeCreateStudent: function (component, event, helper) {
        component.set("v.isCreatingStudent", false);
        component.set("v.isViewStudentDetail", false);
        component.set("v.isUpdatingStudents", false);

        helper.fetchStudents(component);
    },

    // close Student detail pop up
    closeStudentDetail: function (component, event, helper) {
        component.set("v.isViewStudentDetail", false);
    },

    // close Update student pop up
    closeUpdateStudent: function (component, event, helper) {
        component.set("v.isUpdatingStudents", false);
    },


    //Pagination
      
    // Handle next page action
      nextPage: function (component, event, helper) {
        helper.nextPage(component);  // Navigate to next page
        helper.getVisiblePages(component); // Update the visible pages
    },

    // Handle previous page action
    previousPage: function (component, event, helper) {
        helper.previousPage(component);  // Navigate to previous page
        helper.getVisiblePages(component); // Update the visible pages
    },

    // Handle go to first page action
    goToFirstPage: function (component, event, helper) {
        component.set("v.currentPage", 1);
        helper.updatePageStudents(component);
        helper.getVisiblePages(component); // Update the visible pages
    },

    // Handle go to last page action
    goToLastPage: function (component, event, helper) {
        const totalPages = component.get("v.totalPages");
        component.set("v.currentPage", totalPages);
        helper.updatePageStudents(component);
        helper.getVisiblePages(component); // Update the visible pages
    },

    // Handle go to page action
    goToPage: function (component, event, helper) {
        const selectedPage = event.getSource().get("v.value"); // Get the page number
        component.set("v.currentPage", selectedPage); // Set the current page
        helper.updatePageStudents(component); // Refresh the student list
        helper.getVisiblePages(component); // Update the visible pages
    },



    // Handle select all action
    toggleSelectAll: function (component, event, helper) {
        helper.toggleSelectAll(component, event);
    },
    
    // Handle student selection
    handleStudentSelection: function (component, event, helper) {
        helper.handleStudentSelection(component, event);
    },
    
    // open delete modal action
    openDeleteModal: function (component) {
        component.set("v.isOpenDeleteModal", true);
    },

    // close delete modal action
    closeModal: function (component) {
        component.set("v.isOpenDeleteModal", false);
    },

    // handle delete single studdent
    DeleteSingleStudent: function (component, event) {
        let selectedStudentId = event.getSource().get("v.value"); // Get selected student ID
    
        if (!selectedStudentId) {
            console.error("No student ID found.");
            return;
        }
    
        // Ensure selectedStudents is an array
        let selectedStudents = component.get("v.selectedStudents") || []; 
    
        // Add the new student ID if it's not already in the list
        if (!selectedStudents.includes(selectedStudentId)) {
            selectedStudents.push(selectedStudentId);
        }
    
        // Update the attribute
        component.set("v.selectedStudents", selectedStudents);
        console.log("Updated Selected Students List:", selectedStudents); // Debugging
    
        // Open confirmation modal
        component.set("v.isOpenDeleteModal", true);
    },

    // Delete multiple student
    DeleteSelectedStudent: function(component,event,helper){
        helper.DeleteSelectedStudent(component,event);
    },

    // Fire event Create event
    handleComponentEvent: function(cmp, event, helper) {
        console.log("Fire event handle Component ");
        cmp.set("v.isCreatingStudent", false);
        helper.fetchStudents(cmp);
        var message = event.getParam("message");
        // Set the same attribute as declared in AuraTestTwo.cmp
        cmp.set("v.receivedMessage", message);
    },
});