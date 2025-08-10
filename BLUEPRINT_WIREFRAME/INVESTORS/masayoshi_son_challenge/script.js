document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registration-form');
    const invitationForm = document.getElementById('invitation-form');

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;

        // Generate registration ID
        const registrationId = generateRegistrationId();

        // Store registration ID
        storeRegistrationId(registrationId);

        // Simulate user registration
        console.log('Registering user:', email, name, registrationId);
        alert('Registration successful! Your registration ID is: ' + registrationId);

        // Open invitation page
        openInvitationPage(registrationId);
    });

    function generateRegistrationId() {
        const adjectives = ['hopeful', 'desperate', 'lonely', 'ambitious', 'quirky'];
        const nouns = ['applicant', 'jobseeker', 'singleton', 'networker', 'go-getter'];

        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];

        return adjective + '-' + noun;
    }

    function storeRegistrationId(id) {
        localStorage.setItem('registrationId', id);
    }

    function openInvitationPage(id) {
        window.open('masayoshi_son_challenge/invitation.html?id=' + id, '_blank');
    }

    invitationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const inviteEmail = document.getElementById('invite-email').value;
        // Simulate sending invitation
        console.log('Sending invitation to:', inviteEmail);
        alert('Invitation sent to: ' + inviteEmail);
    });
});
