# Admin Certificate Management Portal

This folder contains the Admin Portal for The Hashemites Lineages website. The admin portal allows authorized users to manage certificates in the verification system.

## Features

- Secure login system
- View all certificates in the database
- Add new certificates with automatic QR code generation
- Edit existing certificates
- Delete certificates
- Export updated certificate data

## Usage Instructions

1. Navigate to the admin portal by clicking the "Admin" link in the website footer
2. Log in with your administrator credentials:
   - Username: `admin`
   - Password: `Hashemites2025`
3. The dashboard shows an overview of the certificate database
4. Click on "Certificates" in the sidebar to manage certificates:
   - Add new certificates using the "Add New Certificate" button
   - Edit or delete existing certificates using the action buttons
5. After making changes, you'll see a notification confirming your action
6. For all changes to be permanently saved, you'll need to:
   - Check the "Export Certificates Data" dialog that appears after changes
   - Copy the generated JavaScript code
   - Replace the content of the `js/certificates.js` file with this code

## Security Notes

- Change the default username and password in `admin.js` for security
- Keep your login credentials secure
- The admin portal uses browser localStorage to temporarily store certificate data
- For permanent changes, the certificates.js file must be updated manually

## Technical Details

This admin portal uses a client-side approach for simplicity, which means:
1. Authentication happens in the browser (no server-side validation)
2. Changes are stored in browser localStorage
3. To make permanent changes to the site, the certificates.js file must be updated manually

In a production environment with sensitive data, it's recommended to implement:
1. Server-side authentication
2. Database storage
3. Proper user management with different permission levels