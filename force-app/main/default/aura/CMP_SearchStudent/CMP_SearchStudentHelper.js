({
    // load gender options
    fetchGenderOptions: function(component, event, helper) {
        var action = component.get("c.getGenderOptions");
        
        // Set callback to handle response
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                // Set the options for the combobox
                var genderOptions = response.getReturnValue().map(function(item) {
                    return {
                        label: item.picklistLabel, 
                        value: item.pickListValue
                    };
                });
                component.set("v.genderOptions", genderOptions);
                component.set("v.selectedGender", genderOptions[0].value);
            } else {
                console.error("Error fetching gender options: ", response.getError());
            }
        });
        
        // Enqueue the Apex action
        $A.enqueueAction(action);},
        fetchClassOptions: function(component) {
            const action = component.get("c.getClassOptions"); // Call the Apex method
    
            action.setCallback(this, function(response) {
                const state = response.getState();
                if (state === "SUCCESS") {
                    // Map the Apex response to the required combobox format
                    const classOptions = response.getReturnValue().map(function(item) {
                        return {
                            label: item.picklistLabel, // Label for combobox
                            value: item.pickListValue  // Value for combobox
                        };
                    });
                    // Set the options for the combobox
                    component.set("v.classOptions", classOptions);
                    component.set("v.selectedClass", classOptions[0].value);
                } else {
                    console.error("Error fetching class options: ", response.getError());
                }
            });
    
            // Enqueue the action
            $A.enqueueAction(action);
        },

        // search funtion
        handleSearch: function(component, event, helper) {
            // Set isLoading to true before initiating the search
            component.set("v.isLoading", true);
        
            const action = component.get("c.searchStudents");
            action.setParams({
                searchName: component.get("v.searchName"),
                selectedGender: component.get("v.selectedGender"),
                selectedClass: component.get("v.selectedClass"),
                searchStudentCode: component.get("v.searchStudentCode"),
                selectedBirthday: component.get("v.selectedBirthday")
            });
        
            action.setCallback(this, function(response) {
                const state = response.getState();
                
                // Set isLoading to false once the response is received
                component.set("v.isLoading", false);
        
                if (state === "SUCCESS") {
                    const students = response.getReturnValue();
                    component.set("v.students", students);
                    component.set("v.currentPage", 1); // Reset to the first page on search

                    component.set("v.totalRecords", students.length);
                    component.set("v.totalPages", Math.ceil(students.length / component.get("v.pageSize")));
                    this.updatePageStudents(component);
                    this.handleStudentSelection(component,event);
                    this.getVisiblePages(component);
                } else {
                    console.error("Search failed: ", response.getError());
                }
            });
        
            $A.enqueueAction(action);
        },
        
         // Fetch students and handle pagination data
    fetchStudents: function (component) {
        const action = component.get("c.getAllStudents"); // Apex method
        action.setCallback(this, function (response) {
            const state = response.getState();
            if (state === "SUCCESS") {
                const students = response.getReturnValue();
                component.set("v.students", students);
                component.set("v.totalRecords", students.length);
                component.set("v.totalPages", Math.ceil(students.length / component.get("v.pageSize")));
                this.updatePageStudents(component);  // Update page data after fetching students
                this.getVisiblePages(component);
            } else {
                console.error(response.getError());
            }
            component.set("v.isLoading", false);
        });
        $A.enqueueAction(action);
    },


    // Update students to display for the current page
    updatePageStudents: function (component) {
        const allStudents = component.get("v.students");
        const currentPage = component.get("v.currentPage");
        const pageSize = component.get("v.pageSize");
        const totalRecords = component.get("v.totalRecords");

        // Calculate the start and end indexes for the current page
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalRecords);

        // Slice the students array to show only the ones for the current page
        const display_students = allStudents.slice(startIndex, endIndex);
        
        // Set the display students and update current page
        component.set("v.display_students", display_students);
    },

    // Navigate to the next page
    nextPage: function (component) {
        const currentPage = component.get("v.currentPage");
        const totalPages = component.get("v.totalPages");

        if (currentPage < totalPages) {
            component.set("v.currentPage", currentPage + 1);
            this.updatePageStudents(component);  // Update displayed students for the new page
        }
    },

    // Navigate to the previous page
    previousPage: function (component) {
        const currentPage = component.get("v.currentPage");

        if (currentPage > 1) {
            component.set("v.currentPage", currentPage - 1);
            this.updatePageStudents(component);  // Update displayed students for the new page
        }
    },

    getVisiblePages: function (component) {
        const currentPage = component.get("v.currentPage");
        const totalPages = component.get("v.totalPages");
    
        const visiblePages = [];
        let startPage = Math.max(1, currentPage - 2); // Start 2 pages before the current page
        let endPage = Math.min(totalPages, startPage + 4); // Show a maximum of 5 pages
    
        // Adjust the startPage if endPage is within the last 5 pages
        startPage = Math.max(1, endPage - 4);
    
        for (let i = startPage; i <= endPage; i++) {
            visiblePages.push(i);
        }
    
        component.set("v.visiablePages", visiblePages); // Update the attribute
    },
    // handleStudentSelection: function(component,event){
    
    //     const selectedStudentId = event.getSource().get("v.value");
    //     const selectedStudents = component.get("v.selectedStudents"); // Array holding selected student IDs

    //     // Check if the student is already selected
    //     if (selectedStudents.includes(selectedStudentId)) {
    //         // Remove from the array if already selected
    //         const index = selectedStudents.indexOf(selectedStudentId);
    //         if (index > -1) {
    //             selectedStudents.splice(index, 1);
    //         }
    //     } else {
    //         // Add to the array if not selected
    //         selectedStudents.push(selectedStudentId);
    //     }

    //     // Update the selectedStudents array in the component
    //     component.set("v.selectedStudents", selectedStudents);

    //     // Optionally update the `isSelected` flag for the current page's students
    //     const displayStudents = component.get("v.display_students");
    //     displayStudents.forEach((student) => {
    //         student.isSelected = selectedStudents.includes(student.Id);
    //     });
    //     component.set("v.display_students", displayStudents);
    // },

    // clear selected student when search
    clearSelectedStudent: function(component) {
        // Reset the selected students array
        component.set("v.selectedStudents", []);
    
        // Uncheck all checkboxes by updating the isSelected property
        let displayStudents = component.get("v.display_students");
        displayStudents.forEach(student => {
            student.isSelected = false;
        });
    
        // Update the component's displayed students list
        component.set("v.display_students", displayStudents);
    },

    // Delete selected students
    DeleteSelectedStudent: function (component, event) {
        let selectedStudents = component.get("v.selectedStudents"); // Get selected students list
    
        if (!selectedStudents || selectedStudents.length === 0) {
            alert("No students selected for deletion.");
            return;
        }
    
        // Call Apex method to delete students
        const action = component.get("c.deleteSelectedStudents"); 
        action.setParams({ studentIds: selectedStudents });
    
        action.setCallback(this, function (response) {
            const state = response.getState();
            if (state === "SUCCESS") {
                alert("Selected students deleted successfully!");
    
                // Remove deleted students from UI
                let students = component.get("v.students").filter(student => !selectedStudents.includes(student.Id));
                component.set("v.students", students);
    
                let displayStudents = component.get("v.display_students").filter(student => !selectedStudents.includes(student.Id));
                component.set("v.display_students", displayStudents);
    
                component.set("v.selectedStudents", []); // Clear selection after deletion

                component.set("v.isOpenDeleteModal",false);
            } else {
                console.error("Error deleting students: ", response.getError());
            }
        });
    
        $A.enqueueAction(action);
    },

    // Toggle the selection of displayed student students
    toggleSelectAll: function(component, event) {
        // Get the new state of the header checkbox (toggling it)
        let selectAll = component.get("v.selectAll");

        // Toggle the value
        selectAll = !selectAll;
        component.set("v.selectAll", selectAll);

        // Retrieve the current list of students on display
        let displayStudents = component.get("v.display_students") || [];
        let selectedStudents = component.get("v.selectedStudents") || [];

        // Update the isSelected flag for each student
        // add or remove in selected students list based on selectAll value
        displayStudents.forEach(student => {
            student.isSelected = selectAll;
            if (selectAll) {
                selectedStudents.push(student.Id);
            }else if(!selectAll){
                if(selectedStudents.includes(student.Id)){
                    selectedStudents.pop(student.Id);
                }
            }
        });

        // Update the component attributes
        component.set("v.display_students", displayStudents);
        component.set("v.selectedStudents", selectedStudents);
    },

    // handling single student selection 
    handleStudentSelection: function(component, event) {
        const selectedStudentId = event.getSource().get("v.value");
        let selectedStudents = component.get("v.selectedStudents") || [];

        // Toggle the selected state: remove the student ID if already selected, or add it if not.
        if (selectedStudents.includes(selectedStudentId)) {
            selectedStudents = selectedStudents.filter(id => id !== selectedStudentId);
        } else {
            selectedStudents.push(selectedStudentId);
        }

        // Update the selectedStudents array
        component.set("v.selectedStudents", selectedStudents);

        // Update each student's isSelected flag based on whether its ID exists in selectedStudents
        let displayStudents = component.get("v.display_students") || [];
        displayStudents.forEach(function(student) {
            student.isSelected = selectedStudents.includes(student.Id);
        });
        component.set("v.display_students", displayStudents);

        // Optionally update the header checkbox if not all are selected
        component.set("v.selectAll", selectedStudents.length === displayStudents.length);
    },

    // load pagination setting
    fetchPaginationSettings: function (component) {
        const action = component.get("c.getPaginationSettings");
    
        action.setCallback(this, function (response) {
            const state = response.getState();
            if (state === "SUCCESS") {
                const data = response.getReturnValue();
                if (data) {
                    // component.set("v.pageSize", Number(data.PageSize) || 5); // Default to 5
                    component.set("v.pageSize", 10);
                }
            } else {
                console.error("Error retrieving pagination settings:", response.getError());
            }
        });
    
        $A.enqueueAction(action);
    }
    
})