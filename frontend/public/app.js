$(document).ready(function() {
    const BACKEND_URL = 'http://localhost:4000';
    
    $('#reverseForm').on('submit', function(e) {
        e.preventDefault();
        
        const inputText = $('#inputText').val().trim();
        
        if (!inputText) {
            showError('Please enter some text to reverse.');
            return;
        }
        
        // Show loading state
        showLoading(true);
        hideError();
        hideResult();
        
        // Make API call to backend
        $.ajax({
            url: `${BACKEND_URL}/reverse`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ text: inputText }),
            timeout: 10000,
            success: function(response) {
                showLoading(false);
                showResult(response.original, response.reversed);
            },
            error: function(xhr, status, error) {
                showLoading(false);
                
                let errorMessage = 'Failed to reverse text. ';
                
                if (status === 'timeout') {
                    errorMessage += 'Request timed out.';
                } else if (xhr.status === 0) {
                    errorMessage += 'Unable to connect to the backend server. Make sure it\'s running on port 4000.';
                } else if (xhr.responseJSON && xhr.responseJSON.error) {
                    errorMessage += xhr.responseJSON.error;
                } else {
                    errorMessage += `Server error: ${xhr.status}`;
                }
                
                showError(errorMessage);
            }
        });
    });
    
    // Clear results when input changes
    $('#inputText').on('input', function() {
        hideResult();
        hideError();
    });
    
    function showLoading(show) {
        if (show) {
            $('.loading').show();
            $('#reverseForm button').prop('disabled', true);
        } else {
            $('.loading').hide();
            $('#reverseForm button').prop('disabled', false);
        }
    }
    
    function showResult(original, reversed) {
        $('#originalText').text(original);
        $('#reversedText').text(reversed);
        $('#resultContainer').slideDown();
    }
    
    function hideResult() {
        $('#resultContainer').slideUp();
    }
    
    function showError(message) {
        $('#errorMessage').text(message);
        $('#errorContainer').slideDown();
    }
    
    function hideError() {
        $('#errorContainer').slideUp();
    }
});