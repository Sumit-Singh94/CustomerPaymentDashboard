# Customer Payment Dashboard

A high-performance, responsive dashboard for managing customer payment records. This project was built as a technical assessment to demonstrate clean architecture, efficient state management, and modern React practices.

## 🚀 Quick Start

Follow these steps to run the project locally:

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/payment-dashboard.git](https://github.com/your-username/payment-dashboard.git)
    cd payment-dashboard
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠 Tech Stack

* **Framework:** React (Vite) + TypeScript
* **Styling:** Tailwind CSS
* **UI Components:** ShadCn UI (Radix Primitives)
* **State Management:** Zustand (Client State)
* **Data Fetching:** TanStack Query / React Query (Server State)
* **Icons:** Lucide React

## 🏗 Architecture & Decisions

### 1. Separation of Concerns (Server vs. Client State)
I intentionally separated "Server State" from "Client State" to keep the application scalable and predictable.

* **TanStack Query** handles the data layer (Server State). It manages fetching, caching, and synchronization. This ensures the UI is always in sync with the "backend" without manual `useEffect` spaghetti code.
* **Zustand** handles the global UI state (Client State). specifically for row selection (`selectedIds`). It is lightweight and avoids the boilerplate of Redux for simple interactions.

### 2. Component Structure
* `App.tsx` (Smart Component):** Acts as the main controller. It handles the data flow, mutation logic, and orchestrates the view.
* `CustomerForm.tsx` (Presentational):** An isolated component that manages its own local form state. It receives data via props and emits changes back to the parent, making it reusable and easy to test.
* `lib/api.ts` (Mock Service):** Instead of hardcoded data inside components, I abstracted the data layer into a mock service. It uses `localStorage` to simulate persistence and `setTimeout` to mimic network latency, providing a realistic "async" experience.

### 3. UI/UX Choices
* ShadCn UI: Chosen for its accessibility and modularity. Unlike component libraries that lock you into specific styles, ShadCn gives me ownership of the code, allowing for pixel-perfect customization via Tailwind.
* Feedback Loops: The app provides immediate feedback for user actions (loading states on buttons, optimistic UI updates via query invalidation) to ensure the app feels snappy.

  Project Structure

```text
src/
├── components/
│   ├── ui/             # ShadCn primitives (Button, Table, Dialog, etc.)
│   └── CustomerForm.tsx # Modal for Add/Edit operations
├── lib/
│   ├── api.ts          # Mock backend (LocalStorage wrapper)
│   ├── types.ts        # TypeScript interfaces
│   └── utils.ts        # Tailwind class merger
├── store/
│   └── store.ts        # Zustand store for row selection
├── App.tsx             # Main Dashboard logic
└── main.tsx            # Entry point