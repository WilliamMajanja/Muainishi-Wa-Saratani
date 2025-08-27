# Muainishi Wa Saratani - AI Oncological Classification Tool

Muainishi Wa Saratani is an advanced, AI-powered web application designed for bio-informaticists and healthcare practitioners. It classifies oncological samples by analyzing a combination of genomic data, clinical notes, patient history, and medical imaging reports. The tool provides detailed analyses, data visualizations, and web-grounded information to support and accelerate clinical decision-making.

![Main Application Interface](screenshots/app_interface.png)

## ✨ Features

-   **Multi-Modal Data Analysis**: Accepts a variety of inputs including clinical text, patient history, and file uploads for gene expression data (.csv, .tsv, .txt) and imaging reports.
-   **AI-Powered Classification**: Utilizes the Gemini API to deliver a primary cancer classification, complete with a confidence score and a detailed AI-generated summary.
-   **Intelligent File Parsing**: Automatically extracts patient demographics and vitals from various hospital system file formats, including **JSON, PDF, DOCX, CSV, and XLSX**.
-   **In-Depth Analytics**:
    -   Displays a list of the top potential cancer classifications with their respective probabilities.
    -   Identifies and visualizes the most influential genetic and clinical markers that contributed to the diagnosis.
-   **Rational Treatment Options**: Generates a list of evidence-based treatment options (Standard of Care, Emerging, Clinical Trial) tailored to the patient's prognosis.
-   **Web-Grounded Information**: Fetches up-to-date information, recent studies, and treatment protocols for the classified cancer type using Google Search grounding, with citations.
-   **Interactive Visualizations**: Presents complex data through clear, easy-to-understand charts for probabilities and marker importance.
-   **Responsive & Modern UI**: Built with a clean, responsive interface using Tailwind CSS for a seamless experience on any device.

## 🚀 Tech Stack

-   **Frontend**: React, TypeScript
-   **AI Model**: Google Gemini API (`gemini-2.5-flash`)
-   **Styling**: Tailwind CSS
-   **Charting**: Recharts
-   **Bundling/Dependencies**: No build step required; uses modern browser features like ES modules and `importmap`.

## Setup & Running

This project is a pure client-side application and does not require a build step or a local server to run.

### Prerequisites

1.  A modern web browser (e.g., Chrome, Firefox, Safari).
2.  A valid Google Gemini API Key.

### Configuration

The application requires a Google Gemini API key to function. This key must be available as an environment variable `process.env.API_KEY` in the execution context.

For local development or testing without a build system, you can set this up by adding a script tag to `index.html` *before* the main application script is imported.

1.  **Open `index.html`**.
2.  In the `<head>` section, add the following script tag, replacing `"YOUR_API_KEY_HERE"` with your actual key:

    ```html
    <script>
      // WARNING: For development or restricted environments only.
      // Do not expose your API key publicly.
      window.process = {
        env: {
          API_KEY: 'YOUR_API_KEY_HERE'
        }
      };
    </script>
    ```

    **Security Note**: This method exposes your API key in the client-side code. Ensure your API key has appropriate restrictions and is **never** committed to a public repository. For production, use a secure method like a backend proxy or a build system to manage secrets.

### Running the Application

Simply open the `index.html` file in your web browser.

## 📸 Screenshots

*(Please replace the placeholder images in the `/screenshots` directory with actual screenshots of your application.)*

---

### 1. Data Input Form

The user-friendly form allows for inputting patient history and uploading various file types. Note the uploader for demographics, which accepts multiple formats.

![Data Input Form](screenshots/input_form.png)

---

### 2. Classification Results

After analysis, the app displays the primary classification, confidence score, and a detailed summary.

![Classification Results](screenshots/results_summary.png)

---

### 3. Data Visualizations

Interactive charts show the top classification probabilities and the importance of various biological markers.

![Charts and Visualizations](screenshots/charts.png)

---

### 4. Treatment Options

Evidence-based treatment options are presented with clear visual cues for their evidence level (Standard of Care, Emerging, etc.).

![Treatment Options](screenshots/treatment_options.png)

---

### 5. Grounded Information

Users can fetch up-to-date, web-grounded information about the diagnosis, complete with source links.

![Grounded Information](screenshots/grounded_info.png)

---

## ⚖️ Disclaimer

This application is intended for research and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. All analyses and suggestions generated by this tool must be verified and interpreted by a qualified healthcare professional.
