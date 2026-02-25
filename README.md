# owcs-match-prediction

A machine learning system that predicts the winner of custom 5v5 owcs matchups based on the statistical profiles of the ten participating players. Instead of relying on preexisting teams, the model constructs team-level representations from individual player metrics and learns strength differentials between two dynamically formed compositions.

## Architecture

The core model is developed in the `notebook/` directory, where a full scikit-learn `Pipeline` (preprocessing + classifier) is trained and then exported as an ONNX model. That ONNX artifact is saved as `match_prediction_model.onnx` and loaded at runtime by the Node.js API using `onnxruntime-node`.

The frontend is built with TanStack React Start (Router + Query) and Vite. Honestly this stack is a little bit of overkill for such a small app, but I used this project as an excuse to learn the basics of this framework.

## Running the project

1. **Install dependencies**
   - Ensure you have a recent version of Node.js installed.
   - From the repository root, install dependencies for the app:

   ```bash
   cd app
   pnpm install
   ```

2. **Place the model file**
   - The API expects the ONNX model file to be available at `public/match_prediction_model.onnx` relative to the app.
   - Export from the notebokk or obtain the model from drive and save it as `match_prediction_model.onnx`.
   - Copy it into the `app/public/` directory so the runtime can load it.

3. **Start the development server**

   ```bash
   pnpm dev
   ```

   This will start the Vite dev server on `http://localhost:3000` (or the next available port).
