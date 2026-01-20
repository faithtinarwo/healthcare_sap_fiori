# Healthcare SAP Fiori Dashboard

## Overview
This project is my starting point in learning **SAP Fiori** and **SAPUI5** development.  
It is a simple Healthcare Dashboard application built with SAPUI5, following Fiori design principles.  
The goal is to practice building enterprise-style apps, connecting my UX background with SAP technologies.

## Features
- Built with **SAPUI5** (OpenUI5 runtime)
- **MVC architecture** (Model-View-Controller)
- **Routing and navigation** between views
- **Internationalization (i18n)** support
- **Mock data service** for testing
- Responsive design aligned with **Fiori guidelines**

## Project Structure
Healthcare/
├── webapp/
│   ├── Component.js
│   ├── manifest.json
│   ├── index.html
│   ├── view/
│   │   ├── App.view.xml
│   │   └── Home.view.xml
│   ├── controller/
│   │   ├── App.controller.js
│   │   └── Home.controller.js
│   ├── i18n/
│   │   └── i18n.properties
│   ├── css/
│   │   └── style.css
│   └── localService/
│       └── mockserver.js

Code

## Getting Started
1. Clone the repository:
   ```bash
   git clone https://github.com/faithtinarwo/healthcare_sap_fiori.git
Navigate into the project folder:

bash
cd healthcare_sap_fiori
Run a local server (e.g., ui5 serve if you have the UI5 CLI installed).

Open http://localhost:8080/index.html in your browser.

Learning Goals
Understand the basics of SAPUI5 controls and data binding.

Practice routing and navigation in Fiori apps.

Learn how to consume OData services (future step).

Prepare a portfolio project to showcase SAP Fiori/UI5 skills.

Next Steps
Connect the dashboard to a real OData service.

Deploy the app to SAP Business Technology Platform (BTP).

Add charts and analytics once I move to SAPUI5 with sap.viz or other libraries.

Author
Faith Tinarwo  
Aspiring SAP Fiori Developer | UX Designer transitioning into SAP enterprise development
