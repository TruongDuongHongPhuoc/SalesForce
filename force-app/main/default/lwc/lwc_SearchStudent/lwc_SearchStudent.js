import { LightningElement, wire,track } from 'lwc';

import getGenderOptions from '@salesforce/apex/LWC_CreateStudentCtrl.getGenderOptions';
import getClassOptions from '@salesforce/apex/LWC_CreateStudentCtrl.getClassOptions';
import deleteStudents from '@salesforce/apex/CMP_SearchStudentCtrl.deleteSelectedStudents';
import getAllStudents from '@salesforce/apex/CMP_SearchStudentCtrl.getAllStudents';
import searchStudents from '@salesforce/apex/CMP_SearchStudentCtrl.searchStudents';
import getPaginationSettign from '@salesforce/apex/CMP_SearchStudentCtrl.getPaginationSettings';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';


export default class Lwc_SearchStudent extends LightningElement {
 // students data attributes
 @track students = [];
 @track display_students = [];
 wireStudentRecords;
 @track error;

 //search attributes
 @track searchName = '';
 @track selectedBirthday;
 @track selectedGender = '';
 @track selectedClass = '';
 @track searchStudentCode = '';

 //picklist options
 @track genderOptions = [];
 @track classOptions = [];
 @track learningStatusOptions = [];

 //Pagination attribute
 @track maxStudentRecord;
 @track pageSize = 10; // default as 10

 @track visiblePages = [];     // Equivalent to "visiablePages"
 @track currentPage = 1;       // Equivalent to "currentPage"
 @track totalRecords = 0;      // Equivalent to "totalRecords"
 @track totalPages = 0;        // Equivalent to "totalPages"

 // use asyn instead :))
 // is all wire done --> when add wire function please add a flag and make sure the end of wire is call After Wire Data function
 @track isWiredStudent = false; // make sure the wire student is success and operated
 @track isWiredGenderOption = false; // make sure gender options is loaded 
 @track isWiredClassOption = false; // make sure class option is loaded
 @track isWiredPaginationData = false; // make sure get pagination data ia executed

 // attributes handling pop ups as detail , update, create

 @track selectedStudentId = '';
 @track isViewStudentDetail = false;
 @track isCreatingStudent = false;
 @track isUpdatingStudents = false;
 @track isDeletingStudents = false;

 // attribute for selection 
 @track selectedStudents = [];
 @track selectAll = false;

 // disable buttons attribute
 get isDeleteDisabled() {
    return this.selectedStudents.length === 0;
}  
 get isClearDisable(){
    if(this.searchName == '' && this.selectedBirthday == undefined && this.selectedGender == '' && this.selectedClass == '' && this.searchStudentCode == '' && this.selectedStudents.length == 0){
        return true;
    }else{
        return false;
    }
 }
 get isFirstPageDisable() {
    return this.currentPage === 1;
}
get isLastPageDisable(){
    return this.currentPage === this.totalPages;
}

 // END of Attributes


 

 // Start function getting datas Apex
 connectedCallback(){
   
 }

 //Refresh whole data array
 refreshStudents() {
    refreshApex(this.wiredRecords);
}
 
// fetch all student 
@wire(getAllStudents)
wiredGetAllStudents(result) {
    this.wiredRecords = result;
    if (result.data) {
        this.students = result.data.map(student => ({ ...student, isSelected: false }));
        console.log("student length: " + this.students.length);
        this.error = undefined;
        this.fetchPaginationSettings();
    } else if (result.error) {
        console.error('Error fetching students:', result.error);
        this.error = result.error;
        this.students = [];
        this.showToast('Error', 'Error fetching student records', 'error');
    }
}


 //get gender options
 @wire(getGenderOptions)
 wiredGenderOptions({ error, data }) {

     if (data) {
         this.genderOptions = data.map(item => ({
             label: item.picklistLabel, // Đảm bảo có label
             value: item.pickListValue  // Đảm bảo có value
         }));
         // update flag and call After wire functions
         // this.isWiredGenderOption = true;
         // this.AfterWireData();
     } else if (error) {
         console.error("Error fetching gender options:", error);
     }
 }

 //get class options
 @wire(getClassOptions)
 wiredClassOptions({ error, data }) {
     if (data) {
         this.classOptions = data.map(item => ({
             label: item.picklistLabel, // Đảm bảo có label
             value: item.pickListValue  // Đảm bảo có value
         }));
         // update flag and call After wire functions
         // this.isWiredClassOption = true;
         // this.AfterWireData();
     } else if (error) {
         console.error("Error fetching Class options:", error);
     }
 }

 // get pagination settings
 async fetchPaginationSettings() {
     try {
         const data = await getPaginationSettign();
         if (data) {
             this.maxStudentRecord = data.MaxStudentRecord;
             console.log("Page size received from Apex:", data.pageSize);
             this.pageSize = data.pageSize || 10; // Use 10 as fallback if undefined
             this.totalPages = Math.ceil(this.students.length / this.pageSize);
             
             // call first time update pagination student 
             this.updatePageStudent();
             this.getVisiblePages();
         }
     } catch (error) {
         console.error('Error fetching pagination settings:', error);
     }
 }
 

 // SEARCH FUNCTIONS

 // HandleSearch
 handleSearch() {

     const searchName = this.searchName;  // Get value from a lightning-input
     const selectedGender = this.selectedGender;  // Get value from a lightning-combobox     
     const selectedClass = this.selectedClass;  // Get value from a lightning-combobox
     const searchStudentCode = this.searchStudentCode;  // Get value from a lightning-input
     const selectedBirthday = this.selectedBirthday;  // Get value from a lightning-input
     // Call Apex method
     searchStudents({ 
         searchName, 
         selectedGender, 
         selectedClass, 
         searchStudentCode, 
         selectedBirthday 
     })
     .then((result) => {
         this.students = result;

         // pagination update after search
         this.totalRecords = this.students.length;
         this.totalPages = Math.ceil(this.students.length/this.pageSize);
         this.goToFirstPage();

         clearSelection(); // clear the selection after search
     })
     .catch((error) => {
         console.error('Error fetching search results:', error);
         // Handle the error
     });
 }
 
 // Handler for clearing search inputs
 clearInputs() {

     // Reset text fields
     this.searchName = '';
     this.searchStudentCode = '';
     this.selectedBirthday = null;
    
     this.clearSelection();
       

     // Reset dropdowns (set to first value in the options list)
     if (this.genderOptions.length > 0) {
         this.selectedGender = this.genderOptions[0].value;  // Reset to first gender option
     }

     if (this.classOptions.length > 0) {
         this.selectedClass = this.classOptions[0].value;  // Reset to first class option
     }

 }

// End of search function


 // STUDENT ACTION FUNCTIONS

 //hand open create student modal
 openCreateStudent() { 
    console.log('Open create modal'); 
    this.isCreatingStudent = true;
}
 //handle close student
 closeCreateStudent(){
    console.log('close create modal');
    // Remove focus from any active input
    this.template.querySelector(':focus')?.blur();
    this.isCreatingStudent = false; 
 }

 // handle open detail modal
 viewDetail(event) 
 { 
    console.log('View student:', event.target.value); 
    this.isViewStudentDetail = true;
    this.selectedStudentId = event.target.value;
 }
 closeViewDetail(event) 
 { 
    console.log('close view detail'); 
    this.template.querySelector(':focus')?.blur();
    this.isViewStudentDetail = false;
 }

 // handle open edit modal
 updateStudent(event) { 
    console.log('Edit student:', event.target.value); 
    this.selectedStudentId = event.target.value;
    this.isUpdatingStudents = true;
}
 // close update student modal
 closeUpdateStudent(event){
    console.log("close update modal")
    this.template.querySelector(':focus')?.blur();
    this.isUpdatingStudents = false;
 }
 
 // END of student actions

 // SELECTION AND DELETE FUNCTIONS 

 // handle selection 
 handleStudentSelection(event) {
    const selectedStudentId = event.target.value; // Get the selected student's ID
    let selectedStudents = [...this.selectedStudents]; // Copy existing selected students

    // Toggle selection
    if (selectedStudents.includes(selectedStudentId)) {
        selectedStudents = selectedStudents.filter(id => id !== selectedStudentId);
    } else {
        selectedStudents.push(selectedStudentId);
    }

    // Update the selected students list
    this.selectedStudents = selectedStudents;

    // Update the `isSelected` flag for each student in `display_students`
    this.display_students = this.display_students.map(student => ({
        ...student,
        isSelected: selectedStudents.includes(student.Id)
    }));

    //update the isSelected flag for all students 
    this.students = this.students.map(student => ({
        ...student, 
        isSelected: this.selectedStudents.includes(student.Id) // Fix reference
    }));
    

    // Optionally update the "Select All" checkbox status
    this.selectAll = selectedStudents.length === this.display_students.length;

    console.log("selected students:" + selectedStudents.length);
}

    // handle select all displayed student
    toggleSelectAll() {
        // Toggle the value of selectAll
        this.selectAll = !this.selectAll;
    
        // Ensure selectedStudents is an array
        this.selectedStudents = this.selectedStudents || [];
    
        // Update selection status for displayed students
        this.display_students = this.display_students.map(student => {
            if (this.selectAll) {
                // Add student ID to selectedStudents if selecting all
                if (!this.selectedStudents.includes(student.Id)) {
                    this.selectedStudents.push(student.Id);
                }
            } else {
                // Remove student ID from selectedStudents if unchecking all
                this.selectedStudents = this.selectedStudents.filter(id => id !== student.Id);
            }
    
            return {
                ...student,
                isSelected: this.selectAll
            };
        });
    }
    clearSelection(){

        this.selectedStudents = [];
         //clear all students 
         this.students = this.students.map(student => ({
            ...student, 
            isSelected: false
        }));
        
         //clear all students 
         this.display_students = this.display_students.map(student => ({
            ...student, 
            isSelected: false
        }));
    }


 // handle open delete modal
 openDeleteModal() { 
    console.log('Open delete modal'); 
    this.isDeletingStudents = true;
}
// handle open delete modal
closeDeleteModal() { 
    console.log('delete delete modal'); 
    this.isDeletingStudents = false;
}

// Handle deleting a single student
async deleteSingleStudent(event) {
    console.log("Delete single student:", event.target.value);

    // Get the student ID from the button click event
    const studentId = event.target.value;

    // Check if the student is already in the selected list
    if (!this.selectedStudents.includes(studentId)) {
        this.selectedStudents = [...this.selectedStudents, studentId]; // Add to the list
    }

    // Update the `isSelected` flag for each student in `display_students`
    this.display_students = this.display_students.map(student => ({
        ...student,
        isSelected: this.selectedStudents.includes(student.Id)
    }));

    // Open delete confirmation modal
    this.isDeletingStudents = true;
}


//delete selected students
async deleteSelectedStudent(event) {
    // We assume `selectedStudents` holds the student IDs you want to delete
    console.log('Deleting students:', this.selectedStudents);
    
    if (this.selectedStudents.length === 0) {
        this.showToast('Error', 'No students selected for deletion', 'error');
        return; // Exit early if no students are selected
    }
    
    try {
        // Call the Apex method to delete the selected students
        await deleteStudents({ studentIds: this.selectedStudents });

        // Show success message
        this.showToast('Success', 'Students deleted successfully', 'success');

        // Clear selected students list after deletion
        this.selectedStudents = [];
        
        


        // Remove the deleted students from the local list of students (if needed)
        this.students = this.students.filter(student => !this.selectedStudents.includes(student.Id));
        this.display_students = [...this.students]; // Update the display list

        // Optionally refresh the list of students (e.g., if needed)
        this.refreshStudents();

    } catch (error) {
        console.error('Error deleting students:', error);
        this.showToast('Error', 'Failed to delete students', 'error');
    }
}



 
 //ENd of selection and delete function


 //PAGINATION FUNCTIONS

 // update student according to current student page
 updatePageStudent() { 

     this.totalRecords = this.students.length;
     this.pageSize = 10; // page size keeping return 100 IDK why
     const startIndex = (this.currentPage - 1) * this.pageSize;
     const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);

     console.log("page size " + this.pageSize + "total records " + this.totalRecords + " start index " + startIndex + "end Index " + endIndex + "current page " + this.currentPage);


     this.display_students = this.students.slice(startIndex, endIndex);
        
 }

 getVisiblePages() { 
     if (this.totalPages <= 0) {
         console.log("No pages available.");
         this.visiblePages = [];
         return;
     }
     const visiblePages = [];
     let startPage = Math.max(1, this.currentPage - 2);
     let endPage = Math.min(this.totalPages, startPage + 4);
 
     // Ensure we show at most 5 pages, adjusting the start if needed
     if (this.totalPages > 5) {
         startPage = Math.max(1, endPage - 4);
     }
 
     for (let i = startPage; i <= endPage; i++) {
         visiblePages.push(i);
     }
 
     console.log("Visible pages: " + JSON.stringify(visiblePages));
     this.visiblePages = visiblePages;

     this.handleStudentSelection();
 }
 

 // go to a page
 goToPage(event) {
     const selectedPage = parseInt(event.target.value, 10); // Get the selected page number
     if (selectedPage !== this.currentPage) {
         this.currentPage = selectedPage; // Update the current page
         this.updatePageStudent(); // Refresh the student list
         this.getVisiblePages(); // Update the visible pages
     }
 }

 // handle go to next page
 nextPage() {
     if (this.currentPage < this.totalPages) {
         this.currentPage += 1;
         this.updatePageStudent();
         this.getVisiblePages();
     }
 }
 
 // handle go to previous page
 previousPage() {
     if (this.currentPage > 1) {
         this.currentPage -= 1;
         this.updatePageStudent();
         this.getVisiblePages();
     }
 }
 
 // handle go to first page
 goToFirstPage() {
     this.currentPage = 1;
     this.updatePageStudent();
     this.getVisiblePages();
 }
 
 // handle go to last page
 goToLastPage() {
     this.currentPage = this.totalPages;
     this.updatePageStudent();
     this.getVisiblePages();
 }
 
 //End of pagination functions
 

 // OTHERS FUNCTION

 // closing all of the 
 handleChildEvent(event) {
    console.log("event is working");
        this.closeCreateStudent();
        this.closeUpdateStudent();
        this.closeViewDetail();

        this.refreshStudents();  
}

 // Handle change data --> to set input from UI to variable
 handleChange(event) {
     const field = event.target.name;
     this[field] = event.target.value;
 }

 // Utility function to show toast messages
 showToast(title, message, variant) {
     this.dispatchEvent(
         new ShowToastEvent({
             title,
             message,
             variant
         })
     );
 }

 

}   