import { LightningElement, api, track } from 'lwc';
import getStudentDetails from '@salesforce/apex/LWC_DetailStudentCtrl.getStudentDetails';

export default class Lwc_DetailStudent extends LightningElement {

    @api studentId = 'a00WU00000V8KMIYA3';  // Default ID
    @track student;
    @track isLoading = true;
    @track isVisible = false;

     // Fetch student details when component loads
        connectedCallback() {
            this.fetchStudent();
        }
    
        async fetchStudent() {
            if (!this.studentId) {
                console.error("No studentId provided!");
                this.isLoading = false;
                return;
            }
            
            try {
                this.student = await getStudentDetails({ studentId: this.studentId });
            } catch (error) {
                console.error("Error fetching student:", error);
                this.student = null; // Ensure UI shows "No student data available"
            } finally {
                this.isLoading = false;
                this.isVisible = true;
            }
        }
    
        closeModal() {
            this.isVisible = false;
            this.dispatchEvent(new CustomEvent('closemodal')); // Notify parent
        }

        // close message to parent (search page)
        sendCloseMessageEvent() {
            const message = 'Hello Parent, I am your Child!';

            // Create a custom event
            const event = new CustomEvent('childmessage', {
                detail: message, // Pass data inside detail
                bubbles: true, // Allow event to bubble up
                composed: true // Allow crossing Shadow DOM
            });

            // Dispatch the event
            this.dispatchEvent(event);
            // Stop event from bubbling further
            event.stopPropagation();
        }
}