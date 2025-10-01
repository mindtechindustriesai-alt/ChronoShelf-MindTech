document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('save-btn');
    const notification = document.getElementById('notification');
    
    // Make sure the button is properly initialized
    if (saveButton) {
        // Remove any existing event listeners and add a fresh one
        saveButton.replaceWith(saveButton.cloneNode(true));
        const newSaveButton = document.getElementById('save-btn');
        
        newSaveButton.addEventListener('click', function() {
            // Simulate saving process
            newSaveButton.innerHTML = '<i>⏳</i> Saving...';
            newSaveButton.disabled = true;
            
            // Simulate API call delay
            setTimeout(function() {
                // Show success notification
                notification.classList.add('show');
                
                // Reset button after successful save
                newSaveButton.innerHTML = '<i>💾</i> STEP 3 - Save';
                newSaveButton.disabled = false;
                
                // Hide notification after 3 seconds
                setTimeout(function() {
                    notification.classList.remove('show');
                }, 3000);
            }, 1500);
        });
    }
    
    // Additional debugging to ensure button is clickable
    console.log('Save button initialized:', document.getElementById('save-btn'));
});