# Sharepoint Sign PDF

Sharepoint Sign PDF is a SharePoint Framework (SPFx) extension that enables users to digitally sign PDF documents directly from a SharePoint document library.
After selecting one or more PDF files, users can trigger the “Sign with Fortify App” command to securely send the files to the Fortify App for signing.

### 🚀 Features

• Adds a custom command button to SharePoint document libraries
• Allows signing of one or multiple PDF files at once
• Integrates with Fortify App for digital signing
• Tracks and displays signing progress
• Built using React and TypeScript

### 🧩 Tech Stack

• SharePoint Framework (SPFx)
• React + TypeScript
• WIP: [.NET backend for creating signatures](https://github.com/janprasil/dotnet-signing-server)
• WIP: Node.JS integration for calls between frontend and backend
• Fortify App API for digital signature processing

### ⚙️ Usage

1. Deploy the .sppkg package to your SharePoint App Catalog
2. Associate the extension with your document library
3. Select one or more PDF files
4. Click “Sign Documents” and confirm signing
