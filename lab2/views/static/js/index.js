var form = document.getElementById('mail-form')
var sender = document.getElementById('email')
var subject = document.getElementById('subject')
var body = document.getElementById('body')
var senderError = document.getElementById('sender-error')
var subjectError = document.getElementById('subject-error')
var bodyError = document.getElementById('body-error')


function isValidEmail(email) {
    // Regular expression for validating email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

console.log()

form.addEventListener("submit", async(e) => {
    e.preventDefault();
    if (sender.value && subject.value && body.value) {
        if (isValidEmail(sender.value)) {
            const responseBody = {
                "sender": sender.value,
                "subject": subject.value,
                "body": body.value
            };
            const url = `${window.location.href}message`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(responseBody)
            })
            console.log(response)
            if (response.ok) {
                console.log("Form submitted successfully");
            } else {
                console.log('Error sending form:', response.statusText);
                throw new Error('Error sending form');
            }
        } else {
            document.getElementById('sender-error').innerHTML = "Wrong email format";
        }
    } else {
        console.log("Fields cannot be empty");
        if (!sender.value) {
            document.getElementById('sender-error').innerHTML = "Email cannot be empty";
        }
        if (!subject.value) {
            document.getElementById('subject-error').innerHTML = "Subject field cannot be empty";
        }
        if (!body.value) {
            document.getElementById('body-error').innerHTML = "Body cannot be empty";
        }
    }
});