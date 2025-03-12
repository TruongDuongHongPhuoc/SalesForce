({
    // Maybe useless
    fetchPicklistOptions: function (component, apexMethod, attributeName) {
        var action = component.get(apexMethod);
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set("v." + attributeName, response.getReturnValue());
            } else {
                console.error("Error fetching options: ", response.getError());
            }
        });
        $A.enqueueAction(action);
    },
    
    // Handle Create function
    handleCreate: function (component, event, helper) {
        const action = component.get("c.createStudent");

        // Fetch values from the component attributes
        action.setParams({
            firstName: component.get("v.firstName"),
            lastName: component.get("v.lastName"),
            gender: component.get("v.gender"),
            birthday: component.get("v.birthday"),
            selectedClass: component.get("v.selectedClass"),
            learningStatus: component.get("v.learningStatus"),
        });

        // Set callback for the server response
        action.setCallback(this, function (response) {
            const state = response.getState();
            if (state === "SUCCESS") {
                alert("Student record created successfully!");

            } else if (state === "ERROR") {
                const errors = response.getError();
                if (errors && errors[0] && errors[0].message) {
                    alert("Error: " + errors[0].message);
                } else {
                    alert("Unknown error occurred.");
                }
            }
        });

        // Enqueue the server-side action
        $A.enqueueAction(action);
    },

    // Load gender to Comnbo box
    fetchGenderOptions: function (component) {
        const action = component.get("c.getGenderOptions");
        action.setCallback(this, function (response) {
            const state = response.getState();
            if (state === "SUCCESS") {
                const genderOptions = response.getReturnValue().map(function (item) {
                    return { label: item.picklistLabel, value: item.pickListValue };
                });
                component.set("v.genderOptions", genderOptions);
                if (genderOptions.length > 0) {
                    component.set("v.gender", genderOptions[0].value);
                }
            } else {
                console.error("Error fetching gender options:", response.getError());
            }
        });

        $A.enqueueAction(action);
    },

    // Load class option to combo box
    fetchClassOptions: function (component) {
        const action = component.get("c.getClassOptions");
        action.setCallback(this, function (response) {
            const state = response.getState();
            if (state === "SUCCESS") {
                const classOptions = response.getReturnValue().map(function (item) {
                    return { label: item.picklistLabel, value: item.pickListValue };
                });
                component.set("v.classOptions", classOptions);

                if (classOptions.length > 0) {
                    component.set("v.selectedClass", classOptions[0].value);
                }
            } else {
                console.error("Error fetching class options:", response.getError());
            }
        });

        $A.enqueueAction(action);
    },

    // Load Learning status combobox
    fetchLearningStatusOptions: function (component) {
        const action = component.get("c.getLearningStatusOptions");
        action.setCallback(this, function (response) {
            const state = response.getState();
            if (state === "SUCCESS") {
                const learningStatusOptions = response.getReturnValue().map(function (item) {
                    return { label: item.picklistLabel, value: item.pickListValue };
                });
                component.set("v.learningStatusOptions", learningStatusOptions);

                if (learningStatusOptions.length > 0) {
                    component.set("v.learningStatus", learningStatusOptions[0].value);
                }
            } else {
                console.error("Error fetching learning status options:", response.getError());
            }
        });

        $A.enqueueAction(action);
    },

    // Catch error birth day
    validateBirthday: function (component, event, helper) {
        const birthdayField = component.find("birthdayField");
        const birthdayValue = birthdayField.get("v.value");
    
        if (!birthdayValue) {
            birthdayField.setCustomValidity("生年月日は必須です。");
        } else {
            const birthDate = new Date(birthdayValue);
            const today = new Date();
    
            // Calculate the age
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const dayDiff = today.getDate() - birthDate.getDate();
    
            // Adjust age if the birthday hasn't occurred yet this year
            if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                age--;
            }
    
            if (age < 18) {
                birthdayField.setCustomValidity("学生は18歳以上である必要があります。");
                return false;
            } else {
                birthdayField.setCustomValidity(""); // Clear the error
                return true;
            }
        }
    
        birthdayField.reportValidity(); // Display error if any
    },

    // Catch error name fieds not allow to input special character and number
    validateNameFields: function (component) {
        const firstNameField = component.find("firstNameField");
        const lastNameField = component.find("lastNameField");
    
        const firstName = firstNameField.get("v.value");
        const lastName = lastNameField.get("v.value");
    
        let isValid = true;
    
        // Function to check if the character is valid
        function isValidCharacter(char) {
            const charCode = char.charCodeAt(0);
            return (
                (charCode >= 0x3040 && charCode <= 0x30FF) || // Hiragana & Katakana
                (charCode >= 0x4E00 && charCode <= 0x9FAF) || // Kanji
                (charCode >= 65 && charCode <= 90) || // A-Z
                (charCode >= 97 && charCode <= 122) ||  // a-z
                (charCode === 32) // Space
            );
        }
    
        // Validate First Name
        if (!firstName || ![...firstName].every(isValidCharacter)) {
            firstNameField.setCustomValidity("名は特殊文字や数字を含めることはできません。");
            isValid = false;
        } else {
            firstNameField.setCustomValidity(""); // Clear error
        }
    
        // Validate Last Name
        if (!lastName || ![...lastName].every(isValidCharacter)) {
            lastNameField.setCustomValidity("姓は特殊文字や数字を含めることはできません。");
            isValid = false;
        } else {
            lastNameField.setCustomValidity(""); // Clear error
        }
    
        // Show validation messages
        firstNameField.reportValidity();
        lastNameField.reportValidity();
    
        return isValid;
    },

    // catch errors selection in combox boxes 
    validateSelections: function (component) {
        const gender = component.get("v.gender");
        const selectedClass = component.get("v.selectedClass");
        const learningStatus = component.get("v.learningStatus");
    
        let isValid = true;
    
        // Validate Gender
        if (!gender) {
            const genderField = component.find("genderField");
            genderField.setCustomValidity("性別は必須です。");
            isValid = false;
        } else {
            const genderField = component.find("genderField");
            genderField.setCustomValidity(""); // Clear error
        }
    
        // Validate Class
        if (!selectedClass) {
            const classField = component.find("classField");
            classField.setCustomValidity("クラスは必須です。");
            isValid = false;
        } else {
            const classField = component.find("classField");
            classField.setCustomValidity(""); // Clear error
        }
    
        // Validate Learning Status
        if (!learningStatus) {
            const learningStatusField = component.find("learningStatusField");
            learningStatusField.setCustomValidity("スターテスは必須です。");
            isValid = false;
        } else {
            const learningStatusField = component.find("learningStatusField");
            learningStatusField.setCustomValidity(""); // Clear error
        }
    
        // Report the validity
        component.find("genderField").reportValidity();
        component.find("classField").reportValidity();
        component.find("learningStatusField").reportValidity();
    
        return isValid;
    }
    
    
    
    
})